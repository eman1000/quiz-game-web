import React, { Component, useState } from "react";
import Page from "../../components/Page";
import Loader from "../../components/Loader";
import "./PlayGameStyles.scss";
import { withRouter } from "react-router-dom";
import logoImg from "../../assets/logo.svg";
import i2048Img from "../../assets/games/2048.jpg"

import MainMenu from "../MainMenu";
import Iframe from 'react-iframe'
import PlayHeader from "../../components/PlayHeader";

const PlayGame = (props) => {

  const games = [{
    title:"2048",
    image:"",
    link:""
  }]
  const { gamename } = props.match.params

  return (
    <Page id="games" title="Games" className="ngames">
      <PlayHeader/>
      <Iframe
      className="nframe"
        width="100%"
        height="100%" 
        url={process.env.PUBLIC_URL + `/games/${gamename}/index.html`}
      />
    </Page>
  );
};

export default withRouter(PlayGame);
