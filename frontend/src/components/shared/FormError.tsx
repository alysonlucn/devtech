import type { ReactNode } from 'react'

interface FormErrorProps {
  children?: ReactNode
  className?: string
}

export function FormError({ children, className }: FormErrorProps) {
  if (!children) return null
  return (
    <p className={className ?? 'text-sm text-[var(--color-destructive)]'} role="alert">
      {children}
    </p>
  )
}

export function FormErrorBox({ children }: { children?: ReactNode }) {
  if (!children) return null
  return (
    <p
      className="rounded-lg border border-[var(--color-destructive)]/25 bg-[var(--color-destructive)]/10 px-3 py-2 text-sm text-[var(--color-destructive-foreground)]"
      role="alert"
    >
      {children}
    </p>
  )
}
