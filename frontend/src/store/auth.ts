import { create } from 'zustand';

export type UserRole = 'student' | 'employer' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  region?: string | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (data: { token: string; user: AuthUser }) => void;
  logout: () => void;
}

const stored =
  typeof window !== 'undefined' ? localStorage.getItem('professiya-auth') : null;
const initial = stored ? (JSON.parse(stored) as { token: string; user: AuthUser }) : null;

export const useAuthStore = create<AuthState>((set) => ({
  token: initial?.token ?? null,
  user: initial?.user ?? null,
  setAuth: ({ token, user }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('professiya-auth', JSON.stringify({ token, user }));
    }
    set({ token, user });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('professiya-auth');
    }
    set({ token: null, user: null });
  },
}));
