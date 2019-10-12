import React, { useState } from "react";
import TrackPlayer, {
  useTrackPlayerProgress,
  usePlaybackState,
  useTrackPlayerEvents,
} from "react-native-track-player";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableNativeFeedback,
  PanResponder,
} from "react-native";
import Play from "../static/img/play.svg";
import Pause from "../static/img/pause.svg";
import Chevron from "../static/img/chevron-up.svg";
import metrics from "../config/metrics";
import colors from "../config/colors";
import LinearGradient from "react-native-linear-gradient";
import Slider from "react-native-slider";

function ProgressBar() {
  const progress = useTrackPlayerProgress();

  return (
    <Slider
      style={styles.slider}
      trackStyle={styles.progress}
      thumbStyle={styles.progressThumb}
      maximumValue={progress.duration}
      value={progress.position}
      minimumTrackTintColor={colors.canarySecondary}
      maximumTrackTintColor="transparent"
      thumbTintColor={colors.canarySecondary}
      onSlidingComplete={(value: number) => TrackPlayer.seekTo(value)}
    />
  );
}

export default function PlayBar(props) {
  const playbackState = usePlaybackState();
  const [trackTitle, setTrackTitle] = useState("");
  const [trackArtwork, setTrackArtwork] = useState("");
  const [trackArtist, setTrackArtist] = useState("");
  useTrackPlayerEvents(["playback-track-changed"], async event => {
    if (event.type === TrackPlayer.TrackPlayerEvents.PLAYBACK_TRACK_CHANGED) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      setTrackTitle(track.title);
      setTrackArtist(track.artist);
      setTrackArtwork(track.artwork);
    }
  });

  const { style, onNext, onPrevious, onTogglePlayback } = props;

  let playPause = (
    <Play width={18} height={18} />
  );
  let playPausePress = () => TrackPlayer.play();

  if (
    playbackState === TrackPlayer.STATE_PLAYING ||
    playbackState === TrackPlayer.STATE_BUFFERING
  ) {
    playPause = <Pause width={18} height={18} />;
    playPausePress = () => TrackPlayer.pause();
  }

  return (
    <View style={styles.container}>
    <ProgressBar />
    <View style={styles.content}>
    <TouchableNativeFeedback
        onPress={onTogglePlayback}
        background={TouchableNativeFeedback.Ripple(colors.midGrey)}
      >
      <View style={styles.chevron}>
        <Chevron width={18} height={18} />
      </View>
    </TouchableNativeFeedback>
      <View style={styles.trackContent}>
        <Text style={styles.track}>
          {trackTitle}
        </Text>
        <Text style={styles.artist}>
          {trackArtist}
        </Text>
      </View>
      <TouchableNativeFeedback
        onPress={playPausePress}
        background={TouchableNativeFeedback.Ripple(colors.midGrey)}
      >
        <View style={styles.playPause}>
          {playPause}
        </View>
      </TouchableNativeFeedback>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: metrics.screenWidth,
    height: 64,
    backgroundColor: "#222",
    position: "absolute",
    bottom: 0,
    left: 0,
    overflow: "visible",
    zIndex: 998,
  },
  slider: {
    position: "absolute",
    width: "100%",
    zIndex: 999,
    top: -9,
    left: 0,
    height: 18,
  },
  progress: {
    height: 9,
  },
  progressThumb: {
    position: "absolute",
    width: 18,
    height: 18,
  },
  chevron: {
    flex: 1,
    flexGrow: 0,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    height: "100%",
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  track: {
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
  },
  trackContent: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  artist: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "center",
    color: "#a7a7a7",
  },
  playPause: {
    flex: 1,
    flexGrow: 0,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
