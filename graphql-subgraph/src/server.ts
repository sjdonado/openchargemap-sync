import { ApolloServer } from '@apollo/server';

import { buildSubgraphSchema } from '@apollo/subgraph';

import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';

import resolvers from './resolvers';

const typeDefs = loadSchemaSync('./schemas/*.graphql', {
  loaders: [new GraphQLFileLoader()],
});

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
