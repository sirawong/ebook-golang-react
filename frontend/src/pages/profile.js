import { useProfile, useUpdate, useUpload } from '../hook/useProfile';
import React, { useState } from 'react';

export default function Profile() {
  const { data: profile, isLoading, error } = useProfile();
  const { mutate: setProfile, updateLoading, updateError } = useUpdate();
  const { mutate: setImages, uploadLoading, uploadError } = useUpload();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [lname, setLame] = useState();
  const [image, setImage] = useState({ preview: '', raw: [] });
  const [popup, setPopup] = useState(false);

  const handleChange = (e) => {
    var binaryData = [];
    binaryData.push(e.target.files[0]);
    setImage({
      preview: URL.createObjectURL(new Blob(binaryData, { type: 'image/*' })),
      raw: binaryData,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10 sm:px-6">
      {popup && (
        <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-500">
          <span className="text-xl inline-block mr-5 align-middle">
            <i className="fas fa-bell" />
          </span>
          <span className="inline-block align-middle mr-8">
            <b className="capitalize">red!</b> This is a red alert - check it out!
          </span>
          <button
            onClick={() => setPopup(false)}
            className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none">
            <span>×</span>
          </button>
        </div>
      )}

      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
              <p className="mt-1 text-sm text-gray-600">Edit your information.</p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form
              onSubmit={(e) => {
                setProfile({ email, password, name, lname });
                e.preventDefault();
              }}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first-name"
                        value={typeof profile !== 'undefined' && profile.name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-10 px-2 border mt-1  block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last-name"
                        defaultValue={typeof profile !== 'undefined' && profile.lastname}
                        onChange={(e) => setLame(e.target.value)}
                        className="h-10 px-2 border mt-1  block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="text"
                        name="email-address"
                        defaultValue={typeof profile !== 'undefined' && profile.email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-10 px-2 border mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="new-password"
                        className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="new-password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-10 px-2 border mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Photo</label>
                    <label className="block text-sm text-gray-500">Click on Photo to change</label>
                    <div className="mt-1 flex items-center">
                      <label
                        htmlFor="upload-button"
                        className="inline-block h-40 w-32 rounded-xl overflow-hidden cursor-pointer bg-gray-100">
                        {image.preview ? (
                          <img src={image.preview} alt="" />
                        ) : (
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                      </label>
                      <input
                        type="file"
                        id="upload-button"
                        style={{ display: 'none' }}
                        onChange={handleChange}
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setImages(image.raw[0]);
                        }}
                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  {updateError && <p className="text-red-500">{updateError.error}</p>}
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {updateLoading ? 'Loading...' : 'Save'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
