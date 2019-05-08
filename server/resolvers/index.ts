import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
import messageResolvers from './message';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

const resolvers = [customScalarResolver, userResolvers, messageResolvers];
export default resolvers;