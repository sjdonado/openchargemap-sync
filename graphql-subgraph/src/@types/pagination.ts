import type * as MUUID from 'uuid-mongodb';

export type Edge<T> = {
  cursor: string;
  node: T;
};

export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
};

export type PaginatedResult<T> = {
  edges: Array<Edge<T>>;
  pageInfo: PageInfo;
};

export type PageInfoArgs = {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
};

export type CustomFilter = {
  _id: { $in: MUUID.MUUID[] };
};
