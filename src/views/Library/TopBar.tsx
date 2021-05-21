import menuIcon from '@iconify-icons/feather/menu';
import xIcon from '@iconify-icons/feather/x';
import Icon from '@iconify/react';
import { Drawer } from '@material-ui/core';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import LogoutButton from '../../components/LogoutButton';
import LogoutButtonText from '../../components/LogoutButtonText';
import { PlainButton } from '../../components/PlainButton';
import { Typography } from '../../components/Typography';
import UserAvatar from '../../components/UserAvatar';
import useScreenSize from '../../hooks/useScreenSize';
import ExportForm from './ExportForm';

const Container = styled.div`
  border-bottom: 1px solid #d9dadc;
  width: 100%;
  padding: 7px 14px;

  .searchInput {
    text-align: center;
    font-family: 'fira sans';
    flex-grow: 1;
    padding: 6px;
    max-width: 30rem;
    background-color: #f3f3f3;
    border: none;
    border-radius: 5px;
    outline: none;
  }

  .topBar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .libraryLogout {
      display: grid;
      grid-auto-flow: column;
      align-items: center;
      gap: 2rem;
    }

    .avatarExport {
      display: grid;
      grid-auto-flow: column;
      gap: 3rem;
    }
  }

  .topBarMobile {
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: start;
    gap: 10px;

    .titleWrapper {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

const StyledDrawer = styled(Drawer)`
  width: 70%;

  .MuiPaper-root {
    width: 70%;
    max-width: 20rem;
  }

  .menuHeader {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    align-items: center;
    padding: 1rem;
  }

  .menuContainer {
    width: 100%;
    padding: 0 1rem;
    background-color: #fff;
    display: grid;
    grid-auto-flow: row;
    gap: 1rem;
    justify-content: start;
  }
`;

const TopBar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const screenWidth = useScreenSize();
  const navigate = useNavigate();

  return (
    <Container>
      {screenWidth.min(861) && (
        <div className="topBar">
          <div className="avatarExport">
            <UserAvatar />
            <ExportForm />
          </div>
          <Typography textStyle="sm18" textTheme={{ weight: 500 }}>
            My Library
          </Typography>
          <div className="libraryLogout">
            <PlainButton
              onClick={() => {
                navigate('/', { state: { focusInput: true } });
              }}
            >
              <Typography textStyle="sm18">Search</Typography>
            </PlainButton>
            <LogoutButton />
          </div>
        </div>
      )}
      {screenWidth.max(860) && (
        <div className="topBarMobile">
          <PlainButton aria-label="open drawer" onClick={() => setOpen(true)}>
            <Icon
              icon={menuIcon}
              height={'2rem'}
              color={theme.text.colors.primary}
            />
          </PlainButton>
          <div className="titleWrapper">
            <Typography textStyle="sm18" textTheme={{ weight: 500 }}>
              My Library
            </Typography>
          </div>
          <StyledDrawer
            role="navigation"
            aria-label="app drawer"
            open={open}
            onClose={() => setOpen(false)}
          >
            <div className="menuHeader">
              <PlainButton
                aria-label="close menu"
                onClick={() => setOpen(false)}
              >
                <Icon
                  icon={xIcon}
                  height={'2rem'}
                  color={theme.text.colors.primary}
                />
              </PlainButton>
            </div>
            <div className="menuContainer">
              <UserAvatar />
              <ExportForm />
              <PlainButton
                justify="start"
                onClick={() => {
                  navigate('/', { state: { focusInput: true } });
                }}
              >
                <Typography textStyle="sm16">Search</Typography>
              </PlainButton>
              <LogoutButtonText />
            </div>
          </StyledDrawer>
        </div>
      )}
    </Container>
  );
};

export default TopBar;
