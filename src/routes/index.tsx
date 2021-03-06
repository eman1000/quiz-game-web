import React from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "../components/AuthenticatedRoute";
import UnauthenticatedRoute from "../components/UnauthenticatedRoute";
import Loadable from "react-loadable";
import { 
  CSSTransition, 
  TransitionGroup 
} from 'react-transition-group';

import NotFound from "./NotFound";

const Homepage = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "./Home/container/HomeContainer"),
  loading: () => null,
  modules: ["home"]
});

const Categories = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "./Categories/container/CategoriesContainer"),
  loading: () => null,
  modules: ["categories"]
});

const GameChest = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "./GameChest/container/GameChestContainer"),
  loading: () => null,
  modules: ["gameChest"]
});

const FreeChest = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "./FreeChest/container/FreeChestContainer"),
  loading: () => null,
  modules: ["freeChest"]
});

const Profile = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "./Profile/container/ProfileContainer"),
  loading: () => null,
  modules: ["profile"]
});



const CategoryDetails = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "./CategoryDetails/components/CategoryDetails"),
  loading: () => null,
  modules: ["categoryDetails"]
});
const PlayRoom = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "./PlayRoom/components/PlayRoom"),
  loading: () => null,
  modules: ["playRoom"]
});
const PickOpponent = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "./PickOpponent/components/PickOpponent"),
  loading: () => null,
  modules: ["pickOpponent"]
});

const Challenges = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "./Challenges/components/Challenges"),
  loading: () => null,
  modules: ["challenges"]
});


const Login = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "./Login/container/LoginContainer"),
  loading: () => null,
  modules: ["login"]
});

const Logout = Loadable({
  loader: () => import(/* webpackChunkName: "logout" */ "./Logout"),
  loading: () => null,
  modules: ["logout"]
});

const Privacy = Loadable({
  loader: () => import(/* webpackChunkName: "logout" */ "./Privacy"),
  loading: () => null,
  modules: ["privacy"]
});


const Video = Loadable({
  loader: () => import(/* webpackChunkName: "logout" */ "./Videos"),
  loading: () => null,
  modules: ["video"]
});


const Games = Loadable({
  loader: () => import(/* webpackChunkName: "logout" */ "./Games"),
  loading: () => null,
  modules: ["games"]
});

const PlayGame = Loadable({
  loader: () => import(/* webpackChunkName: "logout" */ "./PlayGame"),
  loading: () => null,
  modules: ["playgame"]
});

export default () => (
  <TransitionGroup>
    <CSSTransition
      classNames="page"
      timeout={{
        enter: 1000,
        exit: 1000,
      }}
    >
    <Switch>
      <AuthenticatedRoute exact path="/" component={Homepage} />
      <AuthenticatedRoute exact path="/category-details/:id" component={CategoryDetails} />
      <AuthenticatedRoute exact path="/categories" component={Categories} />
      <AuthenticatedRoute exact path="/game-chest" component={GameChest} />
      <AuthenticatedRoute exact path="/free-chest" component={FreeChest} />
      <AuthenticatedRoute exact path="/profile" component={Profile} />
      <AuthenticatedRoute exact path="/challenges" component={Challenges} />


      
      <AuthenticatedRoute exact path="/play-room/:matchId" component={PlayRoom} />

      <AuthenticatedRoute exact path="/pick-opponent/:categoryId" component={PickOpponent} />

      <UnauthenticatedRoute exact path="/login" component={Login} />

      
      <AuthenticatedRoute exact path="/logout" component={Logout} />

      <Route exact path="/privacy-policy" component={Privacy} />

      <Route exact path="/videos" component={Video} />

      <Route exact path="/games" component={Games} />
      <Route exact path="/play-game/:gamename" component={PlayGame} />

      
      <Route component={NotFound} />

    </Switch>
    </CSSTransition>
  </TransitionGroup>
);
