import { Link } from 'react-router-dom'
import { ArrowRight, GitBranch } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { TechnologyDependency } from '@/types/entities'
import { cn } from '@/lib/utils'

interface PrerequisiteCardProps {
  dependency: TechnologyDependency
  className?: string
}

export function PrerequisiteCard({ dependency, className }: PrerequisiteCardProps) {
  const name = dependency.prerequisiteTechnology?.name ?? dependency.prerequisiteTechnologyId

  return (
    <Link
      to={`/tecnologias/${dependency.prerequisiteTechnologyId}`}
      className={cn('block', className)}
    >
      <Card className="group transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]">
            <GitBranch className="h-5 w-5 text-[var(--color-primary)]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
              Pré-requisito
            </p>
            <h3 className="font-semibold group-hover:text-[var(--color-primary)]">{name}</h3>
            {dependency.prerequisiteTechnology?.description && (
              <p className="mt-1 line-clamp-2 text-sm text-[var(--color-muted-foreground)]">
                {dependency.prerequisiteTechnology.description}
              </p>
            )}
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-[var(--color-muted-foreground)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]" />
        </CardContent>
      </Card>
    </Link>
  )
}
