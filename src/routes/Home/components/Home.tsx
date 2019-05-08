import React, { Component } from "react";
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from "../../../components/Page";
import Loader from "../../../components/Loader"

import "./HomeStyles.scss";

export const GET_PERSON = gql(`
  {
    getPerson(id:"injknknnknk"){
      id
      firstName
    }
    
  }
`);

console.log(GET_PERSON);
class HomePage extends Component<any> {


  render() {

    return (
      <Page
        id="homepage"
        title="Affiliate App"
      >
        <Query query={GET_PERSON}>
          {({ loading, data }) => !loading && (
            <div>dcdcd {data.getPerson.firstName}</div>
          )}
        </Query>
      </Page>
    );
  }
}

export default HomePage;