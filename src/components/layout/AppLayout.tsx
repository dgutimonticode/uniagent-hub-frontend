// UniAgent Hub - AppLayout Component
import { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { UserMenu } from './UserMenu';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useAgents } from '@/hooks/useAgents';
import { useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
  crumbs: Array<{ label: string; emoji?: string; goto?: string }>;
  activeAgentId?: number;
  activeSkillId?: number;
  topbarRight?: ReactNode;
}

export function AppLayout({
  children,
  crumbs,
  activeAgentId,
  activeSkillId,
  topbarRight,
}: AppLayoutProps) {
  const { data: agents } = useAgents();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const openAgentEditor = useUIStore((state) => state.openAgentEditor);
  const navigate = useNavigate();
  const isDocente = useAuthStore((state) => state.user?.rol === 'docente');

  const handleAgentClick = (agentId: number) => {
    navigate(`/agent/${agentId}`);
  };

  const handleSkillClick = (agentId: number, skillId: number) => {
    navigate(`/agent/${agentId}/skill/${skillId}`);
  };

  const handleNewAgent = () => {
    openAgentEditor(null);
  };

  const defaultTopbarRight = (
    <>
      {isDocente && (
        <button
          onClick={handleNewAgent}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium bg-[var(--ink)] text-[var(--paper)] rounded-md border border-[var(--ink)] transition-colors hover:bg-[#000]"
        >
          <Plus size={14} />
          Nuevo agente
        </button>
      )}
      <UserMenu />
    </>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        agents={agents}
        activeAgentId={activeAgentId}
        activeSkillId={activeSkillId}
        onAgentClick={handleAgentClick}
        onSkillClick={handleSkillClick}
        onNewAgent={handleNewAgent}
      />
      <div className="flex flex-col min-w-0 flex-1 bg-[var(--paper)]">
        <Topbar
          crumbs={crumbs}
          right={topbarRight || defaultTopbarRight}
          onToggleSidebar={toggleSidebar}
        />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
