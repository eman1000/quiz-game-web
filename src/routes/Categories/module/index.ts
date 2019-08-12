// LIBRARIES
import update from "immutability-helper";
import queryString from "query-string";
import constants from "./actionConstants";
import axios, { AxiosRequestConfig } from "axios";

const {
} = constants;


const ACTION_HANDLERS = {
};

const initialState = {
};

export default function CategoriesReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
