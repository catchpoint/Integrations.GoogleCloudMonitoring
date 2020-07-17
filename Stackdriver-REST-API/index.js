'use strict';

const googleCloudMonitoring = require('@google-cloud/monitoring');
const catchpointRestApi = require('./catchpoint-rest-api.js');
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.join(__dirname, '.env') });

// token to access Catchpoint API, stored on the file system to remove need for multiple calls
const fs = require('fs');
const tokenPath = path.join(__dirname, 'token.txt');
var token = fs.readFileSync(tokenPath, 'utf8');

const googleProjectId = process.env.GoogleProjectId;
const catchpointKey = process.env.CatchpointKey;
const catchpointSecret = process.env.CatchpointSecret;
const catchpointTestId = process.env.CatchpointTestId;

// metric descriptors for mapping values from Catchpoint API to Stackdriver custom metrics
const metricDescriptors = ['catchpoint_dns', 'catchpoint_connect', 'catchpoint_ssl', 'catchpoint_send', 'catchpoint_wait', 'catchpoint_ttfb', 'catchpoint_load', 'catchpoint_response', 'catchpoint_redirect', 'catchpoint_server_response', 'catchpoint_file_size', 'catchpoint_downloaded_bytes', 'catchpoint_total_downloaded_bytes', 'catchpoint_throughput', 'catchpoint_dom_load', 'catchpoint_content_load', 'catchpoint_document_complete', 'catchpoint_webpage_response'];

catchpointRestApi.getPerformanceData(catchpointTestId, token, function (response) {
	// if .Message does not exist on the response, the response contains performance data
	if (!response.hasOwnProperty('Message')) {
		postToGoogleMonitoring(response);
	} else if (response.Message == 'Expired Token' || response.Message == 'Invalid token') {
		catchpointRestApi.getToken(catchpointKey, catchpointSecret, (response) => {
			// update the token for subsequent calls
			token = response.access_token;
			fs.writeFileSync(tokenPath, token);

			// retry the performance data pull with the new token
			catchpointRestApi.getPerformanceData(catchpointTestId, token, function (response) {
				if (!response.hasOwnProperty('Message')) {
					postToGoogleMonitoring(response);
				} else {
					console.log('Error: Could not retrieve performance data.');
				}
			});
		});
	}
});

// [START function_postToGoogleMonitoring]
/**
 * Handles parsing Catchpoint API data,
 * constructs timeseries object and writes timeseries object to Google Stackdriver Monitoring API 
 */
async function postToGoogleMonitoring(response) {
	console.log('Writing time series data...');
	const serviceClient = new googleCloudMonitoring.MetricServiceClient();
	const totalRuns = response.detail.items.length;
	for (let i = 0; i < metricDescriptors.length; i++) {
		for (let j = 0; j < totalRuns; j++) {
			let metricValue = response.detail.items[j].synthetic_metrics[i];
			let metricTimestamp = response.detail.items[j].dimension.name;
			let testId = response.detail.items[j].breakdown_1.id;
			let nodeName = response.detail.items[j].breakdown_2.name;

			// parse time series data to push to Google Cloud Monitoring
			let dataPoint = parseDataPoint(metricValue, metricTimestamp);
			let timeSeriesData = parseTimeSeriesData(metricDescriptors[i], dataPoint, testId, nodeName);

			let writeRequest = {
				name: serviceClient.projectPath(googleProjectId),
				timeSeries: [timeSeriesData],
			};

			await serviceClient
				.createTimeSeries(writeRequest)
				.then(results => {
					console.error(`Success: ${JSON.stringify(results)}.`);
				})
				.catch(err => {
					console.error(`Error: ${err}`);
				});
		}
	}

	console.log('Finished writing data...');
}

// [START function_parseDataPoint]
/**
 * Constructs data point object. i.e; a single data point in a time series which is required for timeseries object
 */
function parseDataPoint(metric, timeStamp) {
	const date = new Date(timeStamp);
	const seconds = date.getTime() / 1000;
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

// [START function_parseTimeSeriesData]
/**
 * Constructs a complete timeseries object using datapoint from parseDataPoint function
 */
function parseTimeSeriesData(metric, dataPoint, testId, nodeName) {
	const googleMetric = 'custom.googleapis.com/global/' + metric;
	const timeSeriesData = {
		metric: {
			type: googleMetric,
			labels: {
				Test_id: testId,
				Node: nodeName
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

	return timeSeriesData;
}
