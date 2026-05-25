import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStore } from '@/stores/authStore';
import { useAgent } from '@/hooks/useAgents';
import { useSkills, useCreateSkill } from '@/hooks/useSkills';

export function AgentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const agentId = Number(id);

  const { data: agent, isLoading: agentLoading, error: agentError } = useAgent(agentId);
  const { data: skills = [], isLoading: skillsLoading } = useSkills(agentId);
  const createSkill = useCreateSkill(agentId);

  const [creating, setCreating] = useState(false);

  const readOnly = user?.rol === 'estudiante';
  const title = agent?.nombre ?? 'Agente';

  const breadcrumbs = useMemo(
    () => [
      { label: agent?.materia?.nombre ?? 'Sin materia' },
      { label: title },
    ],
    [agent?.materia?.nombre, title]
  );

  const handleCreateSkill = async () => {
    if (readOnly) return;
    setCreating(true);
    try {
      const created = await createSkill.mutateAsync({
        nombre: 'Nueva skill',
        descripcion: undefined,
        contenido: '',
      });
      navigate(`/agent/${agentId}/skill/${created.id}`);
    } finally {
      setCreating(false);
    }
  };

  if (agentLoading) {
    return (
      <AppLayout crumbs={breadcrumbs} activeAgentId={agentId}>
        <div className="px-10 py-8 text-[var(--ink-3)]">Cargando agente…</div>
      </AppLayout>
    );
  }

  if (agentError || !agent) {
    return (
      <AppLayout crumbs={breadcrumbs} activeAgentId={agentId}>
        <div className="px-10 py-8">
          <div className="rounded-[10px] border border-[var(--bad-wash)] bg-[var(--bad-wash)] p-4 text-[var(--bad)]">
            No se pudo cargar el agente.
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout crumbs={breadcrumbs} activeAgentId={agentId}>
      <div className="grid min-h-0 grid-cols-1 lg:grid-cols-[320px_1fr]">
        <aside className="border-r border-[var(--hairline)] bg-[var(--paper-2)] px-5 py-6">
          <div className="rounded-[12px] border border-[var(--hairline)] bg-[var(--paper)] p-5">
            <div className="flex items-start gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-[14px] border border-[var(--hairline)] bg-[var(--paper-2)] text-[34px] shadow-[0_1px_2px_rgba(31,29,26,0.03)]">
                {agent.icono}
              </div>
            </div>

            <h1 className="mt-4 font-serif text-[34px] font-medium leading-tight tracking-[-0.02em] text-[var(--ink)]">
              {agent.nombre}
            </h1>
            {agent.descripcion && (
              <p className="mt-2 font-serif text-[15px] italic leading-7 text-[var(--ink-2)]">
                {agent.descripcion}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2 text-[12px] text-[var(--ink-3)]">
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--hairline)] bg-[var(--paper-2)] px-2.5 py-1">
                <BookOpen size={12} /> {agent.materia.nombre}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--hairline)] bg-[var(--paper-2)] px-2.5 py-1">
                {skills.length} skills
              </span>
            </div>

            {!readOnly && (
              <div className="mt-5 flex items-center justify-between rounded-[10px] border border-[var(--hairline)] bg-[var(--paper-2)] px-4 py-3">
                <div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--ink-3)]">Nueva skill</div>
                  <div className="mt-1 text-[13px] text-[var(--ink-2)]">Crear un borrador vacío y empezar a escribir.</div>
                </div>
                <button
                  type="button"
                  onClick={() => void handleCreateSkill()}
                  disabled={creating}
                  className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--ink)] bg-[var(--ink)] px-3 py-2 text-[13px] text-[var(--paper)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={14} /> {creating ? 'Creando…' : 'Nueva skill'}
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-[12px] border border-[var(--hairline)] bg-[var(--paper)] p-3">
            <div className="px-2 pb-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--ink-3)]">Skills</div>
            {skillsLoading ? (
              <div className="px-3 py-4 text-[13px] text-[var(--ink-3)]">Cargando…</div>
            ) : skills.length === 0 ? (
              <div className="px-3 py-4 text-[13px] text-[var(--ink-3)]">
                Este agente todavía no tiene skills.
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {skills.map((skill, index) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => navigate(`/agent/${agentId}/skill/${skill.id}`)}
                    className="flex items-center gap-2 rounded-[8px] px-3 py-2 text-left text-[13px] text-[var(--ink-2)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--ink)]"
                  >
                    <span className="font-mono text-[10px] text-[var(--ink-4)]">{String(index + 1).padStart(2, '0')}</span>
                    <span className="min-w-0 flex-1 truncate font-serif text-[14px]">{skill.nombre}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--ink-3)]">{skill.tamano_kb}kb</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <main className="px-6 py-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="rounded-[12px] border border-[var(--hairline)] bg-[var(--paper)] p-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)]">Resumen del agente</div>
              <div className="mt-3 grid gap-3 text-[14px] text-[var(--ink-2)]">
                <div>
                  <span className="font-medium text-[var(--ink)]">Icono:</span> {agent.icono}
                </div>
                <div>
                  <span className="font-medium text-[var(--ink)]">Materia:</span> {agent.materia.nombre}
                </div>
                <div>
                  <span className="font-medium text-[var(--ink)]">Docente:</span> {agent.docente.nombre}
                </div>
                <div>
                  <span className="font-medium text-[var(--ink)]">Estado:</span> {readOnly ? 'Vista estudiante' : 'Vista docente'}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
