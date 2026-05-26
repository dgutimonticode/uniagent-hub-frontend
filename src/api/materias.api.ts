// UniAgent Hub - Materias (catálogo local)
// El backend no expone GET /api/v1/materias todavía. Esta lista replica el seed
// en uniagent-hub-backend/app/seeds.py. TODO: migrar a llamada real cuando el
// endpoint exista.
import { Materia } from '@/types';

const LOCAL_MATERIAS: Materia[] = [
  { id: 1, nombre: 'Física I', carrera: 'Ingeniería en Sistemas', semestre: 1, icono: '⚛️' },
  { id: 2, nombre: 'Cálculo I', carrera: 'Ingeniería en Sistemas', semestre: 1, icono: '📐' },
  { id: 3, nombre: 'Física II', carrera: 'Ingeniería en Sistemas', semestre: 2, icono: '🌊' },
  {
    id: 4,
    nombre: 'Infraestructura, Plataformas Tecnológicas y Redes',
    carrera: 'Ingeniería en Sistemas',
    semestre: 6,
    icono: '☁️',
  },
];

export async function listMaterias(): Promise<Materia[]> {
  return Promise.resolve(LOCAL_MATERIAS);
}

export function getMateriaById(id: number | null | undefined): Materia | null {
  if (id == null) return null;
  return LOCAL_MATERIAS.find((materia) => materia.id === id) ?? null;
}

export function getMateriaName(id: number | null | undefined): string {
  const materia = getMateriaById(id);
  return materia?.nombre ?? 'Sin materia';
}
