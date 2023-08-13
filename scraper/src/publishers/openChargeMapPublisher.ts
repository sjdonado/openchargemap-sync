import * as MUUID from 'uuid-mongodb';

import env from '../config/env';

import { type Repository } from '../router';
import { type Country } from '../services/openChargeMap';

export type ScraperMessage = {
  id: MUUID.MUUID;
  country: Country;
  countriesCount: number;
};

export const openChargeMapPublisher = async (
  countries: Country[],
  repository: Repository,
) => {
  const id = MUUID.v4();

  await Promise.all(
    countries.map(async (country) => {
      const message: ScraperMessage = {
        id,
        country,
        countriesCount: countries.length,
      };

      await repository.publishMessage(env.RABBITMQ_EXCHANGE, JSON.stringify(message));

      console.log(
        `[openChargeMapPublisher]: ${id.toString('D')} ${country.ISOCode} - ${
          countries.length
        }`,
      );
    }),
  );
};
