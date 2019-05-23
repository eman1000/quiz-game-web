import React, { Component, Fragment, useState } from "react";
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { withApollo } from 'react-apollo';

import Page from "../../../components/Page";

//import { Category } from "typings";

import styles from "./Home.module.scss";
import ErrorHandler from "../../../components/ErrorHandler";
import PlayButtons from "./PlayButtons";
import { userInfo } from "os";
import CreateMatch from "./CreateMatch";


export const GET_RANDOM_PLAYER = gql(`
  query{
    getRandomUserByLastSeen{
      id
      username
      firstName
    }
  }
`);



const PlayRoom = (props)=>{

  const [isFindPlayer, setFindPlayer] = useState(false)
  console.log("user888", props)
  const { categoryId } = props.match.params || "";


  return (
    <Page
      id="homepage"
      title="Quiz App"
    >
      <PlayButtons setFindPlayer={setFindPlayer}/>
      {
        isFindPlayer &&    
        <Query
            query={GET_RANDOM_PLAYER}
          >
          {({ loading, error, data }) =>{
          if (loading) return "Loading...";
          if (error){     
            return <ErrorHandler error={error}/>;
          } 
           
            const player2  = data.getRandomUserByLastSeen || {};
            console.log("player2", player2)
            
            return(
              <CreateMatch
                categoryId={categoryId}
                playerOneId={props.user.id}
                playerTwoId={player2.id}
              />
            )
          }}
        </Query>
      }
    </Page>
  );
}

export default withApollo(PlayRoom);