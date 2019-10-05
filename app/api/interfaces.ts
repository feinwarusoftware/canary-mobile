import "./enums";

export interface Artist {
  name: string;
  image?: string;
  listeners?: number;
  scrobbles?: number;
  albums?: Album[];
  appearances?: Track[] | Album[] | Playlist[];
  genre?: Genre[];
}

/*
export interface Track {
  album: Album;
  name: string;
  artist: Artist;
  length: number;
  liked: boolean;
  inQueue: boolean;
  inLibrary: boolean;
  isExplicit: boolean;
  excludeFromShuffle: boolean;
  genre: Genre[];
  playlists: Playlist[];
  timestamps?: number[];
  lyrics?: string[];
  path: string;
}
*/

// testing
export interface Track {
  album: {
    name: string,
    cover: string,
  };
  name: string;
  artist: string;
  length: number;
  genre: string;
  path: string;
}
//

export interface Album {
  artist: Artist;
  name: string;
  image: string;
  year?: Date;
  tracks?: Track[];
  liked?: boolean;
  inQueue?: boolean;
  inLibrary?: boolean;
  isExplicit?: boolean;
  genre?: Genre[];
}

export interface Genre {
  name: string;
  similar: Genre[];
}

export interface Playlist {
  name: string;
  image: string;
  tracks: Track[];
}

export interface PlayQueue {
  tracks: Track[];
}

export interface ConnectedAccount {
  serviceName: Services;
}

export interface Settings {
  sleepTimer: Date;
  exludingFromShuffle: boolean;
  darkMode: boolean;
  crossfade: boolean;
  crossfadeAmount?: number;
  localOnly: boolean;
}
