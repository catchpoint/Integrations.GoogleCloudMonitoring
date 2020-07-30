
# Catchpoint-Google Stackdriver

## Introduction

Cloud Monitoring provides visibility into the performance, uptime, and overall health of applications. It collects metrics, events, and metadata from Google Cloud, Amazon Web Services, hosted uptime probes, application instrumentation, and a variety of common application components including Cassandra, Nginx, Apache Web Server, Elasticsearch, and many others. Operations ingests that data and generates insights via dashboards, charts, and alerts. Cloud Monitoring alerting helps you collaborate by integrating with Slack, PagerDuty, and more.
We will be looking at ingesting data from Catchpoint into Cloud Monitoring.
[https://cloud.google.com/monitoring](https://cloud.google.com/monitoring)

This Integrations supports the following test types and metrics respectively.

**Web**  : Timing metrics like Total, Connect, Dns, ContentLoad, Document complete.

**Transaction** : Timing metrics like Total, Connect, Dns, ContentLoad, Document complete.

**API** : Timing metrics like Total, Connect, Dns, ContentLoad.

**Trace route** :  Packet loss , round trip time, number of hops.

**Ping** :  Packet Loss, Round Trip Time.

**DNS** :  Response times.

##  Prerequisites

Google Cloud project 

## Installation &amp; Configuration

### Google cloud Setup:
 ### Enabling the Monitoring API
 
1. Select the [project](https://console.cloud.google.com/apis/dashboard) you will use to access the API.

2.  Click the Enable APIs and Service button.

3. Search for &quot;Stackdriver&quot;.

4. In the search results, click through to &quot;Cloud Monitoring API&quot;.

5. If &quot;API enabled&quot; is displayed, then the API is already enabled. If not, click the Enable button.

### Install cloud SDK on your local machine

1. Download the [Cloud SDK installer.](https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe)

2. Launch the installer and follow the prompts. The installer is signed by Google LLC. Cloud SDK requires Python. Supported versions are 3.5 to 3.7, and 2.7.9 or higher. The installer will install all necessary dependencies, including the needed Python version.

3. After installation has completed, accept the following options:
     -Start Cloud SDK Shell

The installer starts a terminal window and runs the gcloud init command.

### Enabling cloud functions.

1. Go to the project selector page

2. Make sure that billing is enabled for your Google Cloud project.   [Learn how to confirm billing is enabled for your project](https://cloud.google.com/billing/docs/how-to/modify-project).

3. Enable the [Cloud Functions and Cloud Pub/Sub APIs.](https://console.cloud.google.com/flows/enableapi?apiid=cloudfunctions,pubsub&redirect=https://cloud.google.com/functions/docs/tutorials/pubsub)

4. Install and initialize the Cloud SDK.

5. Update gcloud components:
 ```bash
$ gcloud components update
```
### Clone the Repository to your local machine

This repository has all the required NodeJS scripts to deploy webhooks.
Clone [this](https://github.com/catchpoint/Integrations.GoogleCloudMonitoring) repository to your local machine.

Navigate to the directory where the files were cloned and update project Id under .env file

   ```bash
$ cd <path to extracted directory>;
```
### Deploying cloud functions.


Index.js has two functions called catchpointPublish and catchpointSubscribe.

Open Google Cloud SDK Shell and navigate to the directory where the NodeJS scripts was extracted.

 ```bash
$ cd <path to extracted directory>;
```
  
**Deploy publish function**
  
 ```bash
$ gcloud functions deploy catchpointPublish --trigger-http --runtime nodejs10 --timeout=180 --trigger-http --allow-unauthenticated
```
Copy the URL once the deployment is successful. This will be webhook URL which will be added in Catchpoint portal.

**Deploy Subscribe function:**

 ```bash
$ gcloud functions deploy catchpointSubscribe --trigger-topic catchpoint-webhook --timeout=180 --runtime nodejs10 --allow-unauthenticated
  ```

**Catchpoint Setup:**

Add the copied URL to Catchpoint ->Settings ->API page under Test Data Webhook.

**Note: Test data webhook should be enabled under the test properties page.**

## Results

To use Cloud Monitoring, you must have a Google Cloud project with billing enabled. The project must also be associated with a Workspace. Cloud Monitoring uses Workspaces to organize monitored Google Cloud projects.

In the Google Cloud Console, go to Monitoring -\&gt; Overview this will create a workspace for you automatically for the first time.

  
To view the metrics for a monitored resource using Metrics Explorer, do the following:

 1. From the Google Cloud Console, go to Monitoring. [https://console.cloud.google.com/monitoring](https://console.cloud.google.com/monitoring)
 2. In the Monitoring navigation pane, click Metrics Explorer.
 3. Enter the monitored resource name in the Find resource type and metric text box.
Resource type -> global. 
All the Catchpoint specific metrics will have id’s in the following format. custom.googleapis.com/global/catchpoint_Connect
custom.googleapis.com/global/catchpoint_Dns
custom.googleapis.com/global/catchpoint_Load
 4. Metrics explorer also allows to filter data points using node name or test id.
 5. Add all the required metrics and this save the chart to a dashboard.
[https://cloud.google.com/monitoring/charts/metrics-explorer
](https://cloud.google.com/monitoring/charts/metrics-explorer
)
 6. Navigate to Monitoring-Dashboards to check out the metrics.


To check logs with the gcloud tool, use the logs read command:
This will which help in troubleshooting.
 ```bash
$ gcloud functions logs read
````

To view the logs for a specific function, provide the function name as an argument:

 ```bash
$ gcloud functions logs read catchpointSubscribe
````
