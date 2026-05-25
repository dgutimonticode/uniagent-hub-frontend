// UniAgent Hub - Sidebar Component
import { Search, ChevronRight, Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Agente } from '@/types';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';
import { AgentDeleteDialog, AgentEditorDialog } from '@/components/agents/AgentDialogs';

interface SidebarProps {
  agents?: Agente[];
  activeAgentId?: number;
  activeSkillId?: number;
  onAgentClick?: (agentId: number) => void;
  onSkillClick?: (agentId: number, skillId: number) => void;
  onNewAgent?: () => void;
}

export function Sidebar({
  agents = [],
  activeAgentId,
  activeSkillId,
  onAgentClick,
  onSkillClick,
  onNewAgent,
}: SidebarProps) {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const { user } = useAuthStore();
  const [expandedAgents, setExpandedAgents] = useState<Set<number>>(new Set());
  const [menuOpenAgentId, setMenuOpenAgentId] = useState<number | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [agentToEdit, setAgentToEdit] = useState<Agente | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agente | null>(null);

  const toggleAgent = (agentId: number) => {
    setExpandedAgents((prev) => {
      const next = new Set(prev);
      if (next.has(agentId)) {
        next.delete(agentId);
      } else {
        next.add(agentId);
      }
      return next;
    });
  };

  const totalSkills = agents.reduce((total, agent) => total + (agent.skills?.length || 0), 0);
  const userInitials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  const handleNewAgent = () => {
    setAgentToEdit(null);
    setEditorOpen(true);
    onNewAgent?.();
  };

  if (sidebarCollapsed) {
    return (
      <aside className="w-0 hidden md:flex md:w-16 bg-[var(--paper-2)] border-r border-[var(--hairline)] flex-col">
        <div className="p-3 border-b border-[var(--hairline)]">
          <div className="w-10 h-10 bg-[var(--ink)] text-[var(--paper)] rounded-lg flex items-center justify-center text-lg shadow-sm">
            🎓
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[var(--sidebar-w)] bg-[var(--paper-2)] border-r border-[var(--hairline)] flex flex-col min-w-0 overflow-hidden">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-[var(--hairline)]">
        <div className="w-6.5 h-6.5 bg-[var(--ink)] text-[var(--paper)] rounded-md flex items-center justify-center text-[15px] shadow-sm">
          🎓
        </div>
        <div className="font-serif font-medium text-[16.5px] tracking-[-0.01em]">
          UniAgent<em className="font-normal italic text-[var(--accent)]"> Hub</em>
        </div>
      </div>

      {/* Search */}
      <button className="flex items-center gap-2.5 mx-2 my-2 px-2.5 py-1.5 text-[var(--ink-3)] rounded-md transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--ink-2)]">
        <Search size={14} />
        <span className="flex-1 text-left text-[13.5px]">Buscar agentes, skills…</span>
        <span className="font-mono text-[10.5px] text-[var(--ink-3)] bg-[var(--paper)] border border-[var(--hairline-2)] rounded px-1">
          ⌘K
        </span>
      </button>

      {/* Quick Nav */}
      <div className="px-2 mb-1">
        <button className="flex items-center gap-2 w-full px-2 py-1.5 text-[13.5px] text-[var(--ink-2)] rounded-md transition-colors hover:bg-[var(--bg-hover)]">
          <span>◉</span>
          <span>Inicio</span>
        </button>
        <button className="flex items-center gap-2 w-full px-2 py-1.5 text-[13.5px] text-[var(--ink-2)] rounded-md transition-colors hover:bg-[var(--bg-hover)]">
          <span>❋</span>
          <span>Biblioteca</span>
        </button>
      </div>

      {/* Agents Section */}
      <div className="flex items-center justify-between px-3 py-3.5 text-[10.5px] font-semibold text-[var(--ink-3)] tracking-[0.12em] uppercase">
        <span>Agentes</span>
        <span className="font-mono font-normal text-[10.5px] text-[var(--ink-4)] tracking-normal">
          {agents.length} · {totalSkills} skills
        </span>
      </div>

      {/* Agent Tree */}
      <div className="flex-1 overflow-auto min-h-0 px-1">
        {agents.map((agent) => {
          const isExpanded = expandedAgents.has(agent.id) || agent.id === activeAgentId;
          const isActiveAgent = agent.id === activeAgentId && !activeSkillId;

          return (
            <div key={agent.id}>
              {/* Agent Row */}
              <button
                onClick={() => {
                  toggleAgent(agent.id);
                  onAgentClick?.(agent.id);
                  setMenuOpenAgentId(null);
                }}
                className={`flex items-center gap-1 px-1.5 py-1 rounded-md cursor-pointer transition-colors min-h-[28px] w-full text-left ${
                  isActiveAgent
                    ? 'bg-[var(--bg-active)] text-[var(--ink)]'
                    : 'text-[var(--ink-2)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 flex items-center justify-center rounded-sm transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                >
                  <ChevronRight size={9} className="text-[var(--ink-3)]" />
                </div>
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-[14px]">
                  {agent.emoji}
                </div>
                <span
                  className={`flex-1 text-[13.5px] overflow-hidden text-ellipsis whitespace-nowrap leading-5 ${
                    isActiveAgent ? 'font-medium font-serif text-[14.5px] tracking-[-0.005em]' : ''
                  }`}
                >
                  {agent.name}
                </span>
              </button>

              {/* Skills */}
              {isExpanded && agent.skills && agent.skills.length > 0 && (
                <div className="ml-5.5 pl-1.5 border-l border-[var(--hairline-2)]">
                  {agent.skills.map((skill) => {
                    const isActiveSkill = agent.id === activeAgentId && skill.id === activeSkillId;
                    return (
                      <button
                        key={skill.id}
                        onClick={() => onSkillClick?.(agent.id, skill.id)}
                        className={`flex items-center gap-2.5 px-1.5 py-1 rounded-md cursor-pointer transition-colors min-h-[26px] w-full text-left ${
                          isActiveSkill
                            ? 'bg-[var(--bg-active)] text-[var(--ink)] font-medium'
                            : 'text-[var(--ink-2)] hover:bg-[var(--bg-hover)]'
                        }`}
                      >
                        <div className="w-4.5 flex justify-center">
                          <span className="text-[12px] text-[var(--ink-3)]">📄</span>
                        </div>
                        <span className="flex-1 text-[13px]">{skill.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpenAgentId((current) => (current === agent.id ? null : agent.id))}
                  className="absolute right-1 top-1.5 flex h-6 w-6 items-center justify-center rounded-md text-[var(--ink-3)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--ink)]"
                  aria-label={`Acciones de ${agent.name}`}
                >
                  <MoreHorizontal size={14} />
                </button>

                {menuOpenAgentId === agent.id && (
                  <div className="absolute right-1 top-8 z-20 w-44 rounded-md border border-[var(--hairline)] bg-[var(--paper)] p-1 shadow-[0_12px_30px_rgba(31,29,26,0.12)]">
                    <button
                      type="button"
                      onClick={() => {
                        setAgentToEdit(agent);
                        setEditorOpen(true);
                        setMenuOpenAgentId(null);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-[var(--ink)] transition-colors hover:bg-[var(--bg-hover)]"
                    >
                      <Pencil size={14} /> Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAgentToDelete(agent);
                        setDeleteOpen(true);
                        setMenuOpenAgentId(null);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-[var(--bad)] transition-colors hover:bg-[var(--bad-wash)]"
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Agent Button */}
      <button
        onClick={handleNewAgent}
        className="flex items-center gap-2 px-3 py-1.5 mx-2 my-1 text-[var(--ink-3)] text-[13px] rounded-md border border-dashed border-[var(--hairline-2)] w-[calc(100%-16px)] transition-all hover:text-[var(--accent)] hover:border-[var(--accent-soft)] hover:bg-[var(--accent-wash)]"
      >
        <Plus size={12} />
        <span>Nuevo agente</span>
      </button>

      <AgentEditorDialog
        key={`editor-${editorOpen ? (agentToEdit?.id ?? 'new') : 'closed'}`}
        open={editorOpen}
        onOpenChange={setEditorOpen}
        agent={agentToEdit}
      />

      <AgentDeleteDialog
        key={`delete-${deleteOpen ? (agentToDelete?.id ?? 'none') : 'closed'}`}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        agent={agentToDelete}
      />

      {/* User Section */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 border-t border-[var(--hairline)]">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#C97A56] text-[var(--paper)] flex items-center justify-center font-serif font-medium text-[13px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] flex-shrink-0">
          {userInitials}
        </div>
        <div className="flex flex-col line-height-1.2 min-w-0 flex-1">
          <div className="text-[13px] font-medium text-[var(--ink)] overflow-hidden text-ellipsis whitespace-nowrap">
            {user?.name}
          </div>
          <div className="font-mono text-[10px] text-[var(--ink-3)] uppercase tracking-[0.08em] mt-0.5">
            {user?.role === 'docente' ? 'Docente' : 'Estudiante'}
          </div>
        </div>
        <button className="w-7 h-7 flex items-center justify-center text-[var(--ink-3)] rounded-md transition-colors hover:bg-[var(--bg-hover)]">
          <MoreHorizontal size={14} />
        </button>
      </div>
    </aside>
  );
}
