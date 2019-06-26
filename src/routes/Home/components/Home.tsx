import React, { Component, Fragment } from "react";
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from "../../../components/Page";
import HorizontalScroll from "../../../components/HorizontalScroll"
import Loader from "../../../components/Loader"

//import { Category } from "typings";

import styles from "./Home.module.scss";
import { ICategory } from "../../../typings";


type IHomeProps = {
  id:number;
  name:string;
  description:string;
  thumbnail:string;
}

type GetCategoriesQuery = {
  getCategories:{
    edges:Array<ICategory>
  }
}

export const GET_CATEGORIES = gql(`
  query {
    getCategories(limit: 10) {
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

const HomePage: React.FunctionComponent<IHomeProps>  = (props:IHomeProps)=>{

  // console.log("user888", props)

  return (
    <Page
      id="homepage"
      title="Affiliate App"
    >
        <Query<GetCategoriesQuery, {}> query={GET_CATEGORIES}>
          {({ loading, data, error  }) =>{
          if (loading) return <div>Loading</div>;
          if (error) return <h1>ERROR {error.message}</h1>;
          if (!data) return <div>no data</div>;
          const { getCategories } = data;
          return (
            <div className={styles.listWrapper}>
              {
                (getCategories.edges.length > 0) &&
                <HorizontalScroll
                  title="Categories"
                  data={getCategories.edges}
                />
              }   
            </div>
          )}}
        </Query>
    </Page>
  );
}

export default HomePage;