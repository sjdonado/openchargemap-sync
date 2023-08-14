import type amqp from 'amqplib';
import { type Collection, type ClientSession } from 'mongodb';

import { type PublishMessage } from '../repository/messageQueue';

export type Repository = {
  collections: DatabaseCollections;
  startDBSession: () => Promise<ClientSession>;
  publishMessage: PublishMessage;
};

export type DatabaseCollections = {
  poiListSnapshots: Collection;
  pois: Collection;
};

export type Consumer = (
  msg: amqp.ConsumeMessage,
  channel: amqp.Channel,
  repository: Repository,
) => Promise<void>;

export type EnvVariables = {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  RABBITMQ_URI: string;
  RABBITMQ_QUEUE: string;
  RABBITMQ_EXCHANGE: string;
  RABBITMQ_DLX: string;
  RABBITMQ_DLQ: string;
  OPENCHARGEMAP_BASE_URL: string;
  OPENCHARGEMAP_API_KEY: string;
  OPENCHARGEMAP_ALLOWED_COUNTRIES: string;
};
