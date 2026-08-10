import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { InfoCard } from '@/components/detail/InfoCard'
import { ProgressCard } from '@/components/detail/ProgressCard'
import { Clock, BookOpen, FolderKanban, Award } from 'lucide-react'
import { formatEstimatedTime } from '@/lib/detail-utils'
import { cn } from '@/lib/utils'

interface PageHeroProps {
  backTo: string
  backLabel: string
  badges?: ReactNode
  title: string
  description: string
  estimatedTime: number
  resourcesCount: number
  projectsCount: number
  competenciesCount: number
  progressPercentage?: number
  actions?: ReactNode
  className?: string
}

export function PageHero({
  backTo,
  backLabel,
  badges,
  title,
  description,
  estimatedTime,
  resourcesCount,
  projectsCount,
  competenciesCount,
  progressPercentage,
  actions,
  className,
}: PageHeroProps) {
  return (
    <header className={cn('space-y-6', className)}>
      <Link
        to={backTo}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] transition-colors hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      {badges && <div className="flex flex-wrap gap-2">{badges}</div>}

      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--color-muted-foreground)]">
          {description}
        </p>
      </div>

      {progressPercentage !== undefined && progressPercentage > 0 && (
        <ProgressCard percentage={progressPercentage} className="max-w-xl" />
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard icon={Clock} label="Tempo estimado" value={formatEstimatedTime(estimatedTime)} />
          <InfoCard icon={BookOpen} label="Recursos" value={resourcesCount} />
          <InfoCard icon={FolderKanban} label="Projetos" value={projectsCount} />
          <InfoCard icon={Award} label="Competências" value={competenciesCount} />
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap gap-3 lg:justify-end">{actions}</div>
        )}
      </div>
    </header>
  )
}
