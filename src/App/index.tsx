// The basics
import React, { Component, useEffect, useRef, useState, useContext } from "react";
import { connect, MapStateToProps, MapStateToPropsParam } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';




// Action creators and helpers
import { authUser } from "./module";
import { isServer } from "../store";

import Header from "../components/Header";
import Routes from "../routes";
import UserDetailsProvider from '../components/Context/UserDetailsProvider'
import UserDetailsContext from '../components/Context/UserDetailsContext'
import ErrorHandler from "../components/ErrorHandler"
import { GET_PROFILE } from "../components/AuthenticatedRoute";


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
    const userO = useContext(UserDetailsContext);
    const { setUserDetails } = React.useContext(UserDetailsContext)
    let [user, setUser] = useState(userO)
    let [count, setCount] = useState(0);
    useEffect(()=>{
      props.client.query({
        query:GET_PROFILE,
      }).then((res)=>{
        const { getMe } = res.data;
        setUser(getMe)
        setUserDetails(getMe);
      })
      return ()=>console.log("clear")
    },[])
    useInterval(async() => {
      // Your custom logic here
      console.log("user", user)
      let lastSeen = await props.mutate({
        variables:{
          id:user.id,
          date: new Date()
        }
      });
      setCount(count + 1);
      console.log("last")
      console.log(count)
    }, 2000);
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
export default (graphql(UPDATE_LAST_SEEN, {})(withRouter(withApollo(App))));