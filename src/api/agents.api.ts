// UniAgent Hub - Agentes API
import apiClient from './client';
import { ApiResponse, Agente, CreateAgentInput, UpdateAgentInput } from '@/types';

export async function listAgents(filters?: {
  search?: string;
  materia_id?: number;
}): Promise<Agente[]> {
  const response = await apiClient.get<ApiResponse<Agente[]>>('/agentes', {
    params: filters,
  });
  return response.data.data;
}

export async function getAgent(id: number): Promise<Agente> {
  const response = await apiClient.get<ApiResponse<Agente>>(`/agentes/${id}`);
  return response.data.data;
}

export async function createAgent(data: CreateAgentInput): Promise<Agente> {
  const response = await apiClient.post<ApiResponse<Agente>>('/agentes', data);
  return response.data.data;
}

export async function updateAgent(id: number, data: UpdateAgentInput): Promise<Agente> {
  const response = await apiClient.put<ApiResponse<Agente>>(`/agentes/${id}`, data);
  return response.data.data;
}

export async function deleteAgent(id: number): Promise<void> {
  await apiClient.delete(`/agentes/${id}`);
}
