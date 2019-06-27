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
import { IUser, IMatch } from "../../../typings";

export type IPlayRoomProps = {
  match:{
    params:{
      matchId:number;
    }
  },
  user:IUser;
  data:any;
  client:any
}
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
      test{
        id
        name
        categoryId
        pointsPerAnswer
         testQuestions{
          id
          questionId
          question{
            id
            description
            imageUrl
            categoryId
            answers{
              id
              description
              imageUrl
              isCorrect
            }
          }
        }
      }
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
const PlayRoom = (props: IPlayRoomProps)=>{
  const { data: {loading, error, getMatch }, match, user } = props;
  const { matchId } = match.params || "";
  const [opponent, setOpponent] = useState<IUser | undefined>(undefined);
  const [showComplete, setShowComplete] = useState(false);
  const handleComplete = (matchData)=>{
    //Correct answer = 100pts
    //100pts = 1 coins
    //1 Gem = 20 Coins

    //Levels
    // < 2500 Begginer 
    //> 2500 < 3500 MidLevel Guru
    //> 3500 Guru

    setShowComplete(true);
  }
  const handleMatch = (matchData:IMatch)=>{
    switch (matchData.status) {
      case "pending":
        break;
      case "canceled":
          break;
      case "complete":
        handleComplete(matchData);
        break;
    }
  }
  useEffect(()=>{
    props.data.subscribeToMore({
      document: MATCH_SUBSCRIPTION,
      variables: {
        matchId: props.match.params.matchId
      },
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) {
          return prev;
        }
        const matchData = subscriptionData.data.matchUpdated.match;
        handleMatch(matchData);
        return  {
          getMatch: matchData
        }
      }
    });
    return ()=>console.log("clear")
  },[]);

  useEffect(()=>{
    if(getMatch && getMatch.hasOwnProperty("matchUsers")){
      const opponent = getMatch.matchUsers && getMatch.matchUsers.find((o)=>o.userId !== user.id) || null;
      if(opponent){
        props.client.query({
          query:GET_OPPONENT,
          variables:{
            userId:opponent.userId
          }
        }).then((res)=>{
          setOpponent(res.data.getOpponent.opponent);
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
      image="http://www.soidergi.com/wp-content/uploads/cu/cute-beard-afro-smiling-black-guy-face-avatar-vector.jpg"
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

    </Page>
  );
}

//export default PlayRoom;
export default (graphql(GET_MATCH, {
  options: (props) => ({
    //@ts-ignore
    variables: { matchId: props.match.params.matchId },
  }),

  //@ts-ignore
})(withApollo(PlayRoom)));