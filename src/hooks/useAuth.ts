// UniAgent Hub - Auth Hooks
import { useMutation, useQuery } from '@tanstack/react-query';
import { login, getCurrentUser } from '@/api/auth.api';
import { useAuthStore } from '@/stores/authStore';
import { ApiResponse, LoginInput } from '@/types';
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

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
  });
}
