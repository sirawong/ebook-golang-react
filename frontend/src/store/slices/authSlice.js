import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  level: null,
  image: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.level = action.payload.level;
    },
    setImage: (state, action) => {
      state.image = action.payload.image;
    },
    signOut: (state) => {
      state.user = null;
    },
  },
});

export const { signOut, setUser, setImage } = authSlice.actions;

export default authSlice;
