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

type IGameChestProps = {
};




const HomePage: React.FunctionComponent<IGameChestProps> = (props: IGameChestProps) => {

  return (
    <Page id="homepage" title="Affiliate App">
      <h1>Game Chest</h1>
    </Page>
  );
};

export default HomePage;
