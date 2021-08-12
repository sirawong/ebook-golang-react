import axios from 'axios';
import Cookies from 'js-cookie';

import { fatchToken } from './users';

const instance = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_BOOK_SERVICES || '/books',
});

export async function newBook(title, author, genres, description, characters, price, image) {
  if (typeof Cookies.get('ac') === 'undefined') {
    await fatchToken();
  }

  const formData = new FormData();
  if (image.raw[0]) {
    formData.append('image', image.raw[0]);
  }

  await setTimeout(() => {}, 2000);
  return new Promise((resolve, reject) => {
    instance
      .post(`/admin`,
        { title, author, genres, description, characters, price },
      )
      .then(async (res) => {
        if (image.raw[0]) {
          await instance
            .post(`/admin/${res.data.id}/image`, formData, {
              headers: {'Content-Type': 'multipart/form-data'}
            })
            .then(async () => {
              resolve();
            })
            .catch((error) => {
              reject(error.response.data);
            });
        }
        resolve();
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}

export async function updateBook(bookid, title, author, genres, description, characters, price) {
  if (typeof Cookies.get('ac') === 'undefined') {
    await fatchToken();
  }

  await setTimeout(() => {}, 2000);
  return new Promise((resolve, reject) => {
    instance.patch(`/admin/${bookid}`,
        { title, author, genres, description, characters, price },
      )
      .then(async (res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}

export async function deleteBook(bookid) {
  if (typeof Cookies.get('ac') === 'undefined') {
    await fatchToken();
  }

  await setTimeout(() => {}, 2000);
  return new Promise((resolve, reject) => {
    instance
      .delete(`/admin/${bookid}`)
      .then(async () => {
        resolve();
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}

export async function uploadBookImage(file, bookid) {
  if (typeof Cookies.get('ac') === 'undefined') {
    await fatchToken();
  }

  const formData = new FormData();
  formData.append('image', file);
  await setTimeout(() => {}, 2000);

  return new Promise((resolve, reject) => {
    instance
      .post(`/admin/${bookid}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async () => {
        resolve();
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}
