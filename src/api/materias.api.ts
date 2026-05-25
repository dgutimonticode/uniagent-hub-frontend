// UniAgent Hub - Materias API
import apiClient from './client';
import { ApiResponse, Materia } from '@/types';

export async function listMaterias(): Promise<Materia[]> {
  const response = await apiClient.get<ApiResponse<Materia[]>>('/materias');
  return response.data.data;
}
