// UniAgent Hub - Sidebar Component
import { Search, ChevronRight, Plus, MoreHorizontal, Pencil, Trash2, Home, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Agente } from '@/types';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useSkills } from '@/hooks/useSkills';
import { useState } from 'react';
import { AgentDeleteDialog } from '@/components/agents/AgentDialogs';

interface SidebarProps {
  agents?: Agente[];
  activeAgentId?: number;
  activeSkillId?: number;
  onAgentClick?: (agentId: number) => void;
  onSkillClick?: (agentId: number, skillId: number) => void;
  onNewAgent?: () => void;
}

interface AgentRowProps {
  agent: Agente;
  isActiveAgent: boolean;
  isExpanded: boolean;
  activeSkillId?: number;
  onToggle: () => void;
  onSkillClick?: (agentId: number, skillId: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
  showActions: boolean;
}

function AgentRow({
  agent,
  isActiveAgent,
  isExpanded,
  activeSkillId,
  onToggle,
  onSkillClick,
  onEdit,
  onDelete,
  menuOpen,
  onToggleMenu,
  showActions,
}: AgentRowProps) {
  // Skills are fetched lazily — backend agent detail does NOT include skills inline.
  const { data: skills = [] } = useSkills(isExpanded ? agent.id : 0);

  return (
    <div>
      <button
        onClick={onToggle}
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
          {agent.icono}
        </div>
        <span
          className={`flex-1 text-[13.5px] overflow-hidden text-ellipsis whitespace-nowrap leading-5 ${
            isActiveAgent ? 'font-medium font-serif text-[14.5px] tracking-[-0.005em]' : ''
          }`}
        >
          {agent.nombre}
        </span>
      </button>

      {isExpanded && skills.length > 0 && (
        <div className="ml-5.5 pl-1.5 border-l border-[var(--hairline-2)]">
          {skills.map((skill) => {
            const isActiveSkill = isActiveAgent && skill.id === activeSkillId;
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
                <span className="flex-1 text-[13px]">{skill.nombre}</span>
              </button>
            );
          })}
        </div>
      )}

      {showActions && (
        <div className="relative">
          <button
            type="button"
            onClick={onToggleMenu}
            className="absolute right-1 top-1.5 flex h-6 w-6 items-center justify-center rounded-md text-[var(--ink-3)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--ink)]"
            aria-label={`Acciones de ${agent.nombre}`}
          >
            <MoreHorizontal size={14} />
          </button>

          {menuOpen && (
            <div className="absolute right-1 top-8 z-20 w-44 rounded-md border border-[var(--hairline)] bg-[var(--paper)] p-1 shadow-[0_12px_30px_rgba(31,29,26,0.12)]">
              <button
                type="button"
                onClick={onEdit}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-[var(--ink)] transition-colors hover:bg-[var(--bg-hover)]"
              >
                <Pencil size={14} /> Editar
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-[var(--bad)] transition-colors hover:bg-[var(--bad-wash)]"
              >
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
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
  const openCommandPalette = useUIStore((state) => state.openCommandPalette);
  const openAgentEditor = useUIStore((state) => state.openAgentEditor);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isDocente = user?.rol === 'docente';
  const [expandedAgents, setExpandedAgents] = useState<Set<number>>(new Set());
  const [menuOpenAgentId, setMenuOpenAgentId] = useState<number | null>(null);
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

  const totalSkills = agents.reduce((total, agent) => total + (agent.skills_count ?? 0), 0);
  const userInitials = user?.nombre
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  const handleNewAgent = () => {
    openAgentEditor(null);
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
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-[var(--hairline)]">
        <div className="w-6.5 h-6.5 bg-[var(--ink)] text-[var(--paper)] rounded-md flex items-center justify-center text-[15px] shadow-sm">
          🎓
        </div>
        <div className="font-serif font-medium text-[16.5px] tracking-[-0.01em]">
          UniAgent<em className="font-normal italic text-[var(--accent)]"> Hub</em>
        </div>
      </div>

      <button
        type="button"
        onClick={openCommandPalette}
        className="flex items-center gap-2.5 mx-2 my-2 px-2.5 py-1.5 text-[var(--ink-3)] rounded-md transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--ink-2)]"
      >
        <Search size={14} />
        <span className="flex-1 text-left text-[13.5px]">Buscar agentes, skills…</span>
        <span className="font-mono text-[10.5px] text-[var(--ink-3)] bg-[var(--paper)] border border-[var(--hairline-2)] rounded px-1">
          ⌘K
        </span>
      </button>

      <div className="px-2 mb-1">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 w-full px-2 py-1.5 text-[13.5px] text-[var(--ink-2)] rounded-md transition-colors hover:bg-[var(--bg-hover)]"
        >
          <Home size={13} />
          <span>Inicio</span>
        </button>
      </div>

      <div className="flex items-center justify-between px-3 py-3.5 text-[10.5px] font-semibold text-[var(--ink-3)] tracking-[0.12em] uppercase">
        <span>Agentes</span>
        <span className="font-mono font-normal text-[10.5px] text-[var(--ink-4)] tracking-normal">
          {agents.length} · {totalSkills} skills
        </span>
      </div>

      <div className="flex-1 overflow-auto min-h-0 px-1">
        {agents.map((agent) => {
          const isExpanded = expandedAgents.has(agent.id) || agent.id === activeAgentId;
          const isActiveAgent = agent.id === activeAgentId && !activeSkillId;
          return (
            <AgentRow
              key={agent.id}
              agent={agent}
              isActiveAgent={isActiveAgent}
              isExpanded={isExpanded}
              activeSkillId={activeSkillId}
              onToggle={() => {
                toggleAgent(agent.id);
                onAgentClick?.(agent.id);
                setMenuOpenAgentId(null);
              }}
              onSkillClick={onSkillClick}
              onEdit={() => {
                openAgentEditor(agent);
                setMenuOpenAgentId(null);
              }}
              onDelete={() => {
                setAgentToDelete(agent);
                setDeleteOpen(true);
                setMenuOpenAgentId(null);
              }}
              menuOpen={menuOpenAgentId === agent.id}
              onToggleMenu={() =>
                setMenuOpenAgentId((current) => (current === agent.id ? null : agent.id))
              }
              showActions={isDocente}
            />
          );
        })}
      </div>

      {isDocente && (
        <button
          onClick={handleNewAgent}
          className="flex items-center gap-2 px-3 py-1.5 mx-2 my-1 text-[var(--ink-3)] text-[13px] rounded-md border border-dashed border-[var(--hairline-2)] w-[calc(100%-16px)] transition-all hover:text-[var(--accent)] hover:border-[var(--accent-soft)] hover:bg-[var(--accent-wash)]"
        >
          <Plus size={12} />
          <span>Nuevo agente</span>
        </button>
      )}

      <AgentDeleteDialog
        key={`delete-${deleteOpen ? (agentToDelete?.id ?? 'none') : 'closed'}`}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        agent={agentToDelete}
      />

      <div className="flex items-center gap-2.5 px-3 py-2.5 border-t border-[var(--hairline)]">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#C97A56] text-[var(--paper)] flex items-center justify-center font-serif font-medium text-[13px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] flex-shrink-0">
          {userInitials}
        </div>
        <div className="flex flex-col line-height-1.2 min-w-0 flex-1">
          <div className="text-[13px] font-medium text-[var(--ink)] overflow-hidden text-ellipsis whitespace-nowrap">
            {user?.nombre}
          </div>
          <div className="font-mono text-[10px] text-[var(--ink-3)] uppercase tracking-[0.08em] mt-0.5">
            {user?.rol === 'docente' ? 'Docente' : 'Estudiante'}
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/profile')}
          aria-label="Ir al perfil"
          className="w-7 h-7 flex items-center justify-center text-[var(--ink-3)] rounded-md transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--ink)]"
        >
          <User size={14} />
        </button>
      </div>
    </aside>
  );
}
