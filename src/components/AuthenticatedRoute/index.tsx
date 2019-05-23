import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { Query } from "react-apollo";
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
  const { setUserDetails } = React.useContext(UserDetailsContext)
  return(
    <Route
      {...rest}
      render={props =>
        <Query query={GET_PROFILE}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          const isAuthenticated = (data.getMe.id !== undefined) ? true : false;
          if(isAuthenticated){
            //setUserDetails({...data.getMe})
          }
          
          return(<div>
            {
              isAuthenticated && 
              <Component {...props} user={data.getMe}  />
            ||
            <Redirect to={`/login?redirect=${window.location.pathname}`} />
            }
          </div>)
          }}
        </Query>
      }
    />
  )
};

const mapStateToProps = state => ({
  isAuthenticated: state.app.isAuthenticated
});

export default connect(
  mapStateToProps,
  null
)(AuthenticatedRoute);
