import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from 'react-apollo';

import createStore from './store';
import {client} from "./store/reducers"
import App from './App';
import * as serviceWorker from './serviceWorker';

import "./styles/home.scss"
import "./index.scss"

// Create a store and get back itself and its history object
const { store, history } = createStore();


const Application = (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
    </BrowserRouter>
    </Provider>
  </ApolloProvider>
);

const root = document.querySelector('#root')  as HTMLElement;
render(Application, root);

serviceWorker.unregister();
