import { cn } from '@/lib/utils'

interface SectionTitleProps {
  title: string
  description?: string
  className?: string
}

export function SectionTitle({ title, description, className }: SectionTitleProps) {
  return (
    <div className={cn('mb-6', className)}>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{description}</p>
      )}
    </div>
  )
}
