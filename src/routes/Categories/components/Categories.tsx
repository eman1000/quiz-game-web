import React, { Component, Fragment, useEffect } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import Page from "../../../components/Page";
import HorizontalScroll from "../../../components/HorizontalScroll";
import Loader from "../../../components/Loader";
import { Transition } from 'react-transition-group';

//import { Category } from "typings";

import "../../../styles/home.scss";
import { ICategory } from "../../../typings";
import { isAbsolute } from "path";

type ICategoriesProps = {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
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

const Categories: React.FunctionComponent<ICategoriesProps> = (props: ICategoriesProps) => {
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



  return (
    <Page id="homepage" title="Categories">
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
                      <div className={"chest  chest--game"}>
                        <div className={"chest__status"}>
                          <h3>Game Chest</h3>
                          <p>10/20 Left</p>
                        </div>
                        <div className={"chest__loader-wrap"}>
                          <div className={"loading-bg"}>
                            <div className={"loading-bar"} />
                            <span />
                          </div>
                        </div>
                      </div>
                      
                          
                            <div className="chest chest--free">
                              <div className="chest__status">
                                <h3>Free Chest</h3>
                                <div className="chest__loader-wrap">
                                  <span>Open in 12h 20m</span>
                                </div>
                              </div>
                            </div>
                          
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

                    <a href="pick-opponent.html" className="btn btngradient">
                      Quick Play
                    </a>
                  </div>

                  <div className={"footer"}>
                    <a href="competitions.html" className={"footer__item"}>
                      <span className={"footer-icon"}>
                        <svg
                          style={{ width: 24, height: 24 }}
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.2,2H19.5H18C17.1,2 16,3 16,4H8C8,3 6.9,2 6,2H4.5H3.8H2V11C2,12 3,13 4,13H6.2C6.6,15 7.9,16.7 11,17V19.1C8.8,19.3 8,20.4 8,21.7V22H16V21.7C16,20.4 15.2,19.3 13,19.1V17C16.1,16.7 17.4,15 17.8,13H20C21,13 22,12 22,11V2H20.2M4,11V4H6V6V11C5.1,11 4.3,11 4,11M20,11C19.7,11 18.9,11 18,11V6V4H20V11Z" />
                        </svg>
                      </span>
                      <span>Challengies</span>
                    </a>

                    <a href="home.html" className={"footer__item"}>
                      <span className={"footer-icon"}>
                        <svg
                          style={{ width: 24, height: 24 }}
                          viewBox="0 0 24 24"
                        >
                          <path d="M2,13H4V15H6V13H8V15H10V13H12V15H14V10L17,7V1H19L23,3L19,5V7L22,10V22H11V19A2,2 0 0,0 9,17A2,2 0 0,0 7,19V22H2V13M18,10C17.45,10 17,10.54 17,11.2V13H19V11.2C19,10.54 18.55,10 18,10Z" />
                        </svg>
                      </span>
                      <span>Home</span>
                    </a>

                    <a href="/categories" className={"footer__item"}>
                      <span className={"footer-icon"}>
                        <svg
                          style={{ width: 24, height: 24 }}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12.6,2.86C15.27,4.1 18,5.39 20.66,6.63C20.81,6.7 21,6.75 21,6.95C21,7.15 20.81,7.19 20.66,7.26C18,8.5 15.3,9.77 12.62,11C12.21,11.21 11.79,11.21 11.38,11C8.69,9.76 6,8.5 3.32,7.25C3.18,7.19 3,7.14 3,6.94C3,6.76 3.18,6.71 3.31,6.65C6,5.39 8.74,4.1 11.44,2.85C11.73,2.72 12.3,2.73 12.6,2.86M12,21.15C11.8,21.15 11.66,21.07 11.38,20.97C8.69,19.73 6,18.47 3.33,17.22C3.19,17.15 3,17.11 3,16.9C3,16.7 3.19,16.66 3.34,16.59C3.78,16.38 4.23,16.17 4.67,15.96C5.12,15.76 5.56,15.76 6,15.97C7.79,16.8 9.57,17.63 11.35,18.46C11.79,18.67 12.23,18.66 12.67,18.46C14.45,17.62 16.23,16.79 18,15.96C18.44,15.76 18.87,15.75 19.29,15.95C19.77,16.16 20.24,16.39 20.71,16.61C20.78,16.64 20.85,16.68 20.91,16.73C21.04,16.83 21.04,17 20.91,17.08C20.83,17.14 20.74,17.19 20.65,17.23C18,18.5 15.33,19.72 12.66,20.95C12.46,21.05 12.19,21.15 12,21.15M12,16.17C11.9,16.17 11.55,16.07 11.36,16C8.68,14.74 6,13.5 3.34,12.24C3.2,12.18 3,12.13 3,11.93C3,11.72 3.2,11.68 3.35,11.61C3.8,11.39 4.25,11.18 4.7,10.97C5.13,10.78 5.56,10.78 6,11C7.78,11.82 9.58,12.66 11.38,13.5C11.79,13.69 12.21,13.69 12.63,13.5C14.43,12.65 16.23,11.81 18.04,10.97C18.45,10.78 18.87,10.78 19.29,10.97C19.76,11.19 20.24,11.41 20.71,11.63C20.77,11.66 20.84,11.69 20.9,11.74C21.04,11.85 21.04,12 20.89,12.12C20.84,12.16 20.77,12.19 20.71,12.22C18,13.5 15.31,14.75 12.61,16C12.42,16.09 12.08,16.17 12,16.17Z" />
                        </svg>
                      </span>
                      <span>Categories</span>
                    </a>

                    <a href="profile.html" className={"footer__item"}>
                      <span className={"footer-icon"}>
                        <svg
                          style={{ width: 24, height: 24 }}
                          viewBox="0 0 24 24"
                        >
                          <path d="M20,22H4V20C4,17.79 7.58,16 12,16C16.42,16 20,17.79 20,20M8,9H16V10C16,12.19 14.19,14 12,14C9.81,14 8,12.19 8,10M7.5,6C7.5,6 8,5 8.5,4C9,2.95 9.4,2 10.5,2V2C11.1,2 11.64,2.27 12,2.68V2.67C12.37,2.26 12.9,2 13.5,2V2A2,2 0 0,1 15.5,4C16,5 16.5,6 16.5,6H18C18,6 18,5.5 18,5A1,1 0 0,1 19,4A1,1 0 0,1 20,5C20,5.31 20,5.65 20,6A2,2 0 0,1 18,8C14.93,8 9.07,8 6,8A2,2 0 0,1 4,6C4,5.65 4,5.31 4,5A1,1 0 0,1 5,4A1,1 0 0,1 6,5C6,5.5 6,6 6,6" />
                        </svg>
                      </span>
                      <span>Profile</span>
                    </a>
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

export default Categories;
