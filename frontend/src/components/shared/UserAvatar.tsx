import { cn } from '@/lib/utils'

interface UserAvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-lg',
}

export function UserAvatar({ name, size = 'md', className }: UserAvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-deep)] font-semibold text-[var(--color-primary-foreground)] shadow-sm',
        sizeClasses[size],
        className,
      )}
      aria-hidden
    >
      {initials || '?'}
    </div>
  )
}
