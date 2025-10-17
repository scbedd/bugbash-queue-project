targetScope = 'subscription'

@description('Environment name')
param environmentName string = 'dev'

@description('Location for resources')
param location string = 'eastus2'

@description('Resource group name to create')
param resourceGroupName string = 'rg-scbedd'

// Deterministic token for naming (subscription-scoped per plan)
var resourceToken = uniqueString(subscription().id, location, environmentName)

// Deterministic Service Bus namespace name following az{prefix}{token}
var serviceBusNamespaceName = 'azsb${resourceToken}'

// Create resource group with required AZD tag
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: resourceGroupName
  location: location
  tags: {
    'azd-env-name': environmentName
  }
}

// Inline resource-group-scoped deployment to create the Service Bus namespace
resource rgDeployment 'Microsoft.Resources/deployments@2021-04-01' = {
  name: 'deployServiceBus'
  scope: resourceGroup(resourceGroupName)
  properties: {
    mode: 'Incremental'
    template: {
      '$schema': 'https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#'
      'contentVersion': '1.0.0.0'
      'parameters': {
        'namespaceName': {
          'type': 'string'
        }
        'location': {
          'type': 'string'
        }
      }
      'resources': [
        {
          'type': 'Microsoft.ServiceBus/namespaces'
          'apiVersion': '2021-11-01'
          'name': "[parameters('namespaceName')]"
          'location': "[parameters('location')]"
          'sku': {
            'name': 'Standard'
            'tier': 'Standard'
          }
          'properties': {
            'zoneRedundant': false
          }
        }
      ]
      'outputs': {
        'namespaceName': {
          'type': 'string'
          'value': "[parameters('namespaceName')]"
        }
      }
    }
    parameters: {
      'namespaceName': {
        value: serviceBusNamespaceName
      }
      'location': {
        value: location
      }
    }
  }
}

// Outputs required by AZD and useful for verification
output RESOURCE_GROUP_ID string = rg.id
output SERVICEBUS_NAMESPACE string = serviceBusNamespaceName

    'azd-env-name': environmentName
  }
}

// Deploy the Service Bus namespace inside the resource group via module
module sbModule 'module-scb.bicep' = {
  name: 'deployServiceBus'
  scope: rg
  params: {
    // name follows az{prefix}{token} per rules to ensure uniqueness and length
    namespaceName: 'azsb${resourceToken}'
    location: location
  }
}

// Required output for AZD
output RESOURCE_GROUP_ID string = rg.id

// Export the created Service Bus namespace resource name
output SERVICEBUS_NAMESPACE string = sbModule.outputs.name

