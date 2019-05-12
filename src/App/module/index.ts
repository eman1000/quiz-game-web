// LIBRARIES
import update from "immutability-helper";
import constants from "./actionConstants";

const {
  AUTH_USER
} = constants;

export function authUser() {
  const token = localStorage.getItem("jwtToken");
  console.log(token)
  if(!token){
    return{
      type:AUTH_USER,
      payload:false
    }
  }else{
    return{
      type:AUTH_USER,
      payload:true
    }
  }
}

function handleAuthUser(state, action){
  return update(state,{
    isAuthenticated:{
      $set:action.payload
    }
  })
}

const ACTION_HANDLERS = {
  AUTH_USER:handleAuthUser

};

const initialState = {
  isAuthenticated: false
};

export default function AppReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
