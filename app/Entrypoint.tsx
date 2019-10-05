/**
 * React Native App
 * Everthing starts from the entrypoint
 */
import React, { Component } from "react";
import { ActivityIndicator } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import TopNav from "./navigation/TopNav";
// import configureStore from "./store/configureStore";
import store from "./store/reduxStore";

export default class Entrypoint extends Component {
  render() {
    return (
      <Provider store={store}>
        <TopNav />
      </Provider>
    );
  }
}
