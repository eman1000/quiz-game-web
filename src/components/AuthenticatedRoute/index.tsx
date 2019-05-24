import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { Query, graphql } from "react-apollo";
import gql from "graphql-tag";
import UserDetailsContext from "../Context/UserDetailsContext";


export const GET_PROFILE = gql(`
  query {
    getMe{
      id
      username
      firstName
      lastName
      gender
      age
      email
      role
      facebookId
      avatar
    }
  }
`);

const AuthenticatedRoute = ({ component: Component, ...rest }) => {
  const {loading, error, getMe } = rest.data;
  console.log("rest.data", rest.data)
  const { setUserDetails } = React.useContext(UserDetailsContext)

  useEffect(()=>{
    if(getMe){
      setUserDetails(getMe)
    }
    return ()=>console.log("clear")
  },[])
  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>{error.message}</p>
  }

  const isAuthenticated = (getMe.id !== undefined) ? true : false;

  return(
    <Route
      {...rest}
      render={props =>(
        <div>
          {
            isAuthenticated && 
            <Component {...props} user={getMe}  />
          ||
          <Redirect to={`/login?redirect=${window.location.pathname}`} />
          }
        </div>
      )}
    />
  )
};

export default (graphql(GET_PROFILE, {
  //@ts-ignore
})(AuthenticatedRoute));
