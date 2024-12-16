import axios from 'axios';
import { getToken, clearToken } from './authUtils';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER}/jotter`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// let getToken;

/**
 * Sets the Bearer auth token to the current user's token.
 * @param {Function} tokenGetter - Returns the current user's token.
 */
// const setTokenGetter = (tokenGetter) => {
//   getToken = tokenGetter;
// };

// Axios interceptor
api.interceptors.request.use(
  (apiConfig) => {
    const token = getToken();
    if (token) {
      apiConfig.headers['Authorization'] = `Bearer ${token}`;
    }
    return apiConfig;
  }
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      clearToken();
      window.location = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

const apiService = {
  // setTokenGetter,
}

export default apiService;