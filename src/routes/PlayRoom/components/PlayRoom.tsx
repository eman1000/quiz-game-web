import React, { Component, Fragment, useEffect, useState } from "react";
import gql from 'graphql-tag';
import { Query, Subscription, graphql, withApollo } from 'react-apollo';

import Page from "../../../components/Page";
import HorizontalScroll from "../../../components/HorizontalScroll"
import Loader from "../../../components/Loader"

//import { Category } from "typings";

import styles from "./Home.module.scss";
import ErrorHandler from "../../../components/ErrorHandler";
import Test from "./Test";


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

export const GET_MATCH = gql(`
  query($matchId: ID!){
    getMatch(matchId:$matchId){
      id
      status
      testId
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
`);

export const GET_OPPONENT = gql(`
  query($userId: ID!){
    getOpponent(userId:$userId){
      opponent{
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
        lastSeen
      }
    }
  }
`);
const PlayRoom = (props)=>{

  console.log("frfrfrf", props)
  const { matchId } = props.match.params || "";
  console.log("PR matchid", matchId)
  const { data: {loading, error, getMatch }, match, user } = props;
  const [opponent, setOpponent] = useState({})
  console.log("getMatch", getMatch)
  useEffect(()=>{
    props.data.subscribeToMore({
      document: MATCH_SUBSCRIPTION,
      variables: {
        matchId: props.match.params.matchId
      },
      updateQuery: (prev, {subscriptionData}) => {
        console.log("PREV", prev)
        if (!subscriptionData.data) {
          return prev;
        }
        console.log("subscriptionData", subscriptionData)
        return  {
          getMatch: subscriptionData.data.matchUpdated.match
        }
      }
    });
    return ()=>console.log("clear")
  },[]);

  useEffect(()=>{
    if(getMatch && getMatch.hasOwnProperty("matchUsers")){
      //gotOp = true;
      const opponent = getMatch.matchUsers && getMatch.matchUsers.find((o)=>o.userId !== user.id) || null;

      if(opponent){
        props.client.query({
          query:GET_OPPONENT,
          variables:{
            userId:opponent.userId
          }
        }).then((res)=>{
          setOpponent(res.data.getOpponent.opponent);
          console.log("res", res)
        })
      }
    }
    return ()=>console.log("clear")
  })
  if (loading) {
    return "Loading...";
  }
  if (error) {
    return <p>{error.message}</p>;
  }



  return (
    <Page
      id="homepage"
      title="Quiz App"
    >

      <h1>Play Room</h1>
      {
        getMatch.hasOwnProperty("testId") &&
        <Test
          testId={getMatch.testId}
          matchObj={getMatch}
          matchId={matchId}
          user={user}
          opponent={opponent}
          {...props}
        />
      }

        {/* <Subscription
          subscription={MATCH_SUBSCRIPTION}
          variables={{
            matchId:parseInt(matchId)
          }}
        >
          {({ loading, error, data }) =>{
          if (loading) return "Loading...";
          if (error) return <ErrorHandler error={error}/>;
          
            const match  = data.matchUpdated.match || {};
            console.log("MATCH", match)
            return(
              <div>
                <h2>Match</h2>
              </div>
            )
          }}
        </Subscription> */}
    </Page>
  );
}

export default (graphql(GET_MATCH, {
  options: (props) => ({
    //@ts-ignore
    variables: { matchId: props.match.params.matchId },
  }),

  //@ts-ignore
})(withApollo(PlayRoom)));