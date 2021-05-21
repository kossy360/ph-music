import { EnhancedStore } from '@reduxjs/toolkit';
import axios from 'axios';
import localForage from 'localforage';
import {
  logoutUserAction,
  refreshUserTokenAction,
} from '../store/actions/userActions';
import { RootState } from '../store/reducers';
import { IAuthData } from '../types/auth';

const tokenStore = localForage.createInstance({ name: 'token' });

class TokenManager {
  blockedRequests: (() => void)[];
  isBlocked: boolean;
  store: EnhancedStore<RootState> | null;

  constructor() {
    this.blockedRequests = [];
    this.isBlocked = false;
    this.store = null;
  }

  async getToken() {
    if (process.env.NODE_ENV === 'test') return 'token';

    // check blocking status and block if necessary
    await this.canRequest();

    if (!this.store) {
      this.store = (await import('../store')).default;
    }

    let auth = (await tokenStore.getItem('data')) as IAuthData | null;
    const hasExpired = auth && Date.now() >= auth.expires;

    if (!auth || hasExpired) {
      this.isBlocked = true;

      if (!auth) {
        this.store.dispatch(logoutUserAction() as any);
      } else {
        this.store.dispatch(refreshUserTokenAction(auth.refresh_token) as any);
      }

      // block until user is authenticated
      await this.canRequest();

      auth = await tokenStore.getItem('data');
    }

    return auth!.access_token;
  }

  /**
   * checks if requests are currently being blocked i.e a token refresh request
   * is being processed. Returns a promise that is resolved when a call is
   * made to unblockRequests
   */
  canRequest() {
    if (this.isBlocked) {
      return new Promise((res) => {
        this.blockedRequests.push(() => {
          res(true);
        });
      });
    }

    return Promise.resolve(true);
  }

  /**
   * unblocks actively blocked requests. To be called by when the token refresh process is complete.
   * Calling this method would resolve all promises returned by calls to canRequest
   */
  unblockRequests() {
    this.isBlocked = false;

    this.blockedRequests.forEach((req) => req());
  }
}

export const tokenManager = new TokenManager();

export const http = axios.create();

export const authHttp = axios.create({
  baseURL: 'https://api.spotify.com/v1',
});

authHttp.interceptors.request.use(async (config) => {
  const token = await tokenManager.getToken();

  return {
    ...config,
    headers: {
      authorization: `Bearer ${token}`,
      ...config.headers,
    },
  };
});

http.interceptors.response.use(undefined);
