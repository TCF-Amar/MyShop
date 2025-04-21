import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  clearUser,fetchUser, setError } from "../redux/features/userSlice";
import { firebaseAuth } from "../utils/firebase";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      try {

        if (firebaseUser) {
          await dispatch(fetchUser(firebaseUser.uid));

        } else {
          dispatch(clearUser());
        }
      } catch (err) {
        dispatch(setError(err.message));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const isAuthenticated = !!user;

  return {
    user,
    loading,
    error,
    isAuthenticated
  };
};

export { useAuth };
