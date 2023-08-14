import * as _ from 'lodash';
import * as MUUID from 'uuid-mongodb';

import { type Consumer } from '../@types/server';
import { type POIDocument, type POI, type POIListSnapshot } from '../@types/poi';
import { type ScraperMessage } from '../@types/scraper';

import { POI_LIST_CHUNK_SIZE } from '../config/constant';
import { fetchPOIList } from '../services/openChargeMap';

export const openChargeMapConsumer: Consumer = async (msg, channel, repository) => {
  const { id, country, countriesCount } = JSON.parse(
    msg.content.toString(),
  ) as ScraperMessage;

  const session = await repository.startDBSession();

  try {
    const filter = { _id: MUUID.from(id) };

    const poiList = await fetchPOIList(country.ID);

    const chunkedPOIList: POI[][] =
      poiList.length > POI_LIST_CHUNK_SIZE
        ? _.chunk(poiList, POI_LIST_CHUNK_SIZE)
        : [poiList];

    await session.withTransaction(async () => {
      const chunckedPoiListInsertedIds = await Promise.all(
        chunkedPOIList.map(async (poiListChunk) => {
          const poiListChunkWithIds: POIDocument[] = poiListChunk.map((poi) => ({
            _id: MUUID.v4(),
            ...poi,
          }));

          const { insertedIds } = await repository.collections.pois.insertMany(
            // @ts-expect-error _id is a valid field
            poiListChunkWithIds,
            {
              session,
            },
          );

          return _.values(insertedIds);
        }),
      );

      const poiListChunkIds = _.flatten(chunckedPoiListInsertedIds);

      const currentSnapshot =
        await repository.collections.poiListSnapshots.findOne<POIListSnapshot>(filter, {
          session,
        });

      const countriesProcessed = (currentSnapshot?.countriesProcessed ?? 0) + 1;
      const isCompleted = countriesCount === countriesProcessed;

      const update = {
        $set: {
          _id: filter._id,
          poiListIds: [...(currentSnapshot?.poiListIds ?? []), ...poiListChunkIds],
          isCompleted,
        },
        $inc: {
          countriesProcessed: 1,
        },
      };

      await repository.collections.poiListSnapshots.updateOne(filter, update, {
        upsert: true,
        session,
      });

      // TODO: database cleanup: remove old poiListSnapshots + pois
      // if (isCompleted) {
      //   await repository.collections.poiListSnapshots.findOneAndDelete({
      //     isCompleted: true,
      //     // @ts-expect-error _id is a valid field
      //     _id: { $ne: filter._id },
      //   });
      // }

      console.log(
        `[openChargeMapConsumer]: ${poiListChunkIds.length} POIs stored in database`,
      );

      console.log(
        `[openChargeMapConsumer]: ${country.ISOCode} - poiListIds ${update.$set.poiListIds.length}`,
      );
    });

    channel.ack(msg);
  } catch (err) {
    console.error('[openChargeMapConsumer]', err);
  } finally {
    await session.endSession();
  }
};
