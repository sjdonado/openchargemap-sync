import { type FormattedExecutionResult } from 'graphql';

import { type DatabaseCollections } from '../repository/database';
import { type PageInfoArgs } from './pagination';

export type Repository = {
  collections: DatabaseCollections;
};

export type CustomContext = {
  repository: Repository;
};

export type CustomResolver<T> = (
  parent: unknown,
  args: PageInfoArgs,
  context: CustomContext,
) => Promise<T>;

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
