import { useMemo } from 'react';
import { BookOpen, Plus, Sparkles, Users, ArrowRight, Bolt } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAgents } from '@/hooks/useAgents';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  trend?: 'up' | 'down';
}

interface AgentCardProps {
  id: number;
  name: string;
  emoji: string;
  color: string;
  students: number;
  skillsDone: number;
  skillsTotal: number;
  onClick: (id: number) => void;
}

interface AgentCardData {
  id: number;
  name: string;
  emoji: string;
  color: string;
  students: number;
  skillsDone: number;
  skillsTotal: number;
}

interface ActivityItem {
  when: string;
  emoji: string;
  who: string;
  verb: string;
  skill: string;
  agent: string;
  flag?: boolean;
}

interface DraftItem {
  emoji: string;
  agent: string;
  skill: string;
  progress: number;
}

function StatCard({ label, value, hint, trend }: StatCardProps) {
  return (
    <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--paper)] p-4">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--ink-3)]">{label}</div>
      <div className="mt-1.5 flex items-baseline gap-2 font-serif text-[32px] font-medium leading-none text-[var(--ink)]">
        {value}
      </div>
      <div className="mt-2 font-mono text-[10.5px] tracking-[0.04em] text-[var(--ink-3)]">
        {trend === 'up' && <span className="text-[var(--ok)]">▲ </span>}
        {trend === 'down' && <span className="text-[var(--bad)]">▼ </span>}
        {hint}
      </div>
    </div>
  );
}

function AgentCard({ id, name, emoji, color, students, skillsDone, skillsTotal, onClick }: AgentCardProps) {
  const progress = Math.round((skillsDone / Math.max(1, skillsTotal)) * 100);

  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      style={{ ['--agent-c' as string]: color }}
      className="group relative flex min-h-[168px] flex-col rounded-[10px] border border-[var(--hairline)] bg-[var(--paper)] p-4 text-left transition-all hover:-translate-y-px hover:border-[var(--ink-3)] hover:shadow-[0_8px_20px_-10px_rgba(31,29,26,0.12)]"
    >
      <div className="absolute left-0 right-0 top-0 h-[3px] rounded-t-[10px] bg-[var(--agent-c)] opacity-85" />
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-[8px] border border-[var(--hairline)] bg-[var(--paper-2)] text-[22px]">
          {emoji}
        </div>
        <div className="text-[var(--ink-3)] transition-colors group-hover:text-[var(--ink)]">
          <ArrowRight size={14} />
        </div>
      </div>

      <div className="mt-3 font-serif text-[17px] font-medium leading-tight tracking-[-0.012em] text-[var(--ink)]">
        {name}
      </div>

      <div className="mt-1 flex items-center gap-2 font-mono text-[11px] tracking-[0.04em] text-[var(--ink-3)]">
        <span className="inline-flex items-center gap-1">
          <Users size={11} /> {students}
        </span>
        <span>·</span>
        <span className="inline-flex items-center gap-1">
          <BookOpen size={11} /> {skillsTotal} skills
        </span>
      </div>

      <div className="mt-auto pt-4">
        <div className="h-1 rounded-full bg-[var(--paper-3)]">
          <div className="h-1 rounded-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-1.5 font-mono text-[10.5px] text-[var(--ink-3)]">
          {skillsDone}/{skillsTotal} skills publicadas · {progress}%
        </div>
      </div>
    </button>
  );
}

function ActivityRow({ when, emoji, who, verb, skill, agent, flag }: ActivityItem) {
  return (
    <div className={`grid grid-cols-[86px_28px_1fr_auto] items-center gap-2.5 border-t border-[var(--hairline)] px-3.5 py-2.75 first:border-t-0 ${flag ? 'bg-[var(--bad-wash)]' : ''}`}>
      <div className="font-mono text-[10.5px] tracking-[0.04em] text-[var(--ink-3)]">{when}</div>
      <div className="grid h-[22px] w-[22px] place-items-center rounded-[5px] bg-[var(--paper-2)] text-[14px]">{emoji}</div>
      <div className="text-[13.5px]">
        <span className="font-medium text-[var(--ink)]">{who}</span>{' '}
        <span className="text-[var(--ink-3)]">{verb}</span>{' '}
        <span className="font-serif text-[14px] italic font-normal text-[var(--ink)]">{skill}</span>
        <span className="text-[12.5px] text-[var(--ink-3)]"> · {agent}</span>
      </div>
      {flag && (
        <span className="inline-flex items-center gap-1 rounded-[99px] border border-[rgba(162,74,60,0.3)] bg-[var(--bad-wash)] px-2 py-0.5 text-[12px] text-[var(--bad)]">
          <span className="h-1.5 w-1.5 rounded-full bg-current" /> atención
        </span>
      )}
    </div>
  );
}

