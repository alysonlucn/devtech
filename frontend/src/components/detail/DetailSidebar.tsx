import type { ReactNode } from 'react'
import { SidebarCard } from '@/components/detail/SidebarCard'
import { ProgressCard } from '@/components/detail/ProgressCard'
import { cn } from '@/lib/utils'

export interface DetailSidebarItem {
  label: string
  value: ReactNode
}

interface DetailSidebarProps {
  items: DetailSidebarItem[]
  progressPercentage?: number
  className?: string
  footer?: ReactNode
}

export function DetailSidebar({ items, progressPercentage, className, footer }: DetailSidebarProps) {
  return (
    <aside
      className={cn(
        'space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-5',
        'lg:sticky lg:top-8 lg:self-start',
        className,
      )}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
        Resumo
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {items.map((item) => (
          <SidebarCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
      {progressPercentage !== undefined && progressPercentage > 0 && (
        <div className="pt-2">
          <ProgressCard percentage={progressPercentage} />
        </div>
      )}
      {footer}
    </aside>
  )
}
