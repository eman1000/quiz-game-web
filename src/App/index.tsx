// The basics
import React, { Component } from "react";
import { connect, MapStateToProps, MapStateToPropsParam } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { Query } from 'react-apollo';

import gql from 'graphql-tag';



// Action creators and helpers
import { authUser } from "./module";
import { isServer } from "../store";

import Header from "../components/Header";
import Routes from "../routes";
import UserDetailsProvider from '../components/Context/UserDetailsProvider'
import UserDetailsContext from '../components/Context/UserDetailsContext'
import ErrorHandler from "../components/ErrorHandler"


export const App = (props)=>{

    const user = React.useContext(UserDetailsContext);
    console.log("userff", user)
    return (
      <UserDetailsProvider>
          <Header
            isAuthenticated={true}
            current={window.location.pathname}
            authenticatedUser={user}
          />
        <div id="content">
          <Routes />
        </div>
      </UserDetailsProvider>
    );
  }
export default withRouter(App);
