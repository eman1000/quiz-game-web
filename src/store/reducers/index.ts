import { combineReducers } from "redux";
import { createHttpLink } from 'apollo-link-http';
import { onError } from "apollo-link-error"
import { InMemoryCache } from 'apollo-cache-inmemory';

import {ApolloClient} from "apollo-client";


import home from "../../routes/Home/module";

import app from "../../App/module";

import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from "apollo-utilities";
import { split } from "apollo-link";

const wsLink = new WebSocketLink({
  uri: `ws://${window.location.host}/graphql`,
  options: {
    reconnect: true,
    timeout:1000000,
    reconnectionAttempts:20
    
  },
});

const httpLink = createHttpLink({
  uri: '/graphql'

});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('jwtToken');
  // return the headers to the context so httpLink can read them
  if(token){
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        "x-token":token
      }
    }
  }else{
    return {...headers}
  }

});

const logLink = onError(({ graphQLErrors, networkError, operation, forward }) =>{
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      // handle errors differently based on its error code
      //@ts-ignore
      switch (err.extensions.code) {
        case 'UNAUTHENTICATED':
        console.log('jjj')
          // old token has expired throwing AuthenticationError,
          // one way to handle is to obtain a new token and 
          // add it to the operation context
          // const headers = operation.getContext().headers
          // operation.setContext({
          //   headers: {
          //     ...headers,
          //     "x-token": getNewToken(),
          //   },
          // });
          // // Now, pass the modified operation to the next link
          // // in the chain. This effectively intercepts the old
          // // failed request, and retries it with a new token
          localStorage.removeItem("jwtToken");
          console.log('jjj')
          if(window.location.pathname !== "/login"){
            window.location.href = "/login"
          }
          return forward(operation);
        case 'FORBIDDEN':
          console.log('jjj4444')
            // old token has expired throwing AuthenticationError,
            // one way to handle is to obtain a new token and 
            // add it to the operation context
            // const headers = operation.getContext().headers
            // operation.setContext({
            //   headers: {
            //     ...headers,
            //     "x-token": getNewToken(),
            //   },
            // });
            // // Now, pass the modified operation to the next link
            // // in the chain. This effectively intercepts the old
            // // failed request, and retries it with a new token
            localStorage.removeItem("jwtToken");
            console.log('jjj')
            if(window.location.pathname !== "/login"){
              window.location.href = "/login"
            }
            return forward(operation);
        // handle other errors
        case 'ANOTHER_ERROR_CODE':
          // ...
      }
    }
  }
})  // as any

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const client = new ApolloClient({
  link: logLink.concat(authLink.concat(link)),
  cache: new InMemoryCache()
});
// export const client = new ApolloClient({
//   link: createHttpLink({ uri: 'http://localhost:5000/graphql' }),
//   cache: new InMemoryCache(),
// });

export default combineReducers({
  app,
  home
});
