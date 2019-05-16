import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
import messageResolvers from './message';
import categoryResolvers from './category';
import scoreResolvers from './score';
import testResolvers from './test';
import questionResolvers from './question';
import answerResolvers from './answer';
import matchResolvers from './match';
import userMatchResolvers from './userMatch';
import resultResolvers from './result';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

const resolvers = [
  customScalarResolver,
  userResolvers,
  messageResolvers,
  categoryResolvers,
  scoreResolvers,
  testResolvers,
  questionResolvers,
  answerResolvers,
  matchResolvers,
  userMatchResolvers,
  resultResolvers
];
export default resolvers;