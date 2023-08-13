import { composeResolvers } from '@graphql-tools/resolvers-composition';

import poisResolver from './resolvers/pois.resolver';

const resolvers: Resolvers = {
  ...poisResolver,
};

const resolversComposition = {
  'Query.pois': [],
};

const composedResolvers = composeResolvers(resolvers, resolversComposition);

export default composedResolvers;
