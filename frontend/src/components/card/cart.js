import React from 'react';
import { useDispatch } from 'react-redux';

import { addToCart, deleteCart, decreaseCart } from '../../store/slices/cartSlice';

export default function Cart({ book }) {
  const dispatch = useDispatch();

  return (
    <div className="grid grid-cols-5">
      <div className="inline-block h-36 w-24 rounded-xl overflow-hidden bg-gray-100 cursor-pointer">
        <img className="object-contain" src={book.imageslink} alt="" />
      </div>
      <div className="col-span-2 flex flex-col justify-center px-2">
        <span className="text-lg font-medium">{book.title}</span>
        <span className="text-gray-500">
          ${book.price} x {book.quantity} = ${book.price * book.quantity}
        </span>
      </div>
      <div className="flex justify-center items-center">
        <button
          className="bg-gray-100 py-1 text-gray-800 px-2 rounded-l-full focus:bg-gray-300"
          onClick={() => dispatch(decreaseCart({ ...book, quantity: 1 }))}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
        <span className="px-3 bg-gray-200 py-2 rounded-lg ">{book.quantity}</span>
        <button
          className="bg-gray-100 py-1 text-gray-800 px-2 rounded-r-full focus:bg-gray-300"
          onClick={() => dispatch(addToCart({ ...book, quantity: 1 }))}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>
      <div className="flex justify-center items-center">
        <button
          className="hover:text-red-500 text-gray-500"
          onClick={() => dispatch(deleteCart(book.id))}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
      <div className="col-span-5 pb-5 border-b border-gray-200 mb-5" />
    </div>
  );
}
