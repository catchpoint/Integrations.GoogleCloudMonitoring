'use strict';

const monitoring = require('@google-cloud/monitoring');
const { PubSub } = require('@google-cloud/pubsub');
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.join(__dirname, '.env') });
const pubsub = new PubSub();
const googleProjectId = process.env.GoogleProjectId;
const topicName = process.env.TopicName;

const TotalHopsMetric = 'catchpoint_TotalHops';
const RoundTripTimeAverageMetric = 'catchpoint_RoundTripTimeAvg';
const PacketLossPercentMetric = 'catchpoint_PacketLossPct';
const TracerouteTestId = 12;
const PingTestId = 6;
const PacketLossMultiplier = 33.333;

/**
 * Publishes a message to a Google Cloud Pub/Sub Topic.
 */
exports.catchpointPublish = async (req, res) => {
    console.log(`Publishing message to topic ${topicName}.`);
    const pubsub = new PubSub();
    const topic = pubsub.topic(topicName);
    const data = JSON.stringify(req.body);
    const message = Buffer.from(data, 'utf8');
    try {
        await topic.publish(message);
        res.status(200).send(`Message published to topic ${topicName}.`);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
        return Promise.reject(err);
    }
};

/**
 * Triggered from a message on Google Cloud Pub/Sub topic.
 */
exports.catchpointSubscribe = async (message) => {
    const data = Buffer.from(message.data, 'base64').toString();
    const catchpointData = JSON.parse(data);
    await postToGoogleMonitoring(catchpointData);
};

/**
 * Handles parsing Catchpoint webhook data,
 * constructs and writes a time series object to Google Stackdriver Monitoring API 
 */
async function postToGoogleMonitoring(response) {
    const testId = response.TestId;
    const nodeName = response.NodeName;
    const testName = response.TestDetail.Name
    const metrics = Object.keys(response.Summary.Timing);
    let testParameters = {
        'Test_name': testName
    };
    if (response.Summary.hasOwnProperty('Request')) {
        testParameters['Test_url'] = response.Summary.Request
    }

    let timeSeriesData = [];
    for (var i = 0; i < metrics.length; i++) {
        let metricValue = response.Summary.Timing[metrics[i]];
        let dataPoint = parseDataPoint(metricValue);
        let metric = 'catchpoint_' + metrics[i];
        timeSeriesData[i] = parseTimeSeriesData(metric, dataPoint, testId, testParameters, nodeName);
    }
    // If test type is Traceroute then compute RTT, Packet Loss, #Hops.
    if (response.TestDetail.TypeId == TracerouteTestId) {
        let sumPingTime = 0;
        let packetLossCounter = 0;
        let pingCounter = 0;
        let numberOfHops = response.Diagnostic.TraceRoute.Hops.length
        for (var i = 0; i < 3; i++) {
            if (response.Diagnostic.TraceRoute.Hops[numberOfHops - 1].RoundTripTimes[i] != null) {
                sumPingTime += response.Diagnostic.TraceRoute.Hops[numberOfHops - 1].RoundTripTimes[i];
                pingCounter++;
            }
            if (response.Diagnostic.TraceRoute.Hops[numberOfHops - 1].RoundTripTimes[i] == null) {
                packetLossCounter++;
            }
        }

        let rtt = (sumPingTime / pingCounter).toFixed();
        let packetLoss = (PacketLossMultiplier * packetLossCounter).toFixed();

        /** Data point for Total Number of Hops */
        let dataPoint = parseDataPoint(numberOfHops);
        timeSeriesData.push(parseTimeSeriesData(TotalHopsMetric, dataPoint, testId, testParameters, nodeName));

        /** Data point for  Round Trip Time */
        dataPoint = parseDataPoint(rtt);
        timeSeriesData.push(parseTimeSeriesData(RoundTripTimeAverageMetric, dataPoint, testId, testParameters, nodeName));

        /** Data point for Packet Loss */
        dataPoint = parseDataPoint(packetLoss);
        timeSeriesData.push(parseTimeSeriesData(PacketLossPercentMetric, dataPoint, testId, testParameters, nodeName));
    }
    /** If test type is Ping then compute RTT, Packet Loss */
    else if (response.TestDetail.TypeId == PingTestId) {
        const metricsPing = Object.keys(response.Summary.Ping);
        for (var i = 0; i < metricsPing.length; i++) {
            let metricValue = response.Summary.Ping[metricsPing[i]];
            let dataPoint = parseDataPoint(metricValue);
            let metric = 'catchpoint_' + metricsPing[i];
            timeSeriesData.push(parseTimeSeriesData(metric, dataPoint, testId, testParameters, nodeName));
        }
    }
    const client = new monitoring.MetricServiceClient();
    const writeRequest = {
        name: client.projectPath(googleProjectId),
        timeSeries: timeSeriesData
    };

    await client
        .createTimeSeries(writeRequest)
        .then(results => {
            console.log(`Success: ${JSON.stringify(results)}`);
        })
        .catch(err => {
            console.error(`Error: ${err}.`);
        });
    console.log('Finished writing data.');
}

/**
 * Constructs data point object. i.e; a single data point in a time series
 */
function parseDataPoint(metric) {
    const seconds = Date.now() / 1000;
    const dataPoint = {
        interval: {
            endTime: {
                seconds: seconds,
            },
        },
        value: {
            doubleValue: metric,
        },
    };

    return dataPoint;
}

/**
 * Constructs a complete time series object using data point from parseDataPoint function.
 */
function parseTimeSeriesData(metric, dataPoint, testId, testParameters, nodeName) {
    const timeSeriesData = {
        metric: {
            type: 'custom.googleapis.com/global/' + metric,
            labels: {
                Test_id: testId,
                Node: nodeName,
                Test_name: testParameters['Test_name']
            },
        },
        resource: {
            type: 'global',
            labels: {
                project_id: googleProjectId,
            },
        },
        points: [dataPoint],
    };

    if (testParameters != null && testParameters['Test_url'] != null) {
        timeSeriesData['metric']['labels']['Test_url'] = testParameters['Test_url']
    }

    return timeSeriesData;
}
