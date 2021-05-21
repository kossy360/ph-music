import arrowRightIcon from '@iconify-icons/bi/arrow-right';
import Icon from '@iconify/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import styled, { useTheme } from 'styled-components';
import { logoutUserAction } from '../store/actions/userActions';

const Container = styled.button`
  padding: 0;
  display: flex;
  align-items: center;
  border: 2px solid;
  background: black;
  padding: 0 20px;
  border-radius: 5px;
  cursor: pointer;
`;

const LogoutButton = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    navigate('/login', { state: { noRedirect: true } });

    // little hack to prevent "GetUserData" from raising a notification
    setTimeout(() => {
      dispatch(logoutUserAction());
    }, 200);
  };

  return (
    <Container aria-label="logout button" type="button" onClick={logout}>
      <Icon
        icon={arrowRightIcon}
        height={'1.5rem'}
        color={theme.text.colors.accent}
      />
    </Container>
  );
};

export default LogoutButton;
