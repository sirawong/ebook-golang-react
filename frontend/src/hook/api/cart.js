import axios from 'axios';
import Cookies from 'js-cookie';

import { fatchToken } from './users';

export async function getCart() {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `localhost:8002/order`,
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
  console.log(cart, total, value);
  await setTimeout(() => {}, 2000);
  return new Promise((resolve, reject) => {
    axios
      .post(
        `localhost:8002/order`,
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
