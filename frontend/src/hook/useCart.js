import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';

import { getCart } from './api/cart';

import { fetchCart } from '../store/slices/cartSlice';

export function useCart() {
  const dispatch = useDispatch();

  return useQuery('cart', () => getCart(), {
    onSuccess: (data) => {
      dispatch(fetchCart({ cart: data.items, total: data.totalItem, value: data.valueTotal }));
    },
  });
}
