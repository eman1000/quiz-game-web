import { ApolloServer, gql } from 'apollo-server-express';
const schema = gql(`
    type MatchUser {
      id: ID
      userId: ID !
      matchId: ID !
      points: Int !
      user: User 
    }

    extend type Query {
      getMatchUser(id: ID): MatchUser !
    }
`)

export default schema;