// UniAgent Hub - LoadingSkeleton Component
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-[var(--paper-2)]', className)}
    />
  );
}

export function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[var(--hairline-2)] border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[14px] text-[var(--ink-3)]">Cargando...</p>
      </div>
    </div>
  );
}
