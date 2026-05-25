// UniAgent Hub - Agents API
import apiClient from './client';
import { ApiResponse, Agente, CreateAgentInput, UpdateAgentInput } from '@/types';

export async function listAgents(filters?: {
  search?: string;
  materia_id?: number;
}): Promise<Agente[]> {
  const response = await apiClient.get<ApiResponse<Agente[]>>('/agents', {
    params: filters,
  });
  return response.data.data;
}

export async function getAgent(id: number): Promise<Agente> {
  const response = await apiClient.get<ApiResponse<Agente>>(`/agents/${id}`);
  return response.data.data;
}

export async function createAgent(data: CreateAgentInput): Promise<Agente> {
  const response = await apiClient.post<ApiResponse<Agente>>('/agents', data);
  return response.data.data;
}

export async function updateAgent(id: number, data: UpdateAgentInput): Promise<Agente> {
  const response = await apiClient.put<ApiResponse<Agente>>(`/agents/${id}`, data);
  return response.data.data;
}

export async function deleteAgent(id: number): Promise<void> {
  await apiClient.delete(`/agents/${id}`);
}
