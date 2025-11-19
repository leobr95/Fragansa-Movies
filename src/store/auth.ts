'use client';

import { create } from 'zustand';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  login,
  register,
} from '@/lib/api';

type User = AuthResponse['user'];

type State = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error?: string;
};

type Actions = {
  initFromStorage: () => void;
  setToken: (t: string | null, expiresAtIso?: string) => void;
  doLogin: (req: LoginRequest) => Promise<boolean>;
  doRegister: (req: RegisterRequest) => Promise<boolean>;
  loadMe: () => Promise<void>;
  logout: () => void;
};

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(
    new RegExp('(?:^|; )' + name + '=([^;]*)'),
  );
  return m ? decodeURIComponent(m[1]) : null;
}

function getAnyTokenFromClient(): string | null {
  if (typeof window === 'undefined') return null;
  const c = getCookie('access_token');
  if (c) return c;
  return (
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token')
  );
}

function secondsUntil(expiresAtIso?: string): number {
  if (!expiresAtIso) return 86400; // 1 día por defecto si no viene exp
  const ms = new Date(expiresAtIso).getTime() - Date.now();
  return Math.max(60, Math.floor(ms / 1000)); // mínimo 60s
}

function setCookie(name: string, value: string, maxAgeSec: number): void {
  try {
    document.cookie = `${name}=${encodeURIComponent(
      value,
    )}; path=/; max-age=${maxAgeSec}; samesite=lax; secure`;
  } catch {
    // opcional: log interno si quieres
  }
}

function clearCookie(name: string): void {
  try {
    document.cookie = `${name}=; path=/; max-age=0; samesite=lax; secure`;
  } catch {
    // opcional: log interno si quieres
  }
}

// Helper para extraer mensaje de error sin usar `any`
function extractErrorMessage(e: unknown, fallback: string): string {
  if (e instanceof Error) {
    return e.message || fallback;
  }

  if (typeof e === 'object' && e !== null) {
    // Posible error tipo Axios: e.response.data.errors[0] o e.response.data.message
    const maybeResponse = (e as { response?: unknown }).response;
    if (
      maybeResponse &&
      typeof maybeResponse === 'object' &&
      'data' in maybeResponse &&
      maybeResponse.data &&
      typeof maybeResponse.data === 'object'
    ) {
      const data = maybeResponse.data as {
        errors?: string[];
        message?: string;
      };
      if (Array.isArray(data.errors) && data.errors[0]) {
        return data.errors[0];
      }
      if (data.message) {
        return data.message;
      }
    }
  }

  return fallback;
}

export const useAuth = create<State & Actions>((set, get) => ({
  user: null,
  token: null,
  loading: false,

  initFromStorage: () => {
    const t = getAnyTokenFromClient();
    if (t) set({ token: t });
  },

  setToken: (t, expiresAtIso) => {
    set({ token: t });
    try {
      if (t) {
        const sec = secondsUntil(expiresAtIso);
        setCookie('access_token', t, sec);
        localStorage.setItem('accessToken', t);
      } else {
        clearCookie('access_token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('access_token');
      }
    } catch {
      // swallow storage errors
    }
  },

  doLogin: async (req) => {
    try {
      set({ loading: true, error: undefined });
      const res = await login(req); // { accessToken, expiresAt, user, ... }
      get().setToken(res.accessToken, res.expiresAt);
      set({ user: res.user, loading: false });
      return true;
    } catch (e: unknown) {
      const err = extractErrorMessage(e, 'Login failed');
      set({ loading: false, error: err });
      return false;
    }
  },

  doRegister: async (req) => {
    try {
      set({ loading: true, error: undefined });
      const res = await register(req); // { accessToken, expiresAt, user, ... }
      get().setToken(res.accessToken, res.expiresAt);
      set({ user: res.user, loading: false });
      return true;
    } catch (e: unknown) {
      const err = extractErrorMessage(e, 'Register failed');
      set({ loading: false, error: err });
      return false;
    }
  },

  loadMe: async () => {
    const t = get().token || getAnyTokenFromClient();
    if (!t) throw new Error('No token');

    const url = `${process.env.NEXT_PUBLIC_AUTH_API_BASE}/api/Auth/me`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${t}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      get().setToken(null);
      set({ user: null });
      throw new Error(`Auth/me failed: ${res.status}`);
    }

    const u = (await res.json()) as User;
    set({ user: u });
  },

  logout: () => {
    get().setToken(null);
    set({ user: null });
  },
}));
