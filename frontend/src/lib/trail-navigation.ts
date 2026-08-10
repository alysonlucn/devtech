/** Navigation helpers for trail cards — guests must authenticate before exploring a path. */

export interface TrailAuthRedirectState {
  from: { pathname: string }
  intendedLearningPathId: string
}

export function getTrailNavigation(pathId: string, isAuthenticated: boolean): {
  to: string
  state?: TrailAuthRedirectState
} {
  if (isAuthenticated) {
    return { to: `/trilhas/${pathId}` }
  }

  return {
    to: '/login',
    state: {
      from: { pathname: '/app/onboarding' },
      intendedLearningPathId: pathId,
    },
  }
}

export function readIntendedLearningPathId(state: unknown): string | null {
  if (!state || typeof state !== 'object') return null
  const id = (state as { intendedLearningPathId?: unknown }).intendedLearningPathId
  return typeof id === 'string' && id.length > 0 ? id : null
}
