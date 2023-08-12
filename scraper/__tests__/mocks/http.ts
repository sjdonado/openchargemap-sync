import type * as http from 'http';

export const mockReq = {} as unknown as jest.Mocked<http.IncomingMessage>;

export const mockRes = {
  writeHead: jest.fn(),
  end: jest.fn(),
} as unknown as jest.Mocked<http.ServerResponse>;
