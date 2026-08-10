import type { Technology, UserTechnologyProgress } from '@/types/entities'
import { ProgressStatus } from '@/types/enums'

export interface DetailStats {
  estimatedTime: number
  resourcesCount: number
  projectsCount: number
  competenciesCount: number
}

export function formatEstimatedTime(hours: number): string {
  if (hours <= 0) return '—'
  if (hours === 1) return '1 hora'
  return `${hours} horas`
}

export function getProgressPercentage(
  status: ProgressStatus,
  score: number | null,
): number {
  if (status === ProgressStatus.VALIDATED) return score ?? 100
  if (status === ProgressStatus.READY_FOR_ASSESSMENT) return 75
  if (status === ProgressStatus.IN_PROGRESS) return 40
  return 0
}

export function hasProgress(status: ProgressStatus | undefined): boolean {
  return (
    status === ProgressStatus.IN_PROGRESS ||
    status === ProgressStatus.READY_FOR_ASSESSMENT ||
    status === ProgressStatus.VALIDATED
  )
}

export function aggregateTechnologyStats(technologies: Technology[]): DetailStats {
  return technologies.reduce(
    (acc, tech) => ({
      estimatedTime: acc.estimatedTime + (tech.estimatedTime ?? 0),
      resourcesCount: acc.resourcesCount + (tech.resources?.length ?? 0),
      projectsCount: acc.projectsCount + (tech.projects?.length ?? 0),
      competenciesCount: acc.competenciesCount + (tech.competencies?.length ?? 0),
    }),
    { estimatedTime: 0, resourcesCount: 0, projectsCount: 0, competenciesCount: 0 },
  )
}

export function calculatePathProgress(
  technologyIds: string[],
  progressList: UserTechnologyProgress[],
): number {
  if (technologyIds.length === 0) return 0
  const validated = technologyIds.filter((id) => {
    const p = progressList.find((pr) => pr.technologyId === id)
    return p?.status === ProgressStatus.VALIDATED
  }).length
  return Math.round((validated / technologyIds.length) * 100)
}

export function collectCompetencyTitles(technologies: Technology[]): string[] {
  const titles = new Set<string>()
  for (const tech of technologies) {
    for (const c of tech.competencies ?? []) {
      titles.add(c.title)
    }
  }
  return Array.from(titles)
}
