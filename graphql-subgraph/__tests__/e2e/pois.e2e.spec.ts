import request from 'supertest';

import { type Repository, type EnvVariables } from '../../src/@types/server';
import { type Connection } from '../../src/@types/pois';

import { start } from '../../src/server';

const TEST_PORT = 1235;
const TEST_BASE_URL = `http://localhost:${TEST_PORT}`;

jest.mock('../../src/config/env', () => {
  const actual: jest.Mocked<{ default: EnvVariables }> =
    jest.requireActual('../../src/config/env');

  return {
    ...actual.default,
    NODE_ENV: 'test',
    PORT: 1235,
  };
});

describe('POST /', () => {
  let repository: Repository;
  let disconnect: () => Promise<void>;

  beforeAll(async () => {
    // prettier-ignore
    ([repository, disconnect] = await start());
  });

  afterAll(async () => {
    await disconnect();
  });

  it('should return a list of POIs', async () => {
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

    const response = await request(TEST_BASE_URL).post('/').send({ query });

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();

    expect(response.body.data.pois.length).toBeGreaterThan(0);
    expect(response.body.data.pois[0]).toMatchObject({
      StatusType: {
        ID: expect.any(Number) as jest.Mocked<number>,
      },
      AddressInfo: {
        ID: expect.any(Number) as jest.Mocked<number>,
      },
      Connections: expect.arrayContaining([
        {
          ID: expect.any(Number) as jest.Mocked<number>,
        },
      ]) as jest.Mocked<Connection[]>,
      OperatorInfo: {
        ID: expect.any(Number) as jest.Mocked<number>,
      },
    });
  });
});
