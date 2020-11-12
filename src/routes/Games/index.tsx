import React, { Component, useState } from "react";
import Page from "../../components/Page";
import Loader from "../../components/Loader";
import "./GamesStyles.scss";
import { Link, withRouter } from "react-router-dom";
import logoImg from "../../assets/logo.svg";
import i2048Img from "../../assets/games/2048.jpg"
import HexGL from "../../assets/games/HexGL.jpg"
import Chess from "../../assets/games/chess.png"


import MainMenu from "../MainMenu";
import PlayHeader from "../../components/PlayHeader";

const Games = ({}) => {

  const games = [{
    title:"2048",
    image:i2048Img,
    indentifer:"2048"
  },{
    title:"Futuristic racing game",
    image:HexGL,
    indentifer:"hexgl"
  },{
    title:"Chess",
    image:Chess,
    indentifer:"chess"
  }]
  return (
    <Page id="games" title="Games">
      <PlayHeader/>
      <div className="ncontent">
        
        <h1>Games</h1>

        <div className="nlist">
          {
            games.map((obj, index)=>{
              return <Link key={index} to={`/play-game/${obj.indentifer}`} className="nitem">
                <div style={{backgroundImage:`url(${obj.image})`}}/>
                <h2>{obj.title}</h2>
              </Link>
            })
          }
        </div>
      </div>
    </Page>
  );
};

export default withRouter(Games);
