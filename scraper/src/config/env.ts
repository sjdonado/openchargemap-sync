import 'dotenv/config';

import { type EnvVariables } from '../@types/server';

const env: EnvVariables = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? '3000'),
  MONGO_URI: process.env.MONGO_URI!,
  RABBITMQ_URI: process.env.RABBITMQ_URI!,
  RABBITMQ_QUEUE: process.env.RABBITMQ_QUEUE!,
  RABBITMQ_EXCHANGE: process.env.RABBITMQ_EXCHANGE!,
  RABBITMQ_DLX: process.env.RABBITMQ_DLX!,
  RABBITMQ_DLQ: process.env.RABBITMQ_DLQ!,
  OPENCHARGEMAP_BASE_URL: process.env.OPENCHARGEMAP_BASE_URL!,
  OPENCHARGEMAP_API_KEY: process.env.OPENCHARGEMAP_API_KEY!,
  OPENCHARGEMAP_ALLOWED_COUNTRIES: process.env.OPENCHARGEMAP_ALLOWED_COUNTRIES!,
};

export default env;
