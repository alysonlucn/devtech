import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InfoCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  className?: string
}

export function InfoCard({ icon: Icon, label, value, className }: InfoCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3',
        className,
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--color-accent)]">
        <Icon className="h-4 w-4 text-[var(--color-primary)]" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[var(--color-muted-foreground)]">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  )
}
