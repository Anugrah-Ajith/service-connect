import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'service_provider';
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const loadAuthFromStorage = () => {
  try {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { user: parsed.user, token: parsed.token };
    }
  } catch (error) {
    // Ignore errors
  }
  return { user: null, token: null };
};

const saveAuthToStorage = (user: User | null, token: string | null) => {
  try {
    if (user && token) {
      localStorage.setItem('auth-storage', JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem('auth-storage');
    }
  } catch (error) {
    // Ignore errors
  }
};

const initialState = loadAuthFromStorage();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialState.user,
  token: initialState.token,
  setAuth: (user, token) => {
    saveAuthToStorage(user, token);
    set({ user, token });
  },
  logout: () => {
    saveAuthToStorage(null, null);
    set({ user: null, token: null });
  },
}));

