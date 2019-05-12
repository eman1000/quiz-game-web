import React, { Component, Fragment } from "react";
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from "../../../components/Page";
import HorizontalScroll from "../../../components/HorizontalScroll"
import Loader from "../../../components/Loader"

//import { Category } from "typings";

import styles from "./Home.module.scss";


type Category = {
  id:number;
  name:string;
  description:string;
  thumbnail:string;
}
export const GET_CATEGORIES = gql(`
  query {
    getCategories(limit: 4) {
      edges {
        id
        name
        thumbnail
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

const HomePage = (props)=>{

  console.log("user888", props)
 
  return (
    <Page
      id="homepage"
      title="Affiliate App"
    >
        <Query query={GET_CATEGORIES}>
          {({ loading, data }) => !loading && (
            <div className={styles.listWrapper}>
              {
                (data.getCategories.edges.length > 0) &&
                <HorizontalScroll
                  title="Categories"
                  data={data.getCategories.edges}
                />
              }   
            </div>
          )}
        </Query>
    </Page>
  );
}

export default HomePage;