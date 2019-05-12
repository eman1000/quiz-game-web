import { createContext } from 'react'
import { IUser } from "../../typings"

export type IUserContext = IUser & {
  setUserDetails:(userDetails:IUser)=>void
};
const UserDetailsContext = createContext<IUserContext>({
  id :undefined,
  username:"",
  firstName:"",
  lastName:"",
  gender:undefined,
  age:undefined,
  email:"",
  password:"",
  messages:undefined,
  role:"",
  facebookId:"",
  avatar:"",
  setUserDetails: (userDetails:IUser)=>{}
})

export default UserDetailsContext