import menuIcon from '@iconify-icons/feather/menu';
import xIcon from '@iconify-icons/feather/x';
import Icon from '@iconify/react';
import { Drawer } from '@material-ui/core';
import { throttle } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import LogoutButton from '../../components/LogoutButton';
import LogoutButtonText from '../../components/LogoutButtonText';
import { PlainButton } from '../../components/PlainButton';
import { Typography } from '../../components/Typography';
import UserAvatar from '../../components/UserAvatar';
import useScreenSize from '../../hooks/useScreenSize';

const Container = styled.div`
  border-bottom: 1px solid #d9dadc;
  width: 100%;
  padding: 5px 10px;

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
    padding: 7px 14px;

    .libraryLogout {
      display: grid;
      grid-auto-flow: column;
      align-items: center;
      gap: 2rem;

      .logoutButton {
        padding: 0;
        display: flex;
        align-items: center;
        border: 2px solid;
        background: none;
        padding: 0 20px;
        border-radius: 5px;
        cursor: pointer;
      }
    }
  }

  .topBarMobile {
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: start;
    gap: 10px;

    .inputWrapper {
      display: flex;
      justify-content: center;
    }
  }
`;

const StyledDrawer = styled(Drawer)`
  width: 70%;

  .MuiPaper-root {
    width: 70%;
    max-width: 45rem;
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

interface IProps {
  onSearchChange: (val: string) => void;
}

const TopBar = (props: IProps) => {
  const { onSearchChange } = props;
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const screenWidth = useScreenSize();
  const [search, setSearch] = useState('');

  const throttledSearch = useMemo(
    () => throttle(onSearchChange, 600, { trailing: true }),
    [onSearchChange]
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if ((location.state as any)?.focusInput) {
      inputRef.current?.focus();
    }
  }, [location.state]);

  useEffect(() => {
    throttledSearch(search);
  }, [search, throttledSearch]);

  return (
    <Container>
      {screenWidth.min(861) && (
        <div className="topBar">
          <UserAvatar />
          <input
            ref={inputRef}
            type="text"
            aria-label="search field"
            className="searchInput"
            placeholder="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="libraryLogout">
            <Link to="/library">
              <Typography textStyle="sm18">My Library</Typography>
            </Link>
            <LogoutButton />
          </div>
        </div>
      )}
      {screenWidth.max(860) && (
        <div className="topBarMobile">
          <PlainButton aria-label="open menu" onClick={() => setOpen(true)}>
            <Icon
              icon={menuIcon}
              height={'2rem'}
              color={theme.text.colors.primary}
            />
          </PlainButton>
          <div className="inputWrapper">
            <input
              ref={inputRef}
              type="text"
              aria-label="search field"
              className="searchInput"
              placeholder="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <StyledDrawer open={open} onClose={() => setOpen(false)}>
            <div
              role="navigation"
              aria-label="app drawer"
              className="menuHeader"
            >
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
              <Link to="/library">
                <Typography textStyle="sm16">My Library</Typography>
              </Link>
              <LogoutButtonText />
            </div>
          </StyledDrawer>
        </div>
      )}
    </Container>
  );
};

export default TopBar;
