import React, { Component, Fragment } from "react";
import gql from 'graphql-tag';
import { Query, Subscription, graphql } from 'react-apollo';

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
    }
  }
`);
const PlayRoom = (props)=>{

  console.log("frfrfrf", props)
  const { matchId } = props.match.params || "";
  console.log("PR matchid", matchId)
  const { data: {loading, error, getMatch }, match } = props;
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
      <Test testId={getMatch.testId}/>
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
})(PlayRoom));