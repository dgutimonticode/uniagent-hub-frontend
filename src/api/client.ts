// UniAgent Hub - API Client
// Axios instance with interceptors for auth and error handling

import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: adds JWT token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('uniagent_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handles 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<never>>) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('uniagent_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
