import { useMutation } from '@tanstack/react-query';
import { saveMockSkill } from '@/lib/mock-asl23';

interface SaveSkillPayload {
  skillId: number;
  title: string;
  content: string;
}

export function useSkillSave() {
  return useMutation({
    mutationFn: async ({ skillId, title, content }: SaveSkillPayload) => {
      // TODO: conectar cuando ASL-14 esté listo.
      // await apiClient.put(`/skills/${skillId}`, { title, content });
      return saveMockSkill(skillId, { title, content });
    },
  });
}
