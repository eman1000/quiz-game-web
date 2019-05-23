import { ApolloServer, gql } from 'apollo-server-express';

const schema = gql(`
    type TestQuestion {
      id: ID
      questionId: ID 
      testId: ID
      question:Question!
    }
    extend type Query {
      getTestQuestion(id: ID): TestQuestion !
    }
`)

export default schema;