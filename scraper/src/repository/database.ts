import { MongoClient, type Collection } from 'mongodb';

import env from '../config/env';

export type DatabaseCollections = {
  poiListSnapshots: Collection;
};

export type DatabaseConnection = Promise<[DatabaseCollections, () => Promise<void>]>;

export async function connectDatabase(): DatabaseConnection {
  const client = new MongoClient(env.MONGO_URI);

  await client.connect();

  const disconnect = async () => client.close();

  const collections = {
    poiListSnapshots: client.db().collection('poiListSnapshots'),
  };

  console.log(`[database]: Connected to ${env.MONGO_URI}`);

  return [collections, disconnect];
}
