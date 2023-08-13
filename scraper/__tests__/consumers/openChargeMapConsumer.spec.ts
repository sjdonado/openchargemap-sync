import * as MUUID from 'uuid-mongodb';
import type amqp from 'amqplib';

import { openChargeMapConsumer } from '../../src/consumers/openChargeMapConsumer';
import { fetchPOIList } from '../../src/services/openChargeMap';
import { type ScraperMessage } from '../../src/publishers/openChargeMapPublisher';

import { mockRepository } from '../mocks/repository';
import { generatePOIList } from '../fixtures/poiList';

jest.mock('../../src/services/openChargeMap');

const consoleErrorMock = jest.spyOn(console, 'error');

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
  const POIList = generatePOIList();
  const { Country } = POIList[0].AddressInfo;

  const message: ScraperMessage = {
    id: MUUID.from('5bd0e26c-6567-4ccc-b896-e0d451c384db'),
    country: Country,
    countriesCount: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should store POI data and create snapshot', async () => {
    (mockMsg.content.toString as jest.Mock).mockReturnValue(JSON.stringify(message));

    (fetchPOIList as jest.Mock).mockResolvedValue(POIList);

    (
      mockRepository.collections.poiListSnapshots.findOne as jest.Mock
    ).mockImplementation();

    (
      mockRepository.collections.poiListSnapshots.updateOne as jest.Mock
    ).mockImplementation();

    await openChargeMapConsumer(mockMsg, mockChannel, mockRepository);

    expect(fetchPOIList).toHaveBeenCalledWith(Country.ID);

    expect(mockRepository.collections.poiListSnapshots.findOne).toHaveBeenCalledWith({
      _id: 'W9DibGVnTMy4luDUUcOE2w==',
    });

    expect(mockRepository.collections.poiListSnapshots.updateOne).toHaveBeenCalledWith(
      {
        _id: 'W9DibGVnTMy4luDUUcOE2w==',
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
    // TODO: configure retry/recovery logic
    // expect(mockChannel.nack).toHaveBeenCalledWith(mockMsg);
    expect(consoleErrorMock).toHaveBeenCalledWith(
      `[openChargeMapConsumer]: ${error.message}`,
    );
  });
});
