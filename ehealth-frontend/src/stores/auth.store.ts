import { create } from "zustand";

interface AuthState {
  isInitialized: boolean;
  token: string | null;
  initialize: (token: string | null) => void;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isInitialized: false,
  token: null,
  initialize: (token) => set({ isInitialized: true, token }),
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null }),
}));
