import { useMutation, useQuery } from 'react-query';

import { getProfile, updateMe, uploadImage } from './api/users';
import { useDispatch } from 'react-redux';
import { setImage } from '../store/slices/authSlice';

export function useProfile() {
  return useQuery('profile', () => getProfile());
}

export function useUpdate() {
  return useMutation('profile', ({ email, password, fname, lname }) =>
    updateMe(email, password, fname, lname)
  );
}

export function useProfileImage() {
  const dispatch = useDispatch();

  return useMutation('profile', (file) => uploadImage(file), {
    onSuccess: (data) => {
      dispatch(setImage(data));
    },
  });
}
