import { ApolloServer, gql } from 'apollo-server-express';
const schema = gql(`
    type Test {
      id: ID
      name: String !
      categoryId: ID !
      pointsPerAnswer: Int !
      testQuestions:[TestQuestion!]
    }

    extend type Query {
      getTest(testId: ID): Test !
      getTestWithQuestions(testId: ID): Test !
      getRandomTestByCategory(categoryId: ID!): Test !
    }
`)

export default schema;