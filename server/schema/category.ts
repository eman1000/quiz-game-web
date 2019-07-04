import { ApolloServer, gql } from 'apollo-server-express';

const schema = gql(`
    type Category {
      id: ID
      name: String !
      description: String 
      thumbnail: String !
      backgroundImageUrl: String
      catKey: String !
      scores: [Score!]
    }
    extend type Query {
      getCategories(cursor: String, limit: Int): CategoryConnection!
      getCategory(id: ID!): Category
      getCategoryWithScores(id: ID!): Category
    }
    type CategoryConnection {
      edges: [Category!]!
      pageInfo: PageInfo!
    }
`)

export default schema;