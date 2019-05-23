import React, { Component, Fragment } from "react";
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from "../../../components/Page";
import HorizontalScroll from "../../../components/HorizontalScroll"
import Loader from "../../../components/Loader"

//import { Category } from "typings";

import styles from "./CategoryDetails.module.scss";
import PointsHeader from "../../../components/PointsHeader";
import Banner from "../../../components/Banner";
import ErrorHandler from "../../../components/ErrorHandler";
import { Link } from "react-router-dom";


type Category = {
  id:number;
  name:string;
  description:string;
  thumbnail:string;
}
export const GET_CATEGORY = gql(`
  query ($id:ID!){
    getCategory(id: $id) {
      id
      name
      thumbnail
      description
      backgroundImageUrl
    }
  }
`);

export const GET_RANKING = gql(`
  query ($limit:Int!, $categoryId:Int!){
    getScores(limit: $limit, categoryId:$categoryId) {
      edges {
        id
        userId
        categoryId
        score
        user{
          firstName
        },
        category{
          id
          name
          thumbnail
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

const CategoryDetails = (props)=>{
  const { id } = props.match.params || "";
  console.log("prps", props)
  return (
    <Page
      id="homepage"
      title="Affiliate App"
    >
        <Query
          query={GET_CATEGORY}
          variables={{id}}
        >
          {({ loading, error, data }) =>{
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
            const category  = data.getCategory || {};
            return(
              <div className={styles.listWrapper}>
                {
                  category &&
                  <Banner
                    title={category.name}
                    description={category.description}
                    bgImage={category.backgroundImageUrl}
                  />
                }
              </div>
            )
          }}
        </Query>
        <Link to={`/pick-opponent/${id}`}>Play Now</Link>
        <Query
          query={GET_RANKING}
          variables={{
            categoryId:parseInt(id),
            limit: 2
          }}
        >
          {({ loading, error, data }) =>{
          if (loading) return "Loading...";
          if (error) return <ErrorHandler error={error}/>;
          
            const ranking  = data.getScores.edges || {};
            return(
              <div className={styles.listWrapper}>
              <h2>Rankings</h2>
              <ol>
                {
                  ranking &&
                  ranking.map((rank, index)=>{
                    return(
                        <li key={index}>
                          <img src={rank.user.avatar} className={styles.avatar}/>
                          <span>{rank.user.firstName} </span>
                          <span>{rank.score}</span>
                        </li>
                      
                    )
                  })
               
                }
              </ol>
              </div>
            )
          }}
        </Query>
    </Page>
  );
}

export default CategoryDetails;