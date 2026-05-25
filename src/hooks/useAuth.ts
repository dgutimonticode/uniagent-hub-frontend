// UniAgent Hub - Auth Hooks
import { useMutation, useQuery } from '@tanstack/react-query';
import { login, register, getCurrentUser, logout as logoutApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/authStore';
import { ApiResponse, LoginInput, RegisterInput } from '@/types';
import { toast } from 'sonner';

interface ApiErrorResponse {
  response?: {
    data?: ApiResponse<never>;
  };
}

export function useLogin() {
  const { login: setAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: (data: LoginInput) => login(data),
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      toast.success('Bienvenido de vuelta');
    },
    onError: (error: ApiErrorResponse) => {
      const msg = error.response?.data?.error?.message || 'Error al iniciar sesión';
      toast.error(msg);
    },
  });
}

export function useRegister() {
  const { login: setAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: (data: RegisterInput) => register(data),
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      toast.success('Cuenta creada exitosamente');
    },
    onError: (error: ApiErrorResponse) => {
      const msg = error.response?.data?.error?.message || 'Error al crear cuenta';
      toast.error(msg);
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLogout() {
  const { logout: clearAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      clearAuth();
      toast.success('Sesión cerrada');
      window.location.href = '/login';
    },
    onError: () => {
      // Even if API call fails, clear local auth state
      clearAuth();
      window.location.href = '/login';
    },
  });
}
