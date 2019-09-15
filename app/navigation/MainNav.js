import React, { Component } from "react";
import { View } from "react-native";
import {
  TabRouter,
  createNavigator,
  createAppContainer
} from "react-navigation";

import Home from "app/screens/Home";
import Search from "app/screens/Search";
import Navbar from "app/components/Navbar";
import Artists from "app/screens/Artists";
import Artist from "app/screens/Artist";
import Album from "app/screens/Album";
import ProgressBar from "app/components/ProgressBar";

import Welcome1 from "app/screens/Welcome/Welcome1";

class CustomTabView extends React.Component {
  render() {
    const { navigation, descriptors } = this.props;
    const { routes, index } = navigation.state;
    const descriptor = descriptors[routes[index].key];
    const ActiveScreen = descriptor.getComponent();
    return (
      <>
        {descriptor.key.includes("Welcome") ? <></> : <Navbar navigation={navigation} />}
        <ActiveScreen navigation={descriptor.navigation} />
        <ProgressBar />
      </>
    );
  }
}

const CustomTabRouter = TabRouter(
  //Tab Bar Routes
  {
    Home: {
      path: "/",
      screen: Home
    },
    Artists: {
      path: "artists",
      screen: Artists
    },
    Artist: {
      path: "artists/artist",
      screen: Artist
    },
    Album: {
      path: "album",
      screen: Album
    }
  },
  {
    // Change this to start on a different tab
    initialRouteName: "Home"
  }
);

const CustomTabs = createAppContainer(
  createNavigator(CustomTabView, CustomTabRouter, {})
);

export default createAppContainer(CustomTabs);
