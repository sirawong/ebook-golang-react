import React, { Fragment, useState } from 'react';
import { UseBook } from '../../hook/useProducts';

import { useUpdateBook } from '../../hook/useProducts';
import { useBookImage } from '../../hook/useProducts';

import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import ReactTagInput from '@pathofdev/react-tag-input';
import { ArrowCircleUpIcon } from '@heroicons/react/outline';

import '@pathofdev/react-tag-input/build/index.css';

export default function Edit({ props }) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState();
  const [author, setAuthor] = useState();
  const [description, setDescription] = useState();
  const [genres, setTagsGenre] = useState([]);
  const [characters, setTagsChar] = useState([]);
  const [price, setPrice] = useState(0);

  const [image, setImage] = useState({ preview: '', raw: [] });

  const { mutate: uploadImage } = useBookImage();
  const { mutateAsync: setUpdate, isLoading, isSuccess, isError, error } = useUpdateBook();

  const bookid = props.id;
  const { book } = UseBook(bookid);

  const handleChange = (e) => {
    var binaryData = [];
    binaryData.push(e.target.files[0]);
    setImage({
      preview: URL.createObjectURL(new Blob(binaryData, { type: 'image/*' })),
      raw: binaryData,
    });
    uploadImage({ file: binaryData[0], bookid });
  };

  let photo;

  if (props.imageslink) {
    photo = <img className="hover:opacity-30" src={props.imageslink} alt="" />;
  } else if (image.preview) {
    photo = <img className="hover:opacity-30" src={image.preview} alt="" />;
  } else {
    photo = (
      <div className="h-full flex justify-center items-center">
        <ArrowCircleUpIcon className="h-10 w-10 hover:text-indigo-600" />
      </div>
    );
  }

  function handleFetch() {
    setOpen(true);
  }

  async function handleUpdate() {
    setUpdate({ bookid, title, author, genres, description, characters, price });
  }

  return (
    <>
      <div className="">
        <button
          type="button"
          onClick={handleFetch}
          className="text-indigo-400 hover:text-indigo-900">
          Edit
        </button>
      </div>
      {book && (
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            static
            className="z-40 fixed inset-0 overflow-hidden"
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
                      <div className=" absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                        <button
                          className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}>
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Edit Book
                          {isSuccess && (
                            <div className="text-green-500 text-base">Successfully saved!</div>
                          )}
                          {isError && error && (
                            <div className="text-red-500 text-base">Unsuccessful saved!</div>
                          )}
                        </Dialog.Title>
                      </div>
                      <div className="mt-6 relative flex-1 px-4 sm:px-6">
                        <div className="shadow overflow-hidden sm:rounded-md">
                          <div className="px-4 py-5 bg-white sm:p-6">
                            <div className="grid grid-cols-6 gap-6">
                              <div className="col-span-6">
                                <label
                                  htmlFor="title"
                                  className="block text-sm font-medium text-gray-700">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  name="title"
                                  defaultValue={book.title}
                                  onChange={(e) => setTitle(e.target.value)}
                                  className="pl-2 mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 border rounded-md"
                                />
                              </div>

                              <div className="col-span-6">
                                <label
                                  htmlFor="author"
                                  className="block text-sm font-medium text-gray-700">
                                  Author
                                </label>
                                <input
                                  type="text"
                                  name="author"
                                  defaultValue={book.author}
                                  onChange={(e) => setAuthor(e.target.value)}
                                  className="pl-2 mt-1 h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 border rounded-md"
                                />
                              </div>

                              <div className="col-span-6 ">
                                <label
                                  htmlFor="genres"
                                  className="block text-sm font-medium text-gray-700 pb-1">
                                  Genres
                                </label>
                                <ReactTagInput
                                  tags={book.genres ? [...genres, ...book.genres] : genres}
                                  placeholder="Type and press enter"
                                  editable={true}
                                  readOnly={false}
                                  removeOnBackspace={true}
                                  onChange={(newTags) => setTagsGenre(newTags)}
                                />
                              </div>

                              <div className="col-span-6 ">
                                <label
                                  htmlFor="description"
                                  className="block text-sm font-medium text-gray-700">
                                  Description
                                </label>
                                <textarea
                                  name="description"
                                  id="description"
                                  defaultValue={book.description}
                                  onChange={(e) => setDescription(e.target.value)}
                                  className="pl-2 mt-1 h-20 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 border rounded-md"
                                />
                              </div>

                              <div className="col-span-6 ">
                                <label
                                  htmlFor="characters"
                                  className="block text-sm font-medium text-gray-700 pb-1">
                                  Characters
                                </label>

                                <ReactTagInput
                                  tags={
                                    book.characters
                                      ? [...characters, ...book.characters]
                                      : characters
                                  }
                                  placeholder="Type and press enter"
                                  editable={true}
                                  readOnly={false}
                                  removeOnBackspace={true}
                                  onChange={(newTags) => setTagsChar(newTags)}
                                />
                              </div>

                              <div className="col-span-2 sm:col-span-2 lg:col-span-2">
                                <label
                                  htmlFor="price"
                                  className="block text-sm font-medium text-gray-700">
                                  $ Price
                                </label>
                                <input
                                  type="number"
                                  inputMode="decimal"
                                  name="price"
                                  defaultValue={book.price}
                                  onChange={(e) => setPrice(e.target.valueAsNumber)}
                                  className="pl-2 mt-1 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 border rounded-md"
                                />
                              </div>
                            </div>
                            <div className="py-4">
                              <label className="block text-sm font-medium text-gray-700">
                                Photo
                              </label>
                              <label className="block text-sm text-gray-500">
                                Click on Photo to change
                              </label>
                              <div className="mt-1 flex items-center">
                                <label
                                  htmlFor="upload-button"
                                  className="inline-block h-40 w-32 rounded-xl overflow-hidden bg-gray-100 cursor-pointer">
                                  {photo}
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
                              onClick={handleUpdate}
                              type="submit"
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              {isLoading ? 'Loading...' : 'Save'}
                            </button>
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
      )}
    </>
  );
}
