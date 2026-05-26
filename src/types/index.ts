// UniAgent Hub - Shared Types
// Aligned to the real backend contract (Spanish field names).
// Source of truth: uniagent-hub-backend/app/schemas/*.py + app/models/*.py

export type Rol = 'docente' | 'estudiante';

export interface MateriaBrief {
  id: number;
  nombre: string;
  icono?: string | null;
}

export interface Materia extends MateriaBrief {
  carrera?: string | null;
  semestre?: number | null;
  created_at?: string | null;
}

export interface DocenteBrief {
  id: number;
  nombre: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  materia: Materia | null;
  avatar_url: string | null;
  created_at: string | null;
  last_login_at: string | null;
}

export interface Agente {
  id: number;
  nombre: string;
  descripcion: string | null;
  icono: string;
  s3_prefix: string;
  materia: MateriaBrief;
  docente: DocenteBrief;
  skills_count: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  agente_id: number;
  nombre: string;
  descripcion: string | null;
  s3_key: string;
  tamano_kb: number;
  orden: number;
  created_at: string;
  updated_at: string;
}

export interface SkillDetail extends Skill {
  contenido: string;
}

export interface CreateAgentInput {
  nombre: string;
  descripcion?: string;
  icono?: string;
  materia_id: number;
}

export interface UpdateAgentInput {
  nombre?: string;
  descripcion?: string;
  icono?: string;
}

export interface CreateSkillInput {
  nombre: string;
  descripcion?: string;
  contenido?: string;
}

export interface UpdateSkillInput {
  nombre?: string;
  descripcion?: string;
  contenido?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface SkillDownload {
  url: string;
  expires_in: number;
  filename: string;
}
