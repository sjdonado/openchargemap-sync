import { MongoClient, type ClientSession } from 'mongodb';

import { type DatabaseCollections } from '../@types/server';

import env from '../config/env';

export type DatabaseConnection = Promise<
  [DatabaseCollections, () => Promise<ClientSession>, () => Promise<void>]
>;

export async function connectDatabase(): DatabaseConnection {
  const client = new MongoClient(env.MONGO_URI);

  await client.connect();

  const startDBSession = async () => client.startSession();

  const disconnect = async () => client.close();

  const collections = {
    poiListSnapshots: client.db().collection('poiListSnapshots'),
    pois: client.db().collection('pois'),
  };

  console.log(`[database]: Connected to ${env.MONGO_URI}`);

  return [collections, startDBSession, disconnect];
}
