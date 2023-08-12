import { healthController } from '../../src/controllers/health';

import { req, res } from '../mocks/http';
import { mockRepository } from '../mocks/repository';

describe('healthController', () => {
  it('should return a healthy response', async () => {
    const snapshotsCount = 1;

    const expectedResponse = {
      status: 'ok',
      message: `Service is healthy, number of snapshots: ${snapshotsCount}`,
    };

    (
      mockRepository.collections.poiListSnapshots.countDocuments as jest.Mock
    ).mockResolvedValue(snapshotsCount);

    await healthController(req, res, mockRepository);

    expect(res.writeHead).toBeCalledWith(200, {
      'Content-Type': 'application/json',
    });

    expect(res.end).toBeCalledWith(JSON.stringify(expectedResponse));
  });
});
