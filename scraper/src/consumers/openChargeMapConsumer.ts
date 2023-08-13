import type * as MUUID from 'uuid-mongodb';
import { type Consumer } from '../repository/messageQueue';

import { fetchPOIList, type POI } from '../services/openChargeMap';
import { type ScraperMessage } from '../publishers/openChargeMapPublisher';

export type POIListSnapshot = {
  _id: MUUID.MUUID;
  poiList: POI[];
  countriesProcessed: number;
  isCompleted: boolean;
};

export const openChargeMapConsumer: Consumer = async (msg, channel, repository) => {
  const { id, country, countriesCount } = JSON.parse(
    msg.content.toString(),
  ) as ScraperMessage;

  const session = await repository.startDBSession();

  try {
    const filter = { _id: id };

    const poiList = await fetchPOIList(country.ID);

    await session.withTransaction(async () => {
      const currentSnapshot =
        await repository.collections.poiListSnapshots.findOne<POIListSnapshot>(filter, {
          session,
        });

      const countriesProcessed = (currentSnapshot?.countriesProcessed ?? 0) + 1;

      const update = {
        $set: {
          _id: id,
          poiList: [...(currentSnapshot?.poiList ?? []), ...poiList],
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

      console.log(`[openChargeMapConsumer]: ${poiList.length} POIs stored in database`);
    });

    channel.ack(msg);
  } catch (err) {
    console.error(`[openChargeMapConsumer]: ${err.message}`);
  } finally {
    await session.endSession();
  }
};
