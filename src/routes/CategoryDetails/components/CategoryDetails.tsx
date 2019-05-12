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
    }
  }
`);

const CategoryDetails = (props)=>{
  const { id } = props.match.params || "";

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
                  <Banner title={category.name} description={category.description}/>
                }
              </div>
            )
          }}
        </Query>
    </Page>
  );
}

export default CategoryDetails;