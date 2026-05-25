import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { NotionEditor } from '@/components/editor/NotionEditor';
import { useAuthStore } from '@/stores/authStore';
import { AutoSaveStatus, useAutoSave } from '@/hooks/useAutoSave';
import { getMockAgentById, getMockMateriaName, getMockSkill } from '@/lib/mock-asl23';
import { useSkillSave } from '@/hooks/useSkillSave';

interface SkillDraft {
  title: string;
  content: string;
}

interface SkillEditorBodyProps {
  skillId: number;
  agentId: number;
  initialTitle: string;
  initialContent: string;
  initialUpdatedAt: string;
  readOnly: boolean;
}

function SkillEditorBody({
  skillId,
  agentId,
  initialTitle,
  initialContent,
  initialUpdatedAt,
  readOnly,
}: SkillEditorBodyProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [updatedAt, setUpdatedAt] = useState<string>(initialUpdatedAt);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const saveSkill = useSkillSave();

  const persistSkill = useMemo(
    () => async (draft: SkillDraft) => {
      try {
        const saved = await saveSkill.mutateAsync({ skillId, title: draft.title, content: draft.content });
        setUpdatedAt(saved.updatedAt);
        setErrorMessage(null);
      } catch (saveError) {
        const message = saveError instanceof Error ? saveError.message : 'No se pudo guardar';
        setErrorMessage(message);
        throw saveError;
      }
    },
    [saveSkill, skillId]
  );

  const { status, error: autoSaveError, retry } = useAutoSave<SkillDraft>({ title, content }, persistSkill, 1500, !readOnly);

  const saveLabel = useMemo(() => {
    if (status === AutoSaveStatus.Saving) return 'Guardando...';
    if (status === AutoSaveStatus.Saved) {
      return `Guardado ✓${updatedAt ? ` · ${new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}`;
    }
    if (status === AutoSaveStatus.Error) return 'Error al guardar';
    return 'Listo';
  }, [status, updatedAt]);

  const breadcrumbs = useMemo(
    () => [
      { label: getMockMateriaName(getMockAgentById(agentId)?.materiaId) },
      { label: getMockAgentById(agentId)?.name ?? `Agente ${agentId}` },
      { label: title || 'Skill' },
    ],
    [agentId, title]
  );

  return (
    <AppLayout crumbs={breadcrumbs} activeAgentId={agentId} activeSkillId={skillId}>
      <div className="px-10 py-8 lg:px-12">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="max-w-2xl">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              readOnly={readOnly}
              className="w-full bg-transparent font-serif text-[38px] font-medium leading-none tracking-[-0.02em] text-[var(--ink)] outline-none placeholder:text-[var(--ink-4)]"
              placeholder="Título de la skill"
            />
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-[var(--ink-3)]">
              {readOnly ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--hairline)] bg-[var(--paper-2)] px-2.5 py-1">Modo lectura</span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--hairline)] bg-[var(--paper-2)] px-2.5 py-1">{saveLabel}</span>
              )}
              {updatedAt && !readOnly && <span>Última edición: {new Date(updatedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>}
            </div>
          </div>

          {!readOnly && (
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--hairline-2)] bg-[var(--paper)] px-3 py-2 text-[13px] text-[var(--ink-2)] transition-colors hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
            >
              <RotateCcw size={14} /> Reintentar
            </button>
          )}
        </div>

        {(status === AutoSaveStatus.Error || errorMessage || autoSaveError) && !readOnly && (
          <div className="mb-4 flex items-center gap-2 rounded-[10px] border border-[var(--bad-wash)] bg-[var(--bad-wash)] px-4 py-3 text-[13px] text-[var(--bad)]">
            <AlertTriangle size={14} />
            <span>{errorMessage || autoSaveError || 'Error al guardar'}</span>
          </div>
        )}

        <div className="max-w-4xl">
          <NotionEditor content={content} onChange={setContent} readOnly={readOnly} />
        </div>

        {!readOnly && (
          <div className="mt-4 max-w-4xl rounded-[10px] border border-[var(--hairline)] bg-[var(--paper-2)] p-4 text-[13px] text-[var(--ink-3)]">
            TODO: conectar cuando ASL-14 esté listo. Los endpoints reales de skills todavía no están activos en backend.
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export function SkillEditorPage() {
  const { skillId, agentId } = useParams();
  const user = useAuthStore((state) => state.user);
  const parsedSkillId = Number(skillId);
  const parsedAgentId = Number(agentId);
  const readOnly = user?.role === 'estudiante';

  const { data: skill, isLoading, error } = useQuery({
    queryKey: ['skill-mock', parsedSkillId],
    queryFn: () => getMockSkill(parsedSkillId),
    enabled: !!parsedSkillId,
  });

  const agent = getMockAgentById(parsedAgentId);
  const breadcrumbs = useMemo(
    () => [
      { label: getMockMateriaName(agent?.materiaId) },
      { label: agent?.name ?? `Agente ${parsedAgentId}` },
      { label: skill?.title ?? 'Skill' },
    ],
    [agent?.materiaId, agent?.name, parsedAgentId, skill?.title]
  );

  if (isLoading) {
    return (
      <AppLayout crumbs={breadcrumbs}>
        <div className="px-10 py-8 text-[var(--ink-3)]">Cargando skill…</div>
      </AppLayout>
    );
  }

  if (error || !skill) {
    return (
      <AppLayout crumbs={breadcrumbs}>
        <div className="px-10 py-8">
          <div className="rounded-[10px] border border-[var(--bad-wash)] bg-[var(--bad-wash)] p-4 text-[var(--bad)]">
            No se pudo cargar la skill.
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <SkillEditorBody
      key={skill.id}
      skillId={skill.id}
      agentId={parsedAgentId}
      initialTitle={skill.title}
      initialContent={skill.content}
      initialUpdatedAt={skill.updatedAt}
      readOnly={readOnly}
    />
  );
}
