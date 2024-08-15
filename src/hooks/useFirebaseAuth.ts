import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from '../redux/auth';
import { auth } from '../utils/firebase';

const useFirebaseAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(login({ id: user.uid, email: user.email, name: user.displayName, events: [] }));
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
};

export default useFirebaseAuth;
