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

    <UnauthenticatedRoute exact path="/login" component={Login} />
    <AuthenticatedRoute exact path="/logout" component={Logout} />

    <Route component={NotFound} />
  </Switch>
);
