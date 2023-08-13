import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { type Repository } from '../../src/router';

import { start } from '../../src/server';
import env, { type EnvVariables } from '../../src/config/env';

import { referenceData } from '../fixtures/referenceData';
import { generatePOIList } from '../fixtures/poiList';

import { fetch } from '../helpers/http';
import { waitFor } from '../helpers/time';

const TEST_DELAY = 3000;
const TEST_PORT = 1234;

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

    const POIList = generatePOIList(10);

    const snapshots = await repository.collections.poiListSnapshots.find().toArray();

    mock.onGet(`${env.OPENCHARGEMAP_BASE_URL}/referencedata`).reply(200, referenceData);
    mock.onGet(`${env.OPENCHARGEMAP_BASE_URL}/poi`).reply(200, POIList);

    const response = await fetch({
      method: 'GET',
      hostname: 'localhost',
      port: TEST_PORT,
      path: endpoint,
    });

    await waitFor(TEST_DELAY);

    const snapshotsAfter = await repository.collections.poiListSnapshots.find().toArray();

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.data.message).toContain('Job started');

    expect(snapshotsAfter.length).toBeGreaterThan(snapshots.length);
    expect(snapshotsAfter[snapshotsAfter.length - 1].poiList.length).toBe(
      POIList.length * (referenceData.Countries.length - 1),
    );
  });
});
