import React, { Component, useState } from "react";

import Page from "../../components/Page";
import Loader from "../../components/Loader";
import "./VideosStyles.scss";
import { withRouter } from "react-router-dom";
import MainMenu from "../MainMenu";
import PlayHeader from "../../components/PlayHeader";

const Games = ({}) => {

  return (
    <Page id="video" title="Videos">
      
      <PlayHeader/>
      <div className="content">
        <h1>Videos</h1>
      </div>
    </Page>
  );
};

export default withRouter(Games);
