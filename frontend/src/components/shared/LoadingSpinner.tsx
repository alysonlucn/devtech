import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  fullPage?: boolean
  className?: string
}

export function LoadingSpinner({ fullPage, className }: LoadingSpinnerProps) {
  const spinner = (
    <Loader2 className={cn('h-8 w-8 animate-spin text-[var(--color-primary)]', className)} />
  )

  if (fullPage) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        {spinner}
      </div>
    )
  }

  return spinner
}
