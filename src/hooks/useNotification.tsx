import successIcon from '@iconify-icons/bi/check-circle';
import errorIcon from '@iconify-icons/bi/exclamation-circle';
import Icon from '@iconify/react';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import styled, { useTheme } from 'styled-components';
import { Typography } from '../components/Typography';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  max-width: 17rem;

  svg {
    margin-bottom: 5px;
  }
`;

const NotifyContainer = ({ icon, message }: { icon: any; message: string }) => {
  const theme = useTheme();

  return (
    <Container>
      <Icon icon={icon} height={'1.5rem'} color={theme.text.colors.accent} />
      <Typography textColor="accent" textAlign="center">
        {message}
      </Typography>
    </Container>
  );
};

const useNotification = () => {
  const success = useCallback((msg: string) => {
    toast.success(<NotifyContainer icon={successIcon} message={msg} />);
  }, []);

  const error = useCallback((msg: string) => {
    toast.success(<NotifyContainer icon={errorIcon} message={msg} />);
  }, []);

  return { success, error };
};

export default useNotification;
