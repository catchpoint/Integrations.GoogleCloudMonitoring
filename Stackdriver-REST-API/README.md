# Catchpoint-Google Stackdriver
 
## Introduction

Cloud Monitoring provides visibility into the performance, uptime, and overall health of applications. It collects metrics, events, and metadata from Google Cloud, Amazon Web Services, hosted uptime probes, application instrumentation, and a variety of common application components including Cassandra, Nginx, Apache Web Server, Elasticsearch, and many others. Operations ingests that data and generates insights via dashboards, charts, and alerts. Cloud Monitoring alerting helps you collaborate by integrating with Slack, PagerDuty, and more. 
We will be looking at ingesting data from Catchpoint into Cloud Monitoring.
[https://cloud.google.com/monitoring](https://cloud.google.com/monitoring)

 
 This Integrations supports the following test types and metrics.

**Web**  : Timing metrics like  Connect, Dns, ContentLoad, Document complete ...
**Transaction** : Timing metrics like  Connect, Dns, ContentLoad, Document complete ...
**API** : Timing metrics like  Connect, Dns, ContentLoad,...



##  Prerequisites

 - NodeJS
 - Google Cloud project 


## Installation &amp; Configuration

 ### Google cloud Setup


 ### Enabling the Monitoring API

1. Select the [project](https://console.cloud.google.com/apis/dashboard) you will use to access the API.

1.  Click the Enable APIs and Service button.

1. Search for &quot;Stackdriver&quot;.

1. In the search results, click through to &quot;Cloud Monitoring API&quot;.

1. If &quot;API enabled&quot; is displayed, then the API is already enabled. If not, click the Enable button.


### Clone the Repository to your local machine

Clone [this](https://github.com/catchpoint/Integrations.GoogleCloudMonitoring) repository to your local machine.

In Catchpoint go to Settings>API:
[https://portal.catchpoint.com/ui/Content/Administration/ApiDetail.aspx](https://portal.catchpoint.com/ui/Content/Administration/ApiDetail.aspx)
In the “REST API” section click “Add Consumer” and assign a contact. Once saved you will be able to retrieve the consumer key and secret.

Navigate to the directory where the files were cloned.

 ```bash
$ cd <path to extracted directory\GoogleCloudMonitoring\Stackdriver-REST-API>
```
Update GoogleProjectId, CatchpointSecret, CatchpointSecret, CatchpointTestId under .env file

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

In the Google Cloud Console, go to Monitoring -> Overview this will create a workspace for you automatically for the first time.

  
To view the metrics for a monitored resource using Metrics Explorer, do the following:

 1. From the Google Cloud Console, go to Monitoring. [https://console.cloud.google.com/monitoring](https://console.cloud.google.com/monitoring)
 1. In the Monitoring navigation pane, click Metrics Explorer.
 1. Enter the monitored resource name in the Find resource type and metric text box.
Resource type -> global. 
All the Catchpoint specific metrics will have id’s in the following format. custom.googleapis.com/global/catchpoint_Connect
custom.googleapis.com/global/catchpoint_Dns
custom.googleapis.com/global/catchpoint_Load
 1. Metrics explorer also allows to filter data points using node name or test id.
 1. Add all the required metrics and this save the chart to a dashboard.
[https://cloud.google.com/monitoring/charts/metrics-explorer
](https://cloud.google.com/monitoring/charts/metrics-explorer
)
 1. Navigate to Monitoring -> Dashboards to check out the metrics.

