import type * as http from 'http';
import { type ClientSession } from 'mongodb';

import { type DatabaseCollections } from './repository/database';

import { type PublishMessage } from './repository/messageQueue';

export type Repository = {
  collections: DatabaseCollections;
  startDBSession: () => Promise<ClientSession>;
  publishMessage: PublishMessage;
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
