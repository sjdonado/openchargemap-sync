import * as http from 'http';

type Data = {
  message: string;
};

type FetchResponse = {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: string;
  data: Data;
};

export const fetch = async (options: http.RequestOptions): Promise<FetchResponse> =>
  new Promise<FetchResponse>((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';

      res.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });

      res.on('end', () => {
        const fetchResponse: FetchResponse = {
          status: res.statusCode ?? 0,
          headers: res.headers,
          body,
          data: JSON.parse(body) as Data,
        };

        resolve(fetchResponse);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
