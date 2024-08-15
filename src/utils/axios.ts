import axios from 'axios';
import store from '../redux/store';
import { loading } from '../redux/ui';
import { getCurrentUserToken } from '../utils/firebaseHelper';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

let calls = 0;

api.interceptors.request.use(async function (config) {
  try {
    const token = await getCurrentUserToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    calls++;
    store.dispatch(loading(true));
    return config;
  } catch (error) {
    calls++;
    store.dispatch(loading(true));
    console.error(error);
    return Promise.reject(error);
  }
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
