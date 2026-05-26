import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-6">
          <div className="max-w-lg rounded-[14px] border border-[var(--hairline)] bg-[var(--paper-2)] p-8 text-center shadow-[0_18px_40px_-20px_rgba(31,29,26,0.18)]">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">Algo se rompió</div>
            <h1 className="mt-3 font-serif text-[36px] font-medium tracking-[-0.02em] text-[var(--ink)]">
              Volvamos a empezar.
            </h1>
            <p className="mt-3 text-[14px] leading-7 text-[var(--ink-2)]">
              Hubo un error inesperado en la interfaz. Podés recargar la página para intentar de nuevo.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center justify-center rounded-[6px] border border-[var(--ink)] bg-[var(--ink)] px-4 py-2 text-[13px] text-[var(--paper)] transition-colors hover:bg-black"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
