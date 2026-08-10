import { cn } from '@/lib/utils'
import { getTechnologyVisual } from '@/lib/technology-visuals'
import type { TechnologyCategory } from '@/types/enums'

interface TechnologyAvatarProps {
  name: string
  slug: string
  category?: TechnologyCategory
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
}

export function TechnologyAvatar({ name, slug, category, size = 'md', className }: TechnologyAvatarProps) {
  const visual = getTechnologyVisual(slug, category)
  const label = visual.emoji.length <= 3 ? visual.emoji : name.slice(0, 2).toUpperCase()

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-bold text-white shadow-sm ring-2',
        visual.gradient,
        visual.ring,
        sizeClasses[size],
        className,
      )}
      title={name}
      aria-hidden
    >
      {label}
    </div>
  )
}
