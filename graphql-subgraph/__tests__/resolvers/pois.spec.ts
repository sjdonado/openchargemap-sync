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

  afterAll(async () => {
    await server.stop();
  });

  describe('Query.pois - No pagination', () => {
    const query = `#graphql
      query GetPois {
        pois {
          edges {
            cursor
            node {
              OperatorInfo {
                ID
                description
                WebsiteURL
                Comments
                PhonePrimaryContact
                PhoneSecondaryContact
                IsPrivateIndividual
                BookingURL
                ContactEmail
                FaultReportEmail
                IsRestrictedEdit
                AddressInfo {
                  ID
                  Description
                  AddressLine1
                  AddressLine2
                  Town
                  StateOrProvince
                  Postcode
                  CountryID
                  Country {
                    ID
                    ISOCode
                    ContinentCode
                    Title
                  }
                  Latitude
                  Longitude
                  ContactTelephone1
                  ContactTelephone2
                  ContactEmail
                  AccessComments
                  RelatedURL
                  Distance
                  DistanceUnit
                }
              }
              StatusType {
                ID
                description
                IsOperational
                IsUserSelectable
              }
              AddressInfo {
                ID
                Description
                AddressLine1
                AddressLine2
                Town
                StateOrProvince
                Postcode
                CountryID
                Country {
                  ID
                  ISOCode
                  ContinentCode
                  Title
                }
                Latitude
                Longitude
                ContactTelephone1
                ContactTelephone2
                ContactEmail
                AccessComments
                RelatedURL
                Distance
                DistanceUnit
              }
              Connections {
                ID
                ConnectionTypeID
                ConnectionType {
                  ID
                  title
                  FormalName
                  IsDiscontinued
                  IsObsolete
                }
                Reference
                StatusTypeID
                LevelID
                Level {
                  ID
                  Title
                  Comments
                  IsFastChargeCapable
                }
                Amps
                Voltage
                PowerKW
                CurrentTypeID
                CurrentType {
                  ID
                  Title
                }
                Quantity
                Comments
                StatusType {
                  ID
                  description
                  IsOperational
                  IsUserSelectable
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    `;

    it('should return a list of POIs', async () => {
      const pois = generateDatabasePOIList();

      const { _id, ...expectedPoi } = pois[0];

      (
        mockRepository.collections.poiListSnapshots.findOne as jest.Mock
      ).mockResolvedValue(poiListSnapshot);

      (mockRepository.collections.pois.find as jest.Mock).mockImplementation(() => ({
        limit: () => ({
          toArray: async () => Promise.resolve(pois),
        }),
      }));

      const response = (await server.executeOperation({
        query,
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

      expect(mockRepository.collections.poiListSnapshots.findOne).toHaveBeenCalledTimes(
        1,
      );
      expect(mockRepository.collections.poiListSnapshots.findOne).toHaveBeenCalledWith(
        { isCompleted: true },
        { sort: { _id: -1 } },
      );

      expect(mockRepository.collections.pois.find).toHaveBeenCalledTimes(1);
      expect(mockRepository.collections.pois.find).toHaveBeenCalledWith({});
    });

    it('should return an empty list of POIs - when there are no poiListSnapshots', async () => {
      (
        mockRepository.collections.poiListSnapshots.findOne as jest.Mock
      ).mockImplementation();

      const response = (await server.executeOperation({
        query,
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

      expect(mockRepository.collections.poiListSnapshots.findOne).toHaveBeenCalledTimes(
        1,
      );
      expect(mockRepository.collections.poiListSnapshots.findOne).toHaveBeenCalledWith(
        { isCompleted: true },
        { sort: { _id: -1 } },
      );

      expect(mockRepository.collections.pois.find).toHaveBeenCalledTimes(0);
    });

    it('should return an empty list of POIs - when there are no pois', async () => {
      (
        mockRepository.collections.poiListSnapshots.findOne as jest.Mock
      ).mockResolvedValue(poiListSnapshot);

      (mockRepository.collections.pois.find as jest.Mock).mockImplementation(() => ({
        limit: () => ({
          toArray: async () => Promise.resolve([]),
        }),
      }));

      const response = (await server.executeOperation({
        query,
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

      expect(mockRepository.collections.poiListSnapshots.findOne).toHaveBeenCalledTimes(
        1,
      );
      expect(mockRepository.collections.poiListSnapshots.findOne).toHaveBeenCalledWith(
        { isCompleted: true },
        { sort: { _id: -1 } },
      );

      expect(mockRepository.collections.pois.find).toHaveBeenCalledTimes(1);
      expect(mockRepository.collections.pois.find).toHaveBeenCalledWith({});
    });
  });
});
