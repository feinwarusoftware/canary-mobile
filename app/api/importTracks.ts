import { RNAndroidAudioStore } from "react-native-get-music-files";
import { DeviceEventEmitter } from "react-native";
import { Track } from "./interfaces";

interface Batch {
  album: string;
  author: string;
  cover: string;
  duration: number;
  fileName: string;
  path: string;
  title: string;
  genre: string;
}

const importTracks = (): Promise<Track[]> => {
  return new Promise((resolve, reject): void => {
    let tracks: Track[] = [];

    DeviceEventEmitter.addListener("onLastBatchReceived", (): void => {
      DeviceEventEmitter.removeAllListeners();

      resolve(tracks);
    });

    DeviceEventEmitter.addListener("onBatchReceived", (params: { batch: Batch[] }): void => {
      const newTracks = params.batch.map((e: Batch): Track => ({
        album: {
          name: e.album,
          cover: e.cover,
        },
        name: e.title,
        artist: e.author,
        length: Number(e.duration), // im assuming android isnt retarded here
        genre: e.genre,
        path: e.path,
      }));

      tracks = [...tracks, ...newTracks];
    });

    DeviceEventEmitter.addListener("", (error) => {
      reject(error);
    });

    RNAndroidAudioStore.getAll({
      blured: false, // works only when 'cover' is set to true
      artist: true,
      duration: true, // default : true
      cover: true, // default : true,
      genre: true,
      title: true,
      minimumSongDuration: 10000, // get songs bigger than 10000 miliseconds duration,
      batchNumber: 100,
      delay: 1000,
    });
  });
};

export default importTracks;
