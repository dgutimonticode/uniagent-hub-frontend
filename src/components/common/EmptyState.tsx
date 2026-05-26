// UniAgent Hub - EmptyState Component
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      {icon && (
        <div className="text-[var(--ink-3)] mb-4">
          {icon}
        </div>
      )}
      <h3 className="font-serif font-medium text-[20px] text-[var(--ink)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-[14px] text-[var(--ink-3)] max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}
