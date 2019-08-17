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
    <Page className={"game-chest"} title="Game chest">
    <div className={"modal reward-bg"}>
     <div className={"modal-header"}>
       <h1>New Chest Unlocked</h1>
     </div>
     <div className={"modal-body"}>

   <div className={"chest-reward-container"}>

   </div>

   <div className={"chest-rewards"}>
     <div className={"chest-reward gems"}>
       <h1>4</h1>
       <span>Coins Awarded</span>
     </div>
     <div className={"chest-reward coins"}>
       <h1>12</h1>
       <span>Germs Awarded</span>
     </div>
   </div>

   <button className={"btn "}>Continue</button>

     </div>
   </div>
 </Page>
  );
};

export default HomePage;
