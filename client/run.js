#!/usr/bin/env node

import { ServiceBusClient } from "@azure/service-bus";
import { DefaultAzureCredential } from "@azure/identity";

function usage() {
  console.error(
    `Usage: run --namespace <fully-qualified-namespace> --queue <queue-name>\n
Examples:\n  run --namespace my-namespace.servicebus.windows.net --queue my-queue`
  );
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--namespace') out.namespace = argv[++i];
    else if (a === '--queue' || a === '--name') out.queue = argv[++i];
    else if (!out.namespace) out.namespace = a;
    else if (!out.queue) out.queue = a;
  }
  return out;
}

async function main() {
  const argv = process.argv.slice(2);
  const opts = parseArgs(argv);

  if (!opts.namespace || !opts.queue) {
    usage();
    process.exitCode = 2;
    return;
  }

  console.log("Using DefaultAzureCredential to authenticate to Service Bus...");
  const credential = new DefaultAzureCredential();

  // ServiceBusClient accepts fullyQualifiedNamespace and credential when using AAD
  const sbClient = new ServiceBusClient(opts.namespace, credential);

  // Create a receiver that will subscribe and process messages
  const receiver = sbClient.createReceiver(opts.queue, { receiveMode: "peekLock" });

  console.log(`Listening on ${opts.namespace} queue '${opts.queue}' - waiting for messages...`);

  const subscription = receiver.subscribe({
    processMessage: async (message) => {
      try {
        // Normalize body to string for printing
        let bodyStr;
        if (typeof message.body === 'string') bodyStr = message.body;
        else if (message.body instanceof Uint8Array) bodyStr = new TextDecoder().decode(message.body);
        else bodyStr = JSON.stringify(message.body);

        console.log('received:', bodyStr);
        // Complete the message so it's removed from the queue
        await receiver.completeMessage(message);
      } catch (err) {
        console.error('message handling error:', err.message || err);
      }
    },
    processError: async (err) => {
      console.error('receive error:', err.message || err);
    }
  });

  // Graceful shutdown
  async function shutdown() {
    console.log('Shutting down receiver...');
    try {
      await subscription.close();
    } catch (e) {
      // ignore
    }
    try {
      await receiver.close();
      await sbClient.close();
    } catch (e) {
      // ignore
    }
    process.exit(0);
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith("run.js")) {
  main();
}
