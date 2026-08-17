import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { DifficultyBadge } from '@/components/shared/DifficultyBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatEstimatedTime } from '@/lib/detail-utils'
import type { Technology } from '@/types/entities'
import type { ProgressStatus } from '@/types/enums'
import { cn } from '@/lib/utils'

interface TechnologyListCardProps {
  technology: Technology
  order: number
  status?: ProgressStatus
  to: string
  className?: string
}

export function TechnologyListCard({
  technology,
  order,
  status,
  to,
  className,
}: TechnologyListCardProps) {
  return (
    <Link to={to} className={cn('block', className)}>
      <Card className="group transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-[var(--color-primary-foreground)]">
            {order}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold group-hover:text-[var(--color-primary)]">
              {technology.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-[var(--color-muted-foreground)]">
              {technology.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <CategoryBadge category={technology.category} />
              <DifficultyBadge difficulty={technology.difficulty} />
              {status && <StatusBadge status={status} />}
              <span className="text-xs text-[var(--color-muted-foreground)]">
                {formatEstimatedTime(technology.estimatedTime)}
              </span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-[var(--color-muted-foreground)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]" />
        </CardContent>
      </Card>
    </Link>
  )
}
