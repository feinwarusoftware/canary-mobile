import React, { Component } from "react";
import { View, Text, StatusBar } from "react-native";
import { connect } from "react-redux";
import styles from "./styles";
import TrackPlayer from "react-native-track-player";
import { Svg, Path, Defs, ClipPath, Image } from "react-native-svg";
import metrics from "../../config/metrics";

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = { status: 0 };
  }

  addToQueue = () => {
    TrackPlayer.setupPlayer().then(async () => {
      // Adds a track to the queue
      await TrackPlayer.add({
        id: "1",
        url:
          "https://matthewwatt.co.uk/downloads/The%20Root%20of%20All%20Tings.wav",
        title: "Test Title",
        artist: "Test Artist"
        //artwork: require("track.png")
      });
    });
  };

  componentDidMount() {
    TrackPlayer.addEventListener("playback-state", async () => {
      await TrackPlayer.getState().then(e => {
        this.setState({ status: e });
      });
    });
  }

  render() {
    let state = null;

    switch (this.state.status) {
    case TrackPlayer.STATE_NONE:
      state = "STATE_NONE";
      break;
    case TrackPlayer.STATE_READY:
      state = "STATE_READY";
      break;
    case TrackPlayer.STATE_PLAYING:
      state = "STATE_PLAYING";
      break;
    case TrackPlayer.STATE_PAUSED:
      state = "STATE_PAUSED";
      break;
    case TrackPlayer.STATE_STOPPED:
      state = "STATE_STOPPED";
      break;
    case TrackPlayer.STATE_BUFFERING:
      state = "STATE_BUFFERING";
      break;
    case TrackPlayer.STATE_CONNECTING:
      state = "STATE_CONNECTING";
      break;
    }

    return (
      <View style={styles.container}>
        
        <StatusBar backgroundColor="#ce8914" barStyle="light-content" />
        <Text>{`${state}: ${this.state.status}`}</Text>
        <Text style={styles.text} onPress={() => this.addToQueue()}>
          Kill me
        </Text>
        <Text style={styles.text} onPress={() => TrackPlayer.play()}>
          Play
        </Text>
        <Text style={styles.text} onPress={() => TrackPlayer.stop()}>
          Stop
        </Text>
      </View>
    );
  }
}

function mapStateToProps() {
  return {};
}
function mapDispatchToProps() {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
