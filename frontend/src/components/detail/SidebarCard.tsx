import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SidebarCardProps {
  label: string
  value: ReactNode
  className?: string
}

export function SidebarCard({ label, value, className }: SidebarCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3',
        className,
      )}
    >
      <p className="text-xs font-medium text-[var(--color-muted-foreground)]">{label}</p>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  )
}
