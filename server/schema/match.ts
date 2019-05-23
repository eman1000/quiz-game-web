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

    extend type Mutation {
      createMatch(categoryId: ID!, playerOneId: ID!, playerTwoId:ID): Match
      updateMatch(
        id: ID !
        testId: ID
        status: String
        nextMoveUserId: ID
        winnerId:ID
      ) : Match
    }
    extend type Query {
      getMatch(matchId: ID): Match !
    }
    extend type Subscription {
      matchUpdated(matchId: ID!): MatchUpdated!
    }
    type MatchUpdated{
      match: Match!
    }

`)

export default schema;