import { combineReducers } from "redux";
import { updatePlaying, importTracks } from "../actions";

export default combineReducers({
  importTracks,
  updatePlaying,
});
