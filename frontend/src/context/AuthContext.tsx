import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth.api'
import { tokenStorage } from '@/lib/token-storage'
import type { MeResponse, User } from '@/types/entities'
import { UserRole } from '@/types/enums'

interface AuthContextValue {
  user: User | null
  profile: MeResponse['profile'] | null
  streak: MeResponse['streak'] | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<MeResponse['profile'] | null>(null)
  const [streak, setStreak] = useState<MeResponse['streak'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const applyMe = useCallback((me: MeResponse) => {
    setUser({
      id: me.id,
      name: me.name,
      email: me.email,
      role: me.role,
      createdAt: me.createdAt,
    })
    setProfile(me.profile)
    setStreak(me.streak)
  }, [])

  const refreshUser = useCallback(async () => {
    const me = await authApi.me()
    applyMe(me)
  }, [applyMe])

  useEffect(() => {
    async function bootstrap() {
      if (!tokenStorage.getAccessToken()) {
        setIsLoading(false)
        return
      }
      try {
        await refreshUser()
      } catch {
        tokenStorage.clear()
      } finally {
        setIsLoading(false)
      }
    }
    void bootstrap()
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    const { user: loggedUser, tokens } = await authApi.login({ email, password })
    tokenStorage.setTokens(tokens)
    setUser(loggedUser)
    await refreshUser()
  }, [refreshUser])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { user: newUser, tokens } = await authApi.register({ name, email, password })
    tokenStorage.setTokens(tokens)
    setUser(newUser)
    await refreshUser()
  }, [refreshUser])

  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
    setProfile(null)
    setStreak(null)
    queryClient.clear()
  }, [queryClient])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      streak,
      isLoading,
      isAuthenticated: !!user,
      isAdmin: user?.role === UserRole.ADMIN,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, profile, streak, isLoading, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
