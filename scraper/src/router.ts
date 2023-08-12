import type * as http from 'http';

import { type DatabaseCollections } from './repository/database';

import { type PublishMessage } from './repository/messageQueue';

export type Repository = {
  collections: DatabaseCollections;
  publishMessage: PublishMessage;
  getQueueMessageCount: () => number;
};

export type Controller = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  repository: Repository,
) => Promise<void>;

export enum Routes {
  HEALTH = '/health',
  RUN = '/run',
}

export type Router = {
  [key in Routes]: Controller;
};
