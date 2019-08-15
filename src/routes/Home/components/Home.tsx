import React, { Component, Fragment, useEffect } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import Page from "../../../components/Page";
import HorizontalScroll from "../../../components/HorizontalScroll";
import Loader from "../../../components/Loader";
import { Transition } from 'react-transition-group';

//import { Category } from "typings";

import "../../../styles/home.scss";
import { ICategory, IUser } from "../../../typings";
import { isAbsolute } from "path";

type IHomeProps = {
  user:IUser
};

type GetCategoriesQuery = {
  getCategories: {
    edges: Array<ICategory>;
  };
};

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
}

export const GET_CATEGORIES = gql(`
  query {
    getCategories(limit: 10) {
      edges {
        id
        name
        thumbnail
        catKey
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

const HomePage: React.FunctionComponent<IHomeProps> = (props: IHomeProps) => {
  // console.log("user888", props)

  useEffect(()=>{
    setTimeout(()=>{
      setInProp(true)
    }, 1000)
  },[])

  const duration = 1000;

  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    // opacity: 0,
    position: "absolute",
    left: -9999,
  }
  
  const transitionStyles = {
    entering: { left: 0 },
    entered:  { right: 0 },
    exiting:  { opacity: 0 },
    exited:  { opacity: 0 },
  };
  const [inProp, setInProp] = React.useState(false);

  const { id, avatar, coins, gems } = props.user;
  console.log(props)
  return (
    <Page id="homepage" title="Affiliate App">
      <Query<GetCategoriesQuery, {}> query={GET_CATEGORIES}>
        {({ loading, data, error }) => {
          if (loading) return <div>Loading</div>;
          if (error) return <h1>ERROR {error.message}</h1>;
          if (!data) return <div>no data</div>;
          const { getCategories } = data;
          return (
            <div className="listWrapper">
              {getCategories.edges.length > 0 && (
                <div>
                  <div className={"main"}>
                    <div className={"chest-container bounceIn"}>
                      <Link to="/free-chest" className={"chest  chest--game"}>
                        <div className={"chest__status"}>
                          <h3>Game Chest</h3>
                          
                        </div>
                        <div className={"chest__loader-wrap"}>
                          <div className={"loading-bg"}>
                            <div className={"loading-bar"} />
                            <span />
                          </div>
                        </div>
                      </Link>
                      
                          
                            <Link to="/free-chest" className="chest chest--free">
                              <div className="chest__status">
                                <h3>Free Chest</h3>
                                <div className="chest__loader-wrap">
                                  <span>Open in 12h 20m</span>
                                </div>
                              </div>
                            </Link>
                          
                    </div>

                    <div className={"categories-container"}>

                    

                    <div className={"categoriies-header"}>
                      <h2>Category</h2>
                      <a href="category.html" className={"view-all"}>
                        View All
                      </a>
                    </div>

                    <HorizontalScroll
                      // title="uhyuhyhh"
                      data={getCategories.edges}
                    />

                    </div>

                    <Link to="/pick-opponent/1" className="btn btngradient">
                      Quick Play
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        }}
      </Query>
    </Page>
  );
};

export default HomePage;
