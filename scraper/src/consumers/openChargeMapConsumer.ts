import env from '../config/env';

import { type Consumer } from '../repository/messageQueue';

import { fetchPOIList, type POI } from '../logic/openChargeMap';
import { type ScraperMessage } from '../publishers/openChargeMapPublisher';

export type PoiListSnapshot = {
  id: string;
  poiList: POI[];
  completed: boolean;
};

export const openChargeMapConsumer: Consumer = async (
  msg,
  channel,
  repository,
) => {
  const { id, country } = JSON.parse(msg.content.toString()) as ScraperMessage;

  try {
    const poiList = await fetchPOIList(country.ID);
    const queueMessageCount = repository?.getQueueMessageCount();

    const filter = { id };
    const update = {
      $set: {
        id,
        poiList,
        completed: queueMessageCount === 1,
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
