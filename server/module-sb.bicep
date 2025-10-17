targetScope = 'resourceGroup'

@description('Service Bus Namespace name')
param namespaceName string

@description('Location for the namespace (defaults to resource group location)')
param location string = resourceGroup().location

resource sbNamespace 'Microsoft.ServiceBus/namespaces@2021-11-01' = {
  name: namespaceName
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    zoneRedundant: false
  }
}

output name string = sbNamespace.name
