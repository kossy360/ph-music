import { render as rtlRender, RenderOptions } from '@testing-library/react';
import React, { FunctionComponent, ReactElement } from 'react';
import { QueryClient } from 'react-query';
import { Provider } from 'react-redux';
import { MemoryRouter, MemoryRouterProps } from 'react-router';
import { Store } from 'redux';
import AppThemeProvider from '../components/AppThemeProvider';
import FirebaseProvider from '../components/FirebaseProvider';
import NotificationProvider from '../components/NotificationProvider';
import ReactQueryProvider from '../components/ReactQueryProvider';
import SyncLibrary from '../components/SyncLibrary';
import { RootState } from '../store/reducers';
import { defaultTestStore } from './redux';

interface ITestAppConfig {
  store?: Store<RootState>;
  routerProps?: MemoryRouterProps;
  renderOptions?: RenderOptions;
}

export const renderWithApp = (ui: ReactElement, props: ITestAppConfig) => {
  const store = props.store ?? defaultTestStore();
  const queryClient = new QueryClient();

  const Wrapper: FunctionComponent = ({ children }) => {
    return (
      <Provider store={store}>
        <ReactQueryProvider client={queryClient}>
          <FirebaseProvider>
            <SyncLibrary />
            <AppThemeProvider>
              <NotificationProvider />
              <MemoryRouter {...(props.routerProps ?? {})}>
                {children}
              </MemoryRouter>
            </AppThemeProvider>
          </FirebaseProvider>
        </ReactQueryProvider>
      </Provider>
    );
  };
  return rtlRender(ui, { wrapper: Wrapper, ...(props.renderOptions ?? {}) });
};
