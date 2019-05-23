// The basics
import React, { Component, useEffect, useRef, useState, useContext } from "react";
import { connect, MapStateToProps, MapStateToPropsParam } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';




// Action creators and helpers
import { authUser } from "./module";
import { isServer } from "../store";

import Header from "../components/Header";
import Routes from "../routes";
import UserDetailsProvider from '../components/Context/UserDetailsProvider'
import UserDetailsContext from '../components/Context/UserDetailsContext'
import ErrorHandler from "../components/ErrorHandler"


function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      //@ts-ignore
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
export const App = (props)=>{
  console.log("props", props)
    const user = useContext(UserDetailsContext);
    let [count, setCount] = useState(0);

    useInterval(async() => {
      // Your custom logic here
      console.log("user", user)
      let lastSeen = await props.mutate({
        variables:{
          id:1,
          date: new Date()
        }
      });
      setCount(count + 1);
      console.log("last")
      console.log(count)
    }, 10000);
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

export const UPDATE_LAST_SEEN = gql`
  mutation updateUser($id: ID !, $date: Date){
    updateUser(id:$id, lastSeen:$date){
      lastSeen
    }
  }
`;
//export default withRouter(App);
export default (graphql(UPDATE_LAST_SEEN, {})(withRouter(App)));