import { ISpotifyAuthResponse } from './spotify';

export interface IAuthData extends ISpotifyAuthResponse {
  refresh_token: string;
  expires: number;
}
