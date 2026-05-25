// UniAgent Hub - Auth API
import apiClient from './client';
import { ApiResponse, User, LoginInput, RegisterInput } from '@/types';

export async function login(data: LoginInput): Promise<{ user: User; token: string }> {
  const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
    '/auth/login',
    data
  );
  return response.data.data;
}

export async function register(data: RegisterInput): Promise<{ user: User; token: string }> {
  const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
    '/auth/register',
    data
  );
  return response.data.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}
