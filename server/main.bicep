targetScope = 'subscription'

@description('Environment name')
param environmentName string = 'dev'

@description('Location for resources')
param location string = 'eastus2'

@description('Resource group name to create')
param resourceGroupName string = 'rg-scbedd'

var resourceToken = uniqueString(subscription().id, location, environmentName)
var serviceBusNamespaceName = 'azsb${resourceToken}'

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: resourceGroupName
  location: location
  tags: {
    'azd-env-name': environmentName
  }
}

module sb 'module-sb.bicep' = {
  name: 'deployServiceBus'
  scope: rg
  params: {
    namespaceName: serviceBusNamespaceName
    location: location
  }
}

output RESOURCE_GROUP_ID string = rg.id
output SERVICEBUS_NAMESPACE string = sb.outputs.name
