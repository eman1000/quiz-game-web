import { ApolloServer, gql } from 'apollo-server-express';
const schema = gql(`
    type Answer {
      id: ID
      description: String !
      imageUrl: String 
      isCorrect: Boolean
      questionId: ID !
    }

    extend type Query {
      getAnswer(id: ID): Answer !
    }
`)

export default schema;