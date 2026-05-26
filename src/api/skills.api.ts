// UniAgent Hub - Skills API
// All endpoints are nested under /agentes/:agenteId/skills per backend contract.
import apiClient from './client';
import {
  ApiResponse,
  Skill,
  SkillDetail,
  SkillDownload,
  CreateSkillInput,
  UpdateSkillInput,
} from '@/types';

export async function listSkills(agenteId: number): Promise<Skill[]> {
  const response = await apiClient.get<ApiResponse<Skill[]>>(
    `/agentes/${agenteId}/skills`
  );
  return response.data.data;
}

export async function getSkill(agenteId: number, id: number): Promise<SkillDetail> {
  const response = await apiClient.get<ApiResponse<SkillDetail>>(
    `/agentes/${agenteId}/skills/${id}`
  );
  return response.data.data;
}

export async function createSkill(
  agenteId: number,
  data: CreateSkillInput
): Promise<Skill> {
  const response = await apiClient.post<ApiResponse<Skill>>(
    `/agentes/${agenteId}/skills`,
    data
  );
  return response.data.data;
}

export async function updateSkill(
  agenteId: number,
  id: number,
  data: UpdateSkillInput
): Promise<Skill> {
  const response = await apiClient.put<ApiResponse<Skill>>(
    `/agentes/${agenteId}/skills/${id}`,
    data
  );
  return response.data.data;
}

export async function deleteSkill(agenteId: number, id: number): Promise<void> {
  await apiClient.delete(`/agentes/${agenteId}/skills/${id}`);
}

export async function getSkillDownloadUrl(
  agenteId: number,
  id: number
): Promise<SkillDownload> {
  const response = await apiClient.get<ApiResponse<SkillDownload>>(
    `/agentes/${agenteId}/skills/${id}/download`
  );
  return response.data.data;
}
