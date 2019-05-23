import React from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "../components/AuthenticatedRoute";
import UnauthenticatedRoute from "../components/UnauthenticatedRoute";
import Loadable from "react-loadable";

import NotFound from "./NotFound";

const Homepage = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "./Home/container/HomeContainer"),
  loading: () => null,
  modules: ["home"]
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


export default () => (
  <Switch>
    <AuthenticatedRoute exact path="/" component={Homepage} />
    <AuthenticatedRoute exact path="/category-details/:id" component={CategoryDetails} />
    <AuthenticatedRoute exact path="/play-room/:matchId" component={PlayRoom} />

    <AuthenticatedRoute exact path="/pick-opponent/:categoryId" component={PickOpponent} />

    <UnauthenticatedRoute exact path="/login" component={Login} />
    <AuthenticatedRoute exact path="/logout" component={Logout} />

    <Route component={NotFound} />
  </Switch>
);
