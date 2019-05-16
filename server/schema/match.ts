import { ApolloServer, gql } from 'apollo-server-express';

const schema = gql(`
    type Match {
      id: ID
      testId: ID !
      status: String !
      nextMoveUserId: ID !
      winnerId:ID !
      matchUsers:[MatchUser!]
      results:[Result!]
    }

    extend type Query {
      getMatch(id: ID): Match !
    }

`)

export default schema;