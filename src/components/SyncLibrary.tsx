import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLibraryDataAction } from '../store/actions/libraryActions';
import { FirebaseContext } from './FirebaseProvider';

const SyncLibrary = () => {
  const userId = useSelector((state) => state.user.userData?.id);
  const firebase = useContext(FirebaseContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!firebase || !userId) return;

    const ref = firebase.database.ref(`library/${userId}`);

    ref.on('value', (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();

        dispatch(setLibraryDataAction({ ...val }));
      }
    });

    return () => ref.off();
  }, [firebase, userId, dispatch]);

  return null;
};

export default SyncLibrary;
