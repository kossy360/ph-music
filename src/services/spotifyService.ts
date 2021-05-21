import { chunk } from 'lodash';
import qs from 'qs';
import { clientId, clientSecret, redirectURL } from '../config/environment';
import {
  IGetAlbumsByIdsResult,
  IGetTrackByIdsResult,
  ISpotifyAuthResponse,
  ISpotifyNewReleasesResult,
  ISpotifyPlaylist,
  ISpotifyTracksSearchResult,
  ISpotifyUser,
  IUserAuthResponse,
} from '../types/spotify';
import { authHttp, http } from './httpService';

export const loginUserService = async (code: string) => {
  const response = await http.post<IUserAuthResponse>(
    'https://accounts.spotify.com/api/token',
    qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectURL,
    }),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString('base64')}`,
      },
    }
  );

  return response.data;
};

export const refreshTokenService = async (refreshToken: string) => {
  const response = await http.post<ISpotifyAuthResponse>(
    'https://accounts.spotify.com/api/token',
    qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString('base64')}`,
      },
    }
  );

  return response.data;
};

export const getUserDataService = async () => {
  const response = await authHttp.get<ISpotifyUser>('me');

  return response.data;
};

export const createAndAddItemsToPlaylistService = async (
  userId: string,
  name: string,
  description: string,
  items: string[]
) => {
  const newPlaylist = await authHttp.post<ISpotifyPlaylist>(
    `users/${userId}/playlists`,
    {
      name,
      description,
      public: false,
      collaborative: false,
    }
  );

  // introducing a little delay here to compensate delayed change propagation
  await new Promise((res) =>
    setTimeout(() => {
      res(true);
    }, 1000)
  );

  await authHttp.post<{ snapshot_id: string }>(
    `playlists/${newPlaylist.data.id}/tracks`,
    {
      uris: items.map((item) => `spotify:track:${item}`),
    }
  );

  return newPlaylist.data;
};

export const searchTracksService = async (query: {
  q: string;
  offset: number;
}) => {
  const response = await authHttp.get<ISpotifyTracksSearchResult>('search', {
    params: { ...query, type: 'track', limit: 20 },
  });

  return response.data;
};

export const newReleasesService = async (offset: number, limit: number) => {
  const response = await authHttp.get<ISpotifyNewReleasesResult>(
    'browse/new-releases',
    { params: { offset, limit } }
  );

  return response.data;
};

export const getTracksByIdsService = async (ids: string[]) => {
  const idChunks = chunk(ids, 50);
  const tracks = await Promise.all(
    idChunks.map((idc) => {
      return authHttp.get<IGetTrackByIdsResult>('tracks', {
        params: { ids: idc.join(',') },
      });
    })
  );
  const response = tracks.reduce((acc, curr) => {
    acc.data.tracks.concat(curr.data.tracks);
    return acc;
  });

  return response.data;
};

export const getAlbumsByIdsService = async (ids: string[]) => {
  const idChunks = chunk(ids, 20);
  const tracks = await Promise.all(
    idChunks.map((idc) => {
      return authHttp.get<IGetAlbumsByIdsResult>('albums', {
        params: { ids: idc.join(',') },
      });
    })
  );
  const response = tracks.reduce((acc, curr) => {
    acc.data.albums.concat(curr.data.albums);
    return acc;
  });

  return response.data;
};
