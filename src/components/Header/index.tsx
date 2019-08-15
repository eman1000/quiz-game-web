import React from "react";
import { withRouter } from "react-router-dom";
import {RouteComponentProps} from "react-router";
import "./Header.scss";
import { IUser } from "../../typings";


interface IHeaderLinkProps {
  to: string,
  text: string,
  isButton: boolean,
  current: string
}

type IHeaderProps = RouteComponentProps & {
  isAuthenticated: boolean;
  user:IUser;
  current:string;
};


const Header = (props:IHeaderProps)=>{
  
  const {avatar, coins, gems} = props.user;

  console.log("Current", props.current)
  const pages = {
    "/":{
      name:"Home",
      hasBack:false
    },
    "category-details":{
      name:"Category Details",
      hasBack:false
    },
    "categories":{
      name:"Categories",
      hasBack:false
    },
    "game-chest":{
      name:"Game Chest",
      hasBack:false
    },
    "free-chest":{
      name:"Free Chest",
      hasBack:false
    },
    "profile":{
      name:"Profile",
      hasBack:false
    },
    "play-room":{
      name:"Play Room",
      hasBack:false
    },
    "pick-opponent":{
      name:"Pick Opponent",
      hasBack:true
    },
    "challeges":{
      name:"Challenges Opponent",
      hasBack:true
    }
  };
  const path = props.current.split("/")[1];
  console.log("context", path)
  return (
    <div className={"header"}>
      { (props.current === "/" || (pages[path] && !pages[path].hasBack)) &&
        <div className={"profile"}>
          <div className={"profile__user"}>
            <img src={avatar} className={"user__img"} />
            <div className={"profile-points"}>
            <div className={"profile-points-title"}>Your total points</div>
            <div className={"profile-points-qty"}>rfrfr</div>
            </div>
          </div>
          <div className={"profile-gains"}>
          <div className={"profile__coins"}>{coins}</div>
          <div className={"profile__germs"}>{gems}</div>
          </div>
        </div>
        ||
        <div>
          <a href="" onClick={(ev)=>{ev.preventDefault();props.history.goBack()}} className={"back"}></a>
          <h3>{pages[path] && pages[path].name}</h3>
        </div>

      }
    
    </div>
  );
};

export default withRouter(Header);

