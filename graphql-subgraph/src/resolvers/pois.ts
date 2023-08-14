import * as MUUID from 'uuid-mongodb';

import { type POI } from '../@types/pois';
import { type POIListSnapshot } from '../@types/poiListSnapshot';
import { type CustomResolver } from '../@types/server';

import { PAGINATION_MAX_ITEMS } from '../config/constants';

import { poiListToEdges } from '../serializers/poi';
import { type PaginatedResult } from '../@types/pagination';

const pois: CustomResolver<PaginatedResult<POI>> = async (
  _parent,
  { first, after, last, before },
  { repository },
) => {
  const latestSnapshot =
    await repository.collections.poiListSnapshots.findOne<POIListSnapshot>(
      { isCompleted: true },
      { sort: { _id: -1 } },
    );

  if (!latestSnapshot) {
    return {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  let cursor = repository.collections.pois.find<POI>({
    _id: {
      // @ts-expect-error _id is a valid field
      $in: latestSnapshot.poiListIds,
      ...(after ? { $gt: MUUID.from(after) } : {}),
      ...(before ? { $lt: MUUID.from(before) } : {}),
    },
  });

  if (first) {
    cursor = cursor.limit(first);
  }

  if (last) {
    cursor = cursor.skip(last);
  }

  if (!first && !last) {
    cursor = cursor.limit(PAGINATION_MAX_ITEMS);
  }

  const poiListFromLatestSnapshot = await cursor.toArray();

  const edges = poiListToEdges(poiListFromLatestSnapshot);

  const pageInfo = {
    hasNextPage: edges.length < latestSnapshot.poiListIds.length,
    hasPreviousPage:
      // @ts-expect-error _id is a valid field
      latestSnapshot.poiListIds.indexOf(poiListFromLatestSnapshot[0]?._id) > 0,
    startCursor: edges[0]?.cursor,
    endCursor: edges[edges.length - 1]?.cursor,
  };

  return { edges, pageInfo };
};

export default {
  Query: {
    pois,
  },
};
