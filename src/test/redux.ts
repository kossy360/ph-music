import { createStore } from 'redux';
import rootReducer, { RootState } from '../store/reducers';

export const authenticatedInitialReduxState: RootState = {
  auth: {
    isAuthenticated: true,
    error: null,
    _persist: { version: -1, rehydrated: true },
  },
  user: {
    userData: {
      display_name: 'kossy',
      product: '',
      email: 'kossyugochukwu@gmail.com',
      external_urls: {
        spotify: 'https://open.spotify.com/user/j6934es7ucnvi3bg53on801w8',
      },
      href: 'https://api.spotify.com/v1/users/j6934es7ucnvi3bg53on801w8',
      id: 'j6934es7ucnvi3bg53on801w8',
      images: [],
      type: 'user',
      uri: 'spotify:user:j6934es7ucnvi3bg53on801w8',
    },
    error: null,
  },
  library: {
    tracks: {
      '1kPpge9JDLpcj15qgrPbYX': true,
      '5L79aNYCTKiZq7vaOElXYj': true,
      '6sHxpnCerm9M6A5zaFFNfs': true,
    },
    albums: { '2kjyPzcMPYUZlB9CJzu10f': true, '5tArdU5M7zWxHPHVL4B7Wv': true },
  },
  notification: { message: null, type: 'success' },
};

export const authenticatedTestStore = () =>
  createStore(rootReducer, authenticatedInitialReduxState);

export const defaultTestStore = () => createStore(rootReducer);
