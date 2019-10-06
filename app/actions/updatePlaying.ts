import { UPDATE_PLAYING } from "./actionTypes";
const updatePlaying = (state = {}, action: any) => {
  switch (action.type) {
    case UPDATE_PLAYING: {
      return action.track;
    }
    default:
      return state;
  }
};

export default updatePlaying;
