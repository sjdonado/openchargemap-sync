import { type Controller } from '../@types/router';

export const healthController: Controller = async (req, res, repository) => {
  const snapshotsCount = await repository.collections.poiListSnapshots.countDocuments();

  const response = {
    status: 'ok',
    message: `Service is healthy, number of snapshots: ${snapshotsCount}`,
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response));
};
