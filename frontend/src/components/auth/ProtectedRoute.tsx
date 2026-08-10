import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useAuth } from '@/context/AuthContext'

const ONBOARDING_EXEMPT_PATHS = ['/app/onboarding', '/app/perfil']

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, profile } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingSpinner fullPage />
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />

  const needsOnboarding =
    !profile?.learningPathId &&
    !ONBOARDING_EXEMPT_PATHS.some((path) => location.pathname.startsWith(path))

  if (needsOnboarding) {
    return <Navigate to="/app/onboarding" state={location.state} replace />
  }

  return <Outlet />
}

export function AdminRoute() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingSpinner fullPage />
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  if (!isAdmin) return <Navigate to="/app/dashboard" replace />

  return <Outlet />
}

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <LoadingSpinner fullPage />
  if (isAuthenticated) return <Navigate to="/app/dashboard" replace />

  return <Outlet />
}

export function OnboardingRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingSpinner fullPage />
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />

  return <Outlet />
}
