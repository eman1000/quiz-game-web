import React from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import { Route, Redirect } from "react-router-dom";

const UnauthenticatedRoute = ({ component: Component, ...rest }) => {
  let query = queryString.parse(rest.location.search);

  const isAuthenticated = localStorage.getItem("jwtToken") ? true : false;

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
