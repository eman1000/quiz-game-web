import React, { Component, Fragment, useEffect } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import Page from "../../../components/Page";
import HorizontalScroll from "../../../components/HorizontalScroll";
import Loader from "../../../components/Loader";
import { Transition } from "react-transition-group";

//import { Category } from "typings";

import "../../../styles/home.scss";
import { ICategory } from "../../../typings";
import { isAbsolute } from "path";

type IFreeChestProps = {};

const HomePage: React.FunctionComponent<IFreeChestProps> = (
  props: IFreeChestProps
) => {
  return (
    <Page id="homepage" title="Profile App">
      <div className="modal-wrapper">
        <div className="modal">
          <div className={"modal-header"}>
            <h1>Profile</h1>
          </div>
          <div className={"modal-body"}>
            <div className="profile-details">
              <div className={"profile-img"} />
              <div className={"profile-details-name"}>
                Kuda
              </div>
            </div>

            <div className={"profile-stats"}>
              <div className={"profile-stat"}>
                <div className={"profile-stat-label"}>Points Earned: </div>
                <div className={"profile-stat-item"}>2000</div>
              </div>

              <div className={"profile-stat"}>
                <div className={"profile-stat-label"}>Coins Earned: </div>
                <div className={"profile-stat-item"}>2000</div>
              </div>

              <div className={"profile-stat"}>
                <div className={"profile-stat-label"}>Gems Earned: </div>
                <div className={"profile-stat-item"}>2000</div>
              </div>

              <div className={"profile-stat"}>
                <div className={"profile-stat-label"}>Points Earned: </div>
                <div className={"profile-stat-item"}>2000</div>
              </div>
              <div className={"profile-stat"}>
                <div className={"profile-stat-label"}>Games Played: </div>
                <div className={"profile-stat-item"}>2000</div>
              </div>

              <div className={"profile-stat"}>
                <div className={"profile-stat-label"}>Total Wins: </div>
                <div className={"profile-stat-item"}>2000</div>
              </div>

              <div className={"profile-stat"}>
                <div className={"profile-stat-label"}>Total Loss: </div>
                <div className={"profile-stat-item"}>2000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default HomePage;
