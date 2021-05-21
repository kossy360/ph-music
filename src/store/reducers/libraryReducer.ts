import { createReducer } from '@reduxjs/toolkit';
import {
  addItemToLibraryAction,
  removeItemFromLibraryAction,
  setLibraryDataAction,
} from '../actions/libraryActions';
import { logoutUserAction } from '../actions/userActions';

export interface ILibraryReducer {
  tracks: Record<string, true | undefined>;
  albums: Record<string, true | undefined>;
}

const initialState: ILibraryReducer = {
  tracks: {},
  albums: {},
};

const libraryReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(setLibraryDataAction, (state, action) => {
      state.tracks = action.payload.tracks ?? {};
      state.albums = action.payload.albums ?? {};
    })
    .addCase(addItemToLibraryAction, (state, action) => {
      const library =
        action.payload.type === 'album' ? state.albums : state.tracks;

      library[action.payload.id] = true;
    })
    .addCase(removeItemFromLibraryAction, (state, action) => {
      const library =
        action.payload.type === 'album' ? state.albums : state.tracks;

      library[action.payload.id] = undefined;
    })
    .addCase(logoutUserAction.fulfilled, () => initialState)
);

export default libraryReducer;
