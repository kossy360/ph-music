import 'firebase/database';
import app from 'firebase/app';
import React, { createContext, useMemo } from 'react';
import { firebaseConfig } from '../config/environment';

const FirebaseContext = createContext<IFirebase | null>(null);
export { FirebaseContext };

interface IProps {
  children: React.ReactNode;
}

interface IFirebase {
  app: app.app.App;
  database: app.database.Database;
}

const FirebaseProvider = (props: IProps) => {
    
  const App = useMemo(() => {
    if (!app.apps.length) {
      return app.initializeApp(firebaseConfig);
    }
    return app.apps[0];
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        app: App,
        database: App.database(),
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
