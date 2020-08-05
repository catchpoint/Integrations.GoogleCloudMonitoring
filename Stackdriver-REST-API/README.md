# Catchpoint and Google Stackdriver Integration

## Introduction

Cloud Monitoring provides visibility into the performance, uptime, and overall health of applications. It collects metrics, events, and metadata from Google Cloud, Amazon Web Services, hosted uptime probes, application instrumentation, and a variety of common application components including Cassandra, Nginx, Apache Web Server, Elasticsearch, and many others. Operations ingests that data and generates insights via dashboards, charts, and alerts. Cloud Monitoring alerting helps you collaborate by integrating with Slack, PagerDuty, and more.
We will be looking at ingesting data from Catchpoint into [Cloud Monitoring](https://cloud.google.com/monitoring) using REST API.

This Integration allows to send data from following test types and supported metrics are listed below:

**Web Test**  : Timing metrics like  Connect, Dns, ContentLoad, Document complete.

**Transaction Test** : Timing metrics like  Connect, Dns, ContentLoad, Document complete .

**API Test** : Timing metrics like  Connect, Dns, ContentLoad,

##  Prerequisites

 - NodeJS
 - Google Cloud project 
 
## Installation &amp; Configuration

 ### Google cloud Setup
 
 ### Enabling the Monitoring API

1. Select the [project](https://console.cloud.google.com/apis/dashboard) you will use to access the API.

1.  Click the Enable APIs and Service button.

1. Search for `Stackdriver`

1. In the search results, click through to `Cloud Monitoring API`

1. If `API enabled` is displayed, then the API is already enabled. If not, click the Enable button.

### Stackdriver authentication
Set up authentication for accessing stack driver monitoring API from your local machine.
For this we have to create a service account, download the json file and set up an environment variable called GOOGLE_APPLICATION_CREDENTIALS

Please follow the steps  mentioned in the below link.
https://cloud.google.com/docs/authentication/getting-started

### Clone the Repository to your local machine

[This](https://github.com/catchpoint/Integrations.GoogleCloudMonitoring) repository has all the required NodeJS scripts.
1. Clone [this](https://github.com/catchpoint/Integrations.GoogleCloudMonitoring) repository to your local machine.
 
     ```bash
     $ git clone https://github.com/catchpoint/Integrations.GoogleCloudMonitoring.git
    ```
1. In catchpoint,from Settings go to [API page](https://portal.catchpoint.com/ui/Content/Administration/ApiDetail.aspx).
1. In the `REST API` section click `Add Consumer` and assign a contact. 
1. Once saved you will be able to retrieve the `consumer key` and `secret`.
1. Navigate to the directory where the files were cloned.
   ```bash
   $ cd <path to extracted directory\Integrations.GoogleCloudMonitoring\Stackdriver-REST-API>
   ```
1. Update GoogleProjectId, CatchpointSecret, CatchpointSecret, CatchpointTestId under .env file

Run npm install which will download all the package and its dependencies.
 ```bash
$ npm install
```
Now execute index.js file from the terminal. This will pull up last 15 minutes raw data for a given test and writes data to stackdriver monitoring (using Google API).
 ```bash
$ node index.js
```
## Results

To use Cloud Monitoring, you must have a Google Cloud project with billing enabled. The project must also be associated with a Workspace. Cloud Monitoring uses Workspaces to organize monitored Google Cloud projects.

 1. In the `Google Cloud Console`, Go to `Monitoring` and then click `Overview`.\
 Note: This will create a workspace for you automatically for the first time.

  
To view the metrics for a monitored resource using Metrics Explorer, do the following:

 1. From the Google Cloud Console, go to [Monitoring](https://console.cloud.google.com/monitoring).
 1. In the Monitoring navigation pane, click [Metrics Explorer](https://cloud.google.com/monitoring/charts/metrics-explorer).
 1. Input `custom` in the Find resource type and metric text box.
 1. Input `global` in the Resource-type textbox
    All the Catchpoint specific metrics will have id’s in the following format.\
    custom.googleapis.com/global/catchpoint_Connect\
    custom.googleapis.com/global/catchpoint_Dns\
    custom.googleapis.com/global/catchpoint_Load

 1. Metrics explorer also allows to filter data points using node name or test id.
 1. Add all the required metrics and this save the chart to a [dashboard](https://console.cloud.google.com/monitoring/dashboards).
 1. In the `Google Cloud Console`, Go to `Monitoring` and then click `Dashboard` to check out the metrics.
