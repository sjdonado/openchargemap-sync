import { faker } from '@faker-js/faker';
import type amqp from 'amqplib';

import { openChargeMapConsumer } from '../../src/consumers/openChargeMapConsumer';
import { fetchPOIList } from '../../src/services/openChargeMap';
import { type ScraperMessage } from '../../src/publishers/openChargeMapPublisher';

import { mockRepository } from '../mocks/repository';
import { POIList } from '../fixtures/poiList';

jest.mock('../../src/services/openChargeMap');

const mockMsg = {
  content: {
    toString: jest.fn(),
  },
} as unknown as amqp.ConsumeMessage;

const mockChannel = {
  ack: jest.fn(),
  nack: jest.fn(),
} as unknown as amqp.Channel;

describe('openChargeMapConsumer', () => {
  const { Country } = POIList[0].AddressInfo;

  const message: ScraperMessage = {
    id: faker.string.uuid(),
    country: Country,
    countriesCount: 1,
  };

  const consoleErrorMock = jest.spyOn(console, 'error');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should store POI data and create snapshot', async () => {
    (mockMsg.content.toString as jest.Mock).mockReturnValue(JSON.stringify(message));

    (fetchPOIList as jest.Mock).mockResolvedValue(POIList);

    (mockRepository.collections.poiListSnapshots.findOne as jest.Mock).mockResolvedValue(
      undefined,
    );

    (
      mockRepository.collections.poiListSnapshots.updateOne as jest.Mock
    ).mockResolvedValue(undefined);

    await openChargeMapConsumer(mockMsg, mockChannel, mockRepository);

    expect(fetchPOIList).toHaveBeenCalledWith(Country.ID);

    expect(mockRepository.collections.poiListSnapshots.findOne).toHaveBeenCalledWith({
      id: message.id,
    });

    expect(mockRepository.collections.poiListSnapshots.updateOne).toHaveBeenCalledWith(
      {
        id: message.id,
      },
      expect.any(Object),
      {
        upsert: true,
      },
    );
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
  });

  it('should handle errors and nack message', async () => {
    const error = new Error('Mocked error');

    (mockMsg.content.toString as jest.Mock).mockReturnValue(JSON.stringify(message));

    (fetchPOIList as jest.Mock).mockRejectedValue(error);

    consoleErrorMock.mockImplementation();

    await openChargeMapConsumer(mockMsg, mockChannel, mockRepository);

    expect(fetchPOIList).toHaveBeenCalledWith(Country.ID);
    expect(mockRepository.collections.poiListSnapshots.findOne).not.toHaveBeenCalled();
    expect(mockChannel.nack).toHaveBeenCalledWith(mockMsg);
    expect(consoleErrorMock).toHaveBeenCalledWith(
      `[openChargeMapConsumer]: ${error.message}`,
    );
  });
});
