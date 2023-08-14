import { ApolloServer } from '@apollo/server';
import * as MUUID from 'uuid-mongodb';

import { type POI } from '../../src/@types/pois';
import { type GraphQLSingleResult, type CustomContext } from '../../src/@types/server';
import { type POIListSnapshot } from '../@types/poiListSnapshot';
import { type PaginatedResult, type PageInfoArgs } from '../@types/pagination';

import { schemas } from '../../src/server';
import poisResolver from '../../src/resolvers/pois';

import { mockRepository } from '../mocks/repository';
import { generateDatabasePOIList } from '../fixtures/pois';
import { getPois, getPoisNoPagination } from '../fixtures/queries';

describe('Pois resolver', () => {
  let server: ApolloServer<CustomContext>;

  const poiListSnapshot: POIListSnapshot = {
    _id: MUUID.v4(),
    poiListIds: [MUUID.v4(), MUUID.v4(), MUUID.v4()],
    countriesProcessed: 1,
    isCompleted: true,
  };

  beforeAll(async () => {
    const context: CustomContext = { repository: mockRepository };

    server = new ApolloServer({
      typeDefs: schemas,
      resolvers: {
        Query: {
          pois: async (parent, args: PageInfoArgs) =>
            poisResolver.Query.pois(parent, args, context),
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('Query.pois - No pagination', () => {
    it('should return a list of POIs', async () => {
      const pois = generateDatabasePOIList();

      const { _id, ...expectedPoi } = pois[0];

      const poiListSnapshotFindOneMock = (
        mockRepository.collections.poiListSnapshots.findOne as jest.Mock
      ).mockResolvedValue(poiListSnapshot);

      const poisFindMock = (
        mockRepository.collections.pois.find as jest.Mock
      ).mockImplementation(() => ({
        filter: () => ({
          limit: () => ({
            toArray: async () => Promise.resolve(pois),
          }),
        }),
      }));

      const response = (await server.executeOperation({
        query: getPoisNoPagination,
      })) as GraphQLSingleResult<{ pois: PaginatedResult<POI> }>;

      expect(response).toBeDefined();
      expect(response.body.singleResult.data).toBeDefined();
      expect(response.body.singleResult.data?.pois.edges[0].node).toEqual(expectedPoi);
      expect(response.body.singleResult.data?.pois.pageInfo).toEqual({
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: pois[0]._id.toString(),
        endCursor: pois[pois.length - 1]._id.toString(),
      });

      expect(poiListSnapshotFindOneMock).toHaveBeenCalledTimes(1);
      expect(poiListSnapshotFindOneMock).toHaveBeenCalledWith(
        { isCompleted: true },
        { sort: { _id: -1 } },
      );

      expect(poisFindMock).toHaveBeenCalledTimes(1);
      expect(poisFindMock).toHaveBeenCalledWith({});
    });

    it('should return an empty list of POIs - when there are no poiListSnapshots', async () => {
      const poiListSnapshotFindOneMock = (
        mockRepository.collections.poiListSnapshots.findOne as jest.Mock
      ).mockImplementation();

      const response = (await server.executeOperation({
        query: getPoisNoPagination,
      })) as GraphQLSingleResult<{ pois: PaginatedResult<POI> }>;

      expect(response).toBeDefined();
      expect(response.body.singleResult.data).toBeDefined();
      expect(response.body.singleResult.data?.pois.edges).toEqual([]);
      expect(response.body.singleResult.data?.pois.pageInfo).toEqual({
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      });

      expect(poiListSnapshotFindOneMock).toHaveBeenCalledTimes(1);
      expect(poiListSnapshotFindOneMock).toHaveBeenCalledWith(
        { isCompleted: true },
        { sort: { _id: -1 } },
      );

      expect(mockRepository.collections.pois.find).toHaveBeenCalledTimes(0);
    });

    it('should return an empty list of POIs - when there are no pois', async () => {
      const poiListSnapshotFindOneMock = (
        mockRepository.collections.poiListSnapshots.findOne as jest.Mock
      ).mockResolvedValue(poiListSnapshot);

      const poisFindMock = (
        mockRepository.collections.pois.find as jest.Mock
      ).mockImplementation(() => ({
        filter: () => ({
          limit: () => ({
            toArray: async () => Promise.resolve([]),
          }),
        }),
      }));

      const response = (await server.executeOperation({
        query: getPoisNoPagination,
      })) as GraphQLSingleResult<{ pois: PaginatedResult<POI> }>;

      expect(response).toBeDefined();
      expect(response.body.singleResult.data).toBeDefined();
      expect(response.body.singleResult.data?.pois.edges).toEqual([]);
      expect(response.body.singleResult.data?.pois.pageInfo).toEqual({
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      });

      expect(poiListSnapshotFindOneMock).toHaveBeenCalledTimes(1);
      expect(poiListSnapshotFindOneMock).toHaveBeenCalledWith(
        { isCompleted: true },
        { sort: { _id: -1 } },
      );

      expect(poisFindMock).toHaveBeenCalledTimes(1);
      expect(poisFindMock).toHaveBeenCalledWith({});
    });
  });

  describe('Query.pois - Pagination', () => {
    const pois = generateDatabasePOIList(10);

    it('should return a paginated list of POIs', async () => {
      const variables = {
        first: 5,
      };

      const poisPaginated = pois.slice(0, variables.first);
      const { _id, ...expectedPoi } = poisPaginated[0];

      const poiListSnapshotFindOneMock = (
        mockRepository.collections.poiListSnapshots.findOne as jest.Mock
      ).mockResolvedValue({
        ...poiListSnapshot,
        poiListIds: pois.map((poi) => poi._id),
      });

      const poisFindMock = (
        mockRepository.collections.pois.find as jest.Mock
      ).mockImplementation(() => ({
        filter: jest.fn(() => ({
          limit: jest.fn(() => ({
            toArray: async () => Promise.resolve(poisPaginated),
          })),
        })),
      }));

      const response = (await server.executeOperation({
        query: getPois,
        variables,
      })) as GraphQLSingleResult<{ pois: PaginatedResult<POI> }>;

      expect(response).toBeDefined();
      expect(response.body.singleResult.data).toBeDefined();
      expect(response.body.singleResult.data?.pois.edges[0].node).toEqual(expectedPoi);
      expect(response.body.singleResult.data?.pois.pageInfo).toEqual({
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: poisPaginated[0]._id.toString(),
        endCursor: poisPaginated[poisPaginated.length - 1]._id.toString(),
      });

      expect(poiListSnapshotFindOneMock).toHaveBeenCalledTimes(1);
      expect(poiListSnapshotFindOneMock).toHaveBeenCalledWith(
        { isCompleted: true },
        { sort: { _id: -1 } },
      );

      expect(poisFindMock).toHaveBeenCalledTimes(1);
      expect(poisFindMock).toHaveBeenCalledWith({});

      const poisFindFilterMock = poisFindMock.mock.results[0].value.filter as jest.Mock;

      expect(poisFindFilterMock).toHaveBeenCalledWith({
        _id: { $in: expect.any(Array) as jest.Mocked<string[]> },
      });
      expect(
        poisFindFilterMock.mock.results[0].value.limit as jest.Mock,
      ).toHaveBeenCalledWith(variables.first);
    });

    it('should handle pagination with after and before parameters', async () => {
      const variables = {
        first: 5,
        after: pois[1]._id.toString(),
        before: pois[pois.length - 2]._id.toString(),
      };

      const poisPaginated = pois.slice(1, variables.first);
      const { _id, ...expectedPoi } = poisPaginated[0];

      const poiListSnapshotFindOneMock = (
        mockRepository.collections.poiListSnapshots.findOne as jest.Mock
      ).mockResolvedValue({
        ...poiListSnapshot,
        poiListIds: pois.map((poi) => poi._id),
      });

      const poisFindMock = (
        mockRepository.collections.pois.find as jest.Mock
      ).mockImplementation(() => ({
        filter: jest.fn(() => ({
          limit: jest.fn(() => ({
            toArray: async () => Promise.resolve(poisPaginated),
          })),
        })),
      }));

      const response = (await server.executeOperation({
        query: getPois,
        variables,
      })) as GraphQLSingleResult<{ pois: PaginatedResult<POI> }>;

      expect(response).toBeDefined();
      expect(response.body.singleResult.data).toBeDefined();
      expect(response.body.singleResult.data?.pois.edges[0].node).toEqual(expectedPoi);
      expect(response.body.singleResult.data?.pois.pageInfo).toEqual({
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: poisPaginated[0]._id.toString(),
        endCursor: poisPaginated[poisPaginated.length - 1]._id.toString(),
      });

      expect(poiListSnapshotFindOneMock).toHaveBeenCalledTimes(1);
      expect(poiListSnapshotFindOneMock).toHaveBeenCalledWith(
        { isCompleted: true },
        { sort: { _id: -1 } },
      );

      expect(poisFindMock).toHaveBeenCalledTimes(1);
      expect(poisFindMock).toHaveBeenCalledWith({});

      const poisFindFilterMock = poisFindMock.mock.results[0].value.filter as jest.Mock;

      expect(poisFindFilterMock).toHaveBeenCalledWith({
        _id: {
          $in: expect.any(Array) as jest.Mocked<string[]>,
          $lt: expect.anything() as jest.Mocked<MUUID.MUUID>,
          $gt: expect.anything() as jest.Mocked<MUUID.MUUID>,
        },
      });
      expect(
        poisFindFilterMock.mock.results[0].value.limit as jest.Mock,
      ).toHaveBeenCalledWith(variables.first);
    });

    it('should handle pagination with last parameter', async () => {
      const variables = {
        last: 5,
      };

      const poisPaginated = pois.slice(-variables.last);
      const { _id, ...expectedPoi } = poisPaginated[0];

      const poiListSnapshotFindOneMock = (
        mockRepository.collections.poiListSnapshots.findOne as jest.Mock
      ).mockResolvedValue({
        ...poiListSnapshot,
        poiListIds: pois.map((poi) => poi._id),
      });

      const poisFindMock = (
        mockRepository.collections.pois.find as jest.Mock
      ).mockImplementation(() => ({
        filter: jest.fn(() => ({
          skip: jest.fn(() => ({
            toArray: async () => Promise.resolve(poisPaginated),
          })),
        })),
      }));

      const response = (await server.executeOperation({
        query: getPois,
        variables,
      })) as GraphQLSingleResult<{ pois: PaginatedResult<POI> }>;

      expect(response).toBeDefined();
      expect(response.body.singleResult.data).toBeDefined();
      expect(response.body.singleResult.data?.pois.edges[0].node).toEqual(expectedPoi);
      expect(response.body.singleResult.data?.pois.pageInfo).toEqual({
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: poisPaginated[0]._id.toString(),
        endCursor: poisPaginated[poisPaginated.length - 1]._id.toString(),
      });

      expect(poiListSnapshotFindOneMock).toHaveBeenCalledTimes(1);
      expect(poiListSnapshotFindOneMock).toHaveBeenCalledWith(
        { isCompleted: true },
        { sort: { _id: -1 } },
      );

      expect(poisFindMock).toHaveBeenCalledTimes(1);
      expect(poisFindMock).toHaveBeenCalledWith({});

      const poisFindFilterMock = poisFindMock.mock.results[0].value.filter as jest.Mock;

      expect(poisFindFilterMock).toHaveBeenCalledWith({
        _id: {
          $in: expect.any(Array) as jest.Mocked<string[]>,
        },
      });
      expect(
        poisFindFilterMock.mock.results[0].value.skip as jest.Mock,
      ).toHaveBeenCalledWith(variables.last);
    });

    it('should handle pagination with no results', async () => {
      const variables = {
        first: 10,
      };

      const poisPaginated = [];

      const poiListSnapshotFindOneMock = (
        mockRepository.collections.poiListSnapshots.findOne as jest.Mock
      ).mockResolvedValue({
        ...poiListSnapshot,
        poiListIds: pois.map((poi) => poi._id),
      });

      const poisFindMock = (
        mockRepository.collections.pois.find as jest.Mock
      ).mockImplementation(() => ({
        filter: jest.fn(() => ({
          limit: jest.fn(() => ({
            toArray: async () => Promise.resolve(poisPaginated),
          })),
        })),
      }));

      const response = (await server.executeOperation({
        query: getPois,
        variables,
      })) as GraphQLSingleResult<{ pois: PaginatedResult<POI> }>;

      expect(response).toBeDefined();
      expect(response.body.singleResult.data).toBeDefined();

      expect(response.body.singleResult.data?.pois.edges.length).toEqual(0);
      expect(response.body.singleResult.data?.pois.pageInfo).toEqual({
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      });

      expect(poiListSnapshotFindOneMock).toHaveBeenCalledTimes(1);
      expect(poiListSnapshotFindOneMock).toHaveBeenCalledWith(
        { isCompleted: true },
        { sort: { _id: -1 } },
      );

      expect(poisFindMock).toHaveBeenCalledTimes(1);
      expect(poisFindMock).toHaveBeenCalledWith({});

      const poisFindFilterMock = poisFindMock.mock.results[0].value.filter as jest.Mock;

      expect(poisFindFilterMock).toHaveBeenCalledWith({
        _id: { $in: expect.any(Array) as jest.Mocked<string[]> },
      });
      expect(
        poisFindFilterMock.mock.results[0].value.limit as jest.Mock,
      ).toHaveBeenCalledWith(variables.first);
    });
  });
});
