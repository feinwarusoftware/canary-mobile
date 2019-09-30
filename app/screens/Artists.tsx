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
import metrics from "../config/metrics";
import MusicFiles from "react-native-get-music-files";

class Artists extends Component {
  constructor() {
    super();

    this.state = {
      tracks: [],
      artists: [],
      refreshing: false
    };
  }

  getAll = () => {
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

  componentDidMount() {
    DeviceEventEmitter.addListener("onBatchReceived", params => {
      this.setState({
        ...this.state,
        tracks: [...this.state.tracks, params.batch]
      });
    });

    DeviceEventEmitter.addListener("onLastBatchReceived", params => {
      this.setState(alert("last batch sent"));
    });

  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners();
  }

  filterArtists = () => {
    let artists = [];
    for (let track of this.state.tracks) {

      if (!artists.includes(track[0].author)){
        artists.push(track[0].author);
      }

    }
    this.setState({artists: artists});
  }

  render() {
    let state = TrackPlayer.getState().then(e => {
      console.log(e);
    });
    return (
      <View style={styles.container}>
        <View style={{display: "flex", flexDirection: "row"}}>
          <Button title="getAll" onPress={this.getAll} />
          <Button title="Filter" onPress={this.filterArtists} />
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
          {this.state.artists.map((e, i) => {
            return(
              <TouchableHighlight key={i} onPress={() => this.props.navigation.navigate({routeName: "Artist", params: {artist: e}})}>
                <Text>{e}</Text>
              </TouchableHighlight>
            );
          })}

          <TouchableHighlight onPress={() => this.props.navigation.navigate({routeName: "Artist", params: {artist: "Dream Theater"}})}>
            <Text>Dream Theater</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.props.navigation.navigate({routeName: "Artist", params: {artist: "Jinjer"}})}>
            <Text>Jinjer</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.props.navigation.navigate({routeName: "Artist", params: {artist: "TesseracT"}})}>
            <Text>TesseracT</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.props.navigation.navigate({routeName: "Artist", params: {artist: "Kero Kero Bonito"}})}>
            <Text>Kero Kero Bonito</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.props.navigation.navigate({routeName: "Artist", params: {artist: "Periphery"}})}>
            <Text>Periphery</Text>
          </TouchableHighlight>
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
)(Artists);
