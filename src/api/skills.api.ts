// UniAgent Hub - Skills API
import apiClient from './client';
import { ApiResponse, Skill, CreateSkillInput, UpdateSkillInput } from '@/types';

export async function listSkills(agentId: number): Promise<Skill[]> {
  const response = await apiClient.get<ApiResponse<Skill[]>>(`/agents/${agentId}/skills`);
  return response.data.data;
}

export async function getSkill(id: number): Promise<Skill> {
  const response = await apiClient.get<ApiResponse<Skill>>(`/skills/${id}`);
  return response.data.data;
}

export async function createSkill(data: CreateSkillInput): Promise<Skill> {
  const response = await apiClient.post<ApiResponse<Skill>>('/skills', data);
  return response.data.data;
}

export async function updateSkill(id: number, data: UpdateSkillInput): Promise<Skill> {
  const response = await apiClient.put<ApiResponse<Skill>>(`/skills/${id}`, data);
  return response.data.data;
}

export async function deleteSkill(id: number): Promise<void> {
  await apiClient.delete(`/skills/${id}`);
}
