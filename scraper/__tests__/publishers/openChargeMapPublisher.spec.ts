import * as MUUID from 'uuid-mongodb';
import { faker } from '@faker-js/faker';

import { type Country } from '../../src/services/openChargeMap';

import {
  type ScraperMessage,
  openChargeMapPublisher,
} from '../../src/publishers/openChargeMapPublisher';

import { mockRepository } from '../mocks/repository';

jest.mock('uuid-mongodb', () => {
  const actual: jest.Mocked<typeof MUUID> = jest.requireActual('uuid-mongodb');

  return {
    ...actual,
    v4: jest.fn(),
  };
});

describe('openChargeMapPublisher', () => {
  const mockedUUID = MUUID.from(faker.string.uuid());

  const countries: Country[] = [
    {
      ID: faker.number.int(),
      ISOCode: faker.location.countryCode(),
      ContinentCode: faker.location.countryCode(),
      Title: faker.lorem.lines(1),
    },
    {
      ID: faker.number.int(),
      ISOCode: faker.location.countryCode(),
      ContinentCode: faker.location.countryCode(),
      Title: faker.lorem.lines(1),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should publish messages for each country', async () => {
    (MUUID.v4 as jest.Mock).mockReturnValue(mockedUUID);
    mockRepository.publishMessage.mockResolvedValue(true);

    await openChargeMapPublisher(countries, mockRepository);

    expect(mockRepository.publishMessage).toHaveBeenCalledTimes(countries.length);

    countries.forEach((country: Country) => {
      const expectedMessage: ScraperMessage = {
        id: mockedUUID,
        country,
        countriesCount: countries.length,
      };

      expect(mockRepository.publishMessage).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify(expectedMessage),
      );
    });
  });

  it('should throw an error if publish fails', async () => {
    const error = new Error('Mocked error');

    (MUUID.v4 as jest.Mock).mockReturnValue(mockedUUID);
    mockRepository.publishMessage.mockRejectedValue(error);

    const promise = openChargeMapPublisher(countries, mockRepository);

    await expect(promise).rejects.toThrow(error);

    expect(mockRepository.publishMessage).toHaveBeenCalledTimes(countries.length);
  });
});
