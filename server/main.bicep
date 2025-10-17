targetScope = 'subscription'

@description('Deployment environment name')
param environmentName string = '${{AZURE_ENV_NAME}}'

@description('Location for resources')
param location string = '${{AZURE_LOCATION}}'

@description('Name of the resource group to create')
param resourceGroupName string = 'rg-${{AZURE_ENV_NAME}}'

// Resource token used for resource naming (per IA C rules)
var resourceToken = uniqueString(subscription().id, location, environmentName)

// Create the resource group with required tag
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: resourceGroupName
  location: location
  tags: {
    azd-env-name: environmentName
  }
}

// Deploy service bus namespace into the resource group using the module
module sbModule 'module-sb.bicep' = {
  name: 'deployServiceBus'
  scope: rg
  params: {
    // follow naming rule: az{prefix}{token} where prefix <=3 chars
    namespaceName: 'azsb${resourceToken}'
    location: location
  }
}

// Required output for AZD
output RESOURCE_GROUP_ID string = rg.id

// Export the created Service Bus namespace resource name
output SERVICEBUS_NAMESPACE string = sbModule.outputs.name
targetScope = 'subscription'

@description('Deployment environment name')
param environmentName string = '${{AZURE_ENV_NAME}}'

@description('Location for resources')
param location string = '${{AZURE_LOCATION}}'

@description('Name of the resource group to create')
param resourceGroupName string = 'rg-${{AZURE_ENV_NAME}}'

// Create the resource group with required tag
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: resourceGroupName
  location: location
  tags: {
    azd-env-name: environmentName
  }
}

// Deploy resource-group-scoped resources (managed identity + service bus) via module
module rgResources 'modules/rg-resources.bicep' = {
  name: 'rgResources'
  scope: rg
  params: {
    environmentName: environmentName
    location: location
    // desiredNamespaceSuffix is informational; actual resource name follows naming rules
    desiredNamespaceSuffix: 'scbedd'
  }
}

// Required output for AZD
output RESOURCE_GROUP_ID string = rg.id

// Export the created Service Bus namespace resource name
output SERVICEBUS_NAMESPACE string = rgResources.outputs.serviceBusNamespaceName
