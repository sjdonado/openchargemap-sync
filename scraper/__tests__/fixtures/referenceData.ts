import { faker } from '@faker-js/faker';

import { type CoreReferenceData } from '../../src/services/openChargeMap';

export const referenceData: CoreReferenceData = {
  Countries: [
    {
      ID: 86,
      ISOCode: faker.location.countryCode(),
      ContinentCode: faker.location.countryCode(),
      Title: faker.lorem.lines(1),
    },
    {
      ID: 87,
      ISOCode: 'DE',
      ContinentCode: 'EU',
      Title: 'Germany',
    },
    {
      ID: 53,
      ISOCode: 'CO',
      ContinentCode: 'SA',
      Title: 'Colombia',
    },
  ],
};
