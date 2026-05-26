import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSkill } from '@/api/skills.api';
import { Skill } from '@/types';

interface SaveSkillPayload {
  agenteId: number;
  skillId: number;
  nombre: string;
  contenido: string;
}

export function useSkillSave() {
  const queryClient = useQueryClient();

  return useMutation<Skill, Error, SaveSkillPayload>({
    mutationFn: ({ agenteId, skillId, nombre, contenido }) =>
      updateSkill(agenteId, skillId, { nombre, contenido }),
    onSuccess: (_data, { agenteId, skillId }) => {
      queryClient.invalidateQueries({ queryKey: ['skill', agenteId, skillId] });
      queryClient.invalidateQueries({ queryKey: ['skills', agenteId] });
    },
  });
}
