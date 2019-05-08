// LIBRARIES
import update from "immutability-helper";
import constants from "./actionConstants";

const {
  SET_CONFIG
} = constants;





const ACTION_HANDLERS = {
};

const initialState = {
};

export default function AppReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
