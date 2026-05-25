// UniAgent Hub - Skills Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} from '@/api/skills.api';
import { ApiResponse, CreateSkillInput, UpdateSkillInput } from '@/types';
import { toast } from 'sonner';

interface ApiErrorResponse {
  response?: {
    data?: ApiResponse<never>;
  };
}

export function useSkills(agenteId: number) {
  return useQuery({
    queryKey: ['skills', agenteId],
    queryFn: () => listSkills(agenteId),
    enabled: !!agenteId,
  });
}

export function useSkill(agenteId: number, id: number) {
  return useQuery({
    queryKey: ['skill', agenteId, id],
    queryFn: () => getSkill(agenteId, id),
    enabled: !!agenteId && !!id,
  });
}

export function useCreateSkill(agenteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSkillInput) => createSkill(agenteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills', agenteId] });
      queryClient.invalidateQueries({ queryKey: ['agente', agenteId] });
      queryClient.invalidateQueries({ queryKey: ['agentes'] });
      toast.success('Skill creada');
    },
    onError: (error: ApiErrorResponse) => {
      const msg = error.response?.data?.error?.message || 'Error al crear skill';
      toast.error(msg);
    },
  });
}

export function useUpdateSkill(agenteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSkillInput }) =>
      updateSkill(agenteId, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['skill', agenteId, id] });
      queryClient.invalidateQueries({ queryKey: ['skills', agenteId] });
      toast.success('Skill actualizada');
    },
    onError: (error: ApiErrorResponse) => {
      const msg = error.response?.data?.error?.message || 'Error al actualizar skill';
      toast.error(msg);
    },
  });
}

export function useDeleteSkill(agenteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSkill(agenteId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills', agenteId] });
      queryClient.invalidateQueries({ queryKey: ['agente', agenteId] });
      queryClient.invalidateQueries({ queryKey: ['agentes'] });
      toast.success('Skill eliminada');
    },
    onError: (error: ApiErrorResponse) => {
      const msg = error.response?.data?.error?.message || 'Error al eliminar skill';
      toast.error(msg);
    },
  });
}
