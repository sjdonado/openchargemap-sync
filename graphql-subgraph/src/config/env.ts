import 'dotenv/config';

export type EnvVariables = {
  PORT: number;
  MONGO_URI: string;
  REDIS_URI: string;
};

const env: EnvVariables = {
  PORT: Number(process.env.PORT ?? '4000'),
  MONGO_URI: process.env.MONGO_URI!,
  REDIS_URI: process.env.REDIS_URI!,
};

export default env;
