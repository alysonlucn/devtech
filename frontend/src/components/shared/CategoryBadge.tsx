import { Badge } from '@/components/ui/badge'
import { categoryLabels } from '@/lib/labels'
import { cn } from '@/lib/utils'
import type { TechnologyCategory } from '@/types/enums'

const categoryClass: Record<TechnologyCategory, string> = {
  FUNDAMENTALS:
    'border-transparent bg-[oklch(0.55_0.12_290_/0.14)] text-[oklch(0.4_0.12_290)] dark:text-[oklch(0.82_0.08_290)]',
  FRONTEND:
    'border-transparent bg-[var(--color-primary)]/12 text-[var(--color-primary)]',
  BACKEND:
    'border-transparent bg-[var(--color-success)]/14 text-[var(--color-success-foreground)]',
  DATABASE:
    'border-transparent bg-[oklch(0.5_0.12_265_/0.14)] text-[oklch(0.38_0.12_265)] dark:text-[oklch(0.82_0.08_265)]',
  DEVOPS:
    'border-transparent bg-[var(--color-warning)]/16 text-[var(--color-warning-foreground)]',
  TOOLING:
    'border-transparent bg-[var(--color-muted)] text-[var(--color-muted-foreground)]',
}

export function CategoryBadge({ category, className }: { category: TechnologyCategory; className?: string }) {
  return (
    <Badge variant="secondary" className={cn(categoryClass[category], className)}>
      {categoryLabels[category]}
    </Badge>
  )
}
