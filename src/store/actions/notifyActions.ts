import { createAction } from '@reduxjs/toolkit';
import { NotificationActions } from './actionTypes';

const withMessagePayload = (msg: string) => ({ payload: { message: msg } });

export const notifyErrorAction = createAction(
  NotificationActions.notifyError,
  withMessagePayload
);

export const notifySuccessAction = createAction(
  NotificationActions.notifySuccess,
  withMessagePayload
);

export const resetNotificationAction = createAction(
  NotificationActions.resetNotification
);
