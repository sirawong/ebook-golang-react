import axios from 'axios';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import { newBook, uploadBookImage, deleteBook, updateBook } from './api/book';


export default function useBookSearch(
  query,
  pageNumber,
  rating,
  gtPrice,
  ltPrice,
  sortPrice,
  sortRate
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(0);

  if (query === '' || !query) {
    if ((sortRate === 0 && sortPrice === 0) || (!sortRate && !sortPrice)) {
      sortRate = 'desc';
    }
  }

  useEffect(() => {
    setBooks([]);
    pageNumber = 1;
  }, [query, sortRate, sortPrice, rating, gtPrice, ltPrice]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: process.env.REACT_APP_BOOK_SERVICES || '/books/',
      params: {
        page: pageNumber,
        query,
        gtprice: gtPrice,
        ltprice: ltPrice,
        rating,
        sortrate: sortRate,
        sortprice: sortPrice,
      },
      withCredentials: true,
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setBooks((prevBooks) => {
          return [...prevBooks, ...res.data.data];
        });
        setHasMore(res.data.totalCount);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber, sortRate, sortPrice, rating, gtPrice, ltPrice]);

  return { loading, error, books, hasMore };
}

export function UseBook(bookid) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [book, setBook] = useState(null);

  useEffect(() => {
    setBook(null);
  }, [bookid]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: (process.env.REACT_APP_BOOK_SERVICES || `/books`) + `/${bookid}`,
      withCredentials: true,
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [bookid]);

  return { loading, error, book };
}

export function useNewbook() {
  return useMutation('book', ({ title, author, genres, description, characters, price, image }) => {
    newBook(title, author, genres, description, characters, price, image);
  });
}

export function useBookImage() {
  return useMutation('book', ({ file, bookid }) => {
    uploadBookImage(file, bookid);
  });
}

export function useUpdateBook() {
  return useMutation('book', ({ bookid, title, author, genres, description, characters, price }) =>
    updateBook(bookid, title, author, genres, description, characters, price)
  );
}

export function useDeleteBook() {
  return useMutation('book', (id) => deleteBook(id));
}
