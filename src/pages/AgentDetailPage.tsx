import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, FileText, Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStore } from '@/stores/authStore';
import { useAgent } from '@/hooks/useAgents';
import { useSkills, useCreateSkill } from '@/hooks/useSkills';
import { Skill } from '@/types';

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
      <div className="px-10 py-8 lg:px-12">
        <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-5">
            <div className="grid h-20 w-20 flex-shrink-0 place-items-center rounded-[16px] border border-[var(--hairline)] bg-[var(--paper-2)] text-[40px] shadow-[0_1px_2px_rgba(31,29,26,0.03)]">
              {agent.icono}
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
                Agente · {agent.docente.nombre}
              </div>
              <h1 className="mt-2 font-serif text-[40px] font-medium leading-tight tracking-[-0.02em] text-[var(--ink)]">
                {agent.nombre}
              </h1>
              {agent.descripcion && (
                <p className="mt-2 max-w-2xl font-serif text-[16px] italic leading-7 text-[var(--ink-2)]">
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
            </div>
          </div>

          {!readOnly && (
            <button
              type="button"
              onClick={() => void handleCreateSkill()}
              disabled={creating}
              className="inline-flex items-center gap-2 self-start rounded-[6px] border border-[var(--ink)] bg-[var(--ink)] px-4 py-2 text-[13px] font-medium text-[var(--paper)] transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={14} /> {creating ? 'Creando…' : 'Nueva skill'}
            </button>
          )}
        </header>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="font-serif text-[22px] font-medium tracking-[-0.015em] text-[var(--ink)]">
              Skills
            </h2>
            {!skillsLoading && skills.length > 0 && (
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
                {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
              </span>
            )}
          </div>

          {skillsLoading ? (
            <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--paper)] p-8 text-center text-[13px] text-[var(--ink-3)]">
              Cargando skills…
            </div>
          ) : skills.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-[var(--hairline-2)] bg-[var(--paper)] p-10 text-center">
              <FileText size={20} className="mx-auto text-[var(--ink-3)]" />
              <div className="mt-3 font-serif text-[18px] text-[var(--ink)]">
                Este agente todavía no tiene skills.
              </div>
              {readOnly ? (
                <p className="mt-2 text-[13px] text-[var(--ink-3)]">
                  Cuando tu docente publique alguna, va a aparecer acá.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleCreateSkill()}
                  disabled={creating}
                  className="mt-4 inline-flex items-center gap-2 rounded-[6px] border border-[var(--ink)] bg-[var(--ink)] px-4 py-2 text-[13px] text-[var(--paper)] transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={14} /> {creating ? 'Creando…' : 'Crear primera skill'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {skills.map((skill, index) => (
                <SkillCard
                  key={skill.id}
                  index={index}
                  skill={skill}
                  onClick={() => navigate(`/agent/${agentId}/skill/${skill.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

interface SkillCardProps {
  index: number;
  skill: Skill;
  onClick: () => void;
}

function SkillCard({ index, skill, onClick }: SkillCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[148px] flex-col rounded-[10px] border border-[var(--hairline)] bg-[var(--paper)] p-4 text-left transition-all hover:-translate-y-px hover:border-[var(--ink-3)] hover:shadow-[0_8px_20px_-10px_rgba(31,29,26,0.12)]"
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10.5px] tracking-[0.08em] text-[var(--ink-4)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <ArrowRight size={14} className="text-[var(--ink-3)] transition-colors group-hover:text-[var(--ink)]" />
      </div>
      <div className="mt-3 font-serif text-[17px] font-medium leading-tight tracking-[-0.012em] text-[var(--ink)]">
        {skill.nombre}
      </div>
      {skill.descripcion && (
        <p className="mt-1 text-[13px] text-[var(--ink-3)] line-clamp-2">{skill.descripcion}</p>
      )}
      <div className="mt-auto pt-4 flex items-center gap-2 font-mono text-[11px] tracking-[0.04em] text-[var(--ink-3)]">
        <span>{skill.tamano_kb} kb</span>
        <span>·</span>
        <span>Actualizada {new Date(skill.updated_at).toLocaleDateString([], { day: '2-digit', month: 'short' })}</span>
      </div>
    </button>
  );
}
