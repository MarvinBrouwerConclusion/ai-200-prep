const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const target = path.join(root, 'dist', 'instructor-sample.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(target, 'utf8'), context);

const sample = context.window.AI200_INSTRUCTOR_SAMPLE;

const commonCorrections = text => String(text ?? '')
  .replace(/\bAl\b/g, 'AI')
  .replace(/Azure Opendl/gi, 'Azure OpenAI')
  .replace(/\bextemal\b/gi, 'external')
  .replace(/\bfolowing\b/gi, 'following')
  .replace(/\bmutti-partitioned\b/gi, 'multi-partitioned')
  .replace(/\bmuttiple\b/gi, 'multiple')
  .replace(/\bFeediterator\b/g, 'FeedIterator')
  .replace(/\bTraceldRatioBasedSampler\b/g, 'TraceIdRatioBasedSampler')
  .replace(/\bfolows\b/gi, 'follows')
  .replace(/\blinimize\b/gi, 'Minimize')
  .replace(/\bfitered\b/gi, 'filtered')
  .replace(/\bfittering\b/gi, 'filtering')
  .replace(/\bnofifications\b/gi, 'notifications')
  .replace(/\bpossibilty\b/gi, 'possibility')
  .replace(/\bsence\b/gi, 'service')
  .replace(/\bAlresponses\b/g, 'AI responses')
  .replace(/\bAppConfigt\b/g, 'AppConfig1')
  .replace(/\bqueuet\b/g, 'queue1')
  .replace(/\baccount!\b/g, 'account1')
  .replace(/\bApp!\b|\bAppt\b/g, 'App1')
  .replace(/\bapit\b|api'/g, 'api1')
  .replace(/\bTopic'\b/g, 'Topic1')
  .replace(/\bSub\//g, 'Sub1')
  .replace(/\bsetupScript ps1\b/g, 'setupScript.ps1')
  .replace(/\bContosoApp dll\b/g, 'ContosoApp.dll')
  .replace(/\bretums\b/gi, 'returns')
  .replace(/\bKOL\b/g, 'KQL')
  .replace(/\bdese\b/g, 'desc')
  .replace(/\broling\b/gi, 'rolling')
  .replace(/\bKey Vaut\b/g, 'Key Vault')
  .replace(/\bforthe\b/gi, 'for the')
  .replace(/\batleast\b/gi, 'at least')
  .replace(/\battempis\b/gi, 'attempts')
  .replace(/\bupto\b/gi, 'up to')
  .replace(/\bNo n\b/g, 'No')
  .replace(/\bina\b/gi, 'in a')
  .replace(/\bOat\b/g, 'flat')
  .replace(/\bItis\b/g, 'It is')
  .replace(/\brequest_ount\b/g, 'request_count')
  .replace(/\bimage'\b/g, 'image1')
  .replace(/\bAzure Container registry\b/g, 'Azure Container Registry')
  .replace(/\bAI generated\b/g, 'AI-generated')
  .replace(/\bLast 24 hours The\b/g, 'Last 24 hours. The')
  .replace(/\b4 new feature\b/g, 'a new feature')
  .replace(/\bAnon-sensitive\b/g, 'A non-sensitive')
  .replace(/\bAuser\b/g, 'A user')
  .replace(/\bA\.NET\b/g, 'A .NET')
  .replace(/\bNET application\b/g, '.NET application')
  .replace(/\bAcontainer\b/g, 'A container')
  .replace(/\bUsea\b/g, 'Use a')
  .replace(/[‘’]/g, "'")
  .replace(/[“”]/g, '"')
  .replace(/(^|[\s(])'(?=[A-Z])/g, '$1')
  .replace(/\s+([,.;:?])/g, '$1')
  .replace(/[ \t]{2,}/g, ' ')
  .trim();

function stripQuestionHeader(text) {
  if (!/^(?:Mark\s+)?Questio/i.test(text)) return text;
  const close = text.indexOf(')');
  const header = close >= 0 ? text.slice(0, close + 1) : '';
  if (close >= 0 && close < 220 && /Q\d+/i.test(header)) {
    return text.slice(close + 1).replace(/^\s*[.:_-]?\s*/, '');
  }
  return text.replace(/^(?:Mark\s+)?Questio\S*\s*(?:\[[^\]]*\]|\([^)]*\)|of\s+174)?\s*/i, '');
}

function cleanPrompt(raw, question) {
  let text = commonCorrections(stripQuestionHeader(String(raw ?? '')));

  text = text.replace(
    /Not(?:e:?)?\s+This question is part of a series[\s\S]*?review screen\.\s*/i,
    'Series note: Evaluate the proposed solution independently. You cannot return to this question after selecting Next.\n\n'
  );

  if (['order', 'drag', 'matching', 'matrix'].includes(question.type)) {
    text = text
      .replace(/\s+To answer,\s+move the appropriate[\s\S]*$/i, '')
      .replace(/\s+To answer,\s+move all actions[\s\S]*$/i, '');
  }

  text = text
    .replace(/\s*[©¢•]\s*/g, '\n- ')
    .replace(/\s+\*\s+(?=[A-Z])/g, '\n- ')
    .replace(/\s+Solution:\s*/gi, '\n\nProposed solution:\n')
    .replace(/\s+(Does the solution meet (?:the goal|all requirements)\?)/gi, '\n\n$1')
    .replace(/\s+NOTE:\s*/g, '\n\nNote: ')
    .replace(/\s+(You need to (?:implement|identify|recommend|configure|select|ensure|determine|modify|address|optimize|troubleshoot))/gi, '\n\n$1')
    .replace(/:\s*\n- /g, ':\n- ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/(?:\n\s*Proposed\s*)+\n(?=Proposed solution:)/gi, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();

  return text;
}

function cleanOption(raw) {
  return commonCorrections(raw)
    .replace(/\s+(?:LJ\s+)?'?Show List[\s\S]*$/i, '')
    .replace(/\s+Qn\s*$/i, '')
    .replace(/^['"]+|['"]+$/g, '')
    .trim();
}

function cleanExplanation(raw) {
  return commonCorrections(raw)
    .replace(/\s+Qn\s*$/i, '')
    .replace(/\s+(Correct:|Incorrect:)/g, '\n\n$1')
    .replace(/\n{3,}/g, '\n\n');
}

const promptOverrides = {
  INS001: [
    'You are implementing an application that uses Azure Event Grid to push near-real-time information to customers.',
    '',
    'Requirements:',
    '- Send events to thousands of customers.',
    '- Support hundreds of event types.',
    '- Filter events by event type before processing.',
    '- Use Microsoft Entra ID for authentication and authorization.',
    '- Publish events to a single endpoint.',
    '',
    'Proposed solution:',
    '- Publish events to a partner topic.',
    '- Create an event subscription for each customer.',
    '',
    'Does this solution meet all requirements?'
  ].join('\n'),
  INS002: [
    'A PostgreSQL-backed application receives many concurrent requests.',
    '',
    'You need to improve throughput while avoiding excessive database connection overhead.',
    '',
    'What should you implement?'
  ].join('\n'),
  INS003: [
    'A company uses Azure App Configuration across development, staging, and production.',
    '',
    'Requirements:',
    '- Organize keys hierarchically.',
    '- Maintain environment-specific values and revision history.',
    '- Avoid duplicating key names.',
    '- Minimize cost.',
    '',
    'How should the keys be organized and retrieved?'
  ].join('\n'),
  INS006: [
    'You plan to develop an HTTP-triggered Azure Functions app.',
    '',
    'Requirements:',
    '- Scale automatically in response to events.',
    '- Run from a custom Linux container image.',
    '',
    'Select the hosting plan and the maximum HTTP response time.'
  ].join('\n'),
  INS008: [
    'A Retrieval-Augmented Generation (RAG) solution caches AI responses and embeddings in Redis.',
    '',
    'Requirements:',
    '- Expire AI responses exactly 24 hours after they are cached.',
    '- Ensure cached embeddings always reflect the current source data.',
    '',
    'Select the Redis configuration for each requirement.'
  ].join('\n'),
  INS011: [
    'You plan to deploy a web application to Azure Kubernetes Service (AKS).',
    '',
    'Requirements:',
    '- Add pods automatically during periods of high CPU utilization.',
    '- Expose the application only inside the cluster.',
    '',
    'Select the Kubernetes resource for each requirement.'
  ].join('\n'),
  INS012: [
    'You are preparing a container image for production.',
    '',
    'Requirements:',
    '- Give the image a unique version.',
    '- Authenticate securely when pushing to Azure Container Registry (ACR).',
    '- Store the completed image in ACR.',
    '',
    'Arrange the build-and-push actions in the correct order.'
  ].join('\n'),
  INS020: [
    'An Azure Service Bus topic receives messages, and a subscription is receiving copies of those messages. Your application creates the subscription client successfully, but it does not process any messages.',
    '',
    'Which code segment should you add?'
  ].join('\n'),
  INS021: [
    'An AI application uses Azure App Configuration for runtime settings.',
    '',
    'Requirements:',
    '- Support percentage-based and targeted rollouts.',
    '- Retrieve a secret securely at runtime.',
    '- Store a list of supported deployment regions.',
    '',
    'Select the App Configuration feature for each requirement.'
  ].join('\n'),
  INS023: [
    'An HTTP-triggered Azure Function accepts large image uploads.',
    '',
    'Requirements:',
    '- Return quickly enough to avoid client timeouts.',
    '- Process images asynchronously with automatic retries.',
    '- Scale image processing independently from incoming HTTP requests.',
    '',
    'Which two actions should you implement?'
  ].join('\n'),
  INS027: [
    'An Azure web app uses Azure Cosmos DB for NoSQL. The supplied script creates a container with `/EmployeeId` as its partition key and autoscale maximum throughput of 5,000 RU/s.',
    '',
    'The application runs one range query on `EmployeeId` and one equality query on `UserId`.',
    '',
    'For each statement about throughput and partition routing, select Yes or No.'
  ].join('\n'),
  INS034: [
    'You deploy three microservices to one Azure Container Apps environment.',
    '',
    'Requirements:',
    '- serviceA needs storage visible only to its container and limited by local container disk space.',
    '- serviceB needs storage shared by containers in the same replica for the lifetime of that replica.',
    '- serviceC needs persistent storage shared across replicas with per-object permissions.',
    '',
    'Select the appropriate storage type for each service.'
  ].join('\n'),
  INS052: [
    'A multi-partition Azure Cosmos DB for NoSQL container must send inserts and updates to Azure Blob Storage.',
    '',
    'Requirements:',
    '- Process changes from every partition promptly.',
    '- Allow change processing to run in parallel.',
    '',
    'Which two implementations can satisfy these requirements?'
  ].join('\n'),
  INS059: [
    'An Azure Functions app uses the Consumption plan and contains three functions:',
    '- f1: HTTP trigger',
    '- f2: Timer trigger',
    '- f3: Azure Queue Storage trigger',
    '',
    'Dynamic concurrency must manage each supported function independently.',
    '',
    'Select the configuration file and function to which dynamic concurrency applies.'
  ].join('\n'),
  INS060: [
    'You are designing a public API with Azure Functions.',
    '',
    'Requirements:',
    '- Validate request data and return a result immediately.',
    '- Support Microsoft Entra ID authentication.',
    '- Scale automatically under variable load.',
    '',
    'Which trigger should you implement?'
  ].join('\n'),
  INS061: [
    'An AI API running in Azure Container Apps requires database credentials stored in Azure Key Vault. Key Vault uses Azure RBAC, and the security team rotates the credentials periodically.',
    '',
    'Requirements:',
    '- Keep credentials out of code and configuration.',
    '- Retrieve the latest secret version at runtime.',
    '- Avoid redeploying the container after rotation.',
    '',
    'Which three actions should you perform?'
  ].join('\n'),
  INS065: [
    'A backend worker receives Azure Service Bus messages in Peek-Lock mode. It deserializes each message, runs inference, saves the result, and completes the message after successful processing.',
    '',
    'For each statement about message settlement and retry behavior, select Yes or No.'
  ].join('\n'),
  INS071: [
    'An AI inference pipeline has three messaging requirements:',
    '- Send each published message to multiple independent consumers.',
    '- Process work in first-in, first-out (FIFO) order.',
    '- Isolate messages that cannot be processed.',
    '',
    'Arrange the appropriate Azure Service Bus entities in requirement order.'
  ].join('\n'),
  INS073: [
    'Review the supplied HTTP-triggered Azure Function. It accepts POST requests with `AuthorizationLevel.Function`, reads the request body, and returns that body in an HTTP 200 response.',
    '',
    'For each statement about authentication, supported methods, response content, and validation, select Yes or No.'
  ].join('\n'),
  INS074: [
    'You need to generate reports with Azure Container Apps.',
    '',
    'Requirements:',
    '- Run every Sunday at midnight.',
    '- Consume resources only while report generation runs.',
    '- Use the existing Container Apps environment, virtual network, and logging destination.',
    '',
    'Select the workload type, creation action, and trigger type.'
  ].join('\n'),
  INS080: [
    'An Azure Service Bus subscription has three rules: two correlation filters and one SQL filter with an action. A message can satisfy more than one rule in the same subscription.',
    '',
    'For each statement about delivery, property sources, and filter performance, select Yes or No.'
  ].join('\n'),
  INS081: [
    'An Azure Service Bus namespace contains a topic named Topic1. You create a subscription named Sub1.',
    '',
    'The subscription must filter messages by system or application properties and annotate the metadata of each matching message.',
    '',
    'Select the filter type and filtering action.'
  ].join('\n'),
  INS082: [
    'A PostgreSQL table stores document embeddings together with `department` and `created_at` metadata.',
    '',
    'The application must return the five documents most similar to a query vector, restricted to the finance department.',
    '',
    'Arrange the SQL filter and vector-ordering clauses in the correct order.'
  ].join('\n'),
  INS087: [
    'An App Service application has development, test, and production instances. Each instance uses a different backend API endpoint, and departments receive different page layouts.',
    '',
    'Requirements:',
    '- Store API endpoint details as encrypted JSON.',
    '- Change layout assignments without modifying application code.',
    '',
    'Which two Azure App Configuration features should you create?'
  ].join('\n'),
  INS088: [
    'An Azure Container App named App1 uses an access key to call a backend API.',
    '',
    'Requirements:',
    '- Store the key outside the Container Apps environment.',
    '- Minimize credential-maintenance work.',
    '',
    'Select the storage location and access method.'
  ].join('\n'),
  INS092: [
    'An application uses an Azure Cosmos DB for NoSQL account whose default consistency level is Session.',
    '',
    'You want to relax read consistency to Consistent Prefix on a per-request basis. Write consistency continues to follow the account configuration.',
    '',
    'Select the resulting consistency level for reads and writes.'
  ].join('\n'),
  INS095: [
    'An AI search application has high latency. Request and dependency telemetry is stored in Azure Monitor Logs.',
    '',
    'Requirements:',
    '- Analyze only the last 24 hours.',
    '- Include failed requests only.',
    '- Correlate requests with dependencies.',
    '- Calculate average dependency duration by operation.',
    '- Minimize the initial data scan.',
    '',
    'Arrange the five KQL operations in the correct order.'
  ].join('\n'),
  INS099: [
    'An application named app1 reads and writes data in an Azure Cosmos DB for NoSQL account named account1.',
    '',
    'You must configure consistency at the per-operation level whenever the SDK supports it.',
    '',
    'Select where to configure consistency for read and write operations.'
  ].join('\n'),
  INS101: [
    'You are creating a Dockerfile for an ASP.NET Core application named ContosoApp.',
    '',
    'Requirements:',
    '- Run `setupScript.ps1` while building the image.',
    '- Start `ContosoApp.dll` when the container starts.',
    '- Build from the directory containing the application files and setup script.',
    '',
    'Arrange the five Dockerfile instructions in the correct order.'
  ].join('\n'),
  INS102: [
    'An Azure Cosmos DB for NoSQL query sorts first by `name` in ascending order and then by `city` in descending order.',
    '',
    'Which index-policy elements are required to support this query efficiently?'
  ].join('\n'),
  INS110: [
    'A .NET application uses the Azure Cosmos DB for NoSQL SDK.',
    '',
    'Tasks:',
    '- Initialize a connection with the account endpoint and key.',
    '- Define shared database throughput.',
    '- Perform CRUD operations on items in a container.',
    '',
    'Arrange the SDK components in the order in which they are used.'
  ].join('\n'),
  INS116: [
    'You are implementing an Azure Cosmos DB change feed processor for an existing container.',
    '',
    'Arrange the processor components in the order needed to monitor changes, coordinate leases, run the processor, and handle each batch.'
  ].join('\n'),
  INS117: [
    'A distributed application exports traces to Azure Monitor.',
    '',
    'Requirements:',
    '- Preserve upstream sampling decisions across a distributed trace.',
    '- Capture every span during local testing.',
    '- Sample 10 percent of traces in production.',
    '',
    'Arrange the appropriate OpenTelemetry samplers in requirement order.'
  ].join('\n'),
  INS118: [
    'You configure an Event Grid subscription for AI inference events.',
    '',
    'Requirements:',
    '- Filter events by payload data.',
    '- Retain events that cannot be delivered.',
    '- Limit retry attempts.',
    '',
    'Select the Event Grid setting for each requirement.'
  ].join('\n'),
  INS121: [
    'A hospital stores patient information in Azure Cosmos DB for NoSQL. The account default is Strong consistency.',
    '',
    'Requirements:',
    '- Retrieve the most recent patient status after updates from multiple locations.',
    '- Allow health-monitoring reads to return the current or immediately preceding version.',
    '- Read finalized billing records with minimal latency and availability impact.',
    '',
    'Select the weakest consistency level that still satisfies each requirement.'
  ].join('\n'),
  INS123: [
    'Application image APP1 is stored in Azure Container Registry ACR01 and uses base image BASE1 from ACR02.',
    '',
    'APP1 must rebuild automatically whenever BASE1 is updated.',
    '',
    'Arrange the Azure CLI commands needed to create permissions, define the ACR task, and run it.'
  ].join('\n'),
  INS128: [
    'A Linux container running in App Service needs two environment variables:',
    '- `MODEL_VERSION`, which is not sensitive.',
    '- A database password that must remain secret.',
    '',
    'Select the App Service configuration for each value.'
  ].join('\n'),
  INS138: [
    'An Event Grid subscription sends events to a company-managed serverless webhook that performs compliance checks.',
    '',
    'You must authenticate delivery and prove ownership of the webhook endpoint when the subscription is created.',
    '',
    'Select the authentication and endpoint-validation mechanisms.'
  ].join('\n'),
  INS146: [
    'A .NET application uses Azure Cosmos DB for NoSQL. The account has multiple write regions, and application instances run in East US 2 and Central US.',
    '',
    'Which two client settings support local routing and multi-region writes?'
  ].join('\n'),
  INS152: [
    'You are selecting hosting plans for two Azure Functions apps:',
    '- App1 runs Windows code.',
    '- App2 runs as a Linux container.',
    '',
    'Both apps process requests for up to 10 minutes, require event-driven autoscaling, and need the highest supported scale-out limit.',
    '',
    'Select the hosting plan for each app.'
  ].join('\n'),
  INS153: [
    'An Azure Container App named App1 uses an API secret to call a backend service.',
    '',
    'Requirements:',
    '- Store the secret outside the Container Apps environment.',
    '- Minimize credential-maintenance work.',
    '',
    'Select the storage location and access method.'
  ].join('\n'),
  INS156: [
    'A Cosmos DB pre-trigger must ensure that every food-delivery payment document contains a numeric `tip` property. Older clients may omit this property.',
    '',
    'Complete the supplied JavaScript trigger so that a missing or invalid tip is set to zero before the request body is written.'
  ].join('\n'),
  INS158: [
    'An Event Grid subscription sends AI file-upload events to an Azure Function.',
    '',
    'Requirements:',
    '- Accept only event subjects beginning with `/uploads/ai/`.',
    '- Accept only events whose `data.fileType` value is `pdf`.',
    '- Retain events that remain undelivered after retries.',
    '',
    'Select the filtering or reliability setting for each requirement.'
  ].join('\n'),
  INS170: [
    'You deploy an API to Azure Container Apps.',
    '',
    'Requirements:',
    '- Run multiple application revisions concurrently.',
    '- Route 20 percent of incoming traffic to a new revision.',
    '',
    'Select the configuration for each requirement.'
  ].join('\n'),
  INS172: [
    'You are designing Azure Functions for three backend workloads.',
    '',
    'Requirements:',
    '- Return an immediate response to a client.',
    '- Process background work from a queue.',
    '- Run code on a fixed schedule.',
    '',
    'Select the appropriate trigger for each workload.'
  ].join('\n'),
  INS174: [
    'Uploading a blob to Azure Storage must start backend processing.',
    '',
    'Requirements:',
    '- Avoid polling.',
    '- Minimize latency.',
    '- Start processing automatically when the upload occurs.',
    '',
    'Which trigger should you implement?'
  ].join('\n')
};

Object.assign(promptOverrides, {
  INS016: [
    'Series note: Evaluate the proposed solution independently. You cannot return to this question after selecting Next.',
    '',
    'You are implementing an application that uses Azure Event Grid to push near-real-time information to customers.',
    '',
    'Requirements:',
    '- Send events to thousands of customers.',
    '- Support hundreds of event types.',
    '- Filter events by event type before processing.',
    '- Use Microsoft Entra ID for authentication and authorization.',
    '- Publish events to a single endpoint.',
    '',
    'Proposed solution:',
    '- Publish events to a system topic.',
    '- Create an event subscription for each customer.',
    '',
    'Does the solution meet the goal?'
  ].join('\n'),
  INS024: [
    'Container source code is stored in a Git repository. Azure Container Registry (ACR) must automatically build and store a new image whenever a developer commits code.',
    '',
    'You need to use native ACR features and minimize external build infrastructure.',
    '',
    'Which two ACR components should you use?'
  ].join('\n'),
  INS026: [
    'An AI application retrieves database credentials from Azure Key Vault by using the Azure SDK for Python. The application must authenticate with managed identity.',
    '',
    'Review the code and evaluate each statement.'
  ].join('\n'),
  INS028: [
    'An application uses the latest Azure Cosmos DB SDK and a change feed processor to read batches of 100 documents from a new container. Processing can fail on an individual document.',
    '',
    'Requirements:',
    '- Monitor the progress of the change feed processor.',
    '- Prevent the entire batch from being retried when one document cannot be processed.',
    '',
    'Which features should you use?'
  ].join('\n'),
  INS033: [
    'Several microservices run on Azure Container Apps and must support HTTPS through a custom domain.',
    '',
    'In which order should you configure the custom domain?'
  ].join('\n'),
  INS042: [
    'All functions in an Azure Functions app must retry a failed execution until it succeeds or reaches 10 attempts. The delay between attempts must grow from at least 20 seconds to at most 15 minutes.',
    '',
    'Complete the host.json configuration.'
  ].join('\n'),
  INS045: [
    'Telemetry from an Azure OpenAI service is stored in a Log Analytics workspace. You need a KQL query against AppRequests that filters failed requests from the last 30 minutes and counts failures by operation.',
    '',
    'Which two KQL operators should you use?'
  ].join('\n'),
  INS070: [
    'An application must update vector embeddings when documents change and must retain processing state between runs.',
    '',
    'Which two Azure Cosmos DB change feed components should you configure?'
  ].join('\n'),
  INS094: [
    'Review the Python OpenTelemetry configuration that exports distributed traces to Azure Monitor.',
    '',
    'Evaluate each statement about the configuration.'
  ].join('\n'),
  INS107: [
    'You are developing a Java application in Azure Functions that reads secrets from Azure Key Vault.',
    '',
    'Requirements:',
    '- Reference Key Vault without changing the Java code.',
    '- Scale automatically in response to events.',
    '- Keep instances warm to avoid cold starts.',
    '- Connect to a virtual network.',
    '- Remove the Key Vault identity when the function app is deleted.',
    '',
    'Which three actions should you perform in sequence?'
  ].join('\n'),
  INS114: [
    'A Python application uses the azure-cosmos SDK to read data from an existing Azure Cosmos DB for NoSQL container.',
    '',
    'In which order should the application connect to the account and run a SQL query?'
  ].join('\n'),
  INS119: [
    'An Azure Cosmos DB for NoSQL account uses session consistency. Multiple instances of App1 must read and write container1 while participating in the same logical session.',
    '',
    'Which object should the instances share?'
  ].join('\n'),
  INS122: [
    'Resource group RG1 contains a Service Bus queue named SB1. An Event Grid push subscription must deliver an event to SB1 whenever a resource in RG1 is created, modified, or deleted.',
    '',
    'Which Event Grid topic type should you use to minimize development and configuration effort?'
  ].join('\n'),
  INS142: [
    'You are deploying an Azure Functions app that retrieves secrets from Key Vault by using a managed identity. The identity and secret configuration must exist before the function code is deployed.',
    '',
    'In which order should you perform the deployment actions?'
  ].join('\n'),
  INS145: [
    'A microservice runs in Azure Container Apps with external HTTP ingress. Test users need a stable URL for a new version while the current version remains available.',
    '',
    'Which Container Apps features should you configure?'
  ].join('\n'),
  INS157: [
    'An Azure Container Apps application processes messages from a specific Azure Storage queue. It must scale automatically by using a KEDA custom scale rule.',
    '',
    'Which two scale-rule values are required?'
  ].join('\n'),
  INS160: [
    'Series note: Evaluate the proposed solution independently. You cannot return to this question after selecting Next.',
    '',
    'You are implementing an application that uses Azure Event Grid to push near-real-time information to customers.',
    '',
    'Requirements:',
    '- Send events to thousands of customers.',
    '- Support hundreds of event types.',
    '- Filter events by event type before processing.',
    '- Use Microsoft Entra ID for authentication and authorization.',
    '- Publish events to a single endpoint.',
    '',
    'Proposed solution:',
    '- Publish events to a custom topic.',
    '- Create an event subscription for each customer.',
    '',
    'Does the solution meet the goal?'
  ].join('\n')
});

Object.assign(promptOverrides, {
  INS054: [
    'An Azure Service Bus namespace contains a partitioned queue named queue1. You expect a large volume of randomly ordered messages over the next several weeks.',
    '',
    'You need to minimize interruptions caused by transient failures of individual partitions.',
    '',
    'How should you configure the message partition key?'
  ].join('\n'),
  INS063: [
    'You are creating an Azure Functions project locally with Azure Functions Core Tools. The project must use Python or C# and must be initialized without a function template.',
    '',
    'Select the command and parameter required to initialize the project.'
  ].join('\n')
});

Object.assign(promptOverrides, {
  INS019: [
    'You are building a semantic search feature for a chatbot and store document embeddings in Redis.',
    '',
    'Review the Python code and evaluate each statement.'
  ].join('\n'),
  INS029: [
    'Series note: Evaluate the proposed solution independently. You cannot return to this question after selecting Next.',
    '',
    'A KQL query must count requests by HTTP result code and sort the groups from most frequent to least frequent.',
    '',
    'Proposed solution:',
    'The result codes are sorted alphabetically.',
    '',
    'Does the solution meet the goal?'
  ].join('\n'),
  INS032: [
    'A Python web API uses OpenTelemetry for tracing. The call_downstream_service function makes an outbound HTTP request by using the requests library.',
    '',
    'The displayed code is the only OpenTelemetry configuration in the application.',
    '',
    'Evaluate each statement.'
  ].join('\n'),
  INS041: [
    'Series note: Evaluate the proposed solution independently. You cannot return to this question after selecting Next.',
    '',
    'A KQL query must count requests by HTTP result code and sort the groups from most frequent to least frequent.',
    '',
    'Proposed solution:',
    'Use the displayed query.',
    '',
    'Does the solution meet the goal?'
  ].join('\n'),
  INS051: [
    'A Dockerfile builds image1. The application image and its base image are stored in separate repositories in Azure Container Registry registry1. The image1 source is in the main branch of the GitHub repository account1/app1.',
    '',
    'Image1 must rebuild automatically when either its base image or the main branch changes.',
    '',
    'Complete the Azure CLI command.'
  ].join('\n'),
  INS084: [
    'An application sells AI-generated images. A marketing campaign displays a different advertisement every two days. Azure Cosmos DB stores each sale date in the whenFinished property.',
    '',
    'The marketing team needs the number of sales for every two-day period.',
    '',
    'Complete the query.'
  ].join('\n'),
  INS126: [
    'Series note: Evaluate the proposed solution independently. You cannot return to this question after selecting Next.',
    '',
    'A KQL query must count requests by HTTP result code and sort the groups from most frequent to least frequent.',
    '',
    'Proposed solution:',
    'Use the displayed query.',
    '',
    'Does the solution meet the goal?'
  ].join('\n'),
  INS127: [
    'You are designing an Azure Database for PostgreSQL table for semantic search. Queries frequently filter on the created_at column.',
    '',
    'Requirements:',
    '- Support vector similarity search.',
    '- Support reliable date filtering.',
    '',
    'Which two actions should you perform?'
  ].join('\n'),
  INS129: [
    'A Python API running in Azure Container Apps creates spans but does not send distributed traces to Azure Monitor.',
    '',
    'In which order should you configure the OpenTelemetry SDK pipeline and create a span?'
  ].join('\n'),
  INS130: [
    'Series note: Evaluate the proposed solution independently. You cannot return to this question after selecting Next.',
    '',
    'A KQL query must count requests by HTTP result code and sort the groups from most frequent to least frequent.',
    '',
    'Proposed solution:',
    'Use the displayed query.',
    '',
    'Does the solution meet the goal?'
  ].join('\n'),
  INS131: [
    'A containerized Python application retrieves a runtime setting from Azure App Configuration. It must authenticate locally with developer credentials and in Azure with managed identity, without code changes.',
    '',
    'Complete the Python code.'
  ].join('\n'),
  INS141: [
    'Series note: Evaluate the proposed solution independently. You cannot return to this question after selecting Next.',
    '',
    'A KQL query must count requests by HTTP result code and sort the groups from most frequent to least frequent.',
    '',
    'Proposed solution:',
    'The query lists every individual request with its result code.',
    '',
    'Does the solution meet the goal?'
  ].join('\n'),
  INS165: [
    'A containerized recommendation API connects to Azure Database for PostgreSQL.',
    '',
    'Requirements:',
    '- Comply with the database authentication policy.',
    '- Support high concurrency with minimal latency.',
    '- Protect database stability during traffic spikes.',
    '',
    'Select the best configuration for each requirement.'
  ].join('\n')
});

const optionOverrides = {
  INS052: [
    'Create an Azure Function that uses an Azure Cosmos DB trigger connected to the container.',
    'Create an Azure App Service API that uses the SDK change feed estimator and scale the API across multiple App Service instances.',
    'Create a background job in Azure Kubernetes Service that uses the SDK change feed processor.',
    'Create multiple Azure Functions that use FeedIterator and FeedRange to process the change feed with the pull model.'
  ],
  INS020: [
    'subscriptionClient = new SubscriptionClient(ServiceBusConnectionString, TopicName, SubscriptionName);',
    'subscriptionClient.RegisterMessageHandler(ProcessMessagesAsync, messageHandlerOptions);',
    'await subscriptionClient.AddRuleAsync(new RuleDescription(RuleDescription.DefaultRuleName, new TrueFilter()));',
    'await subscriptionClient.CloseAsync();'
  ],
  INS082: ["WHERE department = 'Finance'", 'ORDER BY embedding <=> query_vector LIMIT 5'],
  INS099: ['app1', 'account1'],
  INS101: [
    'FROM microsoft/aspnetcore:latest',
    'WORKDIR /apps/ContosoApp',
    'COPY . /apps/ContosoApp',
    'RUN powershell ./setupScript.ps1',
    'CMD ["dotnet", "ContosoApp.dll"]'
  ],
  INS102: ['compositeIndexes', 'descending']
};

const codeOverrides = {
  INS029: 'requests\n| summarize request_count = count() by resultCode\n| order by request_count desc',
  INS041: 'requests\n| summarize request_count = count() by resultCode\n| order by resultCode desc',
  INS126: 'requests\n| summarize request_count = count() by resultCode\n| order by request_count desc',
  INS130: 'requests\n| summarize request_count = count() by resultCode',
  INS141: 'requests\n| summarize request_count = count() by resultCode\n| order by request_count desc'
};

const answerOverrides = {
  INS023: [0, 3],
  INS129: [
    "Initialize the application's TracerProvider for tracing",
    'Create the Azure Monitor component that sends trace data',
    'Configure a span processor to send spans to the exporter',
    'Call tracer.start_as_current_span()'
  ]
};

const explanationOverrides = {
  INS005: 'The supplied answer uses an SDK-level read-consistency setting for the requested read behavior. Setting TTL to -1 keeps items from expiring automatically.',
  INS010: 'Reducing vector precision and changing a flat index to quantizedFlat or DiskANN can reduce the work and RU consumption of similarity searches. Strong consistency does not optimize vector computation.',
  INS019: 'hset stores the binary embedding in a Redis hash field. This alone does not create a vector index, so it does not enable similarity search. expire(..., 600) removes the key after 600 seconds, or 10 minutes.',
  INS029: 'The query groups rows by resultCode, counts each group, and sorts by request_count descending. It does not sort result codes alphabetically.',
  INS032: 'The code creates a local span. The requests library needs OpenTelemetry instrumentation to create an outbound span and propagate trace context automatically.',
  INS041: 'The query groups and counts requests correctly, but it sorts by resultCode. To sort from most to least frequent, it must order by request_count desc.',
  INS042: 'Use the retry section with the exponentialBackoff strategy and maxRetryCount set to 10. minimumInterval and maximumInterval define the retry-delay bounds.',
  INS051: 'Use the acr command group and pass the Git repository through --context. An ACR Task can then react to source changes and supported base-image updates.',
  INS054: 'Leave the partition key unset when strict ordering or affinity is unnecessary. Service Bus can then distribute messages across available partitions and avoid concentrating traffic on one partition.',
  INS057: 'Use where to filter requests and dependencies by time and failure state. Use summarize to calculate the average dependency duration grouped by operation name.',
  INS063: 'func init creates the Functions project. The --worker-runtime parameter selects the language worker, such as python or dotnet-isolated.',
  INS081: 'A SQL filter can evaluate system and application properties. A rule action modifies the metadata on the subscription copy; it does not change the original topic message.',
  INS118: 'Advanced filters evaluate fields in the event payload. A dead-letter destination retains undelivered events, and maximum delivery attempts limits retries.',
  INS126: 'The query uses summarize to count requests by resultCode and order by request_count desc to place the most frequent result first.',
  INS127: 'Use a pgvector column for embeddings and a typed timestamp column for created_at. This supports vector operators and reliable, indexable date comparisons.',
  INS129: 'Initialize the TracerProvider, create the Azure Monitor trace exporter, attach it through a span processor, and then create application spans. The processor forwards completed spans to the exporter.',
  INS130: 'The query counts requests by resultCode but does not sort the groups. Add order by request_count desc to meet the complete requirement.',
  INS131: 'DefaultAzureCredential can use local developer credentials and managed identity in Azure without code changes. get_configuration_setting retrieves a specific key and optional label.',
  INS141: 'The query returns one aggregated row per resultCode, not every individual request. It then sorts the groups by request_count descending.',
  INS151: 'Use a Vector field for the embeddings. HNSW provides approximate nearest-neighbor search suited to low-latency retrieval at scale.',
  INS165: 'Managed identity avoids stored database credentials. Connection pooling reuses database sessions, and a maximum pool size prevents traffic spikes from exhausting PostgreSQL connections.',
  INS166: 'A commit trigger starts validation when code changes. A GitHub workflow can orchestrate the pre-merge process while invoking the required registry build operations.'
};

function fallbackExplanation(question) {
  const placeholder = /^(?:Compare the answer|Arrange the choices|Review the supplied)/i;
  if (!placeholder.test(question.explanation || '')) return question.explanation;
  if (['order', 'drag'].includes(question.type)) {
    return `Correct order: ${question.answer.map((value, index) => `${index + 1}) ${value}`).join(' → ')}`;
  }
  if (['matching', 'matrix'].includes(question.type)) {
    return `Correct mapping: ${question.rows.map((row, index) => `${Array.isArray(row) ? row[0] : row} → ${question.answer[index]}`).join('; ')}.`;
  }
  const indexes = Array.isArray(question.answer) ? question.answer : [question.answer];
  return `Correct answer: ${indexes.map(index => question.options[index]).join('; ')}.`;
}

const fabrikamScenario = {
  title: 'Fabrikam retail analytics platform',
  sections: [
    {
      heading: 'Background',
      paragraphs: [
        'Fabrikam Inc. is a global retail analytics company that provides AI-driven demand forecasting and product recommendation services to online retailers. The company is modernizing its solution to run entirely on Microsoft Azure.',
        'The platform ingests transaction data, generates embeddings for semantic retrieval, performs vector similarity search, and returns product recommendations through containerized microservices. Developers use Python and Azure SDKs. Operations teams manage container orchestration, scaling, monitoring, and security.',
        'The solution must meet strict performance, scalability, and security requirements.'
      ]
    },
    {
      heading: 'Current environment',
      groups: [
        {
          heading: 'Application architecture',
          items: [
            'The Recommendation engine is a customer-facing HTTP API running as a containerized Python application. The engine is deployed to Azure Container Apps (ACA).',
            'Embeddings are stored in Azure Database for PostgreSQL by using pgvector.',
            'Semantic retrieval uses metadata filtering combined with vector similarity search.',
            'Azure Managed Redis is used as a caching layer.',
            'Front-end and API workloads are deployed to Azure Container Apps (ACA).',
            'Batch model retraining workloads run in Azure Kubernetes Service (AKS).'
          ]
        },
        {
          heading: 'Container and CI/CD',
          items: [
            'Container images are stored in Azure Container Registry (ACR).',
            'CI/CD uses ACR Tasks to build images on commit.',
            'ACA environments support revision management.',
            'AKS workloads are deployed by using Kubernetes manifest files stored in Git.'
          ]
        },
        {
          heading: 'Monitoring',
          items: [
            'Logs are collected in Azure Monitor.',
            'Teams inspect container logs and Kubernetes events when troubleshooting.',
            'Developers write KQL queries to analyze latency spikes.'
          ]
        }
      ]
    },
    {
      heading: 'Business requirements',
      items: [
        'Customer experience: Maintain a seamless, low-latency recommendation experience for end-users, even during unpredictable seasonal traffic spikes.',
        'Operational cost efficiency: Minimize compute expenditures by deallocating resources during periods of inactivity and by preventing runaway scaling costs.',
        'Data integrity and freshness: Ensure that product recommendations always reflect the most current catalog metadata and pricing to prevent customer dissatisfaction.',
        'Security and compliance: Adhere to a Zero Trust security model by eliminating long-lived credentials and centralizing the management of all sensitive secrets.',
        'Global scalability: Support the rapid ingestion of millions of new product embeddings daily without degrading query performance or existing retailers.'
      ]
    },
    {
      heading: 'Technical requirements',
      items: [
        'Performance: Semantic search latency must remain under 200 milliseconds at peak load.',
        'Database optimization: Use pgvector for embeddings and implement metadata filtering to reduce compute overhead. Configure compute and memory appropriately for vector workloads to ensure high-dimensional index residency in RAM and efficient mathematical throughput. Vector similarity calculations must be performed only against products that satisfy mandatory metadata constraints.',
        'Database performance: Database connections must support high concurrency with minimal latency through the implementation of connection optimization.',
        'Data load strategy: To ensure maximum ingestion throughput, secondary indexes must be applied only after bulk loading of embeddings is complete.',
        'Caching: Redis cache entries must expire automatically after 10 minutes. Implement a reactive mechanism to invalidate cache entries upon metadata updates.',
        'Identity: Use managed identities for all service-to-service and service-to-database authentication. Plain-text credentials in configuration files are strictly prohibited.',
        'Secret management: All secrets must be stored centrally. Secrets must be rotated automatically by using a centralized lifecycle policy.',
        'Scaling: Use Kubernetes event-driven autoscaling (KEDA) for event-driven scaling. The Recommendation API must scale based on HTTP traffic, while batch jobs must scale based on queue length and support scale-to-zero.',
        'CI/CD: All images must be stored in Azure Container Registry. Use ACR Tasks to automate image builds triggered by source code commits.',
        'Monitoring: Use KQL to analyze performance telemetry and troubleshoot microservice connectivity failures. Inspect logs and events when troubleshooting AKS and ACA.'
      ]
    }
  ]
};

const prosewareScenario = {
  title: 'Proseware knowledge management platform',
  sections: [
    {
      heading: 'Background',
      paragraphs: [
        'Proseware Inc. develops AI-powered knowledge management solutions for enterprise customers. The company is modernizing its platform to support semantic search, intelligent document retrieval, and real-time partner integrations.',
        'The engineering team uses Python and Azure SDKs. The architecture is being redesigned to support containerized microservices, vector search workloads, and serverless backend processing.'
      ]
    },
    {
      heading: 'Planned application architecture',
      items: [
        'Microservices are containerized by using Docker.',
        'Code for containerized microservices and Azure Function apps is developed locally but stored in a GitHub repository.',
        'Custom images for containerized microservices are stored in Azure Container Registry (ACR).',
        'Base images are stored in Docker Hub. Custom images must be rebuilt automatically whenever their base images are updated.',
        'Azure Cosmos DB for NoSQL stores documents, metadata, and vector embeddings.',
        'Azure Functions generate vector embeddings of Azure Cosmos DB for NoSQL-hosted documents and send messages to Service Bus to trigger search index updates.',
        'Azure Container Apps (ACA) apps host backend API services that provide semantic search across Azure Cosmos DB for NoSQL documents. API services process Service Bus messages and update search indexes.',
        'Azure Kubernetes Service (AKS) processes batch vector embedding regeneration for existing Azure Cosmos DB for NoSQL documents whenever the embedding model is changed.',
        'An extranet-facing containerized webhook allows business partners to submit documents to be processed by internal AI workflows for semantic search and retrieval.'
      ]
    },
    {
      heading: 'Monitoring',
      items: [
        'Telemetry generated by Azure resources is sent to Azure Monitor.',
        'A Log Analytics workspace is used to collect ACA app logs, AKS container logs, and Azure Functions app logs.',
        'Monitoring of Azure Functions is currently implemented by using Azure Application Insights SDK instrumentation.'
      ]
    },
    {
      heading: 'Business requirements',
      items: [
        'Embeddings for new or updated Azure Cosmos DB for NoSQL-hosted documents must be automatically generated.',
        'Backend API services must scale automatically during business hours.',
        'Cold start delay of backend APIs must be minimized.',
        'Secrets must be stored outside of container images.',
        'Developers must be able to correlate telemetry across Azure Functions hosts and apps.',
        'All tracing must be implemented by using OpenTelemetry SDK instrumentation.',
        'Development efforts must be minimized.'
      ]
    },
    {
      heading: 'Technical requirements',
      items: [
        'Container images must be built automatically and validated before code updates are merged into the main branch.',
        'Image build automation must run inside Azure Container Registry, eliminating dependency on local developer machines and external build services.',
        'Dependency of image builds on local developer machines must be eliminated.',
        'Event-driven scaling in AKS must occur based on the number of pending messages in the Azure Service Bus queue.',
        'Azure Cosmos DB for NoSQL RU consumption must be minimized.',
        'Vector similarity search must use embeddings stored in Azure Cosmos DB for NoSQL.',
        'The partner-facing containerized webhook service must run on Azure App Service.',
        'Secrets must not be stored in container images, source control, or application configuration directly. They must be accessed securely at runtime.',
        'All secrets must be stored centrally in Azure Key Vault and accessed at runtime through a managed identity.',
        'Azure App Service must supply secrets at runtime without relying on external services.',
        'Resources and workloads must be deployed by using Bicep templates through an automated, version-controlled pipeline. Local and command-line deployments must be eliminated to ensure repeatable, auditable deployments.'
      ]
    },
    {
      heading: 'Known issues',
      items: ['RU consumption spikes during vector similarity queries.']
    }
  ]
};

const scenarioByContext = {
  'context-002.png': fabrikamScenario,
  'context-168.png': fabrikamScenario,
  'context-011.png': prosewareScenario,
  'context-052.png': prosewareScenario,
  'context-074.png': prosewareScenario,
  'context-170.png': prosewareScenario
};

for (const question of sample.questions) {
  question.prompt = cleanPrompt(promptOverrides[question.id] || question.prompt, question);
  if (optionOverrides[question.id]) {
    question.options = optionOverrides[question.id];
    if (Array.isArray(question.answer) && question.answer.every(value => typeof value === 'string')) question.answer = [...question.options];
  }
  if (codeOverrides[question.id]) question.code = codeOverrides[question.id];
  if (Array.isArray(question.options)) question.options = question.options.map(cleanOption);
  if (Array.isArray(question.answer) && question.answer.every(value => typeof value === 'string')) question.answer = question.answer.map(cleanOption);
  if (Array.isArray(question.rows)) question.rows = question.rows.map(row => Array.isArray(row) ? [cleanOption(row[0]), row[1].map(cleanOption)] : cleanOption(row));
  if (answerOverrides[question.id]) question.answer = answerOverrides[question.id];
  if (question.explanation || explanationOverrides[question.id]) {
    question.explanation = cleanExplanation(explanationOverrides[question.id] || fallbackExplanation(question));
  }
  if (question.contextPage) question.scenarioText = scenarioByContext[path.basename(question.contextPage)] || null;
}

fs.writeFileSync(target, `window.AI200_INSTRUCTOR_SAMPLE=${JSON.stringify(sample)};\n`);
console.log(`Polished ${sample.questions.length} instructor sample questions.`);
