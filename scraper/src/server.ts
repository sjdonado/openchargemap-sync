import * as http from 'http';

import env from './config/env';

import { Routes, type Router, type Repository } from './router';

import { connectDatabase } from './repository/database';
import { connectMessageQueue } from './repository/messageQueue';

import { healthController } from './controllers/health';
import { runController } from './controllers/run';

import { openChargeMapConsumer } from './consumers/openChargeMapConsumer';

const router: Router = {
  [Routes.HEALTH]: healthController,
  [Routes.RUN]: runController,
};

export const start = async () => {
  const [
    collections, //
    startDBSession,
    disconnectDatabase,
  ] = await connectDatabase();

  const [
    startConsumer, //
    publishMessage,
    disconnectChannel,
  ] = await connectMessageQueue();

  const repository: Repository = { collections, startDBSession, publishMessage };

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

  const disconnect = async () =>
    new Promise<void>((resolve) => {
      server.close(() => {
        console.log('[server]: closed');
        resolve();
      });
    });

  server.listen(env.PORT, () => {
    console.log(`[server] listening on PORT ${env.PORT}`);
  });

  return [repository, disconnect] as [Repository, () => Promise<void>];
};
