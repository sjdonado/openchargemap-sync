import { type POI } from '../@types/pois';
import { type POIListSnapshot } from '../@types/poiListSnapshot';
import { type CustomResolver } from '../@types/server';
import { type PaginatedResult } from '../@types/pagination';

import { applyPagination, getPageInfo } from '../helpers/pagination';
import { poiListToEdges } from '../serializers/poi';

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

  const filter = {
    _id: {
      $in: latestSnapshot.poiListIds,
    },
  };

  const cursor = repository.collections.pois.find({});

  const poiListFromLatestSnapshot = await applyPagination(cursor, filter, {
    first,
    after,
    last,
    before,
  }).toArray();

  const edges = poiListToEdges(poiListFromLatestSnapshot);

  const pageInfo = getPageInfo(edges, latestSnapshot.poiListIds);

  // prettier-ignore
  console.log(
    `[poisResolver] snapshot: ${latestSnapshot._id.toString()} poiListIds: ${latestSnapshot.poiListIds.length} edges: ${edges.length} `,
  );

  return { edges, pageInfo };
};

export default {
  Query: {
    pois,
  },
};
