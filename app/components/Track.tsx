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
  TouchableOpacity,
  Alert,
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
import More from "../static/img/more.svg";

class Track extends Component {
  constructor(props) {
    super(props);

    this.state = {};
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
        // updatePlaying(this.track);
      })
    });
  }

  addToQueue = () => {
    const newTrack = this.track;
    // Adds a track to the queue
    TrackPlayer.getQueue().then((queue:TrackPlayer.Track[]) => {
      const id = queue.length;
      TrackPlayer.add({
        id: id + 1,
        url: `file://${this.track.path}`,
        title: this.track.name,
        artist: this.track.artist,
        album: this.track.album.name,
        artwork: this.track.album.cover,
      }).then(() => {
        TrackPlayer.getQueue().then(e => {
          if (e.length >= 1){
            TrackPlayer.play();
          } else if (e.length === 0){
            console.log("error adding song");
          }
        });
      });
    });
  };

  showMenu = () => {
    Alert.alert(
      `${this.track.name} - ${this.track.artist}`,
      "This is temporary ok, i will make this better when i can be bothered",
      [
        {
          text: "Add to Playlist",
          onPress: () => console.log("Ask me later pressed")
        },
        {
          text: "Add to queue",
          onPress: () => this.addToQueue(),
        },
        { text: "Play next", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: true }
    );
  }

  render() {
    return (
      <TouchableNativeFeedback
        onPress={() => this.playTrack()}
        background={TouchableNativeFeedback.Ripple(colors.canarySecondary)}
      >
        <View style={styles.container}>
          <View style={styles.image}>
            <Image
              style={styles.cover}
              source={
                this.track.album.cover
                  ? { uri: this.track.album.cover }
                  : require("../static/img/placeholder/placeholder.jpg")
              }
            />
          </View>
          <View style={styles.details}>
            <Text numberOfLines={1} style={styles.name}>
              {this.track.name}
            </Text>
            <Text style={styles.artist}>{this.track.artist}</Text>
          </View>
          <TouchableOpacity onPress={() => this.showMenu()}>
            <View style={styles.more}>
              <More width={5} height={17} />
            </View>
          </TouchableOpacity>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: metrics.screenWidth,
    backgroundColor: "#222",
    overflow: "visible",
    paddingVertical: 7,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  name: {
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
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
  },
  more: {
    paddingHorizontal: 19,
    paddingVertical: 10,
    flex: 1,
    flexGrow: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
  },
  details: {
    flex: 1,
  },
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
