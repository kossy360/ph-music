import qs from 'qs';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Typography } from '../components/Typography';
import { clientId, redirectURL } from '../config/environment';
import { loginUserAction } from '../store/actions/userActions';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .loginContainer {
    width: 90%;
    max-width: 20rem;
    border: 1px solid #d9dadc;
    height: 10rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    padding: 1.7rem 2rem;

    .loginLink {
      width: 100%;

      .loginButton {
        padding: 10px 20px;
        background: black;
        border: none;
        border-radius: 6px;
        outline: none;
        font-family: 'fira sans';
        width: 100%;
        cursor: pointer;
      }
    }
  }
`;

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { code } = qs.parse(location.search, { ignoreQueryPrefix: true });
  const dispatch = useDispatch();
  const spotifyUrl = 'https://accounts.spotify.com/authorize';
  const scopes = [
    'user-read-email',
    'playlist-modify-private',
    'playlist-read-private',
  ];

  useEffect(() => {
    if (code) {
      dispatch(loginUserAction(code as string));
    }
  }, [code, dispatch]);

  useEffect(() => {
    if (isAuthenticated && !(location.state as any)?.noRedirect) {
      navigate('/');
    }
  }, [dispatch, isAuthenticated, navigate, location.state]);

  return (
    <Container>
      <div className="loginContainer">
        <Typography
          as="h1"
          className="welcomeText"
          textStyle="sm18"
          textColor="primary"
          textAlign="center"
        >
          Welcome
        </Typography>
        <a
          className="loginLink"
          href={`${spotifyUrl}?${qs.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scopes.join(' '),
            redirect_uri: redirectURL,
          })}`}
        >
          <button type="button" className="loginButton">
            <Typography textStyle="sm18" textColor="accent">
              {code ? 'Logging you in...' : 'Login with Spotify'}
            </Typography>
          </button>
        </a>
      </div>
    </Container>
  );
};

export default Login;
