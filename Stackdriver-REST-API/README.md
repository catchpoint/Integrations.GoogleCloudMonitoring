# Catchpoint and Google's Cloud Monitoring & Logging

## Introduction

Cloud Monitoring with Catchpoint provides visibility into cloud services and the applications they depend on. Cloud services depend on many different services, from Nginx to Elasticsearch to Cassandra. With Cloud Monitoring, Operations teams can proactively monitor their infrastructure with data collected from application instrumentation, probes, events, and metadata. With integrations to collaboration tools, alerts can be sent via Slack, PagerDuty, and others. And with advanced charting and dashboards, analysts can isolate issues and recover quickly.

This integration uses the [Cloud Monitoring](https://cloud.google.com/monitoring) REST API to ingest raw data from Catchpoint.

### Catchpoint Tests

#### Supported Metrics

1. **Connect** The time to establish a connection with a specific URL. Reported in milliseconds.

1. **DNS** The time to resolve the primary URL. Reported in milliseconds.

1. **Content Load** The time to load all components, from the first byte to the last byte, from the provided URL. Reported in milliseconds.

1. **Document Complete** The time to render the full webpage. Reported in milliseconds.

#### Supported tests and available metrics

1. **Web Test** Connect, DNS, Content Load, Document Complete.

1. **Transaction Test** Connect, DNS, Content Load, Document Complete.

1. **API Test** Connect, DNS, Content Load.

## Prerequisites

- NodeJS
- Google Cloud project
- An active Catchpoint account

## Installation and Configuration

### Google Cloud Setup

#### Enable the Monitoring API

_Note: Cloud Monitoring requires a Google Cloud project that is associated with a Workspace._

1. Navigate to your Google Cloud [project dashboard](https://console.cloud.google.com/apis/dashboard) to access your API information.

1. Find and select `Cloud Monitoring API` to ensure APIs are enabled.
_Note: If the API is already enabled, the message_ **API enabled** _will be displayed. If there is no message, click on the_ **Enable** _button._

#### Google Stackdriver authentication

##### Set up authentication for accessing stack driver monitoring API from your local machine

1. In the Cloud Console, go to the [Create service account key](https://console.cloud.google.com/apis/credentials/serviceaccountkey) page.

1. From the `Service account` list, select `New service account`.

1. In the  `Service account name`  field, enter a name.

1. From the `Role` list, select `Project` > `Owner`.

1. Click `Create`. A JSON file that contains your key downloads to your computer.

1. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable for the downloaded JSON file.

For additional information, please refer to the [Getting Started](https://cloud.google.com/docs/authentication/getting-started) from the Google Cloud documentation.

#### Set up the Catchpoint REST API endpoint

1. In the Catchpoint Portal, go to the [API page](https://portal.catchpoint.com/ui/Content/Administration/ApiDetail.aspx).

1. Set up a [REST API endpoint](https://support.catchpoint.com/hc/en-us/articles/208029743).

1. Retrieve the `Key` and `Secret`. These correspond to the `CatchpointKey` and `CatchpointSecret` below.

#### Set up the Google Cloud Monitoring Repository locally

1. Clone this repository into a working directory.  
`$ git clone https://github.com/catchpoint/Integrations.GoogleCloudMonitoring.git`

1. In the `.env` file from Stackdriver-REST-API directory , update
    - `CatchpointKey` and `CatchpointSecret` with the REST API values from above.
    - `CatchpointTestId` with a Catchpoint Test Id.
    - `GoogleProjectId` with your Google Cloud Monitoring Project Id.

1. Download and install packages and dependencies.  
`$ npm install`

1. Use the provided script to retrieve the last 15 minutes of raw test data and send to Google Cloud Monitoring & Logging.  
`$ node index.js`

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
