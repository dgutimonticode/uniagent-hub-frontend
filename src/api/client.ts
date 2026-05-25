// UniAgent Hub - API Client
// Axios instance with interceptors for auth and error handling.

import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('uniagent_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<never>>) => {
    if (error.response?.status === 401) {
      // Wipe BOTH the raw token and the Zustand persisted store, otherwise the
      // login page rehydrates the stale user and bounces back to /, creating a
      // redirect loop that hammers the backend with 401s.
      localStorage.removeItem('uniagent_token');
      localStorage.removeItem('uniagent-auth');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
