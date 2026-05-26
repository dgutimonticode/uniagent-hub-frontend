import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckSquare, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function WelcomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <header className="border-b border-[var(--hairline)] bg-[var(--paper)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-[var(--ink)] text-[15px] text-[var(--paper)] shadow-sm">
              🎓
            </div>
            <span className="font-serif text-[17px] font-medium tracking-[-0.01em]">
              UniAgent<em className="font-normal italic text-[var(--accent)]"> Hub</em>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <a
              href="#docentes"
              className="hidden rounded-md px-3 py-1.5 text-[13px] text-[var(--ink-3)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--ink)] md:inline-flex"
            >
              Para docentes
            </a>
            <a
              href="#estudiantes"
              className="hidden rounded-md px-3 py-1.5 text-[13px] text-[var(--ink-3)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--ink)] md:inline-flex"
            >
              Para estudiantes
            </a>
            <span className="mx-2 hidden h-4 w-px bg-[var(--hairline)] md:inline-block" />
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--ink)] bg-[var(--ink)] px-3 py-1.5 text-[13px] font-medium text-[var(--paper)] transition-colors hover:bg-black"
            >
              Iniciar sesión <ArrowRight size={13} />
            </Link>
          </nav>
        </div>
      </header>

      <section className="uh-cover">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="uh-pill terra tag">v0.1</span>
              <span className="uh-eyebrow">Early access · Primavera 2026</span>
            </div>

            <h1 className="mt-6 max-w-[18ch] font-serif text-[64px] font-normal leading-[1.02] tracking-[-0.025em] text-[var(--ink)] lg:text-[72px]">
              Donde los docentes enseñan a sus{' '}
              <em className="italic text-[var(--accent)]">propios agentes.</em>
            </h1>

            <p className="mt-6 max-w-[52ch] font-serif text-[19px] italic leading-[1.55] text-[var(--ink-2)]">
              Un taller editorial para diseñar las skills que tu agente entrega a cada
              estudiante — a su ritmo, con tu voz, sin perder de vista lo que importa:
              que entiendan.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--accent)] bg-[var(--accent)] px-5 py-3 text-[14px] font-medium text-[var(--paper)] transition-colors hover:bg-[#A04E32]"
              >
                Empezar como docente <ArrowRight size={14} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--hairline-2)] bg-[var(--paper)] px-5 py-3 text-[14px] font-medium text-[var(--ink-2)] transition-colors hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
              >
                Soy estudiante
              </Link>
            </div>

            <p className="mt-5 max-w-[44ch] text-[12.5px] text-[var(--ink-3)]">
              Funciona con tu correo institucional · ¿ya tienes cuenta?{' '}
              <Link to="/login" className="text-[var(--ink)] underline-offset-4 hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:gap-5">
            <EditorPeek />
            <ChatPeek />
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--hairline)] bg-[var(--paper)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3 lg:px-10">
          <Pillar
            id="docentes"
            eyebrow="Para docentes"
            title="Diseñá el agente que te falta en clase."
            body="Escribís skills como páginas de Notion. El agente las consume y responde con tu voz a cada estudiante. Vos seguís siendo el autor."
          />
          <Pillar
            id="estudiantes"
            eyebrow="Para estudiantes"
            title="Una segunda lectura, en cualquier momento."
            body="Leés las skills a tu ritmo. Si te trabás, el agente te acompaña. Sin esperar tutoría, sin sentirte juzgado."
          />
          <Pillar
            eyebrow="Para la cátedra"
            title="Trazabilidad sin vigilancia."
            body="La cátedra ve qué skill quedó dominada y dónde se traban los estudiantes — sin leer ni una sola conversación privada."
          />
        </div>

        <div className="border-t border-dashed border-[var(--hairline-2)]">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-6 sm:flex-row sm:items-center lg:px-10">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
              UniAgent Hub · v0.1 · USFX · COM610
            </span>
            <span className="text-[12px] text-[var(--ink-3)]">
              © 2026 — proyecto académico, no afiliado con instituciones reales.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

function EditorPeek() {
  return (
    <div className="rounded-[12px] border border-[var(--hairline)] bg-[var(--paper)] shadow-[0_22px_50px_-26px_rgba(31,29,26,0.18)]">
      <div className="flex items-center justify-between border-b border-[var(--hairline)] bg-[var(--paper-2)] px-4 py-2.5">
        <span className="uh-pill terra tag">El docente diseña</span>
        <span className="font-mono text-[10.5px] text-[var(--ink-3)]">Guardado ✓</span>
      </div>
      <div className="space-y-3 px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-[8px] border border-[var(--hairline)] bg-[var(--paper-2)] text-[18px]">
            ∫
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
              Skill · Profesora de Cálculo
            </span>
            <div className="font-serif text-[18px] font-medium leading-tight tracking-[-0.015em]">
              <em className="italic text-[var(--accent)]">Intuición</em> de la derivada
            </div>
          </div>
        </div>
        <div className="space-y-1.5 border-t border-dashed border-[var(--hairline-2)] pt-3">
          <p className="font-serif text-[13.5px] italic leading-[1.65] text-[var(--ink-2)]">
            Antes de las reglas, una pregunta: si la posición de un auto cambia, ¿qué tan
            rápido lo hace en este instante?
          </p>
          <div className="space-y-1 pt-1 text-[13px] text-[var(--ink-2)]">
            <div className="flex items-start gap-2">
              <CheckSquare size={13} className="mt-1 text-[var(--ok)]" />
              <span>Mostrar el pendiente de la cuerda</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckSquare size={13} className="mt-1 text-[var(--ok)]" />
              <span>Llevar la cuerda al límite</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-3 w-3 rounded-[3px] border border-[var(--hairline-2)]" />
              <span className="text-[var(--ink-3)]">Conectar con la idea de tasa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatPeek() {
  return (
    <div className="rounded-[12px] border border-[var(--hairline)] bg-[var(--paper)] shadow-[0_22px_50px_-26px_rgba(31,29,26,0.18)]">
      <div className="flex items-center justify-between border-b border-[var(--hairline)] bg-[var(--paper-2)] px-4 py-2.5">
        <span className="uh-pill info tag">El estudiante aprende</span>
        <span className="font-mono text-[10.5px] text-[var(--ink-3)]">Ej. 2 ↞ aquí</span>
      </div>
      <div className="space-y-3 px-5 py-5">
        <div className="flex items-start gap-2.5">
          <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-[8px] border border-[var(--hairline)] bg-[var(--paper-2)] text-[16px]">
            ∫
          </div>
          <div className="max-w-[80%] rounded-[10px] border border-[var(--hairline)] bg-[var(--paper-2)] px-3.5 py-2.5">
            <span className="font-serif text-[12.5px] italic text-[var(--accent)]">Profa de Cálculo</span>
            <p className="mt-0.5 font-serif text-[13.5px] leading-[1.55] text-[var(--ink)]">
              Vamos paso a paso. ¿Qué pasa con la pendiente si acortás la cuerda hasta
              casi tocar el punto?
            </p>
          </div>
        </div>
        <div className="flex items-start justify-end gap-2.5">
          <div className="max-w-[80%] rounded-[10px] bg-[var(--ink)] px-3.5 py-2.5 text-[13.5px] leading-[1.5] text-[var(--paper)]">
            Se vuelve la pendiente en el punto…
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-[8px] border border-[var(--hairline)] bg-[var(--paper-2)] text-[16px]">
            ∫
          </div>
          <div className="max-w-[80%] rounded-[10px] border border-[var(--accent-soft)] bg-[var(--accent-wash)] px-3.5 py-2.5">
            <p className="font-serif text-[15px] italic text-[var(--ink)]">
              f′(x) = lim<sub>h→0</sub>{' '}
              <span className="mx-1">f(x + h) − f(x)</span>
              <span>/ h</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 border-t border-dashed border-[var(--hairline-2)] pt-3 font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
          <Sparkles size={11} /> tu conversación es privada
        </div>
      </div>
    </div>
  );
}

interface PillarProps {
  id?: string;
  eyebrow: string;
  title: string;
  body: string;
}

function Pillar({ id, eyebrow, title, body }: PillarProps) {
  return (
    <div id={id}>
      <span className="uh-eyebrow">{eyebrow}</span>
      <h3 className="mt-3 font-serif text-[22px] font-medium leading-[1.2] tracking-[-0.015em] text-[var(--ink)]">
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-[1.65] text-[var(--ink-2)]">{body}</p>
    </div>
  );
}
