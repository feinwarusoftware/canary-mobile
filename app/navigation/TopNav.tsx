import React, { Component } from "react";
import { View, ScrollView, Dimensions, PermissionsAndroid, StatusBar } from "react-native";
import {
  TabRouter,
  createNavigator,
  createAppContainer,
} from "react-navigation";
import getTracks from "../api/getTracks";
import TrackPlayer, { getQueue, reset } from "react-native-track-player";

import Home from "../screens/Home";
import Search from "../screens/Search";
import Navbar from "../components/Navbar";
import Artists from "../screens/Artists";
import Artist from "../screens/Artist";
import Album from "../screens/Album";
import PlayBar from "../components/PlayBar";
import Player from "../screens/Player";

import Welcome1 from "../screens/Welcome/Welcome1";

class TopNav extends Component {
  constructor(props) {
    super(props);
    this.state = { currentPage: 0, showPlayBar: false };
  }
  scrollView = React.createRef<ScrollView>();
  routes = [
    "Home",
    "Artists",
    "Albums",
    "Playlists",
  ];

  requestPermission = async () => {
    try {
      await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ],
      );
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted) {
        return;
      }
      this.requestPermission();
    } catch (err) {
      console.warn(err);
    }
  }

  setupTrackPlayer = async () => {
    await TrackPlayer.setupPlayer().then(() => {
      TrackPlayer.updateOptions({
        ratingType: TrackPlayer.RATING_HEART,
        stopWithApp: true,
        capabilities: [
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT
        ],
        compactCapabilities: [
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT
        ],
        icon: require("../static/img/notification/notification.png"), // The notification icon
      });
    });
  }

  showPlayBar = () => {
    return this.setState({ showPlayBar: true });
  }

  componentDidMount() {
    this.requestPermission().then(() => {
      getTracks();
      this.setupTrackPlayer().then(() => this.showPlayBar());
    });
  }

  render() {
    return (
      <View style={{backgroundColor: "#2e2e2e", flex: 1}}>
        <StatusBar backgroundColor="#00000000" translucent={true} barStyle="light-content" />
        <Navbar routes={this.routes} />
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={e => console.log(e.nativeEvent.contentOffset.x)}
        >
          <View style={{ flex: 1, width: Dimensions.get("window").width }}>
            <Home />
          </View>
        </ScrollView>
        {this.state.showPlayBar ? <PlayBar /> : null}
      </View>
    );
  }
}
export default TopNav;
