import faker from 'faker';
import { mapValues, random } from 'lodash';
import { createServer, Factory, Model } from 'miragejs';
import {
  IGetAlbumsByIdsResult,
  IGetTrackByIdsResult,
  ISpotifyAlbum,
  ISpotifyArtist,
  ISpotifyAuthResponse,
  ISpotifyNewReleasesResult,
  ISpotifyResultMeta,
  ISpotifyTrack,
  ISpotifyTracksSearchResult,
  ISpotifyUser,
} from '../types/spotify';

const createSpotifyAuthResponse = (): ISpotifyAuthResponse => ({
  access_token: faker.random.alphaNumeric(50),
  token_type: 'access_token',
  scope: 'playlist-read-private user-library-read',
  expires_in: 3600,
});

const createSpotifyUser = (): ISpotifyUser => ({
  display_name: faker.name.firstName(),
  email: faker.internet.email(),
  external_urls: {
    spotify: 'https://open.spotify.com/user/2kjyPzcMPYUZlB9CJzu10f',
  },
  href: '',
  id: faker.random.alphaNumeric(15),
  images: [
    {
      height: 640,
      url: 'https://i.scdn.co/image/ab67616d0000b27390acd1669192dc34cae79608',
      width: 640,
    },
  ],
  product: '',
  type: 'user',
  uri: 'spotify:user:2kjyPzcMPYUZlB9CJzu10f',
});

const createSpotifyArtist = (): ISpotifyArtist => ({
  href: faker.internet.domainName(),
  id: faker.random.alphaNumeric(10),
  name: faker.name.findName(),
  type: 'artist',
  uri: faker.random.alphaNumeric(25),
  external_urls: { spotify: faker.internet.domainName() },
});

const createSpotifyAlbum = (): ISpotifyAlbum => ({
  album_type: 'single',
  artists: [createSpotifyArtist()],
  available_markets: ['AD', 'AE', 'AG', 'ZM', 'ZW'],
  external_urls: {
    spotify: 'https://open.spotify.com/album/2kjyPzcMPYUZlB9CJzu10f',
  },
  href: 'https://api.spotify.com/v1/albums/2kjyPzcMPYUZlB9CJzu10f',
  id: faker.random.alphaNumeric(15),
  images: [
    {
      height: 640,
      url: 'https://i.scdn.co/image/ab67616d0000b27390acd1669192dc34cae79608',
      width: 640,
    },
  ],
  name: faker.random.alpha({ count: 5 }),
  release_date: '2021-05-14',
  release_date_precision: 'day',
  total_tracks: 2,
  type: 'album',
  uri: 'spotify:album:2kjyPzcMPYUZlB9CJzu10f',
});

const createSpotifyTrack = (): ISpotifyTrack => ({
  album: createSpotifyAlbum(),
  artists: [createSpotifyArtist()],
  available_markets: ['AD', 'AE', 'AG', 'ZM', 'ZW'],
  disc_number: random(1, 9, false),
  duration_ms: random(120000, 300000, false),
  explicit: false,
  external_urls: {
    spotify: 'https://open.spotify.com/album/2kjyPzcMPYUZlB9CJzu10f',
  },
  external_ids: {
    isrc: '',
  },
  href: 'https://api.spotify.com/v1/tracks/2kjyPzcMPYUZlB9CJzu10f',
  id: faker.random.alphaNumeric(15),
  is_local: true,
  name: faker.random.alpha({ count: 5 }),
  popularity: 5,
  track_number: random(1, 9, false),
  type: 'track',
  uri: 'spotify:track:2kjyPzcMPYUZlB9CJzu10f',
});

const createSpotifyResultMeta = (
  limit: number,
  offset: number,
  total: number,
  isLast?: boolean
): ISpotifyResultMeta => ({
  limit,
  offset,
  total,
  href: '',
  next: isLast ? null : 'www.nextpage.next',
});

export const startMirage = () => {
  return createServer({
    environment: 'test',
    models: {
      spotifyAlbum: Model,
      spotifyTrack: Model,
    },
    factories: {
      spotifyAlbum: Factory.extend({
        album() {
          return createSpotifyAlbum();
        },
      }),
      spotifyTrack: Factory.extend({
        track() {
          return createSpotifyTrack();
        },
      }),
    },
    routes() {
      this.urlPrefix = 'https://api.spotify.com/v1';

      this.get(
        '/browse/new-releases',
        (schema, request): ISpotifyNewReleasesResult => {
          const query = mapValues(request.queryParams, Number);
          const items = schema.all('spotifyAlbum').models.map((m) => m.album);
          const response: ISpotifyNewReleasesResult = {
            albums: {
              items: items.slice(query.offset, query.limit),
              ...createSpotifyResultMeta(
                query.limit,
                query.offset,
                items.length
              ),
            },
          };

          return response;
        }
      );

      this.get('/search', (schema, request): ISpotifyTracksSearchResult => {
        const { q, type, ...pageQuery } = request.queryParams;
        const query = mapValues(pageQuery, Number);
        const items = schema.all('spotifyTrack').models.map((m) => m.track);
        const response: ISpotifyTracksSearchResult = {
          tracks: {
            items: items.slice(query.offset, query.limit),
            ...createSpotifyResultMeta(query.limit, query.offset, items.length),
          },
        };

        return response;
      });

      this.get('/tracks', (schema): IGetTrackByIdsResult => {
        const tracks = schema.all('spotifyTrack').models.map((m) => m.track);

        return { tracks };
      });

      this.get('/albums', (schema): IGetAlbumsByIdsResult => {
        const albums = schema.all('spotifyAlbum').models.map((m) => m.album);

        return { albums };
      });
    },
  });
};
