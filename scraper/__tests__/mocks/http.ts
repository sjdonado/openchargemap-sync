import type * as http from 'http';

export const req = {} as unknown as jest.Mocked<http.IncomingMessage>;

export const res = {
  writeHead: jest.fn(),
  end: jest.fn(),
} as unknown as jest.Mocked<http.ServerResponse>;
