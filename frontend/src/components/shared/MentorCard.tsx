import { Brain } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MentorCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function MentorCard({ title, children, className }: MentorCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center gap-3 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-success)]/5 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-deep)] text-[var(--color-primary-foreground)] shadow-sm">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-primary)]">
            Mentor DevTech
          </p>
          <h3 className="text-base font-semibold">{title}</h3>
        </div>
      </CardHeader>
      <CardContent className="pt-5">{children}</CardContent>
    </Card>
  )
}
