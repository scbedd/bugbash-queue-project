# Azure deployment plan (generated)

Goal
----
Create a resource group named `rg-scbedd` and, within it, a Service Bus namespace named `sb-scbedd` using AZD and Bicep IaC.

Project
-------
Repository: bugbash-queue-project
Requested deployment: subscription-scoped Bicep that creates `rg-scbedd` and deploys a Service Bus namespace `sb-scbedd` in that RG.

Planner notes (raw template from deploy_plan_get)
------------------------------------------------

This plan outlines the goal, recommended resources, and execution steps for deploying the project using AZD and Bicep.

Goal
Based on the project to provide a plan to deploy the project to Azure Functions using AZD.

Project information and recommended resources
- Hosting recommendation: Azure Functions (per deploy tool suggestion)
- Supporting services to consider: Application Insights, Log Analytics, Key Vault (optional)

Execution steps (high level)
1. Use `deploy_iac_rules_get` to get IaC rules for the required resource types (Service Bus).
2. Generate Bicep files (main.bicep + modules + main.parameters.json) according to the IaC rules and AZD requirements.
3. Validate generated Bicep with `az deployment sub validate`.
4. Deploy using `az deployment sub create` or `azd up`.

Notes
- Follow AZD rules for tagging and outputs (the deploy tool expects certain parameters and outputs). See appended IaC rules section.

---

IaC rules (service-bus):

_Placeholder — will be filled by calling deploy_iac_rules_get for servicebus and appended below._

---

Returned IaC rules (deploy_iac_rules_get):

- AZD rules:
	- Ensure an User-Assigned Managed Identity exists.
	- Resource Group resource (if exists) must have tag "azd-env-name" = environmentName. Apply this tag to resource group resource ONLY.
	- Expected parameters in bicep parameters: environmentName='${{AZURE_ENV_NAME}}', location='${{AZURE_LOCATION}}'. resourceGroupName='rg-${{AZURE_ENV_NAME}}' is required if scope is subscription.
	- All container apps, app services, function apps, static web apps (and nothing else) must have tag "azd-service-name" matching the service name in azure.yaml.
	- Expected output in main.bicep: RESOURCE_GROUP_ID.

- Bicep rules:
	- Expected files: main.bicep, main.parameters.json (with parameters from main.bicep).
	- Resource token format: uniqueString(subscription().id, resourceGroup().id, location, environmentName) (scope = resourceGroup) or uniqueString(subscription().id, location, environmentName) (scope = subscription).
	- All resources should be named like az{resourcePrefix}{resourceToken}, resourcePrefix <= 3 chars, alphanumeric only, total <= 32 chars.

Special note:
- The tool instructs to call `get_errors` after making code changes and to apply all rules exactly. We'll follow these rules when generating Bicep.

