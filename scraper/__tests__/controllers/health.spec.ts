import * as http from 'http';

import sinon from 'sinon';

import { type Repository } from '../../src/router';
import { healthController } from '../../src/controllers/health';

describe('healthController', () => {
  const req = sinon.createStubInstance(http.IncomingMessage);
  const res = sinon.createStubInstance(http.ServerResponse);
  const repository = {
    collections: {
      poiListSnapshots: {
        countDocuments: async () => Promise.resolve(1),
      },
    },
  } as Repository;

  it('should return a healthy response', async () => {
    await healthController(req, res, repository);

    sinon.assert.calledWith(
      res.writeHead,
      200,
      sinon.match({
        'Content-Type': 'application/json',
      }),
    );

    sinon.assert.calledWith(
      res.end,
      JSON.stringify({
        status: 'ok',
        message: `Service is healthy, number of snapshots: 1`,
      }),
    );
  });
});
