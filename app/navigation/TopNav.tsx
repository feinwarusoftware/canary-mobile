import React, { Component } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import {
  TabRouter,
  createNavigator,
  createAppContainer
} from "react-navigation";

import Home from "../screens/Home";
import Search from "../screens/Search";
import Navbar from "../components/Navbar";
import Artists from "../screens/Artists";
import Artist from "../screens/Artist";
import Album from "../screens/Album";
import ProgressBar from "../components/ProgressBar";

import Welcome1 from "../screens/Welcome/Welcome1";

class TopNav extends Component {
  render() {
    return (
      <>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{flex: 1, width: Dimensions.get("window").width}}>
            <Home />
          </View>
          <View style={{flex: 1, width: Dimensions.get("window").width}}>
            <Artists />
          </View>
        </ScrollView>
        <ProgressBar />
      </>
    );
  }
}
export default TopNav;
