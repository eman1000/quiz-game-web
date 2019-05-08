// The basics
import React, { Component } from "react";
import { connect, MapStateToProps, MapStateToPropsParam } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";


// Action creators and helpers
//import { establishCurrentUser } from "./routes/Login/module";
import { isServer } from "../store";

import Header from "../components/Header";
import Routes from "../routes";
import { Interface } from "readline";


interface StateProps {
  propFromReduxStore: string,
  home:{
    isAuthenticated:boolean,
    authenticatedUser:{
      affiliate_name: string
    }
  }
}

interface DispatchProps {
}

export class App extends Component<any, any> {
  constructor(props:any) {
    super(props);

    this.state = {
      showDevApp:false
    };
  }
  componentWillMount() {
    if (!isServer) {
      //this.props.establishCurrentUser();
    }
  }

  render() {
    return (
      <div id="app">
        <Header
          isAuthenticated={this.props.isAuthenticated}
          current={this.props.location ? this.props.location.pathname : ""}
          authenticatedUser={this.props.authenticatedUser}
        />
        <div id="content">
          <Routes />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state:StateProps) => ({
  isAuthenticated: state.home.isAuthenticated,
  authenticatedUser: state.home.authenticatedUser
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({  }, dispatch);

const connectedRouter = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default withRouter(
  connectedRouter as any
);
