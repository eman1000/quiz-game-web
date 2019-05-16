import { gql } from 'apollo-server-express';

import userSchema from './user';
import messageSchema from './message';
import categorySchema from './category';
import scoreSchema from './score';
import testSchema from './test';
import questionSchema from './question';
import answerSchema from './answer';
import matchSchema from './match';
import userMatchSchema from './matchUser';
import resultSchema from './result';
import testQuestionSchema from './testQuestion';

const linkSchema = gql`
  scalar Date
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }

  type PageInfo {
    _: Boolean
  }
  
`;

export default [
  linkSchema,
  userSchema,
  messageSchema,
  categorySchema,
  scoreSchema,
  testSchema,
  questionSchema,
  answerSchema,
  matchSchema,
  userMatchSchema,
  resultSchema,
  testQuestionSchema
];