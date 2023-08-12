import { openChargeMapPublisher } from '../../src/publishers/openChargeMapPublisher';
import { fetchReferenceData } from '../../src/services/openChargeMap';
import { runController } from '../../src/controllers/run';

import { mockReq, mockRes } from '../mocks/http';
import { mockRepository } from '../mocks/repository';

import { POIList } from '../fixtures/poiList';

jest.mock('../../src/services/openChargeMap');
jest.mock('../../src/publishers/openChargeMapPublisher');

describe('runController', () => {
  const countries = [POIList[0].AddressInfo.Country];

  it('should fetch reference data and publish messages', async () => {
    (fetchReferenceData as jest.Mock).mockResolvedValue({ countries });

    (openChargeMapPublisher as jest.Mock).mockImplementation();

    const response = {
      message: `Job started, number of messages published: ${countries.length}`,
    };

    await runController(mockReq, mockRes, mockRepository);

    expect(fetchReferenceData).toHaveBeenCalled();
    expect(openChargeMapPublisher).toHaveBeenCalledWith(countries, mockRepository);

    expect(mockRes.writeHead).toHaveBeenCalledWith(200, {
      'Content-Type': 'application/json',
    });

    expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify(response));
  });
});
