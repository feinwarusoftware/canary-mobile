import AsyncStorage from "@react-native-community/async-storage";
import importTracks from "./importTracks";
import store from "../store/reduxStore";

const getTracks = async (force = false) => {
  await AsyncStorage.getItem("tracks").then((e) => {
    if (e == null || force) {
      importTracks().then((e) => {
        console.log(e);
        store.dispatch({ type: "IMPORT_TRACKS", tracks: e });
        AsyncStorage.setItem("tracks", JSON.stringify(e));
      });
    } else {
      store.dispatch({ type: "IMPORT_TRACKS", tracks: JSON.parse(e) });
    }
  });
};

export default getTracks;
