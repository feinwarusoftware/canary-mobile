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
  TouchableHighlight,
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

class Artist extends Component {
  constructor() {
    super();

    this.state = {
      artist: {
        last_fm: [],
        deezer: []
      },
      refreshing: false,
      loading: true,
      tracks: [],
      unownedTracks: [],
      unownedAlbums: []
    };
  }

  getLastFM = artist => {
    return fetch(
      `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=${tokens.lastfmkey}&format=json`
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ artist: { last_fm: responseJson.artist } });
      })
      .catch(error => {
        console.error(error);
      });
  };

  getDeezer = artist => {
    return fetch(
      `https://deezerdevs-deezer.p.rapidapi.com/search?q=${artist}`,
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
        this.setState({ artist: { last_fm: this.state.artist.last_fm, deezer: responseJson.data } });
      })
      .catch(error => {
        console.error(error);
      });
  };

  abbreviateNumber = value => {
    let newValue = value;
    if (value >= 1000) {
      let suffixes = ["", "K", "M", "B", "T"];
      let suffixNum = Math.floor(("" + value).length / 3);
      let shortValue = "";
      for (let precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat(
          (suffixNum != 0
            ? value / Math.pow(1000, suffixNum)
            : value
          ).toPrecision(precision)
        );
        let dotLessShortValue = (shortValue + "").replace(
          /[^a-zA-Z 0-9]+/g,
          ""
        );
        if (dotLessShortValue.length <= 2) {
          break;
        }
      }
      if (shortValue % 1 != 0) shortNum = shortValue.toFixed(1);
      newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
  };

  cacheArtistData = async () => {
    try {
      let data = {
        last_fm: this.state.artist.last_fm,
        deezer: this.state.artist.deezer
      };
      AsyncStorage.setItem(
        `artist.${this.props.navigation.getParam("artist")}`,
        JSON.stringify(data)
      );
    } catch (e) {
      console.log(e);
    }
  };

  getUnownedTracks = () => {
    return fetch(
      `https://api.deezer.com/artist/${this.state.artist.deezer[0].artist.id}/top?limit=50`,
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
        this.setState({ unownedTracks: responseJson.data });
      })
      .catch(error => {
        console.error(error);
      });
  };

  getUnownedAlbums = () => {
    let albums = [];
    let albumsFiltered;
    for (let track of this.state.unownedTracks){
      albums.push(track.album);
    }

    albumsFiltered = albums.filter((e, i, s) =>
      i === s.findIndex(t => (
        t.title === e.title
      ))
    );

    albumsFiltered.sort((a,b) => (a.id < b.id) ? 1 : ((b.id < a.id) ? -1 : 0));

    //console.log(albums);
    console.log(albumsFiltered);
    //console.log(albumsFiltered);

    this.setState({unownedAlbums: albumsFiltered});
  }

  componentDidMount = async () => {
    try {
      AsyncStorage.getItem(
        `artist.${this.props.navigation.getParam("artist")}`
      ).then(data => {
        console.log(JSON.parse(data));
        if (data == null) {
          this.getLastFM(this.props.navigation.getParam("artist")).then(() => {
            this.getDeezer(this.props.navigation.getParam("artist")).then(() => {
              this.cacheArtistData();
              this.setState({ loading: false });
              this.getUnownedTracks().then(() => {
                this.getUnownedAlbums();
              });
            });
          });
        } else {
          console.log("loading cache");
          this.setState({ artist: JSON.parse(data), loading: false });
          this.getUnownedTracks().then(() => {
            this.getUnownedAlbums();
          });
        }
      });
    } catch (e) {
      console.log(e)
    }
  };

  componentWillUnmount() {}

  render() {
    console.log(this.state);

    let artistInfo = () => {
      return (
        <>
          <View style={styles.artistImgView}>
            <Image
              style={styles.artistImg}
              source={{
                uri: this.state.artist.deezer[0].artist.picture_xl,
                cache: "only-if-cached"
              }}
            />
            <LinearGradient
              colors={["#00000000", "#222222"]}
              style={styles.artistImgGradient}
            />
          </View>

          <View style={styles.artistMain}>
            <View style={styles.contained}>
              <Text style={styles.artistTitle}>
                {this.state.artist.deezer[0].artist.name}
              </Text>
              <View style={styles.statsView}>
                <Text style={{ ...styles.stats, marginRight: 13 }}>
                  {this.abbreviateNumber(
                    this.state.artist.last_fm.stats.listeners
                  )} Listeners
                </Text>
                <Text style={styles.stats}>
                  {this.abbreviateNumber(
                    this.state.artist.last_fm.stats.playcount
                  )} Scrobbles
                </Text>
              </View>

              <Text style={styles.sectionHeading}>Not in your collection</Text>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.albumsScroll}
            >
              {this.state.unownedAlbums.map((e, i) =>
                <TouchableHighlight key={i} onPress={() => this.props.navigation.navigate({routeName: "Album", params: {album: e, artist: this.state.artist}})}>
                  <Image style={styles.albumArt} source={{uri: e.cover_big, cache: "only-if-cached"}} />
                </TouchableHighlight>
              )}
            </ScrollView>
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
          {this.state.loading ? null : artistInfo()}
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
  artistImgView: {
    width: metrics.screenWidth,
    height: 238,
    zIndex: -100
  },
  artistImg: {
    width: metrics.screenWidth,
    height: 238
  },
  artistImgGradient: {
    bottom: 0,
    height: 238,
    width: metrics.screenWidth,
    position: "absolute",
    zIndex: 1
  },
  artistMain: {
    top: -150
  },
  contained: {
    marginLeft: 14,
    marginRight: 14,
  },
  artistTitle: {
    fontSize: 47,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 57,
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
  statsView: {
    flexDirection: "row"
  },
  stats: {
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffa800",
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
    marginLeft: 14,
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
)(Artist);
