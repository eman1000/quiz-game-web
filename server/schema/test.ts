import { ApolloServer, gql } from 'apollo-server-express';
const schema = gql(`
    type Test {
      id: ID
      name: String !
      categoryId: ID !
      testQuestions:[TestQuestion!]
    }

    extend type Query {
      getTest(id: ID): Test !
      getRandomTest: Test !
    }
`)

export default schema;