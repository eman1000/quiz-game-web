import { ApolloServer, gql } from 'apollo-server-express';

export interface ResultAttributes {
  readonly id?: number;
  matchId: number;
  userId:number;
  questionId:number;
  answerId:number;
  isCorrect:boolean;
}


const schema = gql(`
    type Result {
      id: ID
      matchId: ID !
      userId: ID !
      questionId: ID !
      answerId: ID !
      categoryId: ID
      isCorrect: Boolean
    }

    extend type Query {
      getResult(id: ID): Result !
    }

    extend type Mutation {
      saveQuestionResult(
        matchId: ID !
        userId: ID !
        questionId: ID !
        categoryId: ID !
        answerId: ID !
        isCorrect: Boolean
      ): Result !
    }
`)

export default schema;