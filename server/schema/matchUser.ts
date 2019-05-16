import { ApolloServer, gql } from 'apollo-server-express';
const schema = gql(`
    type MatchUser {
      id: ID
      userId: ID !
      matchId: ID !
    }

    extend type Query {
      getMatchUser(id: ID): MatchUser !
    }
`)

export default schema;