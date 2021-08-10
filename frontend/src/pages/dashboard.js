import React, { useState, useEffect } from 'react';

import useBookSearch from '../hook/useProducts';

import { SearchIcon } from '@heroicons/react/outline';
import NewBookPop from '../components/sidebar/NewBook';
import EditBook from '../components/sidebar/Edit';
import DeleteBook from '../components/popup/Delete';

import Noti from '../components/popup/Noti';

export default function Dashboard() {
  const [query, setQuery] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  const { books, hasMore } = useBookSearch(query, pageNumber);
  const [bookMore, setBookMore] = useState(0);

  useEffect(() => {
    setBookMore(hasMore - books.length);
  }, [hasMore]);

  function handlePage() {
    setBookMore((prev) => prev - books.length);
    setPageNumber((prev) => prev + 1);
  }

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  async function handleReload() {
    setQuery('');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="max-w-full flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="min-w-full py-2 align-middle inline-block sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <div className=" flex flex-col lg:flex-row lg:justify-between ">
                <div className="bg-gray-100 max-w-sm lg:w-full flex items-center rounded-lg h-10">
                  <div className="p-4">
                    <button className="text-gray-600 p-2 focus:outline-none w-8 h-8 flex items-center justify-center">
                      <SearchIcon />
                    </button>
                  </div>
                  <input
                    className="rounded-r-md h-10 lg:w-full bg-gray-100 text-gray-800 focus:outline-none"
                    id="search"
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Search"
                  />
                </div>
                <div className="flex items-center py-2 lg:py-0">
                  <NewBookPop handleReload={handleReload} />
                </div>
              </div>

              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title / Author
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      $ Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th scope="col" className="relative px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td className="px-6 py-4 whitespace-nowrap max-w-md">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={book.imageslink} alt="" />
                          </div>
                          <div className="ml-4 w-11/12">
                            <div className="text-sm font-medium text-gray-900">{book.title}</div>
                            <p className="overflow-ellipsis overflow-hidden text-sm text-gray-500 ">
                              {book.author}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{book.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.rating}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex row space-x-2">
                          <EditBook handleReload={handleReload} props={book} />
                          <DeleteBook handleReload={handleReload} props={book.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Noti />
      <div className="flex justify-center py-5 pb-10">
        {bookMore > 1 && (
          <button
            className="bg-indigo-500 hover:bg-indigo-600 px-10 py-2 rounded-full font-bold text-white"
            onClick={handlePage}>
            More...
          </button>
        )}
      </div>
    </div>
  );
}
