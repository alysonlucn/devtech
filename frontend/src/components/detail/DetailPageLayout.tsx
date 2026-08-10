import type { ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { SectionTitle } from '@/components/detail/SectionTitle'
import { cn } from '@/lib/utils'

interface LearningSectionProps {
  items: string[]
  className?: string
}

export function LearningSection({ items, className }: LearningSectionProps) {
  if (items.length === 0) return null

  return (
    <section className={cn('mb-12', className)}>
      <SectionTitle title="O que você vai aprender" />
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3.5"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
            <span className="text-sm font-medium">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

interface DetailPageLayoutProps {
  hero: ReactNode
  sidebar: ReactNode
  children: ReactNode
  className?: string
}

export function DetailPageLayout({ hero, sidebar, children, className }: DetailPageLayoutProps) {
  return (
    <div className={cn('mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12', className)}>
      {hero}
      <div className="mt-12 flex flex-col gap-10 xl:flex-row xl:gap-12">
        <main className="min-w-0 flex-1 xl:w-[70%]">{children}</main>
        <div className="xl:w-[30%] xl:shrink-0">{sidebar}</div>
      </div>
    </div>
  )
}
