import React, { useState } from 'react';
import Card from '../components/card/bookCard';
import { Link } from 'react-router-dom';
import Header from '../components/header/Header';
import useBookSearch from '../hook/useProducts';

export default function Home() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  return (
    <div className="max-w-7xl mx-auto">
      <Header />
      <div className="py-7 pb-10">
        <div className="flex justify-center flex-col items-center lg:flex-row lg:justify-between lg:px-8">
          <span className="text-2xl font-bold text-indigo-600 lg:text-2xl">Popular Books</span>
          <Link to="/shop" className="text-lg mt-5 text-gray-500 lg:text-md hover:text-indigo-500">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
          {books.length === 0 ? (
            <p>No products</p>
          ) : (
            books.slice(0, 4).map((props) => <Card key={props.id} props={props} />)
          )}
        </div>
      </div>
    </div>
  );
}
