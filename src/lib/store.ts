'use client';
import { create } from 'zustand';
import { authApi } from './api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses?: any[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('pc_token') : null,
  isLoading: false,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('pc_token') : false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem('pc_token', data.token);
      localStorage.setItem('pc_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  register: async (formData) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.register(formData);
      localStorage.setItem('pc_token', data.token);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('pc_token');
    localStorage.removeItem('pc_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    try {
      const { data } = await authApi.getMe();
      set({ user: data.user, isAuthenticated: true });
    } catch {
      localStorage.removeItem('pc_token');
      set({ user: null, isAuthenticated: false });
    }
  },
}));