function DraftRow({ emoji, agent, skill, progress }: DraftItem) {
  return (
    <div className="flex items-center gap-2.5 border-t border-[var(--hairline)] px-3.5 py-2.5 first:border-t-0">
      <div className="grid h-[22px] w-[22px] place-items-center rounded-[5px] bg-[var(--paper-2)] text-[13px]">{emoji}</div>
      <div className="min-w-0 flex-1">
        <div className="font-serif text-[14px] font-medium text-[var(--ink)]">{skill}</div>
        <div className="text-[11.5px] text-[var(--ink-3)]">{agent}</div>
      </div>
      <div className="w-[64px]">
        <div className="h-1 rounded-full bg-[var(--paper-3)]">
          <div className="h-1 rounded-full bg-[var(--accent)]" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-0.5 text-right font-mono text-[10px] text-[var(--ink-3)]">{progress}%</div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: agents = [] } = useAgents();
  const user = useAuthStore((state) => state.user);

  const dashboardStats = useMemo(() => {
    const totalAgents = agents.length;
    const totalStudents = agents.reduce((sum, agent) => sum + (agent.students_count ?? 0), 0);
    const totalSkills = agents.reduce((sum, agent) => sum + (agent.skills_total ?? agent.skills.length ?? 0), 0);
    const publishedSkills = agents.reduce((sum, agent) => sum + (agent.skills_done ?? 0), 0);
    const averageCompletion = totalSkills > 0 ? Math.round((publishedSkills / totalSkills) * 100) : 0;

    return [
      { label: 'Agentes activos', value: String(totalAgents || 0), hint: 'Actualizado desde tu catálogo', trend: 'up' as const },
      { label: 'Estudiantes', value: String(totalStudents || 0), hint: 'Actividad agregada', trend: 'up' as const },
      { label: 'Skills publicadas', value: String(publishedSkills || 0), hint: `${totalSkills || 0} total`, trend: 'up' as const },
      { label: 'Completitud media', value: String(averageCompletion || 0), hint: 'Estado general del catálogo', trend: averageCompletion >= 50 ? 'up' as const : 'down' as const },
    ];
  }, [agents]);

  const agentCards = useMemo<AgentCardData[]>(() => {
    if (agents.length > 0) {
      return agents.map((agent) => ({
        id: agent.id,
        name: agent.name,
        emoji: agent.emoji,
        color: agent.color,
        students: agent.students_count,
        skillsDone: agent.skills_done,
        skillsTotal: agent.skills_total,
      }));
    }

    return [
      { id: 1, name: 'Profesor de Cálculo', emoji: '📐', color: '#B85C3D', students: 218, skillsDone: 2, skillsTotal: 4 },
      { id: 2, name: 'Asistente de Química', emoji: '🧪', color: '#2F5A4A', students: 96, skillsDone: 3, skillsTotal: 5 },
      { id: 3, name: 'Tutor de Ensayo', emoji: '✒️', color: '#3D5A80', students: 142, skillsDone: 4, skillsTotal: 4 },
      { id: 4, name: 'Geografía Mundial', emoji: '🌍', color: '#8B5A3C', students: 64, skillsDone: 1, skillsTotal: 6 },
    ];
  }, [agents]);

  const activity: ActivityItem[] = [
    { when: 'hace 8 min', emoji: '📐', who: 'Andrés Cuevas', verb: 'completó', skill: 'Derivadas', agent: 'Cálculo I' },
    { when: 'hace 22 min', emoji: '🌍', who: 'Laura Pinto', verb: 'se atascó en', skill: 'América Latina', agent: 'Geografía', flag: true },
    { when: 'hace 41 min', emoji: '📐', who: '3 estudiantes', verb: 'iniciaron', skill: 'Regla de la cadena', agent: 'Cálculo I' },
    { when: 'hace 1h', emoji: '🧪', who: 'Camila Torres', verb: 'hizo una pregunta a', skill: 'Equilibrio ácido-base', agent: 'Química' },
    { when: 'hoy, 11:02', emoji: '✒️', who: 'Tú', verb: 'publicaste', skill: 'Estilo y voz', agent: 'Tutor de Ensayo' },
    { when: 'ayer, 18:31', emoji: '📐', who: '14 estudiantes', verb: 'dominaron', skill: 'Límites y continuidad', agent: 'Cálculo I' },
  ];

  const drafts: DraftItem[] = [
    { emoji: '📐', agent: 'Cálculo I', skill: 'Integrales', progress: 45 },
    { emoji: '🌍', agent: 'Geografía', skill: 'Europa', progress: 20 },
    { emoji: '📜', agent: 'Historia del Arte', skill: 'Renacimiento', progress: 80 },
    { emoji: '⌨️', agent: 'Mentor de Python', skill: 'Estructuras de datos', progress: 60 },
  ];

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }, []);

  const userName = user?.name?.split(' ')[0] ?? 'María';

  return (
    <AppLayout crumbs={[{ label: 'Inicio' }]}>
      <div className="px-10 py-8 lg:px-12">
        <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)]">Martes 21 · semana lectiva 6</div>
            <h1 className="mt-2 font-serif text-[48px] font-normal leading-none tracking-[-0.022em] text-[var(--ink)]">
              {greeting},<br />
              <em>{userName}.</em>
            </h1>
          </div>

          <div className="flex flex-col items-start gap-2 lg:items-end">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)]">Atajos</div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--hairline-2)] bg-[var(--paper)] px-3 py-1.75 text-[12.5px] text-[var(--ink-2)] transition-all hover:border-[var(--ink-3)] hover:text-[var(--ink)]">
                <Plus size={13} /> Nueva skill
              </button>
              <button type="button" className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--hairline-2)] bg-[var(--paper)] px-3 py-1.75 text-[12.5px] text-[var(--ink-2)] transition-all hover:border-[var(--ink-3)] hover:text-[var(--ink)]">
                <Bolt size={13} /> Probar agente
              </button>
              <button type="button" className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--hairline-2)] bg-[var(--paper)] px-3 py-1.75 text-[12.5px] text-[var(--ink-2)] transition-all hover:border-[var(--ink-3)] hover:text-[var(--ink)]">
                <ArrowRight size={13} /> Compartir clase
              </button>
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="mb-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="font-serif text-[24px] font-medium tracking-[-0.015em] text-[var(--ink)]">
              Tus <em>agentes</em>
            </h2>
            <div className="flex gap-1.5">
              <button type="button" className="rounded-full px-3.5 py-1.5 text-[13px] text-[var(--ink-3)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--ink)]">Recientes</button>
              <button type="button" className="rounded-full px-3.5 py-1.5 text-[13px] text-[var(--ink-3)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--ink)]">Por materia</button>
              <button type="button" className="rounded-full px-3.5 py-1.5 text-[13px] text-[var(--ink-3)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--ink)]">Borradores</button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {agentCards.map((agent) => (
              <AgentCard key={agent.id} {...agent} onClick={(agentId) => navigate(`/agent/${agentId}`)} />
            ))}

            <button
              type="button"
              onClick={() => navigate('/agent/new')}
              className="flex min-h-[168px] flex-col items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[var(--hairline-2)] bg-transparent p-4 text-[var(--ink-3)] transition-all hover:border-[var(--accent-soft)] hover:bg-[var(--accent-wash)] hover:text-[var(--accent)]"
            >
              <Plus size={22} />
              <span className="text-[13px]">Crear otro agente</span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.1em]">O empezar de una plantilla</span>
            </button>
          </div>
        </section>

        <section className="grid gap-7 xl:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-4 flex items-end justify-between">
              <h2 className="font-serif text-[24px] font-medium tracking-[-0.015em] text-[var(--ink)]">
                Actividad <em>reciente</em>
              </h2>
              <button type="button" className="rounded-full px-3.5 py-1.5 text-[13px] text-[var(--ink-3)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--ink)]">
                Ver todo
              </button>
            </div>

            <div className="overflow-hidden rounded-[10px] border border-[var(--hairline)] bg-[var(--paper)]">
              {activity.map((item) => (
                <ActivityRow key={`${item.when}-${item.skill}`} {...item} />
              ))}
            </div>
          </div>

          <aside>
            <div className="mb-4">
              <h2 className="font-serif text-[24px] font-medium tracking-[-0.015em] text-[var(--ink)]">
                Por <em>terminar</em>
              </h2>
            </div>

            <div className="overflow-hidden rounded-[10px] border border-[var(--hairline)] bg-[var(--paper)]">
              {drafts.map((draft) => (
                <DraftRow key={`${draft.agent}-${draft.skill}`} {...draft} />
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-[10px] border border-[var(--accent-soft)] bg-[var(--accent-wash)] p-4 text-[13.5px] leading-6 text-[var(--ink)]">
              <Sparkles size={18} className="shrink-0 text-[var(--accent)]" />
              <div className="flex-1">
                <strong className="font-medium">Sugerencia.</strong> Tres estudiantes se atascaron en <em className="text-[var(--accent)]">Regla de la cadena</em>. Quizá quieras revisar el guion.
              </div>
              <button type="button" className="rounded-[6px] border border-[var(--hairline-2)] bg-[var(--paper)] px-3 py-1.5 text-[12px] text-[var(--ink-2)] transition-colors hover:border-[var(--ink-3)] hover:text-[var(--ink)]">
                Revisar →
              </button>
            </div>
          </aside>
        </section>
      </div>
    </AppLayout>
  );
}
