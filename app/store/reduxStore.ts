import { createStore, compose, applyMiddleware } from "redux";
import rootReducer from "../reducers";
import { composeWithDevTools } from "redux-devtools-extension";

const configureStore = () => {
  return createStore(rootReducer, composeWithDevTools(applyMiddleware()));
};

const store = configureStore();

export default store;
