import axios from 'axios';
import Cookies from 'js-cookie';

import { fatchToken } from './users';

export async function getCart() {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `/cart/order`,
      withCredentials: true,
    })
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
    axios
      .post(
        `/cart/order`,
        { items: cart, totalItem: total, valueTotal: value },
        { withCredentials: true }
      )
      .then(async () => {
        resolve();
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}
