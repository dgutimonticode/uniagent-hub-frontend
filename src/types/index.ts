// UniAgent Hub - Shared Types
// Based on 04_api_specification.md

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'docente' | 'estudiante';
  institution: string;
  created_at: string;
  updated_at: string;
}

export interface Agente {
  id: number;
  user_id: number;
  emoji: string;
  name: string;
  description: string | null;
  materia_id: number | null;
  color: string;
  version: number;
  students_count: number;
  skills_done: number;
  skills_total: number;
  created_at: string;
  updated_at: string;
  skills: Skill[];
}

export interface Skill {
  id: number;
  agent_id: number;
  name: string;
  description: string | null;
  content: string;
  status: 'draft' | 'published';
  order_index: number;
  estimated_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  facultad: string;
}

export interface CreateAgentInput {
  emoji: string;
  name: string;
  description?: string;
  materia_id?: number;
  color: string;
}

export interface UpdateAgentInput {
  emoji?: string;
  name?: string;
  description?: string;
  materia_id?: number;
  color?: string;
}

export interface CreateSkillInput {
  agent_id: number;
  name: string;
  description?: string;
  content: string;
  estimated_minutes?: number;
}

export interface UpdateSkillInput {
  name?: string;
  description?: string;
  content?: string;
  status?: 'draft' | 'published';
  estimated_minutes?: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: 'docente' | 'estudiante';
  institution: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Source[];
}

export interface Source {
  id: string;
  title: string;
  content: string;
  relevance_score: number;
}

export interface ChatChunk {
  type: 'content' | 'source' | 'done';
  content?: string;
  source?: Source;
}
