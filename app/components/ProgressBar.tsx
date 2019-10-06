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
  TouchableNativeFeedback,
  Animated,
  Easing,
  Image,
  PanResponder
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
      playing: false,
      showTime: false,
      playStatus: false,
    };

    this.dragThreshold = ({ dx }) => {
      const draggedLeft = dx < -10;
      const draggedRight = dx > 10;
      let dragDirection = "";

      if (draggedLeft || draggedRight) {
        if (draggedLeft) dragDirection += "dragged left";
        if (draggedRight) dragDirection +=  "dragged right";
      }

      if (dragDirection) return dragDirection;
    }

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => !!this.dragThreshold(gestureState),
      onPanResponderMove: (e, gestureState) => {
        //console.log(`${(gestureState.moveX / metrics.screenWidth) * 100}%`);
        this.setState({ showTime: true });
      },
      onPanResponderRelease: async (e, g) => {
        // console.log(`${(g.moveX / metrics.screenWidth) * 100}%`);
        this.setState({ showTime: false });
        const divider:number = g.moveX / metrics.screenWidth;
        const duration:number = await TrackPlayer.getDuration();
        TrackPlayer.seekTo(duration * divider);
      },
    });
  }

  render() {
    const position = formatTime(Math.floor(this.state.position));
    const duration = formatTime(Math.floor(this.state.duration));
    const info = `${position} / ${duration}`;

    // if (this.props.playing.name) {
    //   this.setState({ playing: true });
    // } else {
    //   this.setState({ playing: false })
    // }
    
    // if (this.state.playing) {
    //   Animated.spring(this.state.bottom, {
    //     toValue: 0,
    //   }).start();
    // } else {
    //   Animated.spring(this.state.bottom, {
    //     toValue: -80,
    //   }).start();
    // }

    return (
      <View style={styles.container} {...this.panResponder.panHandlers}>
        <LinearGradient
          style={{ ...styles.progress, width: `${this.getProgress() * 100}%` }}
          colors={[colors.canary, colors.canarySecondary]}
          useAngle={true}
          angle={90}
        />
        <View style={styles.content}>
          <Chevron style={styles.chevron} width={18} height={18} />
          <View>
            <Text style={styles.track}>
              {this.props.playing.name || "Nothing in queue"}
            </Text>
            <Text style={styles.artist}>
              {this.props.playing.artist || "Press a song to begin"}
            </Text>
          </View>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(colors.canarySecondary)}
            style={styles.playPause}
          >
            {this.state.playingStatus ? (
              <Pause style={styles.play} width={18} height={18} />
            ) : (
              <Play style={styles.play} width={18} height={18} />
            )}
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: metrics.screenWidth,
    height: 64,
    backgroundColor: "#222",
    position: "absolute",
    bottom: 0,
    left: 0,
    overflow: "visible",
    zIndex: 999,
  },
  progress: {
    height: 9,
    opacity: 1,
    position: "absolute",
    left: 0,
    top: -4.5,
    width: "50%",
  },
  chevron: {
    fontSize: 12,
    color: "#FFF",
    left: 20.5,
    height: "100%",
    position: "absolute",
  },
  play: {
    fontSize: 30,
    color: "#FFF",
    right: 20.5,
    height: "100%",
    position: "absolute",
  },
  content: {
    height: "100%",
    alignContent: "center",
    justifyContent: "center",
  },
  track: {
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
  },
  artist: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "center",
    color: "#a7a7a7",
  },
  playPause: {
    height: "100%",
    width: 30,
  }
});

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    playing: { ...state.updatePlaying }
  };
}
function mapDispatchToProps() {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProgressBar);
