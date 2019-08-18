import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import moment from "moment";
import "./Header.scss";
import { IUser } from "../../typings";

interface IHeaderLinkProps {
  to: string;
  text: string;
  isButton: boolean;
  current: string;
}

type IHeaderProps = RouteComponentProps & {
  isAuthenticated: boolean;
  user: IUser;
  current: string;
};

const Header = (props: IHeaderProps) => {
  const { avatar, coins, gems, firstName } = props.user;
  const [numGamesPlayed, setNumGamesPlayes] = useState<number>(0);
  const [isFreeChestActive, setIsFreeChestActive] = useState<boolean>(false);

  console.log("Current", props.current);
  const pages = {
    "/": {
      name: "Home",
      hasBack: false
    },
    "category-details": {
      name: "Category Details",
      hasBack: false
    },
    categories: {
      name: "Categories",
      hasBack: false
    },
    "game-chest": {
      name: "Game Chest",
      hasBack: false
    },
    "free-chest": {
      name: "Free Chest",
      hasBack: false
    },
    profile: {
      name: "Profile",
      hasBack: false
    },
    "play-room": {
      name: "Play Room",
      hasBack: false
    },
    "pick-opponent": {
      name: "Pick Opponent",
      hasBack: true
    },
    challeges: {
      name: "Challenges Opponent",
      hasBack: true
    }
  };
  const path = props.current.split("/")[1];
  
  React.useEffect(()=>{
    if(typeof window != "undefined"){
      const theNumGamesPlayed = window.localStorage.getItem("numGamesPlayed");
      if(theNumGamesPlayed != null){
        setNumGamesPlayes(parseInt(theNumGamesPlayed))
      }
      const freeChestCountDate = window.localStorage.getItem("freeChestCountDate");
      if(freeChestCountDate != null){
        //@ts-ignore
        const isActive = moment(freeChestCountDate) < moment();
        setIsFreeChestActive(isActive);
      }
    }
  },[])
  return (
    <div className={"header"}>
      {((props.current === "/" || (pages[path] && !pages[path].hasBack)) && (
        <div className={"profile"}>
          <div className={"profile__top"}>
            <div className={"profile__user"}>
              <img src={avatar} className={"user__img"} />
              <div className={"profile-name"}>{firstName}</div>
            </div>
            <div className={"profile__coins"}>{coins}</div>
          </div>
          <div className={"profile__bottom"}>
            <button
              onClick={
                ()=>props.history.push("/game-chest")
              }
              disabled={(numGamesPlayed < 10) ? true : false}
              className={`profile__game-chest ${(numGamesPlayed < 10) ? "disabled" : "" }`}>{numGamesPlayed}/10</button>
            <button
              onClick={
                ()=>props.history.push("/free-chest")
              }
              disabled={!isFreeChestActive ? true : false}
              className={`profile__free-chest ${!isFreeChestActive ? "disabled" : "" }`}
            >
              unlock
            </button>
            <div className={"profile__germs"}>{gems}</div>
          </div>
        </div>
      )) || (
        <div>
          <a
            href=""
            onClick={ev => {
              ev.preventDefault();
              props.history.goBack();
            }}
            className={"back"}
          />
          <h3>{pages[path] && pages[path].name}</h3>
        </div>
      )}
    </div>
  );
};

export default withRouter(Header);
