import { combineReducers } from "redux";
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import {ApolloClient} from "apollo-client";


import home from "../../routes/Home/module";

import app from "../../App/module";

export const client = new ApolloClient({
  link: createHttpLink({ uri: 'http://localhost:5000/graphql' }),
  cache: new InMemoryCache(),
});

export default combineReducers({
  app,
  home
});
