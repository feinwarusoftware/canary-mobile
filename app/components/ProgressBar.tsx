//@flow

import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
  Button,
  TextInput,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Easing,
  Image
} from "react-native";
import { connect } from "react-redux";
//import styles from "./styles";
import LinearGradient from "react-native-linear-gradient";
import metrics from "../config/metrics";
import colors from "../config/colors";
import tokens from "../config/tokens";
import AsyncStorage from "@react-native-community/async-storage";
import TrackPlayer, { TrackPlayerEventTypes } from "react-native-track-player";
import Play from "../static/img/play.svg";
import Pause from "../static/img/pause.svg";
import Back from "../static/img/back.svg";
import Forward from "../static/img/forward.svg";
import Chevron from "../static/img/chevron-up.svg";
import {formatTime} from "../utils";

class ProgressBar extends TrackPlayer.ProgressComponent {
  constructor() {
    super();

    this.state = {
      refreshing: false,
      albumArt: ""
    };
  }

  playPause = async () => {
    const state = await TrackPlayer.getState();
    if (state === TrackPlayer.STATE_PLAYING) {
      return (
        <Pause width={28} height={28} />
      );
    } else if (state === TrackPlayer.STATE_PAUSED) {
      return (
        <Play width={28} height={28} />
      );
    } else {
      return null;
    }
  };

  render() {
    const position = formatTime(Math.floor(this.state.position));
    const duration = formatTime(Math.floor(this.state.duration));
    const info = position + " / " + duration;
    return (
      <View style={styles.container}>
        <LinearGradient style={styles.progress} colors={[colors.canary, colors.canarySecondary]} useAngle={true} angle={90} />
        <View style={{...styles.progressCover, width: (100 - (this.getProgress() * 100)) + "%"}} />
        <View style={styles.content}>
          <Text style={styles.time}>{info}</Text>
          <View style={styles.controls}>
              <Back width={24} height={24} />
            <TouchableOpacity style={styles.play} onPress={()=> TrackPlayer.pause()}>
              <Pause width={28} height={28} />
            </TouchableOpacity>
              <Forward width={24} height={24} />
          </View>
          <Chevron style={styles.chevron} width={18} height={18} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: metrics.screenWidth - 28,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 14,
    left: 14,
    shadowColor: "rgb(0, 0, 0)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 10,
    overflow: "hidden"
  },
  progress: {
    height: "100%",
    opacity: 0.6,
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%"
  },
  progressCover: {
    height: "100%",
    position: "absolute",
    bottom: 0,
    right: 0,
    opacity: 1,
    backgroundColor: "#fff"
  },
  controls: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  time: {
    fontSize: 12,
    color: "#222",
    alignSelf: "flex-start",
    paddingLeft: 14
  },
  chevron: {
    fontSize: 12,
    color: "#222",
    position: "absolute",
    right: 18,
    height: "100%"
  },
  play: {
    paddingLeft: 20,
    paddingRight: 20,
    zIndex: 999
  },
  content: {
    height: "100%",
    alignContent: "center",
    justifyContent: "center"
  }
});

function mapStateToProps() {
  return {};
}
function mapDispatchToProps() {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProgressBar);
