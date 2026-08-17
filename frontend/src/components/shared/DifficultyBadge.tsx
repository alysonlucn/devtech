import { Badge } from '@/components/ui/badge'
import { difficultyLabels } from '@/lib/labels'
import { cn } from '@/lib/utils'
import type { TechnologyDifficulty } from '@/types/enums'

const difficultyClass: Record<TechnologyDifficulty, string> = {
  BEGINNER: 'border-transparent bg-[var(--color-success)]/15 text-[var(--color-success-foreground)]',
  INTERMEDIATE: 'border-transparent bg-[var(--color-warning)]/18 text-[var(--color-warning-foreground)]',
  ADVANCED: 'border-transparent bg-[var(--color-destructive)]/12 text-[var(--color-destructive-foreground)]',
}

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: TechnologyDifficulty
  className?: string
}) {
  return (
    <Badge variant="outline" className={cn(difficultyClass[difficulty], className)}>
      {difficultyLabels[difficulty]}
    </Badge>
  )
}
