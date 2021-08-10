import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { useLogout } from '../../hook/useAuth';

import Drawer from '../../components/sidebar/drawerCart';

import { Popover, Menu, Transition } from '@headlessui/react';
import {
  ChartBarIcon,
  MenuIcon,
  RefreshIcon,
  ViewGridIcon,
  CursorClickIcon,
  XIcon,
} from '@heroicons/react/outline';

const pagesUser = [
  {
    name: 'Profile',
    description: 'Edit your profile.',
    href: '/me',
    icon: ChartBarIcon,
  },
  {
    name: 'Find more book...',
    description: 'Discover your all books in our store.',
    href: '/shop',
    icon: ViewGridIcon,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Nav() {
  var retrievedUser = localStorage.getItem('c_user');
  var retrievedLevel = localStorage.getItem('l_user');
  var retrievedImage = localStorage.getItem('image');

  const { mutate: logout } = useLogout();

  return (
    <div>
      <Popover className="z-40 relative bg-white">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
                <div className="flex justify-start lg:w-0 lg:flex-1">
                  <Link to="/">
                    <span className="text-2xl font-bold font-serif text-gray-500">Books</span>
                  </Link>
                </div>

                <div className="-mr-2 -my-2 md:hidden">
                  <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Open menu</span>
                    <MenuIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
                <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                  {!retrievedUser ? (
                    <>
                      <Link
                        to="/auth/signin"
                        className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                        Sign in
                      </Link>
                      <Link
                        to="/auth/signup"
                        className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        Sign up
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <Drawer />

                        <Menu as="div" className="ml-3 relative">
                          {({ open }) => (
                            <>
                              <div>
                                <Menu.Button className="bg-gray-400 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                  <span className="sr-only">Open user menu</span>
                                  {retrievedImage ? (
                                    <img
                                      className="h-8 w-8 rounded-full"
                                      src={retrievedImage}
                                      alt=""
                                    />
                                  ) : (
                                    <svg
                                      className="h-8 w-8 rounded-full text-gray-200"
                                      fill="currentColor"
                                      viewBox="0 0 24 24">
                                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                  )}
                                </Menu.Button>
                              </div>
                              <Transition
                                show={open}
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95">
                                <Menu.Items
                                  static
                                  className="z-50 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <Link
                                        to="/me"
                                        className={classNames(
                                          active ? 'bg-gray-100' : '',
                                          'block px-4 py-2 text-sm text-gray-700 w-full'
                                        )}>
                                        Your Profile
                                      </Link>
                                    )}
                                  </Menu.Item>
                                  {retrievedLevel === 'admin' && (
                                    <Menu.Item>
                                      {({ active }) => (
                                        <Link
                                          to="/dashboard"
                                          className={classNames(
                                            active ? 'bg-gray-100' : '',
                                            'block px-4 py-2 text-sm text-gray-700 w-full'
                                          )}>
                                          Admin Dashboard
                                        </Link>
                                      )}
                                    </Menu.Item>
                                  )}
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => {
                                          logout();
                                        }}
                                        type="submit"
                                        className={classNames(
                                          active ? 'bg-gray-100' : '',
                                          'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                                        )}>
                                        Sign out
                                      </button>
                                    )}
                                  </Menu.Item>
                                </Menu.Items>
                              </Transition>
                            </>
                          )}
                        </Menu>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Transition
              show={open}
              as={Fragment}
              enter="duration-200 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-100 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Popover.Panel
                focus
                static
                className="z-50 absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
                <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                  <div className="pt-5 pb-6 px-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <Link to="/">
                          <span className="text-2xl font-bold font-serif text-gray-500">Books</span>
                        </Link>
                      </div>
                      <div className="-mr-2">
                        <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                          <span className="sr-only">Close menu</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                      </div>
                    </div>
                    {retrievedUser && (
                      <div className="mt-6">
                        <nav className="grid gap-y-8">
                          {retrievedLevel === 'admin' && (
                            <Link
                              key="Dashboard"
                              to="/dashboard"
                              className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50">
                              <CursorClickIcon
                                className="flex-shrink-0 h-6 w-6 text-indigo-600"
                                aria-hidden="true"
                              />
                              <span className="ml-3 text-base font-medium text-gray-900">
                                Admin Dashboard
                              </span>
                            </Link>
                          )}
                          {pagesUser.map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50">
                              {item.name === 'Profile' ? (
                                <div>
                                  {retrievedImage ? (
                                    <img
                                      className="h-8 w-8 rounded-full"
                                      src={retrievedImage}
                                      alt=""
                                    />
                                  ) : (
                                    <svg
                                      className="h-8 w-8 rounded-full text-gray-300"
                                      fill="currentColor"
                                      viewBox="0 0 24 24">
                                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                  )}
                                </div>
                              ) : (
                                <item.icon
                                  className="flex-shrink-0 h-6 w-6 text-indigo-600"
                                  aria-hidden="true"
                                />
                              )}

                              <span className="ml-3 text-base font-medium text-gray-900">
                                {item.name}
                              </span>
                            </Link>
                          ))}
                          <button
                            onClick={(e) => {
                              logout();
                              e.preventDefault();
                            }}
                            type="submit"
                            className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50">
                            <RefreshIcon
                              className="flex-shrink-0 h-6 w-6 text-indigo-600"
                              aria-hidden="true"
                            />
                            <span className="ml-3 text-base font-medium text-gray-900">
                              Sign out
                            </span>
                          </button>
                        </nav>
                      </div>
                    )}
                  </div>
                  {!retrievedUser && (
                    <div className="py-6 px-5 space-y-6">
                      <div>
                        <Link
                          to="/auth/signup"
                          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                          Sign up
                        </Link>
                        <p className="mt-6 text-center text-base font-medium text-gray-500">
                          Existing customer?{' '}
                          <Link to="/auth/signin" className="text-indigo-600 hover:text-indigo-500">
                            Sign in
                          </Link>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
