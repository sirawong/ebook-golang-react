import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  withCredentials: true,
  baseURL: '/user',
});

export function signup(fname, lname, email, password) {
  return new Promise((resolve, reject) => {
    instance
      .post('/signup', { name: fname, lastname: lname, email: email, password: password })
      .then(async () => {
        await localStorage.setItem('c_user', email);
        resolve(email);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}

export function signin(email, password) {
  return new Promise((resolve, reject) => {
    instance
      .post('/signin', { email: email, password: password })
      .then(async (response) => {
        await localStorage.setItem('c_user', email);
        if (response.data.level === 'admin') {
          await localStorage.setItem('l_user', 'admin');
        }
        await localStorage.setItem('image', response.data.image);
        resolve({ user: email, level: response.data.level });
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}

export function fatchToken() {
  return new Promise((resolve, reject) => {
    instance
      .post('/token/refresh', { refresh_token: Cookies.get('rf') })
      .then(async () => {
        resolve();
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}

export async function logout() {
  if (typeof Cookies.get('ac') === 'undefined') {
    await fatchToken();
  }
  await setTimeout(() => {}, 2000);
  return new Promise((resolve, reject) => {
    instance
      .post('/logout')
      .then(async () => {
        localStorage.clear();
        Cookies.remove('rf');
        Cookies.remove('ac');
        resolve();
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}

export async function getProfile() {
  if (typeof Cookies.get('ac') === 'undefined') {
    await fatchToken();
  }
  await setTimeout(() => {}, 2000);
  return new Promise((resolve, reject) => {
    instance
      .get('/user/me')
      .then(async (response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}

export async function updateMe(email, password, fname, lname) {
  if (typeof Cookies.get('ac') === 'undefined') {
    await fatchToken();
  }

  let profile;
  if (password !== '') {
    profile = { email: email, password: password, firstname: fname, lastname: lname };
  } else {
    profile = { email: email, firstname: fname, lastname: lname };
  }

  await setTimeout(() => {}, 2000);
  return new Promise((resolve, reject) => {
    instance
      .patch('/me', profile)
      .then(async () => {
        resolve();
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}

export async function uploadImage(files) {
  if (typeof Cookies.get('ac') === 'undefined') {
    await fatchToken();
  }

  const formData = new FormData();
  formData.append('image', files);
  await setTimeout(() => {}, 2000);
  return new Promise((resolve, reject) => {
    axios
      .post('/user/me/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      })
      .then(async (response) => {
        await localStorage.setItem('image', response.data.image);
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}
