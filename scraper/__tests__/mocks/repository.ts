import { type ClientSession, type Collection } from 'mongodb';

import { type Repository } from '../../src/router';

export const mockRepository: jest.Mocked<Repository> = {
  collections: {
    poiListSnapshots: {
      countDocuments: jest.fn(),
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    } as unknown as jest.Mocked<Collection>,
  },
  startDBSession: jest.fn(async () =>
    Promise.resolve({
      // ts-ignore
      withTransaction: jest.fn(async (callback) => await callback()),
      endSession: jest.fn(),
    } as unknown as jest.Mocked<ClientSession>),
  ),
  publishMessage: jest.fn(),
};
