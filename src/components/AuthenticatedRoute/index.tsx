import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { Query, graphql } from "react-apollo";
import gql from "graphql-tag";
import Loader from "../../components/Loader";


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
      avatar,
      coins,
      gems
    }
  }
`);

const AuthenticatedRoute = ({ component: Component, ...rest }) => {
  const {loading, error, getMe } = rest.data;

  useEffect(()=>{
    return ()=>console.log("clear")
  },[])
  if (loading) {
    return <Loader/>
  }
  if (error) {
    return <p>{error.message}</p>
  }

  const isAuthenticated = localStorage.getItem("jwtToken") ? true : false;

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
