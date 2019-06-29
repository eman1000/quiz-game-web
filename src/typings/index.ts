import { type } from "os";

export interface IUser {
  readonly id: number;
  username: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE" | undefined;
  age: number | undefined;
  email: string;
  password:string;
  messages?: Array<any>;
  role?:string
  facebookId?:string
  avatar?:string;
  coins:number;
  gems:number;
}
export type ICategory = {
  id:number;
  name:string;
  description:string;
  thumbnail:string;
}

export type IMatch = {
  id: number;
  testId: number;
  status: string;
  nextMoveUserId: number;
  winnerId:number;
  matchType: string;
  matchUsers:Array<IMatchUser>
  results:Array<IResult>
}

export type IResult = {
  id: number;
  matchId:number;
  userId: number;
  questionId: number;
  answerId: number;
  isCorrect: boolean;
}
export type IMatchUser = {
  id: number;
  userId: number;
  matchId: number;
}

export type IAnswer = {
  id: number;
  description: string;
  imageUrl: string;
  isCorrect: boolean;
  questionId: number;
}

export type IQuestion = {
  id: number;
  description: string;
  imageUrl: string;
  categoryId: number;
  category: ICategory;
  answers:Array<IAnswer>
}

export type IScore = {
  id:  number;
  userId:  number;
  categoryId:  number;
  score:  number;
  user: IUser
  category: ICategory
}

export type ITest = {
  id: number;
  name: string;
  categoryId: number;
  testQuestions:Array<ITestQuestion>
}

export type ITestQuestion = {
  id: number;
  questionId: number;
  testId:number;
  question:IQuestion;
}

export type IReward = {
  id :number;
  userId:number;
  coins:number;
  gems:number;
}