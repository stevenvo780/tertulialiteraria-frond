import axios from 'axios';
import store from '../redux/store';
import { loading } from '../redux/ui';
import { auth } from '../utils/firebase'; // Import the Firebase auth instance

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

let calls = 0;

api.interceptors.request.use(async function (config) {
  const currentUser = auth.currentUser;
  let token = null;

  if (currentUser) {
    token = await currentUser.getIdToken();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  calls++;
  store.dispatch(loading(true));
  return config;
}, function (error) {
  calls++;
  store.dispatch(loading(true));
  console.error(error);
  return Promise.reject(error);
});

api.interceptors.response.use(function (response) {
  calls--;
  if (calls === 0) {
    store.dispatch(loading(false));
  }
  return response;
}, function (error) {
  console.error(error);
  calls--;
  if (calls === 0) {
    store.dispatch(loading(false));
  }
  return Promise.reject(error);
});

export default api;
