import { ApolloServer } from '@apollo/server';
import * as MUUID from 'uuid-mongodb';

import { type POI } from '../../src/@types/pois';
import { type GraphQLSingleResult, type CustomContext } from '../../src/@types/server';
import { type POIListSnapshot } from '../@types/poiListSnapshot';

import { schemas } from '../../src/server';
import poisResolver from '../../src/resolvers/pois';

import { mockRepository } from '../mocks/repository';
import { generatePOIList } from '../fixtures/pois';
import { GraphQLResponseBody } from '@apollo/server/dist/esm/externalTypes/graphql';

describe('pois resolver', () => {
  let server: ApolloServer<CustomContext>;

  beforeAll(async () => {
    const context: CustomContext = { repository: mockRepository };

    server = new ApolloServer({
      typeDefs: schemas,
      resolvers: {
        Query: {
          pois: async (_parent, _args) =>
            poisResolver.Query.pois(_parent, _args, context),
        },
      },
    });
  });

  afterAll(async () => {
    await server.stop();
  });

  it('should return a list of POIs', async () => {
    const pois = generatePOIList(10);
    const poiListSnapshot: POIListSnapshot = {
      _id: MUUID.v4(),
      poiListIds: [MUUID.v4(), MUUID.v4(), MUUID.v4()],
      countriesProcessed: 1,
      isCompleted: true,
    };

    const query = `#graphql
      query pois {
        pois {
          StatusType {
            ID
          }
          AddressInfo {
            ID
          }
          Connections {
            ID
          }
          OperatorInfo {
            ID
          }
        }
      }
    `;

    (mockRepository.collections.poiListSnapshots.findOne as jest.Mock).mockResolvedValue(
      poiListSnapshot,
    );

    (mockRepository.collections.pois.find as jest.Mock).mockImplementation(() => ({
      toArray: () => pois,
    }));

    const response = (await server.executeOperation({
      query,
    })) as GraphQLSingleResult<POI[]>;

    expect(response).toBeDefined();
    expect(response.body.singleResult.data).toBeDefined();
  });
});
