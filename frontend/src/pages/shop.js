import React, { useState, useEffect } from 'react';

import useBookSearch from '../hook/useProducts';

import Sidebar from '../components/sidebar/filter';
import Dropdown from '../components/dropdown/Sort';
import Card from '../components/card/bookCard';
import { SearchIcon } from '@heroicons/react/outline';

export default function Shop() {
  const [query, setQuery] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [rating, setRate] = useState();
  const [gtPrice, setGtPrice] = useState();
  const [ltPrice, setLtPrice] = useState();
  const [sortPrice, setSortPrice] = useState();
  const [sortRate, setSortRate] = useState();

  const { books, hasMore, loading, error } = useBookSearch(
    query,
    pageNumber,
    rating,
    gtPrice,
    ltPrice,
    sortPrice,
    sortRate
  );
  const [bookMore, setBookMore] = useState(0);

  useEffect(() => {
    setBookMore(hasMore - books.length);
  }, [hasMore]);

  function handlePage() {
    setBookMore((prev) => prev - books.length);
    setPageNumber((prev) => prev + 1);
  }

  function handleClear() {
    setQuery('');
    setRate();
    setGtPrice();
    setLtPrice();
  }

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  const filter = (value) => {
    if (value) {
      if (value.rating) {
        setRate(value.rating);
      } else {
        setGtPrice(value.gtPrice);
        setLtPrice(value.ltPrice);
      }
    }
  };

  const setSort = (value) => {
    if (value.sortby === 'Review') {
      setSortRate(value.val);
      setSortPrice(null);
    }
    if (value.sortby === 'Price') {
      setSortPrice(value.val);
      setSortRate(null);
    }
  };

  return (
    <div className="xs:max-w-xs md:flex">
      <div>
        <Sidebar handle={filter} />
      </div>
      <div className="flex flex-col w-full mr-64">
        <div className="lg:px-10 mt-10">
          <div className="flex justify-between py-4">
            <div className="bg-gray-100 w-full lg:w-1/2 flex items-center rounded-lg h-10">
              <div className="p-4">
                <button className="text-gray-600 p-2 focus:outline-none w-8 h-8 flex items-center justify-center">
                  <SearchIcon />
                </button>
              </div>
              <input
                className="rounded-r-md h-10 w-full bg-gray-100 text-gray-800 focus:outline-none"
                id="search"
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search"
              />
            </div>
            <Dropdown setSort={setSort} />
          </div>
          <div>
            <span className="text-gray-500 text-sm">{hasMore} Results</span>
            <button
              className="mx-3 bg-gray-600 text-sm rounded-lg px-2 py-1 text-white"
              onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
        <div className="ml-10 flex">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-10">
            {books.map((book) => (
              <Card key={book.id} props={book} />
            ))}
            <div>{loading && 'Loading...'}</div>
            <div>{error && 'Error'}</div>
          </div>
        </div>
        <div className="flex justify-center pb-10">
          {bookMore > 1 && (
            <button
              className="bg-indigo-600 px-10 py-2 rounded-full text-white"
              onClick={handlePage}>
              More...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
