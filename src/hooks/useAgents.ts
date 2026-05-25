// UniAgent Hub - Agents Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listAgents, getAgent, createAgent, updateAgent, deleteAgent } from '@/api/agents.api';
import { ApiResponse, CreateAgentInput, UpdateAgentInput } from '@/types';
import { toast } from 'sonner';

interface ApiErrorResponse {
  response?: {
    data?: ApiResponse<never>;
  };
}

export function useAgents(filters?: { search?: string; materia_id?: number }) {
  return useQuery({
    queryKey: ['agents', filters],
    queryFn: () => listAgents(filters),
    staleTime: 30_000,
  });
}

export function useAgent(id: number) {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: () => getAgent(id),
    enabled: !!id,
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateAgentInput) => createAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Agente creado');
    },
    onError: (error: ApiErrorResponse) => {
      const msg = error.response?.data?.error?.message || 'Error al crear agente';
      toast.error(msg);
    },
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAgentInput }) => 
      updateAgent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['agent', id] });
      toast.success('Agente actualizado');
    },
    onError: (error: ApiErrorResponse) => {
      const msg = error.response?.data?.error?.message || 'Error al actualizar agente';
      toast.error(msg);
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Agente eliminado');
    },
    onError: (error: ApiErrorResponse) => {
      const msg = error.response?.data?.error?.message || 'Error al eliminar agente';
      toast.error(msg);
    },
  });
}
