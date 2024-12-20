import axios from 'axios';
import { getToken, clearToken } from './authUtil';

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
      apiConfig.withCredentials = true;
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
  authenticate: () => api.get('/', { withCredentials: true }),
  getRootNotes: () => api.get('/note'),
  getNote: (noteId) => api.get(`/note/${noteId}`),
  addNote: (body) => api.post('/note', body),
  updateNote: (body, noteId) => api.patch(`/note/${noteId}`, body),
  deleteNote: (noteId) => api.delete(`/note/${noteId}`),
  addFolder: (body) => api.post('/folder', body),
}

export default apiService;