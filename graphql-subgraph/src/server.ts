import { type DocumentNode } from 'graphql';

import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { startStandaloneServer } from '@apollo/server/standalone';

import { loadFilesSync } from '@graphql-tools/load-files';

import env from './config/env';
import { type Repository } from './types';

import { connectDatabase } from './repository/database';

import resolvers from './resolvers';

const typeDefs = loadFilesSync<DocumentNode>('./src/schemas/*.graphql');

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

(async () => {
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

    console.log('[server] Server stopped');
    process.exit(0);
  });
})();
