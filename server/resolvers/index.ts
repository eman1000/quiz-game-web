import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
import messageResolvers from './message';
import categoryResolvers from './category';
import scoreResolvers from './score';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

const resolvers = [
  customScalarResolver,
  userResolvers,
  messageResolvers,
  categoryResolvers,
  scoreResolvers
];
export default resolvers;