import { v4 as uuidv4 } from 'uuid';

import env from '../config/env';

import { type Repository } from '../router';
import { type Country } from '../logic/openChargeMap';

export type ScraperMessage = {
  id: string;
  country: Country;
};

export const openChargeMapPublisher = async (
  countries: Country[],
  repository: Repository,
) => {
  await Promise.all(
    countries.map(async (country) => {
      const message: ScraperMessage = {
        id: uuidv4(),
        country,
      };

      await repository.publishMessage(
        env.RABBITMQ_EXCHANGE,
        JSON.stringify(message),
      );
    }),
  );
};
