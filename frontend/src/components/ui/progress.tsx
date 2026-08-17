import type { ComponentProps } from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

interface ProgressProps extends ComponentProps<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string
  variant?: 'default' | 'xp' | 'success'
}

const indicatorByVariant = {
  default: 'bg-[var(--color-primary)]',
  xp: 'bg-[var(--color-xp)]',
  success: 'bg-[var(--color-success)]',
}

export function Progress({
  className,
  value,
  indicatorClassName,
  variant = 'default',
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-[var(--color-secondary)]', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn('h-full w-full flex-1 transition-all', indicatorByVariant[variant], indicatorClassName)}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}
