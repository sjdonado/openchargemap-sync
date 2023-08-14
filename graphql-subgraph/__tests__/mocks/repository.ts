import { type FindCursor, type Collection } from 'mongodb';

import { type Repository } from '../../src/@types/server';

const mockCollection = {
  countDocuments: jest.fn(),
  find: jest.fn(
    () =>
      ({
        limit: jest.fn(),
        toArray: jest.fn(),
      }) as unknown as jest.Mocked<FindCursor>,
  ),
  findOne: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  insertMany: jest.fn(),
} as unknown as jest.Mocked<Collection>;

export const mockRepository: jest.Mocked<Repository> = {
  collections: {
    poiListSnapshots: mockCollection,
    pois: mockCollection,
  },
};
