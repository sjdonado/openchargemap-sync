import type * as http from 'http';

import { type DatabaseCollections } from './repository/database';
import { type PublishMessage } from './repository/messageQueue';

export type Repository = {
  collections: DatabaseCollections;
  publishMessage: PublishMessage;
};

export type RouteHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  repository: Repository,
) => Promise<void>;

export enum Routes {
  HEALTH = '/health',
}

export type Router = {
  [key in Routes]: RouteHandler;
};
