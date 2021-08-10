import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { setOrder } from '../../hook/api/cart';
import { useCart } from '../../hook/useCart';

import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { ShoppingCartIcon } from '@heroicons/react/outline';
import Card from '../card/cart';

export default function Cart() {
  const [open, setOpen] = useState(false);

  const cart = useSelector((state) => state.cart);

  useCart();

  useEffect(() => {
    return setOrder(cart);
  }, [cart]);

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-gray-700 h-9 w-9 rounded-full text-white flex justify-center items-center hover:bg-indigo-500">
          {cart.total > 0 ? (
            <div className="text-white">{cart.total}</div>
          ) : (
            <div>
              <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
            </div>
          )}
        </button>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 overflow-hidden z-50"
          open={open}
          onClose={setOpen}>
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full">
                <div className="relative w-screen max-w-xl">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                      <button
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}>
                        <span className="sr-only">Close panel</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-full flex flex-col justify-between py-6 bg-white shadow-xl overflow-y-scroll">
                    <div>
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-2xl font-bold text-gray-900">
                          Cart
                        </Dialog.Title>
                      </div>
                      <div className="mt-6 relative flex-1 px-4 sm:px-6">
                        {cart.cart === 0 ? (
                          <p>Cart is empty</p>
                        ) : (
                          cart.cart.map((book) => <Card key={book.id} book={book} />)
                        )}
                      </div>
                    </div>
                    <div className="mx-10 px-4 py-2 border rounded-xl my-4 flex flex-col content-between">
                      <div className=" flex justify-between">
                        <div>
                          <div className="text-gray-600 py-1">Subtotal</div>
                          <div className="text-gray-600 py-1">Tax</div>
                          <div className="font-medium text-lg  py-1">Total:</div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-800 py-1">${cart.value.toFixed(2)}</div>
                          <div className="text-gray-800 py-1">
                            ${(cart.value * 0.07).toFixed(2)}
                          </div>
                          <div className="font-medium text-lg  py-1">
                            ${(cart.value * 0.07 + cart.value).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 pb-2">
                        <div className="py-2 flex justify-center items-center bg-indigo-500 rounded-full">
                          <span className="text-lg text-white font-bold">Check out</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
