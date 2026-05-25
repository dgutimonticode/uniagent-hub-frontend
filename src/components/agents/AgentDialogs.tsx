import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Trash2, X } from 'lucide-react';
import { Agente } from '@/types';
import { useCreateAgent, useDeleteAgent, useUpdateAgent } from '@/hooks/useAgents';
import { useMaterias } from '@/hooks/useMaterias';

const agentSchema = z.object({
  emoji: z.string().min(1, 'Elegí un emoji'),
  name: z.string().min(2, 'El nombre es obligatorio'),
  description: z.string().optional(),
  materia_id: z.string().optional(),
  color: z.string().regex(/^#([0-9A-Fa-f]{6})$/, 'Color inválido'),
});

// Keep the form shape explicit for TypeScript and review clarity.
interface AgentFormValues {
  emoji: string;
  name: string;
  description?: string;
  materia_id?: string;
  color: string;
}

interface AgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent?: Agente | null;
  resetKey?: number;
}

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agente | null;
}

const emojiOptions = ['📐', '🧪', '✒️', '🌍', '📜', '⌨️', '🧠', '🔬'];
const colorOptions = ['#B85C3D', '#2F5A4A', '#3D5A80', '#8B5A3C', '#6E4A24', '#1F1D1A'];

function ModalShell({
  open,
  title,
  description,
  onOpenChange,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,29,26,0.28)] p-4">
      <button
        type="button"
        aria-label="Cerrar diálogo"
        className="absolute inset-0 cursor-default"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl overflow-hidden rounded-[12px] border border-[var(--hairline)] bg-[var(--paper)] shadow-[0_24px_70px_rgba(31,29,26,0.24)]"
      >
        <div className="flex items-start justify-between border-b border-[var(--hairline)] bg-[var(--paper-2)] px-5 py-4">
          <div>
            <h3 className="font-serif text-[24px] font-medium tracking-[-0.015em] text-[var(--ink)]">{title}</h3>
            {description && <p className="mt-1 text-[13px] leading-6 text-[var(--ink-3)]">{description}</p>}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-2 text-[var(--ink-3)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--ink)]"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AgentEditorDialog({ open, onOpenChange, agent }: AgentDialogProps) {
  const createAgent = useCreateAgent();
  const updateAgent = useUpdateAgent();
  const { data: materias = [] } = useMaterias();

  const initialEmoji = agent?.emoji ?? '📐';
  const initialColor = agent?.color ?? '#B85C3D';

  const isEditing = !!agent;
  const isBusy = createAgent.isPending || updateAgent.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AgentFormValues>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      emoji: agent?.emoji ?? '📐',
      name: agent?.name ?? '',
      description: agent?.description ?? '',
      materia_id: agent?.materia_id ? String(agent.materia_id) : '',
      color: agent?.color ?? '#B85C3D',
    },
  });

  const [selectedEmoji, setSelectedEmoji] = useState(initialEmoji);
  const [selectedColor, setSelectedColor] = useState(initialColor);

  const onSubmit = async (values: AgentFormValues) => {
    const payload = {
      emoji: values.emoji,
      name: values.name,
      description: values.description?.trim() || undefined,
      materia_id: values.materia_id ? Number(values.materia_id) : undefined,
      color: values.color,
    };

    if (isEditing && agent) {
      await updateAgent.mutateAsync({ id: agent.id, data: payload });
    } else {
      await createAgent.mutateAsync(payload);
    }

    onOpenChange(false);
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar agente' : 'Nuevo agente'}
      description={isEditing ? 'Ajustá identidad, materia y color del agente.' : 'Definí cómo se verá tu nuevo agente.'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 px-5 py-5">
        <div className="grid gap-5 md:grid-cols-[1fr_220px]">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-[13px] font-medium text-[var(--ink-2)]">Nombre</label>
              <input
                {...register('name')}
                placeholder="Profesor de Cálculo"
                className="w-full rounded-[8px] border border-[var(--hairline-2)] bg-[var(--paper)] px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-[var(--accent)]"
              />
              {errors.name && <p className="text-[12px] text-[var(--bad)]">{errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <label className="text-[13px] font-medium text-[var(--ink-2)]">Descripción</label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Mecánica clásica para ingeniería"
                className="w-full rounded-[8px] border border-[var(--hairline-2)] bg-[var(--paper)] px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-[var(--accent)]"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-[13px] font-medium text-[var(--ink-2)]">Materia</label>
              <select
                {...register('materia_id')}
                className="w-full rounded-[8px] border border-[var(--hairline-2)] bg-[var(--paper)] px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-[var(--accent)]"
              >
                <option value="">Sin materia</option>
                {materias.map((materia) => (
                  <option key={materia.id} value={materia.id}>
                    {materia.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid content-start gap-4 rounded-[10px] border border-[var(--hairline)] bg-[var(--paper-2)] p-4">
            <div className="grid gap-2">
              <label className="text-[13px] font-medium text-[var(--ink-2)]">Emoji</label>
              <div className="flex items-center gap-2 rounded-[8px] border border-[var(--hairline-2)] bg-[var(--paper)] px-3 py-2.5">
                <span className="text-[20px]">{selectedEmoji}</span>
                <input
                  {...register('emoji')}
                  className="min-w-0 flex-1 bg-transparent text-[14px] outline-none"
                  placeholder="📐"
                />
              </div>
              {errors.emoji && <p className="text-[12px] text-[var(--bad)]">{errors.emoji.message}</p>}
            </div>

            <div className="grid gap-2">
              <label className="text-[13px] font-medium text-[var(--ink-2)]">Atajos</label>
              <div className="flex flex-wrap gap-1.5">
                {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setSelectedEmoji(emoji);
                    setValue('emoji', emoji, { shouldValidate: true });
                  }}
                  className={`grid h-8 w-8 place-items-center rounded-[6px] border text-[15px] transition-colors ${
                    emoji === selectedEmoji
                      ? 'border-[var(--accent)] bg-[var(--accent-wash)]'
                        : 'border-[var(--hairline-2)] bg-[var(--paper)] hover:border-[var(--ink-3)]'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-[13px] font-medium text-[var(--ink-2)]">Color</label>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <input
                  {...register('color')}
                  className="w-full rounded-[8px] border border-[var(--hairline-2)] bg-[var(--paper)] px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-[var(--accent)]"
                  placeholder="#B85C3D"
                />
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(event) => {
                    setSelectedColor(event.target.value);
                    setValue('color', event.target.value, { shouldValidate: true });
                  }}
                  className="h-[44px] w-[52px] cursor-pointer rounded-[8px] border border-[var(--hairline-2)] bg-[var(--paper)] p-1"
                />
              </div>
              {errors.color && <p className="text-[12px] text-[var(--bad)]">{errors.color.message}</p>}
              <div className="flex flex-wrap gap-1.5">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color);
                      setValue('color', color, { shouldValidate: true });
                    }}
                    className={`h-7 w-7 rounded-full border transition-transform hover:scale-105 ${
                      selectedColor === color ? 'border-[var(--ink)] ring-2 ring-[var(--accent-soft)]' : 'border-[var(--hairline-2)]'
                    }`}
                    style={{ background: color }}
                    aria-label={`Seleccionar color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--hairline)] pt-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-[6px] border border-[var(--hairline-2)] bg-[var(--paper)] px-4 py-2 text-[13px] text-[var(--ink-2)] transition-colors hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isBusy}
            className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--ink)] bg-[var(--ink)] px-4 py-2 text-[13px] text-[var(--paper)] transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Pencil size={14} />
            {isBusy ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear agente'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function AgentDeleteDialog({ open, onOpenChange, agent }: DeleteDialogProps) {
  const deleteAgent = useDeleteAgent();

  const handleDelete = async () => {
    if (!agent) return;
    await deleteAgent.mutateAsync(agent.id);
    onOpenChange(false);
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Eliminar agente"
      description="Esta acción borra el agente y sus skills asociadas."
    >
      <div className="grid gap-4 px-5 py-5">
        <div className="rounded-[10px] border border-[var(--bad-wash)] bg-[var(--bad-wash)] p-4 text-[13.5px] leading-6 text-[var(--bad)]">
          Estás por eliminar <strong className="font-medium">{agent?.name ?? 'este agente'}</strong>. No se puede deshacer.
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--hairline)] pt-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-[6px] border border-[var(--hairline-2)] bg-[var(--paper)] px-4 py-2 text-[13px] text-[var(--ink-2)] transition-colors hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteAgent.isPending}
            className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--bad)] bg-[var(--bad)] px-4 py-2 text-[13px] text-[var(--paper)] transition-colors hover:bg-[#8f3e31] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={14} />
            {deleteAgent.isPending ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
