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
      isCorrect: Boolean
    }

    extend type Query {
      getResult(id: ID): Result !
    }
`)

export default schema;