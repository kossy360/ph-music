export enum UIActionTypes {
  SET_SCREEN_WIDTH = 'SET_SCREEN_WIDTH',
}

export enum UserActions {
  loginUser = 'loginUser',
  loginUserSuccess = 'loginUserSuccess',
  loginUserError = 'loginUserError',

  refreshUserToken = 'refreshUserToken',
  refreshUserTokenSuccess = 'refreshUserTokenSuccess',
  refreshUserTokenError = 'refreshUserTokenError',

  logoutUser = 'logoutUser',

  getUserData = 'getUserData',
  getUserDataSuccess = 'getUserDataSuccess',
  getUserDataError = 'getUserDataError',
}

export enum LibraryActions {
  setLibraryData = 'setLibraryData',

  addItemToLibrary = 'addItemToLibrary',
  removeItemFromLibrary = 'removeItemFromLibrary',
}

export enum NotificationActions {
  notifyError = 'notifyError',
  notifySuccess = 'notifySuccess',
  resetNotification = 'resetNotification',
}
