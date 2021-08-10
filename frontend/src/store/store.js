import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './slices/cartSlice';
import authSlice from './slices/authSlice';

export default configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartReducer.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false }),
});
