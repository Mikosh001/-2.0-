import { create } from 'zustand';

interface UserInfo {
  id: string;
  name: string;
  role: 'student' | 'employer' | 'admin';
}

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  login: (payload: { token: string; user: UserInfo }) => void;
  logout: () => void;
}

const safeGet = (key: string) => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(key);
};

export const useAuthStore = create<AuthState>((set) => ({
  user: safeGet('user') ? JSON.parse(safeGet('user') as string) : null,
  token: safeGet('token'),
  login: ({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  }
}));
