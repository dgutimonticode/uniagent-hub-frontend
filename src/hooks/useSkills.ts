// UniAgent Hub - Skills Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listSkills, getSkill, createSkill, updateSkill, deleteSkill } from '@/api/skills.api';
import { ApiResponse, CreateSkillInput, UpdateSkillInput } from '@/types';
import { toast } from 'sonner';

interface ApiErrorResponse {
  response?: {
    data?: ApiResponse<never>;
  };
}

export function useSkills(agentId: number) {
  return useQuery({
    queryKey: ['skills', agentId],
    queryFn: () => listSkills(agentId),
    enabled: !!agentId,
  });
}

export function useSkill(id: number) {
  return useQuery({
    queryKey: ['skill', id],
    queryFn: () => getSkill(id),
    enabled: !!id,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateSkillInput) => createSkill(data),
    onSuccess: (_, { agent_id }) => {
      queryClient.invalidateQueries({ queryKey: ['skills', agent_id] });
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Skill creada');
    },
    onError: (error: ApiErrorResponse) => {
      const msg = error.response?.data?.error?.message || 'Error al crear skill';
      toast.error(msg);
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSkillInput }) => 
      updateSkill(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['skill', id] });
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill actualizada');
    },
    onError: (error: ApiErrorResponse) => {
      const msg = error.response?.data?.error?.message || 'Error al actualizar skill';
      toast.error(msg);
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Skill eliminada');
    },
    onError: (error: ApiErrorResponse) => {
      const msg = error.response?.data?.error?.message || 'Error al eliminar skill';
      toast.error(msg);
    },
  });
}
