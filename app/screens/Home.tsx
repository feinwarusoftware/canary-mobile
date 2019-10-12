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
  TouchableHighlight,
  FlatList
} from "react-native";
import { connect } from "react-redux";
//import styles from "./styles";
import TrackPlayer from "react-native-track-player";
import { Svg, Path, Defs, ClipPath, Image } from "react-native-svg";
import metrics from "../config/metrics";
import MusicFiles, { RNAndroidAudioStore } from "react-native-get-music-files";
import getTracks from "../api/getTracks";
import Track from "../components/Track";

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

  componentDidMount() {

  }

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

  getAll = () => {
    this.setState({ refreshing: true });
    getTracks(true).then(() => {
      this.setState({ refreshing: false });
    });
  }

  render() {

    const data = this.props.tracks.reduce((r, e) => {
      const letter = e.name[0].toUpperCase();
      if (!r[letter]) r[letter] = { letter, tracks: [e] };
      else r[letter].tracks.push(e);
      return r;
    }, {});

    console.log(data)

    return (
      <View style={styles.container}>
        <View style={{display: "flex", flexDirection: "row"}}>
          <Button title="Play" onPress={()=> TrackPlayer.play()} />
          <Button title="Pause" onPress={()=> TrackPlayer.pause()} />
          <Button title="Next" onPress={()=> TrackPlayer.skipToNext()} />
          <Button title="Prev" onPress={()=> TrackPlayer.skipToPrevious()} />
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={() => this.getAll()}
              refreshing={this.state.refreshing}
            />
          }
          style={{ height: 100, width: "100%" }}
        >
        <FlatList
          data={this.props.tracks}
          renderItem={({ item }) => <Track track={item} />}
          keyExtractor={item => item.path}
        />
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
    backgroundColor: "#2e2e2e",
    marginBottom: 64,
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
