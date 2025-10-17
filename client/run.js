#!/usr/bin/env node

import { ServiceBusClient } from "@azure/service-bus";
import { DefaultAzureCredential } from "@azure/identity";

function usage() {
  console.error(
    `Usage: run <fully-qualified-namespace> <queue-name>\n
Examples:\n  run my-namespace.servicebus.windows.net my-queue`
  );
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length < 2) {
    usage();
    process.exitCode = 2;
    return;
  }

  const [fullyQualifiedNamespace, queueName] = argv;

  console.log("Using DefaultAzureCredential to authenticate to Service Bus...");
  const credential = new DefaultAzureCredential();

  // ServiceBusClient accepts fullyQualifiedNamespace and credential when using AAD
  const sbClient = new ServiceBusClient(fullyQualifiedNamespace, credential);

  const sender = sbClient.createSender(queueName);

  try {
    const testMessage = {
      body: `Hello from bugbash-client-sb at ${new Date().toISOString()}`,
      contentType: "text/plain",
      subject: "bugbash-test"
    };

    console.log(`Sending test message to queue '${queueName}'...`);
    await sender.sendMessages(testMessage);
    console.log("Message sent.");

    console.log("Creating receiver to peek/receive messages (max 5) ...");
    const receiver = sbClient.createReceiver(queueName, { receiveMode: "peekLock" });

    // Try to receive a short batch of messages
    const messages = await receiver.receiveMessages(5, { maxWaitTimeInMs: 5000 });
    console.log(`Received ${messages.length} message(s):`);
    for (const msg of messages) {
      console.log(`- messageId=${msg.messageId} body=${JSON.stringify(msg.body)}`);
      try {
        await receiver.completeMessage(msg);
        console.log(`  completed messageId=${msg.messageId}`);
      } catch (e) {
        console.error(`  failed to complete messageId=${msg.messageId}:`, e.message || e);
      }
    }

    await receiver.close();
  } catch (err) {
    console.error("Error while sending/receiving:", err.message || err);
    process.exitCode = 1;
  } finally {
    try {
      await sender.close();
      await sbClient.close();
    } catch (e) {
      // ignore
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith("run.js")) {
  main();
}
