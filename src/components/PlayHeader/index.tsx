import React from "react";
import "./PlayHeaderStyles.scss";
import logoImg from "../../assets/logo.svg";
import { Link } from "react-router-dom";

const PlayHeader = ()=>{
  return(
    <Link to="/" className="nheader">
    <div className="nlogo">
      <img src={logoImg}/>
    </div>
  </Link>
  )
}


export default PlayHeader;