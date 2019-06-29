import React, { Component, Fragment, useState } from "react";
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { withApollo, graphql } from 'react-apollo';

import Page from "../../../components/Page";

//import { Category } from "typings";

import styles from "./Home.module.scss";
import ErrorHandler from "../../../components/ErrorHandler";
import PlayButtons from "./PlayButtons";
import { userInfo } from "os";
import CreateMatch from "./CreateMatch";

//Common queries
import { GET_CATEGORY, GetCategoryQuery, GetCategoryVariables, IGetCategotyProps } from "../../../queries";
import { IUser } from "../../../typings";


type GetRandomPlayerQuery = {
  getRandomUserByLastSeen:{
    opponent:IUser
  }
}

type GetRandomPlayerVariables = {
  userId:number;
}
export const GET_RANDOM_PLAYER = gql(`
  query($userId:ID!){
    getRandomUserByLastSeen(userId:$userId){
    opponent{
      id
      username
      firstName
      avatar
      }
    }
  }
`);



const PickOpponent = (props)=>{

  const [isFindPlayer, setFindPlayer] = useState(false);
  const [isSinglePlayer, setSinglePlayer] = useState(false)
  const { data: {loading, error, getCategory }, match, user } = props;
  const { categoryId } = match.params || "";
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
      <PlayButtons setFindPlayer={setFindPlayer} setSinglePlayer={setSinglePlayer}/>
      {
        isFindPlayer &&    
        <Query<GetRandomPlayerQuery, GetRandomPlayerVariables>
            query={GET_RANDOM_PLAYER}
            variables={{
              userId:props.user.id
            }}
          >
          {({ loading, error, data }) =>{
          if (loading) return "Loading...";
          if (error) return <h1>ERROR</h1>;
          if (!data) return <div>no data</div>;

            const player2  = data.getRandomUserByLastSeen.opponent || {};
            return(
              <CreateMatch
                playerOne={props.user}
                playerTwo={player2}
                category={getCategory}
              />
            )
          }}
        </Query>
      }
      {
        isSinglePlayer &&
        <CreateMatch
          category={getCategory}
          playerOne={props.user}
          playerTwo={null}
        />
      }
    </Page>
  );
}

//export default withApollo(PlayRoom);

export default (graphql<IGetCategotyProps, GetCategoryVariables, {}>(GET_CATEGORY, {
  options: (props) => ({
    variables: { id: props.match.params.categoryId },
  }),

  //@ts-ignore
})(withApollo(PickOpponent)));