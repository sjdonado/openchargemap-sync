import { type Collection } from 'mongodb';

import { type Repository } from '../../src/router';

export const mockRepository: jest.Mocked<Repository> = {
  collections: {
    poiListSnapshots: {
      countDocuments: jest.fn(),
      find: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    } as unknown as jest.Mocked<Collection>,
  },
  publishMessage: jest.fn(),
};
