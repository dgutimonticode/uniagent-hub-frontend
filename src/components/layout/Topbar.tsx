// UniAgent Hub - Topbar Component
import { PanelLeft } from 'lucide-react';
import { ReactNode } from 'react';

interface Crumb {
  label: string;
  emoji?: string;
  goto?: string;
}

interface TopbarProps {
  crumbs: Crumb[];
  right?: ReactNode;
  onToggleSidebar?: () => void;
}

export function Topbar({ crumbs, right, onToggleSidebar }: TopbarProps) {
  return (
    <div className="h-[var(--topbar-h)] border-b border-[var(--hairline)] flex items-center px-6 gap-4 bg-[var(--paper)] flex-shrink-0">
      {/* Sidebar Toggle */}
      <button
        onClick={onToggleSidebar}
        className="w-7 h-7 flex items-center justify-center text-[var(--ink-3)] rounded-md transition-colors hover:bg-[var(--bg-hover)]"
        aria-label="Toggle sidebar"
      >
        <PanelLeft size={14} />
      </button>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {crumbs.map((crumb, i) => (
          <div key={i} className="flex items-center">
            <span
              className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-md transition-colors overflow-hidden text-ellipsis whitespace-nowrap max-w-[240px] ${
                i === crumbs.length - 1
                  ? 'text-[var(--ink)] font-medium'
                  : 'text-[var(--ink-3)] hover:bg-[var(--bg-hover)] hover:text-[var(--ink-2)]'
              }`}
            >
              {crumb.emoji && <span>{crumb.emoji}</span>}
              {crumb.label}
            </span>
            {i < crumbs.length - 1 && (
              <span className="font-mono text-[11px] text-[var(--ink-3)] mx-1.5">/</span>
            )}
          </div>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        {right}
      </div>
    </div>
  );
}
