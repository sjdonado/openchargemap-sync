import * as MUUID from 'uuid-mongodb';

import { type Repository } from '../@types/server';
import { type Country } from '../@types/poi';
import { type ScraperMessage } from '../@types/scraper';

import env from '../config/env';

export const openChargeMapPublisher = async (
  countries: Country[],
  repository: Repository,
) => {
  const id = MUUID.v4();

  await Promise.all(
    countries.map(async (country) => {
      const message: ScraperMessage = {
        id: id.toString('D'),
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
