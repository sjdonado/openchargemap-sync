import { type FindCursor, type Collection } from 'mongodb';

import { type Repository } from '../../src/@types/server';

export const mockCursor = {
  filter: jest.fn(),
  limit: jest.fn(),
  skip: jest.fn(),
  toArray: jest.fn(),
} as unknown as jest.Mocked<FindCursor>;

const mockCollection = {
  find: jest.fn(() => mockCursor),
  findOne: jest.fn(),
} as unknown as jest.Mocked<Collection>;

export const mockRepository: jest.Mocked<Repository> = {
  collections: {
    poiListSnapshots: mockCollection,
    pois: mockCollection,
  },
};
