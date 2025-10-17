# bugbash-client-sb

Minimal ESM CLI that talks to Azure Service Bus using AAD authentication (DefaultAzureCredential).

Prerequisites
- Node.js 16+ installed
- You must be authenticated with Azure (for example via `az login`) so that DefaultAzureCredential finds your credentials.

Install

1. Change to the `client` folder

   cd client

2. Install dependencies

   npm install

Usage

run <fully-qualified-namespace> <queue-name>

Example

  run my-namespace.servicebus.windows.net my-queue

What it does
- Uses `DefaultAzureCredential` from `@azure/identity` to authenticate via AAD.
- Sends a single test message to the specified queue, then attempts to receive up to 5 messages and completes them.

Notes
- The CLI is intentionally minimal. For production use, add better error handling, retry logic, and configuration.
