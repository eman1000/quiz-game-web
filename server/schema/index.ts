import { gql } from 'apollo-server-express';

import userSchema from './user';
import messageSchema from './message';
import categorySchema from './category';
import scoreSchema from './score';

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
  scoreSchema
];