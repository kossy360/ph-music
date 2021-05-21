import { createReducer } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { persistReducer } from 'redux-persist';
import {
  loginErrorAction,
  loginSuccessAction,
  logoutUserAction,
} from '../actions/userActions';

export interface TAuthReducer {
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: TAuthReducer = {
  isAuthenticated: false,
  error: null,
};

const authReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(loginSuccessAction, (state) => {
      state.isAuthenticated = true;
      state.error = null;
    })
    .addCase(loginErrorAction, (state, action) => {
      state.error = action.payload.error;
      state.isAuthenticated = false;
    })
    .addCase(logoutUserAction.fulfilled, () => initialState)
);

export default persistReducer(
  {
    key: 'auth_data',
    storage: localForage,
    whitelist: ['isAuthenticated'],
  },
  authReducer
);
