// UniAgent Hub - Auth Store
// Zustand store with persistence for authentication

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (user, token) => {
        set({ user, token });
        localStorage.setItem('uniagent_token', token);
      },
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('uniagent_token');
      },
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'uniagent-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
