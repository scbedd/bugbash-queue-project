#!/usr/bin/env node
import readline from 'readline';
import { ServiceBusClient } from '@azure/service-bus';
import { DefaultAzureCredential } from '@azure/identity';

const [,, ...args] = process.argv;

// Usage: send --namespace <ns> --resource-group <rg> --queue <queue>
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--namespace') out.namespace = argv[++i];
    else if (a === '--resource-group') out.resourceGroup = argv[++i];
    else if (a === '--queue' || a === '--name') out.queue = argv[++i];
  }
  return out;
}

const opts = parseArgs(args);
if (!opts.namespace || !opts.queue) {
  console.error('Usage: send --namespace <namespace>.servicebus.windows.net --queue <queueName>');
  process.exit(2);
}

const credential = new DefaultAzureCredential();
const sbClient = new ServiceBusClient(opts.namespace, credential);
const sender = sbClient.createSender(opts.queue);

console.info(`Connected to ${opts.namespace} queue ${opts.queue}. Type lines and press Enter to send. Ctrl+C to exit.`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
rl.on('line', async (line) => {
  try {
    if (!line || !line.trim()) return;
    await sender.sendMessages({ body: line });
    console.log('sent:', line);
  } catch (err) {
    console.error('send error:', err.message || err);
  }
});

process.on('SIGINT', async () => {
  await sender.close();
  await sbClient.close();
  process.exit(0);
});
