export interface ISpotifyAuthResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
}

export interface IUserAuthResponse extends ISpotifyAuthResponse {
  refresh_token: string;
}

export interface ISpotifyUserImage {
  height?: any;
  url: string;
  width?: any;
}

export interface ISpotifyUser {
  display_name: string;
  email: string;
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: ISpotifyUserImage[];
  product: string;
  type: string;
  uri: string;
}

export interface ISpotifyArtist {
  external_urls: { spotify: string };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ISpotifyImage {
  height: number;
  url: string;
  width: number;
}

export interface ISpotifyAlbum {
  album_type: string;
  artists: ISpotifyArtist[];
  available_markets: string[];
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: ISpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface ISpotifyTrack {
  album: ISpotifyAlbum;
  artists: ISpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: { isrc: string };
  external_urls: { spotify: string };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url?: any;
  track_number: number;
  type: string;
  uri: string;
}

interface ISpotifyOwner {
  external_urls: { spotify: string };
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface ISpotifyPlaylist {
  collaborative: boolean;
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: any[];
  name: string;
  owner: ISpotifyOwner;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
}

export interface ISpotifyResultMeta {
  limit: number;
  next: string | null;
  offset: number;
  previous?: any;
  total: number;
  href: string;
}

export interface Tracks extends ISpotifyResultMeta {
  items: ISpotifyTrack[];
}

export interface ISpotifyTracksSearchResult {
  tracks: Tracks;
}

export interface ISpotifyNewReleasesResult {
  albums: {
    items: ISpotifyAlbum[];
  } & ISpotifyResultMeta;
}

export interface IGetTrackByIdsResult {
  tracks: ISpotifyTrack[];
}

export interface IGetAlbumsByIdsResult {
  albums: ISpotifyAlbum[];
}
