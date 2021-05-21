import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import useNotification from '../hooks/useNotification';
import { resetNotificationAction } from '../store/actions/notifyActions';

const ToastWrapper = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  width: 100%;
  height: 1px;
  display: flex;
  justify-content: center;
  z-index: 1000;

  .Toastify {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .Toastify__toast-container--top-center {
    left: initial;
    transform: none;

    @media only screen and (max-width: 480px) {
      top: 1em;
    }
  }

  .Toastify__toast-container {
    width: max-content;
    align-self: center;
  }

  .Toastify__toast {
    border-radius: 5px;
    padding: 0;
    max-width: 450px;
    width: max-content;
  }
  .Toastify__toast--success {
    background-color: #000000cc;

    .Toastify__toast-body {
      color: #fff;
      font-family: 'fira sans';
    }
  }
  .Toastify__toast--error {
    background-color: #000000cc;

    .Toastify__toast-body {
      color: #fff;
    }
  }
  .Toastify__toast-body {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    line-height: 25px;
    text-align: center;
    word-wrap: break-word;
  }
`;

const NotificationProvider = () => {
  const notify = useNotification();
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);

  useEffect(() => {
    if (notification.message) {
      if (notification.type === 'success') notify.success(notification.message);
      if (notification.type === 'error') notify.error(notification.message);

      dispatch(resetNotificationAction);
    }
  }, [notification, notify, dispatch]);

  return (
    <ToastWrapper>
      <ToastContainer
        position="top-center"
        transition={Slide}
        closeButton={false}
        autoClose={false}
        closeOnClick
        hideProgressBar
        enableMultiContainer
      />
    </ToastWrapper>
  );
};

export default NotificationProvider;
