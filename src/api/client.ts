// UniAgent Hub - API Client
// Axios instance with interceptors for auth and global error handling.

import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { ApiResponse } from '@/types';
import { useAuthStore } from '@/stores/authStore';

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
    const status = error.response?.status;
    const envelopeMessage = error.response?.data?.error?.message;

    if (status === 401) {
      // Reset Zustand in-memory state AND wipe the persisted snapshot.
      // Without clearing 'uniagent-auth', the login page rehydrates the stale
      // user and bounces back to /, creating a redirect loop.
      useAuthStore.getState().logout();
      localStorage.removeItem('uniagent-auth');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      toast.error('No tenés permisos para realizar esta acción.', { id: 'http-403' });
    } else if (status && status >= 500) {
      console.error('[api] server error', status, error.response?.data ?? error.message);
      toast.error(envelopeMessage || 'Error del servidor. Intentá de nuevo en unos segundos.', {
        id: 'http-5xx',
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
