import React, { Component, Fragment } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import Page from "../../../components/Page";
import HorizontalScroll from "../../../components/HorizontalScroll";
import Loader from "../../../components/Loader";
import "../../../styles/home.scss";

//import { Category } from "typings";

import styles from "./CategoryDetails.module.scss";
import PointsHeader from "../../../components/PointsHeader";
import Banner from "../../../components/Banner";
import ErrorHandler from "../../../components/ErrorHandler";
import {
  BrowserRouter as Router,
  Route,
  Link,
  RouteComponentProps
} from "react-router-dom";

//Common queries
import { GET_CATEGORY } from "../../../queries";

type TParams = {
  id: string;
};

type ICategoryDetails = {
  match: {
    params: {
      id: string;
    };
  };
};

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

const CategoryDetails: React.ComponentType<ICategoryDetails> = props => {
  const { id } = props.match.params || "";

  return (
    <Page id="homepage"  className={"category-wrapper"} title="Affiliate App">
      
     <div className={"modal"}>
     
      <Query query={GET_CATEGORY} variables={{ id }}>
        {({ loading, error, data }) => {
          if (loading) return <Loader></Loader>;
          if (error) return `Error! ${error.message}`;
          const category = data.getCategory || {};
          return (
            <div>
              {
                <div >
       
                    {/* category && */}
                    <Banner
                      title={category.name}
                      description={category.description}
                      bgImage={category.backgroundImageUrl}
                    />                 
                </div>

                
              }
            </div>
          );
        }}
      </Query>
 <div className={"modal-body"}>
      <Query
        query={GET_RANKING}
        variables={{
          categoryId: parseInt(id),
          limit: 2
        }}
      >
        {({ loading, error, data }) => {
           if (loading) return <Loader></Loader>;
          if (error) return <ErrorHandler error={error} />;

          const ranking = data.getScores.edges || {};
          return (
            <div>
          
              
              <ol className={"rankings"}>
              
                {ranking &&
                  ranking.map((rank, index) => {
                    return (
                      <li className={"ranking-list"} key={index}>
                        
                          
                          <img src={rank.user.avatar} className={"ranking-list__img"} />
                         
                          <div className={"ranking-list__name"}>
                          {rank.user.firstName} 
                          </div>
                          <div className={"ranking-list__points"}>
                          {rank.score}
                          </div>
                        

             
                      </li>
                    );
                  })}
              </ol>
              <Link className={"btn btngradient"} to={`/pick-opponent/${id}`}>
          Play Now
        </Link>
            
              
            </div>
            
          );
        }}
      </Query>
      </div>
    </div>
    </Page>
  );
};

export default CategoryDetails;
