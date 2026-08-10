import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ProgressCardProps {
  percentage: number
  label?: string
  className?: string
}

export function ProgressCard({ percentage, label = 'Progresso', className }: ProgressCardProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--color-muted-foreground)]">{label}</span>
        <span className="font-semibold tabular-nums">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2.5" />
    </div>
  )
}
