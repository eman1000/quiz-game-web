export interface IUser {
  readonly id?: number;
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
  avatar?:string
}
export type Category = {
  id:number;
  name:string;
  description:string;
  thumbnail:string;
}