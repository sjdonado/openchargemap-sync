import axios from 'axios';
import request from 'supertest';
import MockAdapter from 'axios-mock-adapter';

import { type Repository, type EnvVariables } from '../../src/@types/server';

import env from '../../src/config/env';
import { start } from '../../src/server';
import { POI_LIST_MAX_RESULTS } from '../../src/config/constant';

import { referenceData } from '../fixtures/referenceData';
import { generatePOIList } from '../fixtures/poiList';

import { waitFor } from '../helpers/time';

const TEST_DELAY = 3000;
const TEST_PORT = 1234;
const TEST_BASE_URL = `http://localhost:${TEST_PORT}`;

jest.mock('../../src/config/env', () => {
  const actual: jest.Mocked<{ default: EnvVariables }> =
    jest.requireActual('../../src/config/env');

  return {
    ...actual.default,
    NODE_ENV: 'test',
    PORT: 1234,
    OPENCHARGEMAP_ALLOWED_COUNTRIES: 'DE,CO',
  };
});

describe('GET /run ', () => {
  let repository: Repository;
  let disconnect: () => Promise<void>;

  let mock: MockAdapter;

  beforeAll(async () => {
    // prettier-ignore
    ([repository, disconnect] = await start());
  });

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(async () => {
    await disconnect();
  });

  it('should return 200 when sending a GET request', async () => {
    const endpoint = '/run';

    const POIList = generatePOIList(1000);

    const snapshots = await repository.collections.poiListSnapshots.find().toArray();
    const pois = await repository.collections.pois.find().toArray();

    mock.onGet(`${env.OPENCHARGEMAP_BASE_URL}/referencedata`).reply(200, referenceData);
    mock
      .onGet(`${env.OPENCHARGEMAP_BASE_URL}/poi`, {
        params: {
          countryid: referenceData.Countries[1].ID,
          maxresults: POI_LIST_MAX_RESULTS,
        },
      })
      .reply(200, POIList);

    mock
      .onGet(`${env.OPENCHARGEMAP_BASE_URL}/poi`, {
        params: {
          countryid: referenceData.Countries[2].ID,
          maxresults: POI_LIST_MAX_RESULTS,
        },
      })
      .reply(200, POIList);

    const response = await request(TEST_BASE_URL).get(endpoint);

    await waitFor(TEST_DELAY);

    const snapshotsAfter = await repository.collections.poiListSnapshots.find().toArray();

    const poisAfter = await repository.collections.pois.find().toArray();

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body.message).toContain('Job started');

    expect(snapshotsAfter.length).toBeGreaterThan(snapshots.length);
    expect(snapshotsAfter[snapshotsAfter.length - 1].poiListIds.length).toBe(
      POIList.length * (referenceData.Countries.length - 1),
    );

    expect(poisAfter.length).toBeGreaterThan(pois.length);
    expect(poisAfter.length - pois.length).toBe(
      POIList.length * (referenceData.Countries.length - 1),
    );
  });
});
