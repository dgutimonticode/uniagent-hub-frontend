import { useMemo } from 'react';
import { BookOpen, Plus, Sparkles, ArrowRight, FileText, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAgents } from '@/hooks/useAgents';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
}

interface AgentCardProps {
  id: number;
  nombre: string;
  icono: string;
  descripcion: string | null;
  materia: string;
  skillsCount: number;
  onClick: (id: number) => void;
}

function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--paper)] p-4">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--ink-3)]">{label}</div>
      <div className="mt-1.5 flex items-baseline gap-2 font-serif text-[32px] font-medium leading-none text-[var(--ink)]">
        {value}
      </div>
      <div className="mt-2 font-mono text-[10.5px] tracking-[0.04em] text-[var(--ink-3)]">{hint}</div>
    </div>
  );
}

function AgentCard({ id, nombre, icono, descripcion, materia, skillsCount, onClick }: AgentCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className="group relative flex min-h-[168px] flex-col rounded-[10px] border border-[var(--hairline)] bg-[var(--paper)] p-4 text-left transition-all hover:-translate-y-px hover:border-[var(--ink-3)] hover:shadow-[0_8px_20px_-10px_rgba(31,29,26,0.12)]"
    >
      <div className="absolute left-0 right-0 top-0 h-[3px] rounded-t-[10px] bg-[var(--accent)] opacity-85" />
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-[8px] border border-[var(--hairline)] bg-[var(--paper-2)] text-[22px]">
          {icono}
        </div>
        <div className="text-[var(--ink-3)] transition-colors group-hover:text-[var(--ink)]">
          <ArrowRight size={14} />
        </div>
      </div>

      <div className="mt-3 font-serif text-[17px] font-medium leading-tight tracking-[-0.012em] text-[var(--ink)]">
        {nombre}
      </div>

      {descripcion && (
        <div className="mt-1 text-[13px] text-[var(--ink-3)] line-clamp-2">{descripcion}</div>
      )}

      <div className="mt-auto pt-4 flex items-center gap-2 font-mono text-[11px] tracking-[0.04em] text-[var(--ink-3)]">
        <span className="inline-flex items-center gap-1">
          <BookOpen size={11} /> {skillsCount} skills
        </span>
        <span>·</span>
        <span className="truncate">{materia}</span>
      </div>
    </button>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: agents = [], isLoading } = useAgents();
  const user = useAuthStore((state) => state.user);
  const openAgentEditor = useUIStore((state) => state.openAgentEditor);
  const isDocente = user?.rol === 'docente';

  const dashboardStats = useMemo(() => {
    const totalAgents = agents.length;
    const totalSkills = agents.reduce((sum, agent) => sum + (agent.skills_count ?? 0), 0);
    const totalMaterias = new Set(agents.map((a) => a.materia.id)).size;

    if (isDocente) {
      const avg = totalAgents > 0 ? Math.round(totalSkills / totalAgents) : 0;
      return [
        { label: 'Agentes activos', value: String(totalAgents), hint: 'En tu catálogo' },
        { label: 'Skills totales', value: String(totalSkills), hint: 'Acumulado entre agentes' },
        { label: 'Materias cubiertas', value: String(totalMaterias), hint: 'Con agentes asignados' },
        { label: 'Promedio skills', value: String(avg), hint: 'Por agente' },
      ];
    }

    return [
      { label: 'Agentes disponibles', value: String(totalAgents), hint: 'Listos para consultar' },
      { label: 'Skills publicadas', value: String(totalSkills), hint: 'En tus agentes' },
      { label: 'Materias', value: String(totalMaterias), hint: 'En tu catálogo' },
    ];
  }, [agents, isDocente]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }, []);

  const userName = user?.nombre?.split(' ')[0] ?? '';

  const handleNewSkill = () => {
    if (agents.length === 0) {
      toast.info('Primero creá un agente para sumarle skills.');
      return;
    }
    navigate(`/agent/${agents[0].id}`);
  };

  return (
    <AppLayout crumbs={[{ label: 'Inicio' }]}>
      <div className="px-10 py-8 lg:px-12">
        <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
              {isDocente ? 'Tu espacio de trabajo' : 'Tu espacio de estudio'}
            </div>
            <h1 className="mt-2 font-serif text-[48px] font-normal leading-none tracking-[-0.022em] text-[var(--ink)]">
              {greeting},<br />
              <em>{userName || 'bienvenido'}.</em>
            </h1>
          </div>

          {isDocente && (
            <div className="flex flex-col items-start gap-2 lg:items-end">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)]">Atajos</div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openAgentEditor(null)}
                  className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--hairline-2)] bg-[var(--paper)] px-3 py-1.75 text-[12.5px] text-[var(--ink-2)] transition-all hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
                >
                  <Plus size={13} /> Nuevo agente
                </button>
                <button
                  type="button"
                  onClick={handleNewSkill}
                  className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--hairline-2)] bg-[var(--paper)] px-3 py-1.75 text-[12.5px] text-[var(--ink-2)] transition-all hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
                >
                  <FileText size={13} /> Nueva skill
                </button>
              </div>
            </div>
          )}
        </header>

        <section
          className={`mb-8 grid gap-3 md:grid-cols-2 ${
            isDocente ? 'xl:grid-cols-4' : 'xl:grid-cols-3'
          }`}
        >
          {dashboardStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="mb-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="font-serif text-[24px] font-medium tracking-[-0.015em] text-[var(--ink)]">
              {isDocente ? (
                <>Tus <em>agentes</em></>
              ) : (
                <>Agentes <em>disponibles</em></>
              )}
            </h2>
          </div>

          {isLoading ? (
            <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--paper)] p-8 text-center text-[13px] text-[var(--ink-3)]">
              Cargando agentes…
            </div>
          ) : agents.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-[var(--hairline-2)] bg-[var(--paper)] p-10 text-center">
              {isDocente ? (
                <>
                  <div className="font-serif text-[20px] text-[var(--ink)]">Todavía no tenés agentes.</div>
                  <p className="mt-2 text-[13px] text-[var(--ink-3)]">
                    Creá tu primer agente para empezar a sumar skills.
                  </p>
                  <button
                    type="button"
                    onClick={() => openAgentEditor(null)}
                    className="mt-4 inline-flex items-center gap-2 rounded-[6px] border border-[var(--ink)] bg-[var(--ink)] px-4 py-2 text-[13px] text-[var(--paper)] transition-colors hover:bg-black"
                  >
                    <Plus size={14} /> Crear agente
                  </button>
                </>
              ) : (
                <>
                  <GraduationCap size={20} className="mx-auto text-[var(--ink-3)]" />
                  <div className="mt-3 font-serif text-[20px] text-[var(--ink)]">
                    Todavía no hay agentes publicados.
                  </div>
                  <p className="mt-2 text-[13px] text-[var(--ink-3)]">
                    Cuando tu cátedra publique uno, va a aparecer acá.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  id={agent.id}
                  nombre={agent.nombre}
                  icono={agent.icono}
                  descripcion={agent.descripcion}
                  materia={agent.materia.nombre}
                  skillsCount={agent.skills_count}
                  onClick={(agentId) => navigate(`/agent/${agentId}`)}
                />
              ))}

              {isDocente && (
                <button
                  type="button"
                  onClick={() => openAgentEditor(null)}
                  className="flex min-h-[168px] flex-col items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[var(--hairline-2)] bg-transparent p-4 text-[var(--ink-3)] transition-all hover:border-[var(--accent-soft)] hover:bg-[var(--accent-wash)] hover:text-[var(--accent)]"
                >
                  <Plus size={22} />
                  <span className="text-[13px]">Crear otro agente</span>
                </button>
              )}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-serif text-[24px] font-medium tracking-[-0.015em] text-[var(--ink)]">
              Actividad <em>reciente</em>
            </h2>
          </div>

          <div className="overflow-hidden rounded-[10px] border border-dashed border-[var(--hairline-2)] bg-[var(--paper)] p-8 text-center">
            <Sparkles size={18} className="mx-auto text-[var(--ink-3)]" />
            <div className="mt-3 font-serif text-[16px] text-[var(--ink-2)]">Próximamente</div>
            <p className="mt-1 text-[12.5px] text-[var(--ink-3)]">
              {isDocente
                ? 'El feed de actividad de estudiantes se va a conectar cuando el backend lo exponga.'
                : 'Tu historial de consultas va a aparecer acá cuando el backend lo exponga.'}
            </p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
