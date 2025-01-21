import axios from 'axios';
import { getToken, clearToken } from './authUtil';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER}/jotter`,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  authenticate: () => api.get('/', { withCredentials: true }),
  getRootNotes: () => api.get('/note'),
  getNote: (noteId) => api.get(`/note/${noteId}`),
  getNotes: (folderId) => api.get(`/note/f/${folderId}`),
  addNote: (body) => api.post('/note', body),
  updateNote: (body, noteId) => api.patch(`/note/${noteId}`, body),
  deleteNote: (noteId) => api.delete(`/note/${noteId}`),
  getFolder: (folderId) => api.get(`/folder/${folderId}`),
  getFolders: (parentId) => api.get(`/folder/f/${parentId}`),
  getAllFolders: (folderId, type) => api.get(`/folder/all/${type}/${folderId}`),
  addFolder: (body) => api.post('/folder', body),
  updateFolder: (body, folderId) => api.patch(`/folder/${folderId}`, body),
  deleteFolder: (folderId) => api.delete(`/folder/${folderId}`),
  getConfigs: () => api.get('/config'),
  updateConfigs: (body) => api.patch('/config', body),
}

export default apiService;