// UniAgent Hub - AppLayout Component
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { UserMenu } from './UserMenu';
import { useUIStore } from '@/stores/uiStore';
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
  const navigate = useNavigate();

  const handleAgentClick = (agentId: number) => {
    navigate(`/agent/${agentId}`);
  };

  const handleSkillClick = (agentId: number, skillId: number) => {
    navigate(`/agent/${agentId}/skill/${skillId}`);
  };

  const handleNewAgent = () => {
    navigate('/agent/new');
  };

  const defaultTopbarRight = (
    <>
      <button className="w-7 h-7 flex items-center justify-center text-[var(--ink-3)] rounded-md transition-colors hover:bg-[var(--bg-hover)]">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M10 21a2 2 0 0 0 4 0"/>
        </svg>
      </button>
      <button
        onClick={handleNewAgent}
        className="flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium bg-[var(--ink)] text-[var(--paper)] rounded-md border border-[var(--ink)] transition-colors hover:bg-[#000]"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Nuevo agente
      </button>
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
