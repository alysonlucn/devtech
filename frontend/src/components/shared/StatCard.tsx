import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  iconClassName?: string
  subtitle?: string
  progress?: number
  progressVariant?: 'default' | 'xp' | 'success'
  highlight?: boolean
  className?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
  subtitle,
  progress,
  progressVariant = 'default',
  highlight,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden transition-shadow hover:shadow-md',
        highlight && 'border-[var(--color-primary)]/30 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent',
        className,
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--color-muted-foreground)]">{label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{subtitle}</p>
            )}
          </div>
          <div className={cn('rounded-lg bg-[var(--color-accent)] p-2.5', iconClassName)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {progress !== undefined && (
          <Progress value={progress} variant={progressVariant} className="mt-3 h-2" />
        )}
      </CardContent>
    </Card>
  )
}
