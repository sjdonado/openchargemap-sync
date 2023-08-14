import { type Controller } from '../@types/router';

import { fetchReferenceData } from '../services/openChargeMap';
import { openChargeMapPublisher } from '../publishers/openChargeMapPublisher';

export const runController: Controller = async (req, res, repository) => {
  const { countries } = await fetchReferenceData();

  await openChargeMapPublisher(countries, repository);

  const response = {
    message: `Job started, number of messages published: ${countries.length}`,
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response));
};
