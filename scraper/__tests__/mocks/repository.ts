import { type ClientSession, type Collection } from 'mongodb';

import { type Repository } from '../../src/@types/server';

const mockCollection = {
  countDocuments: jest.fn(),
  findOne: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  findOneAndDelete: jest.fn(),
  insertMany: jest.fn(),
} as unknown as jest.Mocked<Collection>;

export const mockRepository: jest.Mocked<Repository> = {
  collections: {
    poiListSnapshots: mockCollection,
    pois: mockCollection,
  },
  startDBSession: jest.fn(async () =>
    Promise.resolve({
      withTransaction: jest.fn(async (callback: () => Promise<void>) => callback()),
      endSession: jest.fn(),
    } as unknown as jest.Mocked<ClientSession>),
  ),
  publishMessage: jest.fn(),
};
