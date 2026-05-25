export interface MockSkillRecord {
  id: number;
  agentId: number;
  title: string;
  content: string;
  status: 'draft' | 'published';
  updatedAt: string;
}

export interface MockMateria {
  id: number;
  name: string;
}

export interface MockAgentRecord {
  id: number;
  name: string;
  emoji: string;
  description: string;
  materiaId: number | null;
  color: string;
}

const STORAGE_KEY = 'uniagent-mock-skills';

export const MOCK_MATERIAS: MockMateria[] = [
  { id: 1, name: 'Física I' },
  { id: 2, name: 'Química General' },
  { id: 3, name: 'Lenguaje y Comunicación' },
  { id: 4, name: 'Infraestructura, Plataformas Tecnológicas y Redes' },
];

export const MOCK_AGENTS: MockAgentRecord[] = [
  {
    id: 1,
    name: 'Profesor de Cálculo',
    emoji: '📐',
    description: 'Mecánica clásica para ingeniería y resolución guiada.',
    materiaId: 1,
    color: '#B85C3D',
  },
  {
    id: 2,
    name: 'Asistente de Química',
    emoji: '🧪',
    description: 'Apoyo en equilibrio químico, estequiometría y pH.',
    materiaId: 2,
    color: '#2F5A4A',
  },
];

const skillSeeds: MockSkillRecord[] = [
  {
    id: 101,
    agentId: 1,
    title: 'Límites y continuidad',
    content: '<h2>Límites y continuidad</h2><p>Explorá la idea de aproximación con ejemplos simples.</p>',
    status: 'published',
    updatedAt: new Date('2026-05-24T10:15:00Z').toISOString(),
  },
  {
    id: 102,
    agentId: 1,
    title: 'Derivadas',
    content: '<h2>Derivadas</h2><p>La derivada mide el cambio instantáneo.</p>',
    status: 'published',
    updatedAt: new Date('2026-05-24T12:20:00Z').toISOString(),
  },
  {
    id: 103,
    agentId: 1,
    title: 'Integrales',
    content: '<h2>Integrales</h2><p>Área, acumulación y anti-derivadas.</p>',
    status: 'draft',
    updatedAt: new Date('2026-05-24T13:10:00Z').toISOString(),
  },
  {
    id: 201,
    agentId: 2,
    title: 'Equilibrio ácido-base',
    content: '<h2>Equilibrio ácido-base</h2><p>pH, pOH y sistemas amortiguadores.</p>',
    status: 'published',
    updatedAt: new Date('2026-05-24T11:05:00Z').toISOString(),
  },
];

function readSkillStore(): MockSkillRecord[] {
  if (typeof window === 'undefined') {
    return [...skillSeeds];
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(skillSeeds));
    return [...skillSeeds];
  }

  try {
    return JSON.parse(stored) as MockSkillRecord[];
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(skillSeeds));
    return [...skillSeeds];
  }
}

function writeSkillStore(skills: MockSkillRecord[]) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
  }
}

export function getMockMateriaName(materiaId: number | null | undefined) {
  if (!materiaId) return 'Sin materia';
  return MOCK_MATERIAS.find((materia) => materia.id === materiaId)?.name ?? `Materia ${materiaId}`;
}

export function getMockAgentById(agentId: number | null | undefined) {
  if (!agentId) return null;
  return MOCK_AGENTS.find((agent) => agent.id === agentId) ?? null;
}

export async function listMockSkills(agentId: number): Promise<MockSkillRecord[]> {
  const skills = readSkillStore().filter((skill) => skill.agentId === agentId);
  return [...skills].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function getMockSkill(skillId: number): Promise<MockSkillRecord> {
  const skill = readSkillStore().find((record) => record.id === skillId);
  if (!skill) {
    throw new Error('Skill no encontrada');
  }

  return skill;
}

export async function createMockSkill(agentId: number): Promise<MockSkillRecord> {
  const skills = readSkillStore();
  const nextId = Math.max(...skills.map((skill) => skill.id), 0) + 1;
  const now = new Date().toISOString();
  const nextSkill: MockSkillRecord = {
    id: nextId,
    agentId,
    title: 'Nueva skill',
    content: '<p></p>',
    status: 'draft',
    updatedAt: now,
  };

  const nextSkills = [nextSkill, ...skills];
  writeSkillStore(nextSkills);
  return nextSkill;
}

export async function saveMockSkill(
  skillId: number,
  updates: Pick<MockSkillRecord, 'title' | 'content'>
): Promise<MockSkillRecord> {
  const skills = readSkillStore();
  const existing = skills.find((skill) => skill.id === skillId);

  if (!existing) {
    throw new Error('Skill no encontrada');
  }

  const updated: MockSkillRecord = {
    ...existing,
    title: updates.title,
    content: updates.content,
    updatedAt: new Date().toISOString(),
  };

  const nextSkills = skills.map((skill) => (skill.id === skillId ? updated : skill));
  writeSkillStore(nextSkills);
  return updated;
}
