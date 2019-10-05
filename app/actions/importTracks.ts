import { IMPORT_TRACKS } from "./actionTypes";
const importTracks = (state = [], action: any) => {
  switch (action.type) {
    case IMPORT_TRACKS: {
      return action.tracks;
    }
    default:
      return state;
  }
};

export default importTracks;
