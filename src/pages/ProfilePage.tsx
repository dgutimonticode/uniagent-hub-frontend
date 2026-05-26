import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStore } from '@/stores/authStore';

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const isDocente = user?.rol === 'docente';
  const userInitials = user?.nombre
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '··';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <AppLayout crumbs={[{ label: 'Perfil' }]}>
      <div className="uh-cover px-10 pb-10 pt-12 lg:px-12">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className={`uh-avatar xl ${isDocente ? '' : 'ink'}`}>{userInitials}</div>
          <div className="min-w-0 flex-1">
            <span className="uh-eyebrow">Perfil</span>
            <h1 className="mt-2 font-serif text-[40px] font-medium leading-[1.04] tracking-[-0.022em] text-[var(--ink)]">
              <NameWithAccent name={user?.nombre ?? 'Usuario'} />
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`uh-pill ${isDocente ? 'terra' : 'info'}`}>
                <span className="dot" /> {isDocente ? 'Docente' : 'Estudiante'}
              </span>
              {user?.materia?.nombre && (
                <span className="uh-pill">
                  <BookOpen size={12} /> {user.materia.nombre}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-8 lg:px-12">
        <div className="max-w-3xl">
          <div className="grid gap-3 md:grid-cols-2">
            <InfoCard label="Nombre" value={user?.nombre ?? '—'} />
            <InfoCard label="Email" value={user?.email ?? '—'} />
            <InfoCard label="Rol" value={user?.rol ?? '—'} />
            <InfoCard label="Materia" value={user?.materia?.nombre ?? 'Sin materia asignada'} />
          </div>

          <div className="mt-6 rounded-[12px] border border-[var(--hairline)] bg-[var(--paper-2)] p-5">
            <span className="uh-eyebrow">Acerca de</span>
            <div className="mt-3 grid gap-2 text-[14px] text-[var(--ink-2)]">
              <div><span className="font-medium text-[var(--ink)]">App:</span> UniAgent Hub</div>
              <div><span className="font-medium text-[var(--ink)]">Universidad:</span> USFX</div>
              <div><span className="font-medium text-[var(--ink)]">Materia:</span> COM610 · Trabajando en la nube</div>
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

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-[var(--hairline)] bg-[var(--paper)] p-4">
      <span className="uh-eyebrow">{label}</span>
      <div className="mt-2 font-serif text-[18px] text-[var(--ink)]">{value}</div>
    </div>
  );
}

function NameWithAccent({ name }: { name: string }) {
  const parts = name.trim().split(' ');
  if (parts.length <= 1) {
    return <em className="italic text-[var(--accent)]">{name}</em>;
  }
  const head = parts.slice(0, -1).join(' ');
  const tail = parts[parts.length - 1];
  return (
    <>
      {head}{' '}
      <em className="italic text-[var(--accent)]">{tail}</em>
    </>
  );
}
