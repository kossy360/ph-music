import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { logoutUserAction } from '../store/actions/userActions';
import { Typography } from './Typography';

const Container = styled.button`
  padding: 0;
  display: flex;
  align-items: center;
  border: 2px solid;
  background: none;
  padding: 0;
  border-radius: 5px;
  cursor: pointer;
  border: none;
`;

const LogoutButtonText = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    navigate('/login');
    dispatch(logoutUserAction());
  };

  return (
    <Container type="button" onClick={logout}>
      <Typography textStyle="sm16">Logout</Typography>
    </Container>
  );
};

export default LogoutButtonText;
