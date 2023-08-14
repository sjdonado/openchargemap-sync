import { type FormattedExecutionResult } from 'graphql';
import { type DatabaseCollections } from '../repository/database';

export type Repository = {
  collections: DatabaseCollections;
};

export type CustomContext = {
  repository: Repository;
};

export type GraphQLSingleResult<T> = {
  body: {
    kind: 'single';
    singleResult: FormattedExecutionResult<T>;
  };
};

export type EnvVariables = {
  PORT: number;
  MONGO_URI: string;
  REDIS_URI: string;
};
