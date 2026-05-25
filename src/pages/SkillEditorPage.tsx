import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, Download, RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { NotionEditor } from '@/components/editor/NotionEditor';
import { useAuthStore } from '@/stores/authStore';
import { AutoSaveStatus, useAutoSave } from '@/hooks/useAutoSave';
import { useAgent } from '@/hooks/useAgents';
import { useSkill, useDeleteSkill } from '@/hooks/useSkills';
import { useSkillSave } from '@/hooks/useSkillSave';
import { getSkillDownloadUrl } from '@/api/skills.api';

interface SkillDraft {
  nombre: string;
  contenido: string;
}

interface SkillEditorBodyProps {
  skillId: number;
  agentId: number;
  initialNombre: string;
  initialContenido: string;
  initialUpdatedAt: string;
  readOnly: boolean;
}

function SkillEditorBody({
  skillId,
  agentId,
  initialNombre,
  initialContenido,
  initialUpdatedAt,
  readOnly,
}: SkillEditorBodyProps) {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState(initialNombre);
  const [contenido, setContenido] = useState(initialContenido);
  const [updatedAt, setUpdatedAt] = useState<string>(initialUpdatedAt);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const saveSkill = useSkillSave();
  const deleteSkill = useDeleteSkill(agentId);
  const { data: agent } = useAgent(agentId);

  const persistSkill = useCallback(
    async (draft: SkillDraft) => {
      try {
        const saved = await saveSkill.mutateAsync({
          agenteId: agentId,
          skillId,
          nombre: draft.nombre,
          contenido: draft.contenido,
        });
        setUpdatedAt(saved.updated_at);
        setErrorMessage(null);
      } catch (saveError) {
        const message = saveError instanceof Error ? saveError.message : 'No se pudo guardar';
        setErrorMessage(message);
        throw saveError;
      }
    },
    [agentId, saveSkill, skillId]
  );

  const { status, error: autoSaveError, retry } = useAutoSave<SkillDraft>(
    { nombre, contenido },
    persistSkill,
    1500,
    !readOnly
  );

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
      { label: agent?.materia?.nombre ?? 'Sin materia' },
      { label: agent?.nombre ?? `Agente ${agentId}` },
      { label: nombre || 'Skill' },
    ],
    [agent?.materia?.nombre, agent?.nombre, agentId, nombre]
  );

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const payload = await getSkillDownloadUrl(agentId, skillId);
      window.open(payload.url, '_blank', 'noopener,noreferrer');
    } catch {
      toast.error('No se pudo generar el enlace de descarga.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSkill.mutateAsync(skillId);
      navigate(`/agent/${agentId}`);
    } catch {
      // toast lo maneja el hook
    }
  };

  return (
    <AppLayout crumbs={breadcrumbs} activeAgentId={agentId} activeSkillId={skillId}>
      <div className="uh-cover px-10 pb-8 pt-10 lg:px-12">
        <div className="flex items-start justify-between gap-4">
          <div className="flex max-w-2xl flex-1 items-start gap-4">
            {agent && (
              <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-[10px] border border-[var(--hairline)] bg-[var(--paper)] text-[24px] shadow-[0_4px_12px_-6px_rgba(31,29,26,0.18)]">
                {agent.icono}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="uh-eyebrow">
                Skill{agent ? ` · ${agent.nombre}` : ''}
              </span>
              {readOnly ? (
                <h1 className="mt-1 font-serif text-[40px] font-medium leading-[1.05] tracking-[-0.022em] text-[var(--ink)]">
                  <span className="italic text-[var(--accent)]">{nombre || 'Skill'}</span>
                </h1>
              ) : (
                <input
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  className="mt-1 w-full bg-transparent font-serif text-[40px] font-medium leading-[1.05] tracking-[-0.022em] text-[var(--ink)] outline-none placeholder:text-[var(--ink-4)]"
                  placeholder="Título de la skill"
                />
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-[var(--ink-3)]">
                {readOnly ? (
                  updatedAt && (
                    <span>Actualizado el {new Date(updatedAt).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}</span>
                  )
                ) : (
                  <>
                    <span className="uh-pill">{saveLabel}</span>
                    {updatedAt && (
                      <span>Última edición: {new Date(updatedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handleDownload()}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--hairline-2)] bg-[var(--paper)] px-3 py-2 text-[13px] text-[var(--ink-2)] transition-colors hover:border-[var(--ink-3)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download size={14} /> {downloading ? 'Generando…' : 'Descargar'}
            </button>

            {!readOnly && (
              <>
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--hairline-2)] bg-[var(--paper)] px-3 py-2 text-[13px] text-[var(--ink-2)] transition-colors hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
                >
                  <RotateCcw size={14} /> Reintentar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--bad)] bg-transparent px-3 py-2 text-[13px] text-[var(--bad)] transition-colors hover:bg-[var(--bad-wash)]"
                >
                  <Trash2 size={14} /> Eliminar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-10 py-8 lg:px-12">
        {(status === AutoSaveStatus.Error || errorMessage || autoSaveError) && !readOnly && (
          <div className="mb-4 flex items-center gap-2 rounded-[10px] border border-[var(--bad-wash)] bg-[var(--bad-wash)] px-4 py-3 text-[13px] text-[var(--bad)]">
            <AlertTriangle size={14} />
            <span>{errorMessage || autoSaveError || 'Error al guardar'}</span>
          </div>
        )}

        <div className="max-w-4xl">
          <NotionEditor content={contenido} onChange={setContenido} readOnly={readOnly} />
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,29,26,0.28)] p-4">
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute inset-0 cursor-default"
            onClick={() => setConfirmDelete(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md overflow-hidden rounded-[12px] border border-[var(--hairline)] bg-[var(--paper)] shadow-[0_24px_70px_rgba(31,29,26,0.24)]"
          >
            <div className="border-b border-[var(--hairline)] bg-[var(--paper-2)] px-5 py-4">
              <h3 className="font-serif text-[20px] font-medium tracking-[-0.015em] text-[var(--ink)]">Eliminar skill</h3>
              <p className="mt-1 text-[13px] leading-6 text-[var(--ink-3)]">
                Esta acción borra <strong className="font-medium">{nombre || 'la skill'}</strong> y su contenido en S3. No se puede deshacer.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-[6px] border border-[var(--hairline-2)] bg-[var(--paper)] px-4 py-2 text-[13px] text-[var(--ink-2)] transition-colors hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleteSkill.isPending}
                className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--bad)] bg-[var(--bad)] px-4 py-2 text-[13px] text-[var(--paper)] transition-colors hover:bg-[#8f3e31] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={14} />
                {deleteSkill.isPending ? 'Eliminando…' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export function SkillEditorPage() {
  const { skillId, agentId } = useParams();
  const user = useAuthStore((state) => state.user);
  const parsedSkillId = Number(skillId);
  const parsedAgentId = Number(agentId);
  const readOnly = user?.rol === 'estudiante';

  const { data: skill, isLoading, error } = useSkill(parsedAgentId, parsedSkillId);
  const { data: agent } = useAgent(parsedAgentId);

  const breadcrumbs = useMemo(
    () => [
      { label: agent?.materia?.nombre ?? 'Sin materia' },
      { label: agent?.nombre ?? `Agente ${parsedAgentId}` },
      { label: skill?.nombre ?? 'Skill' },
    ],
    [agent?.materia?.nombre, agent?.nombre, parsedAgentId, skill?.nombre]
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
      initialNombre={skill.nombre}
      initialContenido={skill.contenido ?? ''}
      initialUpdatedAt={skill.updated_at}
      readOnly={readOnly}
    />
  );
}
