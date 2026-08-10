import { apiClient, unwrap } from '@/api/client'
import type { AuthResponse, MeResponse, TokenPair } from '@/types/entities'

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export const authApi = {
  login: (input: LoginInput) =>
    unwrap<AuthResponse>(apiClient.post('/auth/login', input)),

  register: (input: RegisterInput) =>
    unwrap<AuthResponse>(apiClient.post('/auth/register', input)),

  refresh: (refreshToken: string) =>
    unwrap<TokenPair>(apiClient.post('/auth/refresh', { refreshToken })),

  me: () => unwrap<MeResponse>(apiClient.get('/auth/me')),
}
