// The basics
import React, { Component, useEffect, useRef, useState, useContext } from "react";
import { connect, MapStateToProps, MapStateToPropsParam } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { graphql, withApollo, Subscription } from 'react-apollo';
import gql from 'graphql-tag';
import moment from "moment";



// Action creators and helpers
import { authUser } from "./module";
import { isServer } from "../store";

import Header from "../components/Header";
import Routes from "../routes";
import ErrorHandler from "../components/ErrorHandler"
import { GET_PROFILE } from "../components/AuthenticatedRoute";
import MatchNotification from "../components/MatchNotification";
import { IUser } from "../typings";
import Footer from "../components/Footer";

export const MATCH_SUBSCRIPTION = gql(`
  subscription($matchId: ID!){
    matchUpdated(matchId:$matchId){
      match{
        id
        status
        matchUsers{
          userId
          matchId
        }
        results{
          id
          matchId
          questionId
          answerId
          isCorrect
          id
        }
      }
    }
  }
`);

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
    let [user, setUser] = useState<IUser | null>(null)
    let [requestedMatch, setMatchUser] =  useState({})
    let [count, setCount] = useState(0);
    useEffect(()=>{
      props.client.query({
        query:GET_PROFILE,
      }).then((res)=>{
        const { getMe } = res.data;
        setUser(getMe)
      });

      // props.data.subscribeToMore({
      //   document: MATCH_SUBSCRIPTION,
      //   variables: {
      //     userId: user.id
      //   },
      //   updateQuery: (prev, {subscriptionData}) => {
      //     if (!subscriptionData.data) {
      //       return prev;
      //     }
      //     console.log("subscriptionData", subscriptionData)
      //     setMatchUser(subscriptionData.data.matchRequested.match)
      //     return  {
      //       matchRequested: subscriptionData.data.matchRequested.match
      //     }
      //   }
      // });
      if(typeof window != "undefined"){
        
        const freeChestCountDate = window.localStorage.getItem("freeChestCountDate");
        if(freeChestCountDate == null){
          window.localStorage.setItem("freeChestCountDate", moment(Date.now()).add(24, 'hours').toString());
        }
      }
      return ()=>console.log("clear")
    },[])

    
    useInterval(async() => {
      // // Your custom logic here
      // console.log("user", user)
      // let lastSeen = await props.mutate({
      //   variables:{
      //     id:user.id,
      //     date: new Date()
      //   }
      // });
      // setCount(count + 1);
      // console.log("last")
      // console.log(count)
    }, 2000);

    return (
      <div>
        {
          user &&
          //@ts-ignore
          <Header
            isAuthenticated={true}
            current={window.location.pathname}
            user={user}
          />
        }
        <div id="content">
          {
            //@ts-ignore
            requestedMatch.status === "pending" &&
            <MatchNotification/>
          }
          
          <Routes />
          {/* {
            user &&
            <Footer current={window.location.pathname}/>
          } */}
        </div>
      </div>
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