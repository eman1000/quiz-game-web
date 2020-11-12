import React from "react";

import { Component } from "react";
//import { logoutUser } from "../Login/module";
import "./MainMenu.scss";
import quizImg from "../../assets/quiz.jpg"
import gameImg from "../../assets/game.jpg"
import vidImg from "../../assets/vid.jpg"
import { Link } from "react-router-dom";


class MainMenu extends Component<any>{



  render() {
    
    return <div className="main-menu">

      <button onClick={()=>this.props.closeMenu(false)}>x Close Menu</button>
      <h1>SELECT YOUR FUN </h1>

      <div className="main-menu-options">
        <Link to="/" onClick={(e)=>{
          if(window.location.pathname == "/login")
          e.preventDefault();this.props.closeMenu(false)
        }} className="item">
          <h2>Quiz</h2>
          <div className="item-box" style={{backgroundImage:`url(${quizImg})`}}></div>
        </Link>
        <Link to="/games" className="item">
          <h2>HTML 5 Games</h2>
          <div className="item-box" style={{backgroundImage:`url(${gameImg})`}}></div>
        </Link>
        <Link to="/videos" className="item">
          <h2>Videos</h2>
          <div className="item-box" style={{backgroundImage:`url(${vidImg})`}}></div>

        </Link>
      </div>
    </div>
  }
}


export default MainMenu
