import { useNavigate } from 'react-router-dom';
import { LogOut, UserCircle2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStore } from '@/stores/authStore';

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <AppLayout crumbs={[{ label: 'Perfil' }]}>
      <div className="px-10 py-8 lg:px-12">
        <div className="max-w-3xl rounded-[14px] border border-[var(--hairline)] bg-[var(--paper)] p-8 shadow-[0_1px_2px_rgba(31,29,26,0.03)]">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-[16px] border border-[var(--hairline)] bg-[var(--paper-2)] text-[34px] text-[var(--ink)]">
              <UserCircle2 size={34} />
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)]">Perfil</div>
              <h1 className="mt-2 font-serif text-[34px] font-medium tracking-[-0.02em] text-[var(--ink)]">
                {user?.nombre ?? 'Usuario'}
              </h1>
              <p className="mt-1 text-[14px] text-[var(--ink-3)]">Vista de solo lectura</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[12px] border border-[var(--hairline)] bg-[var(--paper-2)] p-4">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--ink-3)]">Nombre</div>
              <div className="mt-2 font-serif text-[18px] text-[var(--ink)]">{user?.nombre ?? '—'}</div>
            </div>
            <div className="rounded-[12px] border border-[var(--hairline)] bg-[var(--paper-2)] p-4">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--ink-3)]">Email</div>
              <div className="mt-2 font-serif text-[18px] text-[var(--ink)]">{user?.email ?? '—'}</div>
            </div>
            <div className="rounded-[12px] border border-[var(--hairline)] bg-[var(--paper-2)] p-4">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--ink-3)]">Rol</div>
              <div className="mt-2 font-serif text-[18px] text-[var(--ink)]">{user?.rol ?? '—'}</div>
            </div>
            <div className="rounded-[12px] border border-[var(--hairline)] bg-[var(--paper-2)] p-4">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--ink-3)]">Materia</div>
              <div className="mt-2 font-serif text-[18px] text-[var(--ink)]">
                {user?.materia?.nombre ?? 'Sin materia asignada'}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[12px] border border-[var(--hairline)] bg-[var(--paper-2)] p-5">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--ink-3)]">Acerca de</div>
            <div className="mt-3 grid gap-2 text-[14px] text-[var(--ink-2)]">
              <div><span className="font-medium text-[var(--ink)]">App:</span> UniAgent Hub</div>
              <div><span className="font-medium text-[var(--ink)]">Universidad:</span> USFX</div>
              <div><span className="font-medium text-[var(--ink)]">Enfoque:</span> Agentes académicos y skills</div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--bad)] bg-[var(--bad)] px-4 py-2 text-[13px] text-[var(--paper)] transition-colors hover:bg-[#8f3e31]"
            >
              <LogOut size={14} /> Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
