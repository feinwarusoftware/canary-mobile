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
import { Svg, Path, Defs, ClipPath } from "react-native-svg";
import metrics from "../config/metrics";
import tokens from "../config/tokens";
import AsyncStorage from "@react-native-community/async-storage";
import TrackPlayer from "react-native-track-player";

class Album extends Component {
  constructor() {
    super();

    this.state = {
      refreshing: false,
      loading: true,
      album: [],
      trackList: [],
      artist: []
    };
  }

  getTrackList = () => {
    return fetch(
      `https://api.deezer.com/album/${this.props.navigation.getParam("album").id}/tracks`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
          "x-rapidapi-key": tokens.deezerkey
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ trackList: responseJson.data });
      })
      .catch(error => {
        console.error(error);
      });
  };

  playTrack = async e => {
    await TrackPlayer.getQueue().then(q => {
      const trackInfo = {
        id: q.length++,
        url: e.preview,
        title: e.title,
        artist: e.artist.name,
        album: this.state.album.title,
        artwork: this.state.album.cover_xl
      };

      TrackPlayer.add(trackInfo).then(() => {
        TrackPlayer.play();
      }).catch(e => {
        console.log(e);
      });
    }).catch(e => {
      console.log(e);
    });
  }

  componentDidMount = async () => {
    this.getTrackList();
    this.setState({artist: this.props.navigation.getParam("artist"),
      album: this.props.navigation.getParam("album"),
      loading: false});
  };

  componentWillUnmount() {}

  render() {
    console.log(this.state);

    let albumInfo = () => {
      return (
        <>
          <View style={styles.albumImgView}>
            <Image
              style={styles.albumImg}
              source={{
                uri: this.state.album.cover_big,
                cache: "only-if-cached"
              }}
            />
            <LinearGradient
              colors={["#00000000", "#222222"]}
              style={styles.albumImgGradient}
            />
          </View>

          <View style={styles.albumMain}>
            <View style={styles.contained}>
              <Text style={styles.albumTitle}>{this.state.album.title}</Text>
              <View style={styles.tracksList}>
                {this.state.trackList.map((e, i) =>
                  <TouchableOpacity key={i} onPress={() => this.playTrack(e)}>
                    <View style={styles.trackContainer}>
                      <Text style={styles.trackTitle}>{e.title}</Text>
                      <Text style={styles.duration}>{Math.floor(e.duration / 60) + ":" + (e.duration % 60).toString().padStart(2, "0")}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

        </>
      );
    };

    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          style={{ height: 100, width: "100%" }}
        >
          {this.state.loading ? null : albumInfo()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222"
  },
  albumImgView: {
    width: metrics.screenWidth,
    height: metrics.screenWidth,
    zIndex: -100
  },
  albumImg: {
    width: metrics.screenWidth,
    height: metrics.screenWidth
  },
  albumImgGradient: {
    bottom: 0,
    height: metrics.screenWidth / 2,
    width: metrics.screenWidth,
    position: "absolute",
    zIndex: 1
  },
  albumMain: {
    top: -metrics.screenWidth / 2
  },
  contained: {
    marginLeft: 14,
    marginRight: 14,
  },
  albumHeading: {
    flexDirection: "row",
  },
  albumTitle: {
    fontSize: 36,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 40,
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: {
      width: 0,
      height: 0
    },
    textShadowRadius: 10
  },
  sectionHeading: {
    fontSize: 29,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 35,
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
    marginTop: 16
  },
  albumsScroll: {
    width: metrics.screenWidt,
    flexDirection: "row",
    marginTop: 10,
    paddingRight: 14
  },
  albumArt: {
    width: 130,
    height: 130,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 10,
    marginRight: 14,
    flexShrink: 0
  },
  tracksList: {
    flex: 1,
    backgroundColor: "#222",
    marginTop: 15
  },
  trackContainer: {
    flex: 1,
    height: 50,
    marginBottom: 7,
    padding: 7,
    justifyContent: "center",
  },
  trackTitle: {
    fontSize: 16,
    color: "#fff"
  },
  duration: {
    fontSize: 13,
    color: "#707070"
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
)(Album);
