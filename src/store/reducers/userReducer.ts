import { createReducer } from '@reduxjs/toolkit';
import { ISpotifyUser } from '../../types/spotify';
import {
  getUserDataErrorAction,
  getUserDataSuccessAction,
  logoutUserAction,
} from '../actions/userActions';

export interface IUserReducer {
  userData: ISpotifyUser | null;
  error: string | null;
}

const initialState: IUserReducer = {
  userData: null,
  error: null,
};

const userReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(getUserDataSuccessAction, (state, action) => {
      state.userData = action.payload;
      state.error = null;
    })
    .addCase(getUserDataErrorAction, (state, action) => {
      state.userData = null;
      state.error = action.payload.error;
    })
    .addCase(logoutUserAction.fulfilled, () => initialState)
);

export default userReducer;
