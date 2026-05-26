import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-6">
      <div className="max-w-lg text-center">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">Error 404</div>
        <h1 className="mt-3 font-serif text-[44px] font-medium tracking-[-0.02em] text-[var(--ink)]">
          Esta página no existe.
        </h1>
        <p className="mt-3 text-[14px] leading-7 text-[var(--ink-2)]">
          Puede que el enlace esté roto o que la ruta ya no exista.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex items-center justify-center rounded-[6px] border border-[var(--ink)] bg-[var(--ink)] px-4 py-2 text-[13px] text-[var(--paper)] transition-colors hover:bg-black"
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}
