import * as _ from 'lodash';
import * as MUUID from 'uuid-mongodb';
import { type Consumer } from '../repository/messageQueue';

import { POI_LIST_CHUNK_SIZE } from '../config/constant';
import { fetchPOIList, type POI } from '../services/openChargeMap';
import { type ScraperMessage } from '../publishers/openChargeMapPublisher';

export type POIListSnapshot = {
  _id: MUUID.MUUID;
  poiListIds: string[];
  countriesProcessed: number;
  isCompleted: boolean;
};

export type POIDocument = POI & {
  _id: string;
};

export const openChargeMapConsumer: Consumer = async (msg, channel, repository) => {
  const { id, country, countriesCount } = JSON.parse(
    msg.content.toString(),
  ) as ScraperMessage;

  const session = await repository.startDBSession();

  try {
    const filter = { _id: id };

    const poiList = await fetchPOIList(country.ID);

    const chunkedPOIList: POI[][] =
      poiList.length > POI_LIST_CHUNK_SIZE
        ? _.chunk(poiList, POI_LIST_CHUNK_SIZE)
        : [poiList];

    await session.withTransaction(async () => {
      const chunckedPoiListInsertedIds = await Promise.all(
        chunkedPOIList.map(async (poiListChunk) => {
          const poiListChunkWithIds: POIDocument[] = poiListChunk.map((poi) => ({
            _id: MUUID.v4().toString('base64'),
            ...poi,
          }));

          const { insertedIds } = await repository.collections.pois.insertMany(
            // @ts-expect-error _id is a string already
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

      const update = {
        $set: {
          _id: id,
          poiListIds: [...(currentSnapshot?.poiListIds ?? []), ...poiListChunkIds],
          isCompleted: countriesCount === countriesProcessed,
        },
        $inc: {
          countriesProcessed: 1,
        },
      };

      await repository.collections.poiListSnapshots.updateOne(filter, update, {
        upsert: true,
        session,
      });

      console.log(
        `[openChargeMapConsumer]: ${poiListChunkIds.length} POIs stored in database`,
      );
    });

    channel.ack(msg);
  } catch (err) {
    console.error(`[openChargeMapConsumer]: ${err.message}`);
  } finally {
    await session.endSession();
  }
};
