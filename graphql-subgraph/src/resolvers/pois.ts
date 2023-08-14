import { type POI } from '../@types/pois';
import { type POIListSnapshot } from '../@types/poiListSnapshot';
import { type Repository } from '../@types/server';

import { serializePOIList } from '../serializers/poi';

export default {
  Query: {
    async pois(
      _parent: unknown,
      _args: unknown,
      { repository }: { repository: Repository },
    ): Promise<POI[]> {
      const latestSnapshot =
        await repository.collections.poiListSnapshots.findOne<POIListSnapshot>(
          { isCompleted: true },
          { sort: { _id: -1 } },
        );

      if (!latestSnapshot) {
        return [];
      }

      const poiListFromLatestSnapshot = await repository.collections.pois
        .find<POI>({
          // @ts-expect-error _id is a valid field
          _id: { $in: latestSnapshot.poiListIds },
        })
        .toArray();

      return serializePOIList(poiListFromLatestSnapshot);
    },
  },
};
