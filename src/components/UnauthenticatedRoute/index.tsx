import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import { Route, Redirect } from "react-router-dom";

const UnauthenticatedRoute = ({ component: Component, ...rest }) => {
  let query = queryString.parse(rest.location.search);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  //@ts-ignore
  let authUser = JSON.parse(localStorage.getItem("authUser"));

  let authenticated = authUser ? authUser.hasOwnProperty("id") : false; 
  return (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={query.redirect as string || "/"} />
        )
      }
    />
  );
};


export default UnauthenticatedRoute;
