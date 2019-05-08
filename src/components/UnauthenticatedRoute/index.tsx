import React from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import { Route, Redirect } from "react-router-dom";

const UnauthenticatedRoute = ({ component: Component, ...rest }) => {
  let query = queryString.parse(rest.location.search);

  return (
    <Route
      {...rest}
      render={props =>
        !rest.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={/** uery.redirect || **/ "/dashboard"} />
        )
      }
    />
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.login.isAuthenticated
});

export default connect(
  mapStateToProps,
  null
)(UnauthenticatedRoute);
