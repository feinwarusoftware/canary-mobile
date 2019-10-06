import store from "../store/reduxStore";
import { Track } from "./interfaces";

const updatePlaying = (track:Track) => {
  store.dispatch({ type: "UPDATE_PLAYING", track });
};

export default updatePlaying;
