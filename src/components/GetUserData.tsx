import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch, useNavigate } from 'react-router-dom';
import useNotification from '../hooks/useNotification';
import { getUserDataAction } from '../store/actions/userActions';

const GetUserData = () => {
  const match = useMatch('/login');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notify = useNotification();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (isAuthenticated) {
      if (!userData) {
        dispatch(getUserDataAction());
      }
    } else {
      if (!match) {
        notify.error('You have been logged out, re-login');
        navigate('/login');
      }
    }
  }, [dispatch, isAuthenticated, navigate, notify, userData, match]);

  return null;
};

export default GetUserData;
