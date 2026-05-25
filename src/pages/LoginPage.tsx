import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { login } from '@/api/auth.api';
import { useAuthStore } from '@/stores/authStore';

const loginSchema = z.object({
  email: z.string().email('Ingresá un email válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);
  const authToken = useAuthStore((state) => state.token);
  const authLogin = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (authUser && authToken) {
      navigate('/', { replace: true });
    }
  }, [authToken, authUser, navigate]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login(values);
      authLogin(response.user, response.token);
      navigate('/', { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo iniciar sesión';
      setError('root', { message });
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.15fr_0.85fr] bg-[var(--paper)]">
      <section className="relative hidden overflow-hidden border-r border-[var(--hairline)] lg:flex lg:flex-col lg:justify-between lg:p-12 uh-cover">
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-[var(--ink)] text-[15px] text-[var(--paper)] shadow-sm">
              🎓
            </div>
            <span className="font-serif text-[17px] font-medium tracking-[-0.01em]">
              UniAgent<em className="font-normal italic text-[var(--accent)]"> Hub</em>
            </span>
          </div>

          <div className="mt-12 inline-flex items-center gap-2">
            <span className="uh-pill terra tag">v0.1</span>
            <span className="uh-eyebrow">Early access · Primavera 2026</span>
          </div>

          <h1 className="mt-5 max-w-[18ch] font-serif text-[56px] font-normal leading-[1.04] tracking-[-0.022em] text-[var(--ink)]">
            Donde los docentes enseñan a sus{' '}
            <em className="italic text-[var(--accent)]">propios agentes.</em>
          </h1>

          <p className="mt-5 max-w-[44ch] font-serif text-[18px] italic leading-[1.55] text-[var(--ink-2)]">
            Un taller editorial para diseñar las skills que tu agente entrega a cada
            estudiante — a su ritmo, con tu voz.
          </p>
        </div>

        <div className="relative z-10 mt-8 flex items-end justify-between">
          <SpecimenCard />
          <div className="hidden flex-col items-end gap-1 self-end font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--ink-3)] xl:flex">
            <span>UniAgent Hub · v0.1</span>
            <span>USFX · COM610</span>
          </div>
        </div>
      </section>

      <section className="relative flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-7">
            <span className="uh-eyebrow">Iniciar sesión</span>
            <h2 className="mt-2 font-serif text-[40px] font-medium leading-tight tracking-[-0.02em] text-[var(--ink)]">
              Bienvenida <em className="italic text-[var(--accent)]">de vuelta.</em>
            </h2>
            <p className="mt-2 max-w-[36ch] text-[14px] leading-6 text-[var(--ink-3)]">
              Ingresá con tu correo institucional para seguir donde lo dejaste.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="uh-eyebrow">
                Correo institucional
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)]"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@usfx.bo"
                  className="w-full rounded-[6px] border border-[var(--hairline-2)] bg-[var(--paper)] py-2.5 pl-9 pr-3 text-[14px] outline-none transition-colors focus:border-[var(--accent)]"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-[12px] text-[var(--bad)]">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="uh-eyebrow">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)]"
                />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-[6px] border border-[var(--hairline-2)] bg-[var(--paper)] py-2.5 pl-9 pr-3 text-[14px] outline-none transition-colors focus:border-[var(--accent)]"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="text-[12px] text-[var(--bad)]">{errors.password.message}</p>
              )}
            </div>

            {errors.root?.message && (
              <div className="rounded-[6px] border border-[var(--bad-wash)] bg-[var(--bad-wash)] px-3 py-2 text-[13px] text-[var(--bad)]">
                {errors.root.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-[6px] border border-[var(--ink)] bg-[var(--ink)] px-4 py-2.5 text-[14px] font-medium text-[var(--paper)] transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </form>

          <p className="mt-6 max-w-[36ch] text-[12.5px] leading-6 text-[var(--ink-3)]">
            Usá las credenciales que te dio tu cátedra. Si tu cuenta no existe todavía,
            pedile al docente que te agregue.
          </p>
        </div>
      </section>
    </div>
  );
}

function SpecimenCard() {
  return (
    <div className="relative max-w-[340px] rotate-[-2.4deg] rounded-[12px] border border-[var(--hairline)] bg-[var(--paper)] p-5 shadow-[0_22px_50px_-22px_rgba(31,29,26,0.18)]">
      <span className="uh-eyebrow">Agente · Profesora de Cálculo</span>
      <div className="mt-3 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-[10px] border border-[var(--hairline)] bg-[var(--paper-2)] text-[26px]">
          ∫
        </div>
        <div>
          <div className="font-serif text-[20px] font-medium leading-tight tracking-[-0.015em]">
            Profesora de <em className="italic text-[var(--accent)]">Cálculo</em>
          </div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
            4 skills · semestre 1
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-[13px] text-[var(--ink-2)]">
        <SpecimenRow index="01" name="Intuición de la derivada" status="moss" label="Dominada" />
        <SpecimenRow index="02" name="Reglas de derivación" status="moss" label="Dominada" />
        <SpecimenRow index="03" name="Derivada como pendiente" status="warn" label="En curso" />
        <SpecimenRow index="04" name="Aplicaciones" status="" label="Pendiente" />
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-dashed border-[var(--hairline-2)] pt-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
          Specimen · COM610
        </span>
        <span className="font-mono text-[10px] tracking-[0.06em] text-[var(--ink-3)]">↗</span>
      </div>
    </div>
  );
}

interface SpecimenRowProps {
  index: string;
  name: string;
  status: 'moss' | 'warn' | '';
  label: string;
}

function SpecimenRow({ index, name, status, label }: SpecimenRowProps) {
  return (
    <li className="flex items-center gap-3">
      <span className="font-mono text-[10.5px] text-[var(--ink-4)]">{index}</span>
      <span className="flex-1 truncate font-serif text-[14px]">{name}</span>
      <span className={`uh-pill ${status} text-[10.5px]`}>{label}</span>
    </li>
  );
}
