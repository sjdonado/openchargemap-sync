import { type DocumentNode } from 'graphql';
import Keyv from 'keyv';

import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { startStandaloneServer } from '@apollo/server/standalone';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';

import { loadFilesSync } from '@graphql-tools/load-files';

import env from './config/env';
import { type Repository } from './@types/server';

import { connectDatabase } from './repository/database';

import resolvers from './resolvers';

export const directives = loadFilesSync('./src/directives/*.graphql');
export const schemas = loadFilesSync<DocumentNode>('./src/schemas/*.graphql');

export const start = async () => {
  const typeDefs = schemas.concat(directives);

  const keyv = new Keyv(env.REDIS_URI);

  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
    cache: new KeyvAdapter(keyv),
    csrfPrevention: false,
  });

  const [collections, disconnectDatabase] = await connectDatabase();

  const repository: Repository = { collections };

  const { url } = await startStandaloneServer(server, {
    listen: { port: env.PORT },
    context: async () => ({ repository }),
  });

  console.log(`[server] Server is running, GraphQL Playground available at ${url}`);

  process.on('SIGINT', async () => {
    console.log('[server] Server is stopping...');

    await disconnectDatabase();
    await keyv.disconnect();

    console.log('[server] Server stopped');
    process.exit(0);
  });

  const disconnect = async () => server.stop();

  return [repository, disconnect] as [Repository, () => Promise<void>];
};
