# Catchpoint and Google's Cloud Monitoring & Logging

## Introduction

Cloud Monitoring with Catchpoint provides visibility into cloud services and the applications they depend on. Cloud services depend on many different services, from Nginx to Elasticsearch to Cassandra. With Cloud Monitoring, Operations teams can proactively monitor their infrastructure with data collected from application instrumentation, probes, events, and metadata. With integrations to collaboration tools, alerts can be sent via Slack, PagerDuty, and others. And with advanced charting and dashboards, analysts can isolate issues and recover quickly.

This integration uses the [Cloud Monitoring](https://cloud.google.com/monitoring) REST API to ingest raw data from Catchpoint Test dat webhook.

### Catchpoint Tests

#### Supported Metrics

1. **Connect** The time to establish a connection with a specific URL. Reported in milliseconds.

1. **DNS** The time to resolve the primary URL. Reported in milliseconds.

1. **Content Load** The time to load all components, from the first byte to the last byte, from the provided URL. Reported in milliseconds.

1. **Document Complete** The time to render the full webpage. Reported in milliseconds.

#### Supported tests and available metrics

1. **Web Test** Connect, DNS, Content Load, Document Complete  

1. **Transaction Test** Connect, DNS, Content Load, Document Complete

1. **API Test** Connect, DNS, Content Load

1. **Trace route Test** :  Packet loss , round trip time, number of hops.

1. **Ping Test** :  Packet Loss, Round Trip Time.

1. **DNS Test** :  Response times.


##  Prerequisites

- Google Cloud project
- An active Catchpoint account

## Installation and Configuration

 ### Google Cloud setup:
 
 #### Enabling the Monitoring API
 
_Note: Cloud Monitoring requires a Google Cloud project that is associated with a Workspace._

1. Navigate to your Google Cloud [project dashboard](https://console.cloud.google.com/apis/dashboard) to access your API information.

1. Find and select `Cloud Monitoring API` to ensure APIs are enabled.
_Note: If the API is already enabled, the message_ **API enabled** _will be displayed. If there is no message, click on the_ **Enable** _button._


#### Install cloud SDK on your local machine

1. Download the [Cloud SDK installer.](https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe)

1. Launch the installer and follow the prompts. The installer is signed by Google LLC. Cloud SDK requires Python. Supported versions are 3.5 to 3.7, and 2.7.9 or higher. The installer will install all necessary dependencies, including the needed Python version.

1. After installation has completed, accept the following options:\
    1. Start Cloud SDK Shell

 Note : The installer starts a terminal window and runs the gcloud init command.

#### Enabling cloud functions.

1. Go to the project selector page

1. Make sure that billing is enabled for your Google Cloud project.   [Learn how to confirm billing is enabled for your project](https://cloud.google.com/billing/docs/how-to/modify-project).

1. Enable the [Cloud Functions and Cloud Pub/Sub APIs.](https://console.cloud.google.com/flows/enableapi?apiid=cloudfunctions,pubsub&redirect=https://cloud.google.com/functions/docs/tutorials/pubsub)

1. Install and initialize the Cloud SDK.

1. Update gcloud components:
 ```bash
$ gcloud components update
```
#### Set up the Google Cloud Monitoring Repository locally

1. Clone this repository into a working directory\
`$ git clone https://github.com/catchpoint/Integrations.GoogleCloudMonitoring.git`

1. In the `.env` file fromCatchpoint-Stackdriver-Webhook directory , update GoogleProjectId

    
#### Deploying cloud functions.

Index.js has two functions called catchpointPublish and catchpointSubscribe.
Open Google Cloud SDK Shell and navigate to the directory where the NodeJS scripts was extracted.

 ```bash
$ cd <path to extracted directory/Integrations.GoogleCloudMonitoring/Stackdriver-Webhook/>;
```
 1. Deploy publish function:
    ```bash
    $ gcloud functions deploy catchpointPublish --trigger-http --runtime nodejs10 --timeout=180 --trigger-http --allow-unauthenticated
    ```
    Copy the URL once the deployment is successful. This will be webhook URL which will be added in Catchpoint portal.
 
 1. Deploy Subscribe function:
    `$ gcloud functions deploy catchpointSubscribe --trigger-topic catchpoint-webhook --timeout=180 --runtime nodejs10 --allow-unauthenticated`
    $ gcloud functions deploy catchpointSubscribe --trigger-topic catchpoint-webhook --timeout=180 --runtime nodejs10 --allow-unauthenticated
    ```
####  Set up the Catchpoint Test data webhook.

Add the copied URL to Catchpoint.
1. In catchpoint,from Settings go to [API page](https://portal.catchpoint.com/ui/Content/Administration/ApiDetail.aspx).
1. Under Test Data Webhook add the copied url.
1. Select default JSON for Test-data webhook and save the changes


_Note: Test data webhook should be enabled under the test properties page._

## Results

##### Using the Metrics Explorer to build a dashboard

1. From the Google Cloud Console, go to [Monitoring](https://console.cloud.google.com/monitoring).

1. In the Monitoring navigation pane, click [Metrics Explorer](https://cloud.google.com/monitoring/charts/metrics-explorer).

1. Set the `Find resource type` and `metric` value to `custom` or `custom.googleapis.com`. This will display the list of metrics to choose from.

1. Set the `Resource-Type` to `global`  
Catchpoint metrics ids are specified in the format: `custom.googleapis.com/global/catchpoint_<metric_name>`  
For example, to return the `Connect` metric data, use:  
`custom.googleapis.com/global/catchpoint_Connect`.

1. Metrics explorer also allows to filter data points using node name or test id.

1. Add all the required metrics and this save the chart to a [Dashboard](https://console.cloud.google.com/monitoring/dashboards).

##### View your data

1. Go to `Monitoring` in the `Google Cloud Console`.

1. Select `Dashboard`.
