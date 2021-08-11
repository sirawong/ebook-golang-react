import axios from 'axios';
import Cookies from 'js-cookie';

import { fatchToken } from './users';

export async function getBook(bookid) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `http://localhost:8001/${bookid}`,
      withCredentials: true,
    })
      .then((res) => {
        resolve({ data: res.data });
      })
      .catch((error) => {
        if (axios.isCancel(error)) reject(error.data);
      });
  });
}

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
    axios
      .post(
        `http://localhost:8001/admin`,
        { title, author, genres, description, characters, price },
        { withCredentials: true }
      )
      .then(async (res) => {
        if (image.raw[0]) {
          await axios
            .post(`http://localhost:8001/admin/${res.data.id}/image`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              withCredentials: true,
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
    axios
      .patch(
        `http://localhost:8001/admin/${bookid}`,
        { title, author, genres, description, characters, price },
        { withCredentials: true }
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
    axios
      .delete(`http://localhost:8001/admin/${bookid}`, { withCredentials: true })
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
  console.log(file);
  await setTimeout(() => {}, 2000);

  return new Promise((resolve, reject) => {
    axios
      .post(`http://localhost:8001/admin/${bookid}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      })
      .then(async () => {
        resolve();
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}
