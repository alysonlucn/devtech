import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { tokenStorage } from '@/lib/token-storage'
import type { ApiResponse } from '@/types/api'
import type { TokenPair } from '@/types/entities'

const API_URL = (() => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  if (import.meta.env.VITE_API_HOST) {
    const host = String(import.meta.env.VITE_API_HOST).replace(/^https?:\/\//, '')
    return `https://${host}/api/v1`
  }
  return 'http://localhost:3001/api/v1'
})()

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise: Promise<string | null> | null = null

function isPublicAuthRequest(config?: InternalAxiosRequestConfig) {
  const path = config?.url ?? ''
  return /\/auth\/(login|register|refresh)(\?|$)/.test(path)
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) return null

  try {
    const { data } = await axios.post<ApiResponse<TokenPair>>(
      `${API_URL}/auth/refresh`,
      { refreshToken },
    )
    tokenStorage.setTokens(data.data)
    return data.data.accessToken
  } catch {
    tokenStorage.clear()
    return null
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isPublicAuthRequest(originalRequest)
    ) {
      originalRequest._retry = true

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }

      const newToken = await refreshPromise
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      }

      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data } = await promise
  return data.data
}

export async function unwrapWithMeta<T>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<{ data: T; meta?: ApiResponse<T>['meta'] }> {
  const { data } = await promise
  return { data: data.data, meta: data.meta }
}
