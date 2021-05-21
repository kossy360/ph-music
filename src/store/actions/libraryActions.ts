import { createAction } from '@reduxjs/toolkit';
import { LibraryActions } from './actionTypes';

const withPayloadType =
  <T>() =>
  (payload: T) => ({ payload: payload });

export const setLibraryDataAction = createAction(
  LibraryActions.setLibraryData,
  withPayloadType<{
    tracks?: Record<string, true | undefined>;
    albums?: Record<string, true | undefined>;
  }>()
);

export const addItemToLibraryAction = createAction(
  LibraryActions.addItemToLibrary,
  withPayloadType<{
    id: string;
    type: 'track' | 'album';
  }>()
);

export const removeItemFromLibraryAction = createAction(
  LibraryActions.removeItemFromLibrary,
  withPayloadType<{
    id: string;
    type: 'track' | 'album';
  }>()
);
