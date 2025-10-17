# send-client

Minimal CLI to send lines from stdin to an Azure Service Bus queue using AAD (DefaultAzureCredential).

Install

```bash
cd send-client
npm install
```

Usage

The CLI accepts the Service Bus namespace host and queue name as flags.

Required flags:
- `--namespace` - the Service Bus namespace host (for example `<ns>.servicebus.windows.net`).
- `--queue` - the queue name to send messages to (for example `default-queue`).

Example

```bash
send --namespace <ns>.servicebus.windows.net --queue default-queue
```

Type lines and press Enter; each non-empty line is sent as a separate message. Press Ctrl+C to exit.

Authentication

This tool uses `DefaultAzureCredential` from `@azure/identity`. Ensure you're authenticated, for example by running `az login` locally or setting appropriate environment variables for a service principal.

If you prefer to use a connection string instead, consider using the `@azure/service-bus` APIs directly or I can extend this tool to accept a `--connection-string` flag.
