import axios from 'axios';
import Cookies from 'js-cookie';

import { fatchToken } from './users';

const instance = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_CART_SERVICES || '/cart',
});

export async function getCart() {
  return new Promise((resolve, reject) => {
    instance.get('/')
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        if (axios.isCancel(error)) reject(error.data);
      });
  });
}

export async function setOrder({ cart, total, value }) {
  if (typeof Cookies.get('ac') === 'undefined') {
    await fatchToken();
  }
  await setTimeout(() => {}, 2000);
  return new Promise((resolve, reject) => {
    instance
      .post('/',{items: cart, totalItem: total, valueTotal: value },
      )
      .then(async () => {
        resolve();
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}
