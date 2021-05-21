import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppThemeProvider from './components/AppThemeProvider';
import FirebaseProvider from './components/FirebaseProvider';
import NotificationProvider from './components/NotificationProvider';
import ReactQueryProvider from './components/ReactQueryProvider';
import SyncLibrary from './components/SyncLibrary';
import Routes from './routes';
import store, { persistor } from './store';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ReactQueryProvider>
          <FirebaseProvider>
            <SyncLibrary />
            <AppThemeProvider>
              <NotificationProvider />
              <Routes />
            </AppThemeProvider>
          </FirebaseProvider>
        </ReactQueryProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
