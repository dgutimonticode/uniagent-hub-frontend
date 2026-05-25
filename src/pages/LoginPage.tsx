import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
      <section className="hidden lg:flex flex-col justify-between p-12 bg-[linear-gradient(180deg,var(--paper-2),var(--paper))] border-r border-[var(--hairline)]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--ink-3)] mb-6">UniAgent Hub</p>
          <h1 className="text-[52px] leading-[0.95] mb-4">
            Donde tus agentes
            <br />
            toman forma.
          </h1>
          <p className="max-w-md text-[15px] text-[var(--ink-2)] leading-7">
            Administrá agentes, skills y chat con una interfaz liviana, clara y pensada para
            flujos académicos.
          </p>
        </div>

        <div className="space-y-3 text-[13px] text-[var(--ink-3)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            Login con contrato API real
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--ok)]" />
            Estado persistente con Zustand
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--info)]" />
            Base visual adaptada al bosquejo
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-[30px] mb-2">Iniciar sesión</h2>
            <p className="text-[14px] text-[var(--ink-3)]">
              Entrá con tu cuenta para seguir con UniAgent Hub.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-[var(--radius)] border border-[var(--hairline)] bg-[var(--paper-2)] p-6 shadow-[0_10px_30px_rgba(31,29,26,0.04)]">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[13px] font-medium text-[var(--ink-2)]">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="daniel@usfx.bo"
                className="w-full rounded-md border border-[var(--hairline-2)] bg-[var(--paper)] px-3 py-2 text-[14px] outline-none transition-colors focus:border-[var(--accent)]"
                {...register('email')}
              />
              {errors.email && <p className="text-[12px] text-[var(--bad)]">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[13px] font-medium text-[var(--ink-2)]">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-md border border-[var(--hairline-2)] bg-[var(--paper)] px-3 py-2 text-[14px] outline-none transition-colors focus:border-[var(--accent)]"
                {...register('password')}
              />
              {errors.password && <p className="text-[12px] text-[var(--bad)]">{errors.password.message}</p>}
            </div>

            {errors.root?.message && (
              <div className="rounded-md border border-[var(--bad-wash)] bg-[var(--bad-wash)] px-3 py-2 text-[13px] text-[var(--bad)]">
                {errors.root.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-[var(--ink)] px-4 py-2.5 text-[14px] font-medium text-[var(--paper)] transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Ingresando…' : 'Entrar'}
            </button>

            <p className="text-[12px] text-[var(--ink-3)] leading-6">
              Usá las credenciales definidas por el backend. Si el login falla, revisá el contrato de la API.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
