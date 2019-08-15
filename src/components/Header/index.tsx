import React from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
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
  const { avatar, coins, gems } = props.user;

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
  console.log("context", path);
  return (
    <div className={"header"}>
      {((props.current === "/" || (pages[path] && !pages[path].hasBack)) && (
        <div className={"profile"}>
          <div className={"profile__top"}>
            <div className={"profile__user"}>
              <img src={avatar} className={"user__img"} />
              <div className={"profile-name"}>kuda</div>
            </div>
            <div className={"profile__coins"}>{coins}</div>
          </div>
          <div className={"profile__bottom"}>
            <div className={"profile__game-chest"}>1/10</div>
            <div className={"profile__free-chest"}>unlock</div>
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
