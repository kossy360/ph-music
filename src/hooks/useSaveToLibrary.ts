import { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FirebaseContext } from '../components/FirebaseProvider';
import {
  addItemToLibraryAction,
  removeItemFromLibraryAction,
} from '../store/actions/libraryActions';
import useNotification from './useNotification';

const useSaveToLibrary = (library: 'tracks' | 'albums') => {
  const firebase = useContext(FirebaseContext)!;
  const userId = useSelector((state) => state.user.userData?.id);
  const savedAlbums = useSelector((state) => state.library.albums);
  const savedTracks = useSelector((state) => state.library.tracks);
  const { error: notifyError } = useNotification();
  const dispatch = useDispatch();

  const toggleSave = useCallback(
    async (id: string) => {
      if (!userId) return;

      const type = library === 'albums' ? 'album' : 'track';
      const isSaved =
        library === 'albums'
          ? savedAlbums[id] ?? false
          : savedTracks[id] ?? false;
      const ref = firebase.database.ref(`library/${userId}/${library}/${id}`);

      try {
        if (!isSaved) {
          dispatch(addItemToLibraryAction({ id, type }));
          await ref.set(true);
        } else {
          await ref.remove();
        }
      } catch (error) {
        dispatch(removeItemFromLibraryAction({ id, type }));
        notifyError(`We encountered a problem adding ${type} to your library`);
      }
    },
    [
      userId,
      firebase.database,
      savedAlbums,
      savedTracks,
      library,
      notifyError,
      dispatch,
    ]
  );

  const remove = useCallback(
    async (id: string) => {
      if (!userId) return;

      try {
        await firebase.database
          .ref(`library/${userId}/${library}/${id}`)
          .remove();
      } catch (error) {
        // do some notifications
      }
    },
    [firebase.database, userId, library]
  );

  return { toggleSave, remove };
};

export default useSaveToLibrary;
