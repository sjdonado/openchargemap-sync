import axios from 'axios';

import { type Repository } from '../../src/router';

import { start } from '../../src/server';

const port = 1234;
const baseUrl = `http://localhost:${port}`;

describe('GET /run ', () => {
  let repository: Repository;
  let disconnect: () => Promise<void>;

  beforeAll(async () => {
    // prettier-ignore
    ([repository, disconnect] = await start(1234));
  });

  afterAll(async () => {
    await disconnect();
  });

  it('should return 200 when sending a GET request', async () => {
    const endpoint = '/run';
    const response = await axios.get(`${baseUrl}${endpoint}`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.data.message).toContain('Job started');
    expect(true).toBe(true);
  });
});
