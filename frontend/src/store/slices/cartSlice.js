import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  total: 0,
  value: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    fetchCart: (state, action) => {
      return action.payload;
    },
    addToCart: (state, action) => {
      const foundItem = state.cart.find((item) => item.id === action.payload.id);

      if (!foundItem) {
        state.cart.push(action.payload);
      } else {
        state.cart = state.cart.map((item) => ({
          ...item,
          quantity: item.id === foundItem.id ? item.quantity + 1 : item.quantity,
        }));
      }

      state.value = state.cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
      state.total++;
      return state;
    },
    decreaseCart: (state, action) => {
      const foundItem = state.cart.find((item) => item.id === action.payload.id);

      if (foundItem.quantity === 1) {
        state.cart = state.cart.filter((item) => item.id !== foundItem.id);
      } else {
        state.cart = state.cart.map((item) => ({
          ...item,
          quantity: item.id === foundItem.id ? item.quantity - 1 : item.quantity,
        }));
      }

      state.value = state.cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
      state.total--;
      return state;
    },
    deleteCart: (state, action) => {
      const foundItem = state.cart.find((item) => item.id === action.payload);
      state.cart = state.cart.filter((item) => item.id !== action.payload);
      state.total -= foundItem.quantity;
      state.value -= foundItem.quantity * foundItem.price;
      return state;
    },
  },
});

// Action creators
export const { fetchCart, addToCart, deleteCart, decreaseCart } = cartSlice.actions;

export default cartSlice;
