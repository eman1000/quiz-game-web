import React from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import { Route, Redirect } from "react-router-dom";
import UserDetailsContext from "../Context/UserDetailsContext";

const UnauthenticatedRoute = ({ component: Component, ...rest }) => {
  let query = queryString.parse(rest.location.search);
  const user = React.useContext(UserDetailsContext);
  console.log("AYYY", user)
  const isAuthenticated = (user.id !== undefined) ? true : false;

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
