import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  Button,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableNativeFeedback,
  Animated,
  Easing,
  Image,
} from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import metrics from "../config/metrics";
import colors from "../config/colors";
import tokens from "../config/tokens";
import AsyncStorage from "@react-native-community/async-storage";
import TrackPlayer from "react-native-track-player";
import { Track as TrackInterface } from "../api/interfaces";
import updatePlaying from "../api/updatePlaying";

class Track extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  track:TrackInterface = this.props.track;

  playTrack = () => {
    TrackPlayer.reset().then(() => {
      TrackPlayer.add({
        id: 0,
        url: "file://" + this.track.path,
        title: this.track.name,
        artist: this.track.artist,
        album: this.track.album.name,
        artwork: this.track.album.cover
      }).then(() => {
        TrackPlayer.play();
        updatePlaying(this.track);
      })
    });
  }

  render() {
    return (
      <TouchableNativeFeedback
        onPress={() => this.playTrack()}
        background={TouchableNativeFeedback.Ripple(colors.canarySecondary)}
      >
        <View style={styles.container}>
          <Image
            style={styles.cover}
            source={
              this.track.album.cover
                ? { uri: this.track.album.cover }
                : require("../static/img/placeholder/placeholder.jpg")
            }
          />
          <View>
            <Text style={styles.name}>{this.track.name}</Text>
            <Text style={styles.artist}>{this.track.artist}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: metrics.screenWidth,
    backgroundColor: "#222",
    overflow: "hidden",
    paddingVertical: 7,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff"
  },
  artist: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "left",
    color: "#a7a7a7"
  },
  cover: {
    width: 43,
    height: 43,
    marginRight: 15,
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    ...state,
  };
};
function mapDispatchToProps() {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Track);
