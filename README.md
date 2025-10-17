# bugbash-queue-project
Use microsoft MCP Core to configure and deploy azure resources

The goal of this is repo is to show the outcome of mcp experimentation for a real project.

This package will have two pieces. A client, and work queue.

The client is not really part of this, and will merely use @azure/service-bus to retrieve messages from the queue.

The real goal is to test deployment and interaction with azure resources especially utilizing microsoft/mcp server.

[Entire chat interaction for this repository till successfully generated bicep template](https://microsoft-my.sharepoint.com/:t:/p/scbedd/IQBeObopWWQtQonHGJW6p-odAceUaYQke5b3l9WJ1rnwjfs?e=eqFiL4)

## Note about the newly deployed resource under `server/`

Need to manually add ARM row-based access control role. Something like `Azure Service Bus Data Owner` or the like.

