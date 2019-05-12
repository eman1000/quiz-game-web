import React, { useState } from 'react'
import merge from 'lodash.merge'
import UserDetailsContext from './UserDetailsContext'
import { IUser } from "../../typings"

const UserDetailsProvider = ({ children }) => {
  /**
   * User details state / controls
   */
  const setUserDetails = ({
    id,
    username,
    firstName,
    lastName,
    gender,
    age,
    email,
    password,
    messages,
    role,
    facebookId,
    avatar
  }:IUser) => {
    updateUserDetails(prevState => {
      const newState = { ...prevState }
      return merge(newState, {
        id,
        username,
        firstName,
        lastName,
        gender,
        age,
        email,
        password,
        messages,
        role,
        facebookId,
        avatar
      })
    })
  }

  const userState = {
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
    setUserDetails
  }

  const [userDetails, updateUserDetails] = useState(userState)

  return (
    <UserDetailsContext.Provider value={userDetails}>
      {children}
    </UserDetailsContext.Provider>
  )
}

export default UserDetailsProvider