import * as MUUID from 'uuid-mongodb';

import { type FindCursor } from 'mongodb';

import {
  type PageInfoArgs,
  type CustomFilter,
  type Edge,
  type PageInfo,
} from '../@types/pagination';

import { PAGINATION_MAX_ITEMS } from '../config/constants';

export const applyPagination = <T>(
  cursor: FindCursor<T>,
  filter: CustomFilter,
  pageInfo: PageInfoArgs,
): FindCursor<T> => {
  const { first, after, last, before } = pageInfo;

  if (after) {
    cursor = cursor.filter({
      _id: {
        ...filter._id,
        $gt: MUUID.from(after),
      },
    });
  }

  if (before) {
    cursor = cursor.filter({
      _id: {
        ...filter._id,
        $lt: MUUID.from(before),
      },
    });
  }

  if (first) {
    cursor = cursor.limit(first);
  }

  if (last) {
    cursor = cursor.skip(last);
  }

  if (!first && !last) {
    cursor = cursor.limit(PAGINATION_MAX_ITEMS);
  }

  return cursor;
};

export const getPageInfo = <T>(edges: Array<Edge<T>>, ids: MUUID.MUUID[]): PageInfo => ({
  hasNextPage: edges.length > 0 && edges.length < ids.length,
  hasPreviousPage: edges.length > 0 && ids.indexOf(MUUID.from(edges[0]?.cursor)) > 0,
  startCursor: edges[0]?.cursor,
  endCursor: edges[edges.length - 1]?.cursor,
});
