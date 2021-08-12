import React, { useState } from 'react';

import { useProfile, useUpdate, useProfileImage } from '../hook/useProfile';

import { ArrowCircleUpIcon } from '@heroicons/react/outline';
import { SpinningCircles  } from 'react-loading-icons'

export default function Profile() {
  const { data: profile, error } = useProfile();
  const { mutate: setProfile, isLoading:updateLoading, isError:isUpdateError, isSuccess: isUpdateSuccess } = useUpdate();
  const { mutate: setImages, isError:isImageError, isLoading: isImageLoading } = useProfileImage();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [lname, setLame] = useState();
  const [image, setImage] = useState({ preview: '', raw: [] });

  const handleChange = (e) => {
    var binaryData = [];
    binaryData.push(e.target.files[0]);
    setImage({
      preview: URL.createObjectURL(new Blob(binaryData, { type: 'image/*' })),
      raw: binaryData,
    });
    setImages(binaryData[0]);
  };

  let photo;
  if (image.preview) {
    photo = <img className="hover:opacity-30" src={image.preview} alt="" />;
  }  else if (profile && profile.image) {
    photo = <img className="hover:opacity-30" src={profile.image} alt="" />;
  } else {
    photo = (
      <div className="h-full flex justify-center items-center">
        <ArrowCircleUpIcon className="h-10 w-10 hover:text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10 sm:px-6">
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
                  {isUpdateError && <p className="text-red-500">{updateLoading.error}</p>}
                  {isUpdateSuccess && <p className="text-green-500">Update Successfully</p>}
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
                        defaultValue={profile && profile.name}
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
                        defaultValue={profile && profile.lastname}
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
                        defaultValue={profile && profile.email}
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
                          className="inline-block h-40 w-32 rounded-xl overflow-hidden bg-gray-100 cursor-pointer">
                          {isImageLoading ? <div className="flex justify-center items-center bg-gray-300 h-full">
                            <SpinningCircles stroke="#000000" />
                          </div> : photo}
                          {isImageError && <div className="flex justify-center items-center bg-gray-300 h-full">
                            <p className="text-red-500">{error}</p></div>}
                        </label>
                      <input
                        type="file"
                        id="upload-button"
                        style={{ display: 'none' }}
                        onChange={handleChange}
                      />
                      </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
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
