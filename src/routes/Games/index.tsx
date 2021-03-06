import React, { Component, useState } from "react";
import Page from "../../components/Page";
import Loader from "../../components/Loader";
import "./GamesStyles.scss";
import { Link, withRouter } from "react-router-dom";
import logoImg from "../../assets/logo.svg";
import i2048Img from "../../assets/games/2048.jpg"
import HexGL from "../../assets/games/HexGL.jpg"
import Chess from "../../assets/games/chess.png"
import astrayImg from "../../assets/games/astray.jpg"
import i3dCarRacer from "../../assets/games/3dracer.jpg"
import duckhuntImg from "../../assets/games/duckhunt.jpg"




import MainMenu from "../MainMenu";
import PlayHeader from "../../components/PlayHeader";

const Games = ({}) => {

  const games = [{
    title:"2048",
    image:i2048Img,
    indentifer:"2048",
    platform:"Moble & Desktop"
  },{
    title:"Futuristic racing game",
    image:HexGL,
    indentifer:"hexgl",
    platform:"Desktop"
  },{
    title:"Chess",
    image:Chess,
    indentifer:"chess",
    platform:"Desktop"
  },{
    title:"Astray Maze game",
    image:astrayImg,
    indentifer:"astray",
    platform:"Desktop"
  },{
    title:"3D Car Racer game",
    image:i3dCarRacer,
    indentifer:"3dracer",
    platform:"Desktop"
  },{
    title:"Duck Hunt",
    image:duckhuntImg,
    indentifer:"duckhunt",
    platform:"Desktop"
  }]


  return (
    <Page id="games" title="Games">
      <PlayHeader/>
      <div className="ncontent">
        
        <h1>Games</h1>
        <p>(*NOTE Optimised for desktop)</p>

        <div className="nlist">
          {
            games.map((obj, index)=>{
              return <Link key={index} to={`/play-game/${obj.indentifer}`} className="nitem">
                <div style={{backgroundImage:`url(${obj.image})`}}/>
                <h2>{obj.title}</h2>
                <p>{obj.platform}</p>
              </Link>
            })
          }
        </div>
      </div>
    </Page>
  );
};

export default withRouter(Games);
