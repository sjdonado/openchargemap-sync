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
