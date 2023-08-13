import * as MUUID from 'uuid-mongodb';
import type amqp from 'amqplib';

import {
  type POIListSnapshot,
  openChargeMapConsumer,
} from '../../src/consumers/openChargeMapConsumer';
import { fetchPOIList } from '../../src/services/openChargeMap';

import { type ScraperMessage } from '../../src/publishers/openChargeMapPublisher';

import { mockRepository } from '../mocks/repository';
import { generatePOIList } from '../fixtures/poiList';
import { referenceData } from '../fixtures/referenceData';
import { ClientSession } from 'mongodb';

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
  const POIList = generatePOIList(1);

  const snapshotId = '5bd0e26c-6567-4ccc-b896-e0d451c384db';
  const snapshotIdBase64 = 'W9DibGVnTMy4luDUUcOE2w==';
  const countriesCount = 2;

  const messages: ScraperMessage[] = [
    {
      id: MUUID.from(snapshotId),
      country: referenceData.Countries[1],
      countriesCount,
    },
    {
      id: MUUID.from(snapshotId),
      country: referenceData.Countries[2],
      countriesCount,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should store POI data and create snapshot', async () => {
    const message = messages[0];

    (mockMsg.content.toString as jest.Mock).mockReturnValue(JSON.stringify(message));

    (fetchPOIList as jest.Mock).mockResolvedValue(POIList);

    (
      mockRepository.collections.poiListSnapshots.findOne as jest.Mock
    ).mockImplementation();

    (
      mockRepository.collections.poiListSnapshots.updateOne as jest.Mock
    ).mockImplementation();

    await openChargeMapConsumer(mockMsg, mockChannel, mockRepository);

    expect(fetchPOIList).toHaveBeenCalledWith(message.country.ID);

    expect(mockRepository.collections.poiListSnapshots.findOne).toHaveBeenCalledWith(
      {
        _id: snapshotIdBase64,
      },
      {
        session: expect.any(Object) as jest.Mocked<ClientSession>,
      },
    );

    expect(mockRepository.collections.poiListSnapshots.updateOne).toHaveBeenCalledWith(
      {
        _id: snapshotIdBase64,
      },
      {
        $set: {
          _id: snapshotIdBase64,
          poiList: POIList,
          isCompleted: false,
        },
        $inc: {
          countriesProcessed: 1,
        },
      },
      {
        upsert: true,
        session: expect.any(Object) as jest.Mocked<ClientSession>,
      },
    );
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
  });

  it('should store POI data and create + udpate snapshot', async () => {
    const message = messages[1];

    const currentSnapshot: POIListSnapshot = {
      _id: MUUID.from(snapshotId),
      poiList: POIList,
      countriesProcessed: 1,
      isCompleted: false,
    };

    (mockMsg.content.toString as jest.Mock).mockReturnValue(JSON.stringify(message));

    (fetchPOIList as jest.Mock).mockResolvedValue(POIList);

    (mockRepository.collections.poiListSnapshots.findOne as jest.Mock).mockReturnValue(
      currentSnapshot,
    );

    (
      mockRepository.collections.poiListSnapshots.updateOne as jest.Mock
    ).mockImplementation();

    await openChargeMapConsumer(mockMsg, mockChannel, mockRepository);

    expect(fetchPOIList).toHaveBeenCalledWith(message.country.ID);

    expect(mockRepository.collections.poiListSnapshots.findOne).toHaveBeenCalledWith(
      {
        _id: snapshotIdBase64,
      },
      {
        session: expect.any(Object) as jest.Mocked<ClientSession>,
      },
    );

    expect(mockRepository.collections.poiListSnapshots.updateOne).toHaveBeenCalledWith(
      {
        _id: snapshotIdBase64,
      },
      {
        $set: {
          _id: snapshotIdBase64,
          poiList: [...currentSnapshot.poiList, ...POIList],
          isCompleted: true,
        },
        $inc: {
          countriesProcessed: 1,
        },
      },
      {
        upsert: true,
        session: expect.any(Object) as jest.Mocked<ClientSession>,
      },
    );
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
  });

  it('should handle errors and nack message', async () => {
    const error = new Error('Mocked error');

    (mockMsg.content.toString as jest.Mock).mockReturnValue(JSON.stringify(messages[0]));

    (fetchPOIList as jest.Mock).mockRejectedValue(error);

    consoleErrorMock.mockImplementation();

    await openChargeMapConsumer(mockMsg, mockChannel, mockRepository);

    expect(fetchPOIList).toHaveBeenCalledWith(messages[0].country.ID);
    expect(mockRepository.collections.poiListSnapshots.findOne).not.toHaveBeenCalled();
    // TODO: configure retry/recovery logic
    // expect(mockChannel.nack).toHaveBeenCalledWith(mockMsg);
    expect(consoleErrorMock).toHaveBeenCalledWith(
      `[openChargeMapConsumer]: ${error.message}`,
    );
  });
});
