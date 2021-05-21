import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import localForage from 'localforage';
import { tokenManager } from '../../services/httpService';
import {
  getUserDataService,
  loginUserService,
  refreshTokenService,
} from '../../services/spotifyService';
import { ISpotifyAuthResponse, ISpotifyUser } from '../../types/spotify';
import { LibraryActions, UserActions } from './actionTypes';
import { notifyErrorAction } from './notifyActions';

const tokenStore = localForage.createInstance({ name: 'token' });

const withPayloadType =
  <T>() =>
  (payload: T) => ({ payload: payload });

export const loginSuccessAction = createAction(UserActions.loginUserSuccess);

export const loginErrorAction = createAction(
  UserActions.loginUserError,
  withPayloadType<{ error: string }>()
);

export const logoutUserAction = createAsyncThunk(
  UserActions.logoutUser,
  async () => {
    tokenStore.setItem('data', null);
  }
);

export const loginUserAction = createAsyncThunk(
  UserActions.loginUser,
  async (authCode: string, { dispatch }) => {
    try {
      const response = await loginUserService(authCode);

      await tokenStore.setItem('data', {
        ...response,
        expires: Date.now() + response.expires_in * 999,
      });
      dispatch(loginSuccessAction());
      tokenManager.unblockRequests();
    } catch (error) {
      const message = 'An error occurred while logging you in';

      dispatch(notifyErrorAction(message));
      dispatch(loginErrorAction({ error: message }));
    }
  }
);

export const refreshUserTokenSuccessAction = createAction(
  UserActions.refreshUserTokenSuccess,
  withPayloadType<ISpotifyAuthResponse>()
);

export const refreshUserTokenAction = createAsyncThunk(
  UserActions.refreshUserToken,
  async (token: string, { dispatch }) => {
    try {
      const response = await refreshTokenService(token);

      await tokenStore.setItem('data', {
        ...response,
        expires: Date.now() + response.expires_in * 999,
        refresh_token: token,
      });
      dispatch(loginSuccessAction());
      tokenManager.unblockRequests();
    } catch (error) {
      if (
        error.isAxiosError &&
        (error as AxiosError).response?.status === 401
      ) {
        dispatch(logoutUserAction());
        dispatch(notifyErrorAction('You have been logged out, login again'));

        return;
      }

      dispatch(
        notifyErrorAction('An error occurred while completing the request')
      );
    }
  }
);

export const getUserDataSuccessAction = createAction(
  UserActions.getUserDataSuccess,
  withPayloadType<ISpotifyUser>()
);

export const getUserDataErrorAction = createAction(
  UserActions.getUserDataError,
  withPayloadType<{ error: string }>()
);

export const getUserDataAction = createAsyncThunk(
  UserActions.getUserData,
  async (data, { dispatch }) => {
    try {
      const response = await getUserDataService();

      dispatch(getUserDataSuccessAction(response));
    } catch (error) {
      dispatch(notifyErrorAction('An error occurred fetching your data'));
      dispatch(getUserDataErrorAction({ error: 'Error fetching user data' }));
    }
  }
);

export const setLibraryDataAction = createAction(
  LibraryActions.setLibraryData,
  withPayloadType<{
    tracks: Record<string, true | undefined>;
    albums: Record<string, true | undefined>;
  }>()
);
