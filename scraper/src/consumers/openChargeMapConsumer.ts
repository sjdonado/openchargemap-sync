import env from '../config/env';

import { type Consumer } from '../repository/messageQueue';

import { fetchPOIList, type POI } from '../services/openChargeMap';
import { type ScraperMessage } from '../publishers/openChargeMapPublisher';

export type PoiListSnapshot = {
  id: string;
  poiList: POI[];
  countriesProcessed: number;
  isCompleted: boolean;
};

export const openChargeMapConsumer: Consumer = async (
  msg,
  channel,
  repository,
) => {
  const { id, country, countriesCount } = JSON.parse(
    msg.content.toString(),
  ) as ScraperMessage;

  try {
    const filter = { id };

    const poiList = await fetchPOIList(country.ID);

    const oldSnapshot = (await repository?.collections.poiListSnapshots.findOne(
      filter,
    )) as PoiListSnapshot | undefined;

    const countriesProcessed = (oldSnapshot?.countriesProcessed ?? 0) + 1;

    const update = {
      $set: {
        id,
        poiList: [...(oldSnapshot?.poiList ?? []), ...poiList],
        countriesProcessed,
        isCompleted: countriesProcessed === countriesCount,
        _id: undefined,
      },
    };

    await repository?.collections.poiListSnapshots.updateOne(filter, update, {
      upsert: true,
    });

    console.log(
      `[openChargeMapConsumer]: ${poiList.length} POIs stored in database`,
    );

    channel.ack(msg);
  } catch (err) {
    console.error(`[openChargeMapConsumer]: ${err}`);

    channel.nack(msg);
  }
};
