import * as http from 'http';

import env from './config/env';

import { Routes, type Router } from './router';

import { connectDatabase } from './repository/database';
import { connectMessageQueue } from './repository/messageQueue';

import { healthController } from './controllers/health';
import { openChargeMapConsumer } from './consumers/openChargeMapConsumer';

const router: Router = {
  [Routes.HEALTH]: healthController,
};

async function main() {
  const [collections, disconnectDatabase] = await connectDatabase();
  const [startConsumer, publishMessage, disconnectChannel] =
    await connectMessageQueue();

  const server = http.createServer(async (req, res) => {
    if (!(`${req.url}` in router)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));

      return;
    }

    const endpoint = req.url as Routes;

    await router[endpoint](req, res, { collections, publishMessage });
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
