// UniAgent Hub - UserMenu Component
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export function UserMenu() {
  const { user } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const userInitials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '??';

  return (
    <details className="relative group">
      <summary className="list-none flex items-center gap-2 cursor-pointer rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[var(--bg-hover)]">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#C97A56] text-[var(--paper)] flex items-center justify-center font-serif font-medium text-[13px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]">
          {userInitials}
        </div>
        <div className="hidden sm:flex flex-col leading-tight min-w-0">
          <div className="text-[13px] font-medium text-[var(--ink)] truncate">{user?.name}</div>
          <div className="font-mono text-[10px] text-[var(--ink-3)] uppercase tracking-[0.08em]">
            {user?.role === 'docente' ? 'Docente' : 'Estudiante'}
          </div>
        </div>
      </summary>

      <div className="absolute right-0 mt-2 w-48 rounded-md border border-[var(--hairline)] bg-[var(--paper)] p-1 shadow-[0_12px_30px_rgba(31,29,26,0.12)] z-20">
        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
          className="w-full rounded-md px-3 py-2 text-left text-[13px] text-[var(--ink)] transition-colors hover:bg-[var(--bg-hover)]"
        >
          Cerrar sesión
        </button>
      </div>
    </details>
  );
}
