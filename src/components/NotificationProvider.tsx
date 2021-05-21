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

  .Toastify__toast-container {
    width: max-content;
  }

  .Toastify__toast {
    border-radius: 5px;
    padding: 0;
    max-width: 450px;
    width: max-content;
  }
  .Toastify__toast--success {
    background-color: black;

    .Toastify__toast-body {
      color: #fff;
      font-family: 'fira sans';
    }
  }
  .Toastify__toast--error {
    background-color: black;

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
        autoClose={3000}
        closeOnClick
        hideProgressBar
        enableMultiContainer
      />
    </ToastWrapper>
  );
};

export default NotificationProvider;
