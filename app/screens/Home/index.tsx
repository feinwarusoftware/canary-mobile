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
import MusicFiles, { RNAndroidAudioStore } from "react-native-get-music-files";
import { Track } from "../../api/interfaces";
import getTracks from "../../api/getTracks";

class Home extends Component {
  constructor(props:any) {
    super(props);

    this.state = {
      getAlbumsInput: "",
      getSongsInput: {},
      searchParam: "",
      tracks: [],
      artists: [],
      albums: [],
      songs: [],
      search: [],
      refreshing: false,
    };
  }

  requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ],
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        alert("You can use the package");
      } else {
        this.requestPermission();
      }
    } catch (err) {
      console.warn(err);
    }
  }

  componentDidMount = async () => {
    this.requestPermission();
    getTracks();

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

  _onRefresh = () => {
    this.setState({ refreshing: true });
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
        title: track.name,
        artist: track.artist,
        album: track.album.name,
        artwork: track.album.cover
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

  skip10 = async () => {
    let position = await TrackPlayer.getPosition();
    TrackPlayer.seekTo(position + 10);
  }

  getAll = () => {
    getTracks(true);
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={{display: "flex", flexDirection: "row"}}>
          <Button title="getAll" onPress={this.getAll} />
          <Button title="Play" onPress={()=> TrackPlayer.play()} />
          <Button title="Pause" onPress={()=> TrackPlayer.pause()} />
          <Button title="Next" onPress={()=> TrackPlayer.skipToNext()} />
          <Button title="Prev" onPress={()=> TrackPlayer.skipToPrevious()} />
          <Button title="Skip 10" onPress={()=> this.skip10()} />
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
          {this.props.tracks.map((e, i) => {
            return(
              <TouchableHighlight key={i} onPress={() => this.addToQueue(e)}>
                <View>
                  <Text>
                    {e.name == null ? "No title" : e.name}
                  </Text>
                  <Text>
                    {e.artist == null ? "No artist" : e.artist}
                  </Text>
                  <Text>
                    {e.album.name == null ? "No album" : e.album.name}
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
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  }
});

const mapStateToProps = (state) => {
  return {
    tracks: state.importTracks,
  };
};

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
