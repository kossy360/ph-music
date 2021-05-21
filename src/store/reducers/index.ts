import { combineReducers } from 'redux';
import authReducer from './authReducer';
import libraryReducer from './libraryReducer';
import notificationReducer from './notificationReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  library: libraryReducer,
  notification: notificationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
