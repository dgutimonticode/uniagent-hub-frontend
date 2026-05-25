// UniAgent Hub - Materias Hooks
import { useQuery } from '@tanstack/react-query';
import { listMaterias } from '@/api/materias.api';

export function useMaterias() {
  return useQuery({
    queryKey: ['materias'],
    queryFn: listMaterias,
    staleTime: 60_000 * 60, // 1 hour - materias don't change often
  });
}
