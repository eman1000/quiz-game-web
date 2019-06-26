import { ApolloServer, gql } from 'apollo-server-express';

const schema = gql(`
    type Match {
      id: ID
      testId: ID !
      test:Test
      status: String !
      nextMoveUserId: ID !
      winnerId:ID 
      matchType: MatchType !
      matchUsers:[MatchUser!]
      results:[Result!]
    }

    enum MatchType{
      MULTI_PLAYER
      SINGLE_PLAYER
    }
    extend type Mutation {
      createMatch(categoryId: ID!, matchType: MatchType!, playerOneId: ID!, playerTwoId:ID): Match
      updateMatch(
        id: ID !
        testId: ID
        status: String
        nextMoveUserId: ID
        winnerId:ID
      ) : Match
    }
    extend type Query {
      getMatch(matchId: ID!): Match !
    }
    extend type Subscription {
      matchUpdated(matchId: ID!): MatchUpdated!
      matchRequested(userId: ID!): MatchRequested!
    }
    type MatchUpdated{
      match: Match!
    }
    type MatchRequested{
      match: Match!
    }

`)

export default schema;