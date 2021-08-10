import { useMutation } from 'react-query';

import { signin, signup, logout } from './api/users';
import { useDispatch } from 'react-redux';

import { setUser, signOut } from '../store/slices/authSlice';

export function useSignIn() {
  const dispatch = useDispatch();

  return useMutation('signin', ({ email, password }) => signin(email, password), {
    onSuccess: ({ user, level }) => {
      dispatch(setUser({ user, level }));
    },
  });
}

export function useSignUp() {
  const dispatch = useDispatch();

  return useMutation(
    'singup',
    ({ fname, lname, email, password }) => signup(fname, lname, email, password),
    {
      onSuccess: ({ user, level }) => {
        dispatch(setUser({ user, level }));
      },
    }
  );
}

export function useLogout() {
  const dispatch = useDispatch();

  return useMutation('logout', () => logout(), {
    onSuccess: () => {
      dispatch(signOut());
    },
  });
}
