// UniAgent Hub - Materias Hook
// La lista vive localmente porque el backend aún no expone GET /api/v1/materias.
// Cuando el endpoint exista, este hook va a llamar al servicio real sin cambiar la interfaz.
import { useQuery } from '@tanstack/react-query';
import { listMaterias } from '@/api/materias.api';

export function useMaterias() {
  return useQuery({
    queryKey: ['materias'],
    queryFn: listMaterias,
    staleTime: 60_000 * 60,
  });
}
