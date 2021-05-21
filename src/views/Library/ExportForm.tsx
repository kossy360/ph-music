import xIcon from '@iconify-icons/bi/x';
import Icon from '@iconify/react';
import { CircularProgress, Modal } from '@material-ui/core';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import * as yup from 'yup';
import { PlainButton } from '../../components/PlainButton';
import { Typography } from '../../components/Typography';
import useNotification from '../../hooks/useNotification';
import { createAndAddItemsToPlaylistService } from '../../services/spotifyService';

const ModalContainer = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;

  .modalContent {
    width: 90%;
    background-color: #fff;
    max-width: 20rem;
    border-radius: 6px;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid #d9dadc;
    }

    .formDescription {
      padding: 1rem 1rem 0;
    }

    .formContent {
      padding: 1rem;

      .inputContainer {
        display: grid;
        margin-bottom: 1rem;
        gap: 5px;

        .formInput {
          font-family: 'fira sans';
          flex-grow: 1;
          font-size: 14px;
          max-width: 30rem;
          background-color: #f3f3f3;
          border: none;
          padding: 10px;
          border-radius: 5px;
          outline: none;
        }
      }

      .submitButton {
        padding: 10px 20px;
        background: black;
        border: none;
        border-radius: 6px;
        outline: none;
        font-family: 'fira sans';
        width: 100%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        .MuiCircularProgress-svg {
          color: ${(p) => p.theme.text.colors.accent};
        }
      }
    }
  }
`;

interface IForm {
  name: string;
  description: string;
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Playlist name is required'),
  description: yup.string(),
});

const initialFormData: IForm = {
  name: '',
  description: '',
};

const ExportForm = () => {
  const theme = useTheme();
  const notify = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const userId = useSelector((state) => state.user.userData?.id!);
  const items = useSelector((state) => Object.keys(state.library.tracks));
  const exportLibrary = useMutation(
    (data: IForm) =>
      createAndAddItemsToPlaylistService(
        userId,
        data.name,
        data.description,
        items
      ),
    {
      onSuccess: () => notify.success('Library exported'),
      onError: () => {
        notify.error('An error occurred while exporting your library');
      },
    }
  );

  return (
    <>
      <PlainButton onClick={() => setIsOpen(true)}>
        <Typography textStyle="sm16">Export to My Spotify</Typography>
      </PlainButton>
      <ModalContainer open={isOpen}>
        <div className="modalContent">
          <div className="header">
            <Typography textStyle="sm18">Export Library</Typography>
            <PlainButton
              aria-label="close form"
              onClick={() => setIsOpen(false)}
            >
              <Icon
                icon={xIcon}
                height={'1.5rem'}
                color={theme.text.colors.primary}
              />
            </PlainButton>
          </div>
          <div className="formDescription">
            <Typography
              textColor="primary600"
              textStyle="sm12"
              textAlign="center"
            >
              Export tracks in your library to a new spotify playlist
            </Typography>
          </div>
          <Formik
            initialValues={initialFormData}
            validationSchema={validationSchema}
            onSubmit={async (values, helpers) => {
              await exportLibrary.mutateAsync(values);
              helpers.resetForm();
              setIsOpen(false);
            }}
          >
            <Form aria-label="export to library form" className="formContent">
              <div className="inputContainer">
                <Field
                  name="name"
                  className="formInput"
                  placeholder="Playlist name (required)"
                />
                <ErrorMessage name="name">
                  {(msg) => (
                    <Typography textStyle="sm12" style={{ color: 'red' }}>
                      {msg}
                    </Typography>
                  )}
                </ErrorMessage>
              </div>
              <div className="inputContainer">
                <Field
                  as="textarea"
                  name="description"
                  className="formInput"
                  placeholder="Short description (optional)"
                />
              </div>
              <button type="submit" className="submitButton">
                {exportLibrary.isLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <Typography textColor="accent">Export</Typography>
                )}
              </button>
            </Form>
          </Formik>
        </div>
      </ModalContainer>
    </>
  );
};

export default ExportForm;
