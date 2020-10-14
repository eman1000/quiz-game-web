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

type IChallengesProps = {
};




const Challenges: React.FunctionComponent<IChallengesProps> = (props: IChallengesProps) => {

  return (
    <Page id="homepage" title="Challenges App">
      <h1>Challenges</h1>
    </Page>
  );
};

export default Challenges;
