import poisResolver from './pois';

const resolvers = {
  Query: {
    ...poisResolver.Query,
  },
};

export default resolvers;
