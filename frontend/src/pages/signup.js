import React, { useState } from 'react';
import { useSignUp } from '../hook/useAuth';
import { UserAddIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';

export default function Example() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: signup, isLoading, error } = useSignUp();

  return (
    <div className=" flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign up account
          </h2>
        </div>
        <input type="hidden" name="remember" defaultValue="true" />
        <form className="space-y-8 text-gray-900" onSubmit={() => signup({ email, password })}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="py-3 flex justify-between ">
              <label htmlFor="first-name" className="sr-only">
                First Name
              </label>
              <input
                name="fname"
                type="fname"
                required
                className="appearance-none rounded-none relative block w-full mr-3 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="First Name"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
              />
              <label htmlFor="last-name" className="sr-only">
                Last Name
              </label>
              <input
                name="lname"
                type="lname"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Last Name"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <p className="text-center text-base font-medium text-gray-500">
              {error && <p className="text-red-500">{error.error}</p>}
              Existing account?{' '}
              <Link to="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>

          <div>
            <button
              onClick={async (e) => {
                await signup({ fname, lname, email, password });
                e.preventDefault();
              }}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserAddIcon
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
              </span>
              {isLoading ? 'Loading...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
