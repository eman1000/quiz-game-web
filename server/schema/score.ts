import { ApolloServer, gql } from 'apollo-server-express';

const schema = gql(`
    type Score {
      id: ID
      userId: ID !
      categoryId: ID !
      score: Int !
      user: User
      category: Category
    }

    extend type Query {
      getScore(id: ID): Score !
      getUserScore(userId: ID!, categoryId: ID!): Score !
      getScores(cursor: String, limit: Int, categoryId: Int): ScoreConnection!
    }

    extend type Mutation{
      addScore(
        id: ID
        userId: Int !
        categoryId: Int !
        score: Int !
      ): Score!
      deleteScore(id: ID!): Boolean !
    }

    input ScoreInput{
      id: ID
      userId: Int !
      categoryId: Int !
      score: Int !
    }
    type ScoreConnection {
      edges: [Score!]!
      pageInfo: PageInfo!
    }
`)

export default schema;