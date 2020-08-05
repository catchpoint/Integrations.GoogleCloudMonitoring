# Catchpoint-Google Stackdriver

## Introduction

Cloud Monitoring provides visibility into the performance, uptime, and overall health of applications. It collects metrics, events, and metadata from Google Cloud, Amazon Web Services, hosted uptime probes, application instrumentation, and a variety of common application components including Cassandra, Nginx, Apache Web Server, Elasticsearch, and many others. Operations ingests that data and generates insights via dashboards, charts, and alerts. Cloud Monitoring alerting helps you collaborate by integrating with Slack, PagerDuty, and more.
We will be looking at ingesting data from Catchpoint into [Cloud Monitoring](https://cloud.google.com/monitoring) using Test data webhooks.

This Integrations supports the following test types and metrics respectively.

**Web Test**  : Timing metrics like Total, Connect, Dns, ContentLoad, Document complete.

**Transaction Test** : Timing metrics like Total, Connect, Dns, ContentLoad, Document complete.

**API Test** : Timing metrics like Total, Connect, Dns, ContentLoad.

**Trace route Test** :  Packet loss , round trip time, number of hops.

**Ping Test** :  Packet Loss, Round Trip Time.

**DNS Test** :  Response times.

##  Prerequisites

 - Google Cloud project

## Installation &amp; Configuration

 ### Google Cloud setup:
 ### Enabling the Monitoring API
 
1. Select the [project](https://console.cloud.google.com/apis/dashboard) you will use to access the API.

1. Click the Enable APIs and Service button.

1. Search for `Stackdriver`

1. In the search results, click through to `Cloud Monitoring API`.

1. If `API enabled` is displayed, then the API is already enabled. If not, click the Enable button.

### Install cloud SDK on your local machine

1. Download the [Cloud SDK installer.](https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe)

1. Launch the installer and follow the prompts. The installer is signed by Google LLC. Cloud SDK requires Python. Supported versions are 3.5 to 3.7, and 2.7.9 or higher. The installer will install all necessary dependencies, including the needed Python version.

1. After installation has completed, accept the following options:\
    1. Start Cloud SDK Shell

 Note : The installer starts a terminal window and runs the gcloud init command.

### Enabling cloud functions.

1. Go to the project selector page

1. Make sure that billing is enabled for your Google Cloud project.   [Learn how to confirm billing is enabled for your project](https://cloud.google.com/billing/docs/how-to/modify-project).

1. Enable the [Cloud Functions and Cloud Pub/Sub APIs.](https://console.cloud.google.com/flows/enableapi?apiid=cloudfunctions,pubsub&redirect=https://cloud.google.com/functions/docs/tutorials/pubsub)

1. Install and initialize the Cloud SDK.

1. Update gcloud components:
 ```bash
$ gcloud components update
```
### Clone the Repository to your local machine

[This](https://github.com/catchpoint/Integrations.GoogleCloudMonitoring) repository has all the required NodeJS scripts to deploy webhooks.
 1. Clone [this](https://github.com/catchpoint/Integrations.GoogleCloudMonitoring) repository to your local machine.
 
     ```bash
     $ git clone https://github.com/catchpoint/Integrations.GoogleCloudMonitoring.git
    ```
 1. Navigate to the directory where the files were cloned and update project Id under .env file

### Deploying cloud functions.

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
    ```bash
    $ gcloud functions deploy catchpointSubscribe --trigger-topic catchpoint-webhook --timeout=180 --runtime nodejs10 --allow-unauthenticated
    ```
### Catchpoint Setup:

Add the copied URL to Catchpoint.
1. In catchpoint,from Settings go to [API page](https://portal.catchpoint.com/ui/Content/Administration/ApiDetail.aspx).
1. Under Test Data Webhook add the copied url.
1. Select default JSON for Test-data webhook and save the changes

**Note: Test data webhook should be enabled under the test properties page.**

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
 
### Viewing logs:

1. To check logs with the gcloud tool, use the logs read command:\
   This will help in troubleshooting.

   ```bash
   $ gcloud functions logs read
   ````
1. To view the logs for a specific function, provide the function name as an argument:
   ```bash
   $ gcloud functions logs read catchpointSubscribe
   ````
