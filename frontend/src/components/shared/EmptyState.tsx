import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
  emoji?: string
  icon?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  action,
  emoji,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/20 px-8 py-16 text-center',
        className,
      )}
    >
      {emoji ? (
        <span className="mb-4 text-4xl" role="img" aria-hidden>
          {emoji}
        </span>
      ) : icon ? (
        <div className="mb-4 text-[var(--color-muted-foreground)]">{icon}</div>
      ) : (
        <Inbox className="mb-4 h-10 w-10 text-[var(--color-muted-foreground)]" />
      )}
      <h3 className="text-lg font-medium">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-muted-foreground)]">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
