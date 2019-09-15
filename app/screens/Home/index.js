//@flow

import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
  Button,
  TextInput,
  DeviceEventEmitter,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableHighlight
} from "react-native";
import { connect } from "react-redux";
//import styles from "./styles";
import TrackPlayer, { getQueue, reset } from "react-native-track-player";
import { Svg, Path, Defs, ClipPath, Image } from "react-native-svg";
import metrics from "../../config/metrics";
import MusicFiles from "react-native-get-music-files";

class Home extends Component {
  constructor() {
    super();

    this.requestPermission = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple(
          [
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          ],
          {
            title: "Permission",
            message: "Storage access is requiered",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          alert("You can use the package");
        } else {
          this.requestPermission();
        }
      } catch (err) {
        console.warn(err);
      }
    };

    this.getAll = () => {
      MusicFiles.getAll({
        blured: false, // works only when 'cover' is set to true
        artist: true,
        duration: true, //default : true
        cover: true, //default : true,
        genre: true,
        title: true,
        minimumSongDuration: 10000, // get songs bigger than 10000 miliseconds duration,
        batchNumber: 1,
        delay: 1000
      });
    };

    this.state = {
      getAlbumsInput: "",
      getSongsInput: {},
      searchParam: "",
      tracks: [],
      artists: [],
      albums: [],
      songs: [],
      search: [],
      refreshing: false
    };
  }

  componentDidMount = async () => {
    this.requestPermission();

    DeviceEventEmitter.addListener("onBatchReceived", params => {
      this.setState({
        ...this.state,
        tracks: [...this.state.tracks, params.batch]
      });
    });

    DeviceEventEmitter.addListener("onLastBatchReceived", params => {
      this.setState(alert("last batch sent"));
    });

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
        // An array of capabilities that will show up when the notification is in the compact form on Android
        compactCapabilities: [
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT
        ],
        icon: require("../../static/img/notifcation/notification.png") // The notification icon
      });
    });
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners();
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getAll();
    this.setState({ refreshing: false });
    console.log(this.state.tracks);
  };

  addToQueue = (track) => {
    // Adds a track to the queue
    TrackPlayer.getQueue().then(queue => {
      console.log(track);
      TrackPlayer.add({
        id: queue.length++,
        url: "file://" + track.path,
        title: track.title,
        artist: track.author,
        album: track.album,
        artwork: track.cover
      }).then(() => {
        TrackPlayer.getQueue().then(e => {
          console.log(e);
          if (e.length >= 1){
            TrackPlayer.play();
          } else if (e.length === 0){
            console.log("error adding song");
          }
        });
      });
    });
  };

  render() {
    let state = TrackPlayer.getState().then(e => {
      console.log(e);
    });
    return (
      <View style={styles.container}>
        <View style={{display: "flex", flexDirection: "row"}}>
          <Button title="getAll" onPress={this.getAll} />
          <Button title="Play" onPress={()=> TrackPlayer.play()} />
          <Button title="Pause" onPress={()=> TrackPlayer.pause()} />
          <Button title="Next" onPress={()=> TrackPlayer.skipToNext()} />
          <Button title="Prev" onPress={()=> TrackPlayer.skipToPrevious()} />
          <Button title="Prev" onPress={()=> TrackPlayer.seekTo()} />
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          style={{ height: 100, width: "100%" }}
        >
          {this.state.tracks.map((e, i) => {
            return(
              <TouchableHighlight key={i} onPress={() => this.addToQueue(e[0])}>
                <View>
                  <Text>
                    {e[0].title == null ? "No title" : e[0].title}
                  </Text>
                  <Text>
                    {e[0].author == null ? "No artist" : e[0].author}
                  </Text>
                  <Text>
                    {e[0].album == null ? "No album" : e[0].album}
                  </Text>
                </View>
              </TouchableHighlight>
            );
          })}
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
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
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
)(Home);
