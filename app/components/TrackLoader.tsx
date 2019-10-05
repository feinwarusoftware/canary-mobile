import React, { Component } from "react";
import { connect } from "react-redux";
import MusicFiles, { RNAndroidAudioStore } from "react-native-get-music-files";
import { Track } from "../api/interfaces";
import { DeviceEventEmitter, PermissionsAndroid } from "react-native";

class TrackLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      importing: false,
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
    } catch (e) {
      console.log(e);
    }
  }

  getAll = () => {
    RNAndroidAudioStore.getAll({
      blured: false, // works only when 'cover' is set to true
      artist: true,
      duration: true, // default : true
      cover: true, // default : true,
      genre: true,
      title: true,
      minimumSongDuration: 10000, // get songs bigger than 10000 miliseconds duration,
      batchNumber: 10,
      delay: 1000,
    });
  }

  importTracks = () => {
    DeviceEventEmitter.addListener("onBatchReceived", (params) => {
      this.props.dispatch({ type: "IMPORT_TRACKS", tracks :params.batch });
      console.log(importedTrack);
    });
    DeviceEventEmitter.addListener("onLastBatchReceived", params => {
      alert("Imported all tracks");
      console.log(params);
    });
  }

  componentDidMount = async () => {
    this.requestPermission().then(() => {
      this.importTracks();
      this.getAll();
    });
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners();
  }

  render() {
    return(

    );
  }
}
