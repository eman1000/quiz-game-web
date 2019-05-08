import { createStore, applyMiddleware, compose } from "redux";
import { connectRouter, routerMiddleware, LocationChangeAction, RouterState } from "connected-react-router";
import thunk from "redux-thunk";
import {createLogger} from "redux-logger";
import { createBrowserHistory, createMemoryHistory } from "history";
import rootReducer from "./reducers";
import { client } from "./reducers";

// A nice helper to tell us if we're on the server
export const isServer = !(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);


export default (url = "/") => {
  // Create a history depending on the environment
  const history = createBrowserHistory();

  const enhancers = [];

  // Dev tools are helpful
  if (process.env.NODE_ENV === "development" && !isServer) {
    const devToolsExtension = window['devToolsExtension'] as () => never;

    if (typeof devToolsExtension === "function") {
      enhancers.push(devToolsExtension());
    }
  }

  // logger
  const log = createLogger({ diff: true, collapsed: true });

  //middleware
  const middleware = [thunk, routerMiddleware(history)];
  //if (process.env.NODE_ENV === "development"){
    middleware.push(log);
  //}

  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
  );

  // Do we have preloaded state available? Great, save it.
  const initialState = !isServer ? window['__PRELOADED_STATE__'] : {};

  // Delete it once we have it stored in a variable
  if (!isServer) {
    delete window['__PRELOADED_STATE__'];
  }

  // Create the store
  const myConnectRouter = connectRouter(history) as any
  const store = createStore(
    myConnectRouter(rootReducer as any),
    initialState,
    composedEnhancers as any
  );

  return {
    store,
    history
  };
};
