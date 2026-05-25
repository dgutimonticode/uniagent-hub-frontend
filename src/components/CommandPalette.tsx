import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@base-ui/react/dialog';
import { Search, ArrowRight, LogOut, Plus } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useAgents } from '@/hooks/useAgents';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  action: () => void;
}

export function CommandPalette() {
  const navigate = useNavigate();
  const { data: agents = [] } = useAgents();
  const open = useUIStore((state) => state.commandPaletteOpen);
  const close = useUIStore((state) => state.closeCommandPalette);
  const logout = useAuthStore((state) => state.logout);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const commands = useMemo<CommandItem[]>(() => [
    { id: 'dashboard', label: 'Ir a Dashboard', action: () => navigate('/') },
    { id: 'new-skill', label: 'Nueva skill', action: () => navigate('/') },
    { id: 'logout', label: 'Cerrar sesión', action: () => { logout(); navigate('/login', { replace: true }); } },
  ], [logout, navigate]);

  const filteredAgents = useMemo(() => {
    if (!query.trim()) return agents;
    const search = query.toLowerCase();
    return agents.filter((agent) => agent.name.toLowerCase().includes(search));
  }, [agents, query]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const search = query.toLowerCase();
    return commands.filter((command) => command.label.toLowerCase().includes(search));
  }, [commands, query]);

  const items = useMemo(() => [
    ...filteredCommands.map((command) => ({
      id: command.id,
      label: command.label,
      description: 'Acción rápida',
      action: command.action,
    })),
    ...filteredAgents.map((agent) => ({
      id: `agent-${agent.id}`,
      label: agent.name,
      description: agent.description ?? 'Abrir agente',
      action: () => navigate(`/agent/${agent.id}`),
    })),
  ], [filteredAgents, filteredCommands, navigate]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isShortcut) {
        event.preventDefault();
        useUIStore.getState().openCommandPalette();
        return;
      }

      if (!useUIStore.getState().commandPaletteOpen) return;

      if (event.key === 'Escape') {
        close();
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((current) => Math.min(current + 1, Math.max(items.length - 1, 0)));
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((current) => Math.max(current - 1, 0));
      }

      if (event.key === 'Enter' && items[activeIndex]) {
        items[activeIndex].action();
        close();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, close, items]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          useUIStore.getState().openCommandPalette();
          setActiveIndex(0);
          setQuery('');
          return;
        }

        setQuery('');
        setActiveIndex(0);
        close();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-[rgba(31,29,26,0.2)] backdrop-blur-[1px]" />
        <Dialog.Popup className="fixed left-1/2 top-24 z-50 w-[min(92vw,720px)] -translate-x-1/2 overflow-hidden rounded-[16px] border border-[var(--hairline)] bg-[var(--paper)] shadow-[0_30px_80px_rgba(31,29,26,0.22)] outline-none">
          <div className="flex items-center gap-3 border-b border-[var(--hairline)] bg-[var(--paper-2)] px-4 py-3">
              <Search size={16} className="text-[var(--ink-3)]" />
              <input
                autoFocus
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Buscá un agente o acción..."
                className="w-full bg-transparent text-[14px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-4)]"
              />
            <div className="font-mono text-[10px] text-[var(--ink-3)]">Esc</div>
          </div>

          <div className="max-h-[420px] overflow-auto p-2">
            {items.length === 0 ? (
              <div className="px-4 py-8 text-center text-[13px] text-[var(--ink-3)]">
                Buscá un agente o acción...
              </div>
            ) : (
              items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    item.action();
                    setQuery('');
                    setActiveIndex(0);
                    close();
                  }}
                  className={`flex w-full items-center gap-3 rounded-[10px] px-4 py-3 text-left transition-colors ${
                    index === activeIndex ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <div className="grid h-9 w-9 place-items-center rounded-[8px] border border-[var(--hairline)] bg-[var(--paper-2)] text-[var(--ink-2)]">
                    {item.id.startsWith('agent-') ? <ArrowRight size={14} /> : item.id === 'logout' ? <LogOut size={14} /> : <Plus size={14} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-serif text-[15px] font-medium text-[var(--ink)]">{item.label}</div>
                    <div className="truncate text-[12px] text-[var(--ink-3)]">{item.description}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
