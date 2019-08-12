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
    <Page id="homepage" title="Affiliate App">
      <Query query={GET_CATEGORY} variables={{ id }}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          const category = data.getCategory || {};
          return (
            <div>
              {
                <div>
                 <div className={"header"}>
                    <div className={"profile"}>

                      <div className={"profile__user"}>
                        <img src="" className={"user__img"} />
                        <div className={"profile-points"}>
                        <div className={"profile-points-title"}>Your total points</div>
                        <div className={"profile-points-qty"}>24,800</div>
                        </div>
                      </div>
                      <div className={"profile-gains"}>
                      <div className={"profile__coins"}>12</div>
                      <div className={"profile__germs"}>12</div>
                      </div>
                    </div>
                  </div>

                  <div className={"main"}>
                    category &&
                    <Banner
                      title={category.name}
                      description={category.description}
                      bgImage={category.backgroundImageUrl}
                    />
                  </div>
                </div>
              }
            </div>
          );
        }}
      </Query>
      <div className={"footer no-bg"}>
        <Link className={"btn btngradient"} to={`/pick-opponent/${id}`}>
          Play Now
        </Link>
      </div>
      <Query
        query={GET_RANKING}
        variables={{
          categoryId: parseInt(id),
          limit: 2
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return <ErrorHandler error={error} />;

          const ranking = data.getScores.edges || {};
          return (
            <div className={styles.listWrapper}>
              <h3>Rankings</h3>
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
            </div>
          );
        }}
      </Query>
    </Page>
  );
};

export default CategoryDetails;
