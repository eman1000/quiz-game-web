import { ApolloServer, gql } from 'apollo-server-express';

const schema = gql(`
    type Question {
      id: ID
      description: String !
      imageUrl: String
      categoryId: ID !
      category: [Category!]
      answers:[Answer!]
    }

    extend type Query {
      getQuestion(id: ID): Question !
      getQuestionWithAnswers(testId: ID!):[Question!]
    }

    extend type Mutation {
      createQuestion(
        description: String !
        imageUrl: String
        categoryId: ID !
      ): Question!
    }

`)

export default schema;