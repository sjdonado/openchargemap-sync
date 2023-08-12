import * as http from 'http';

import env from './config/env';

import { Routes, type Router } from './router';

import { connectDatabase } from './repository/database';
import { connectMessageQueue } from './repository/messageQueue';

import { healthController } from './controllers/health';
import { runController } from './controllers/run';

import { openChargeMapConsumer } from './consumers/openChargeMapConsumer';

const router: Router = {
  [Routes.HEALTH]: healthController,
  [Routes.RUN]: runController,
};

async function main() {
  const [collections, disconnectDatabase] = await connectDatabase();
  const [
    startConsumer,
    publishMessage,
    getQueueMessageCount,
    disconnectChannel,
  ] = await connectMessageQueue();

  const repository = { collections, publishMessage, getQueueMessageCount };

  startConsumer(env.RABBITMQ_QUEUE, async (msg, channel) =>
    openChargeMapConsumer(msg, channel, repository),
  );

  const server = http.createServer(async (req, res) => {
    if (!(`${req.url}` in router)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));

      return;
    }

    const endpoint = req.url as Routes;

    await router[endpoint](req, res, repository);
  });

  server.on('close', async () => {
    await disconnectDatabase();
    await disconnectChannel();
  });

  server.listen(env.PORT, () => {
    console.log(`Server listening on PORT ${env.PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
