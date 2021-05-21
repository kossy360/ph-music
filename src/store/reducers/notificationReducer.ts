import { createReducer } from '@reduxjs/toolkit';
import {
  notifyErrorAction,
  notifySuccessAction,
  resetNotificationAction,
} from '../actions/notifyActions';
import { logoutUserAction } from '../actions/userActions';

export interface INotificationReducer {
  message: string | null;
  type: 'success' | 'error';
}

const initialState: INotificationReducer = {
  message: null,
  type: 'success',
};

const notificationReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(notifySuccessAction, (state, action) => {
      state.type = 'success';
      state.message = action.payload.message;
    })
    .addCase(notifyErrorAction, (state, action) => {
      state.type = 'error';
      state.message = action.payload.message;
    })
    .addCase(resetNotificationAction, () => initialState)
    .addCase(logoutUserAction.fulfilled, () => initialState)
);

export default notificationReducer;
