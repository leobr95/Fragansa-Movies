// src/lib/api.ts
import axios from 'axios';

const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_API_BASE!;
const USE_MOCKS =
  (process.env.NEXT_PUBLIC_USE_MOCKS || 'false').toLowerCase() === 'true';

export const authApi = axios.create({
  baseURL: AUTH_BASE,
});

// ---- Tipos de Auth ----
export type LoginRequest = { email: string; password: string };
export type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
};
export type UserDto = {
  userId: string;
  email: string;
  fullName: string;
  role: string;
};
export type AuthResponse = {
  accessToken: string;
  expiresAt: string;
  user: UserDto;
};

// ---- Login ----
export async function login(req: LoginRequest): Promise<AuthResponse> {
  if (USE_MOCKS) {
    return {
      accessToken: 'mock.jwt.token',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      user: {
        userId: '96cece1c-4e3e-4faf-a051-7afc003c04d2',
        email: req.email,
        fullName: 'Mock User',
        role: 'user',
      },
    };
  }

  const { data } = await authApi.post<AuthResponse>('/api/Auth/login', req);
  return data;
}

// ---- Register ----
export async function register(req: RegisterRequest): Promise<AuthResponse> {
  if (USE_MOCKS) {
    // Reusa el login mockeado
    return login({ email: req.email, password: req.password });
  }

  const { data } = await authApi.post<AuthResponse>(
    '/api/Auth/register',
    req,
  );
  return data;
}
