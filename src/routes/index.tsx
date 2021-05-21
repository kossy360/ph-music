import { MemoryHistory } from 'history';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GetUserData from '../components/GetUserData';
import Home from '../views/Home';
import Library from '../views/Library';
import Login from '../views/Login';

export const AppRoutes = () => {
  return (
    <>
      <GetUserData />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/library" element={<Library />} />
      </Routes>
    </>
  );
};

interface IProps {
  // mainly for testing purposes
  children?: React.ReactNode;
  history?: MemoryHistory;
}

const Router = (props: IProps) => {
  return (
    <BrowserRouter>
      <AppRoutes />
      {props.children}
    </BrowserRouter>
  );
};

export default Router;
