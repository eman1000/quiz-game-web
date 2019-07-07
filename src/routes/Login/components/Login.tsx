import React, { Component, useState } from "react";
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import FacebookLogin from "react-facebook-login";

import Page from "../../../components/Page";
import Loader from "../../../components/Loader";

import "./LoginStyles.scss";
import { async } from "q";

export const FACEBOOK_LOGIN = gql(`
  mutation signInFacebook($facebookToken: String!){
    signInFacebook(facebookToken:$facebookToken){
      token
      user{
        id
        username
        firstName
        lastName
        gender
        age
        email
        role
        facebookId
        avatar
      }
    }
  }
`);

const Login = ({}) => {
  const [accessToken, setAccessToken] = useState(null);
  const fbLogin = async ({ res, login }) => {
    console.log("res", res);
    if (res) {
      setAccessToken(res.accessToken);
      const tokenObj = await login();
      if (tokenObj) {
        const { token, user } = tokenObj.data.signInFacebook;
        console.log("token", tokenObj);
        if (user) {
          //localStorage.setItem("authUser", user);
        }

        return localStorage.setItem("jwtToken", token);
      }
    }
  };
  return (
    <Page id="homepage" title="Affiliate App">
      <Mutation
        mutation={FACEBOOK_LOGIN}
        variables={{ facebookToken: accessToken }}
      >
        {(login, { loading }) => {
          if (loading) return "Loading...";
          return (
            <div>
              <div className={"container"}>
                <div className={"login-wrapper"}>
                  <div className={"intro"}>Welcome to Vunzo</div>

                  <div className={"login-footer"}>
                    <p>Signup to start playing quiz bee with friends</p>

                    <a href="home.html" className={"btn facebook"}>
                      Connent with facebbok
                    </a>

                       <div className="login-footer">
                  <FacebookLogin
                    appId="337440783579454"
                    autoLoad={true}
                    fields="name,email,picture"
                    onClick={() => console.log("clicked")}
                    callback={res => fbLogin({ res, login })}
                  />
                </div>
                  </div>
                </div>
             
              </div>
            </div>
          );
        }}
      </Mutation>
    </Page>
  );
};

export default Login;
