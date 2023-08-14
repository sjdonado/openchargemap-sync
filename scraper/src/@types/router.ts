import type * as http from 'http';

import { type Repository } from './server';

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
