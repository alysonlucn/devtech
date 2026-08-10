import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SkillBadgeProps {
  label: string
  className?: string
}

export function SkillBadge({ label, className }: SkillBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'w-full justify-center rounded-lg px-4 py-2.5 text-sm font-medium',
        className,
      )}
    >
      {label}
    </Badge>
  )
}
