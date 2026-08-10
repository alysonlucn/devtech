import type { LucideIcon } from 'lucide-react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export interface DetailTabItem {
  value: string
  label: string
  icon: LucideIcon
  count: number
  content: React.ReactNode
}

interface DetailTabsProps {
  tabs: DetailTabItem[]
  defaultValue?: string
  className?: string
}

export function DetailTabs({ tabs, defaultValue, className }: DetailTabsProps) {
  const initial = defaultValue ?? tabs[0]?.value

  return (
    <Tabs defaultValue={initial} className={className}>
      <TabsList className="mb-8 flex h-auto w-full flex-wrap justify-start gap-2 rounded-xl bg-transparent p-0">
        {tabs.map(({ value, label, icon: Icon, count }) => (
          <TabsTrigger
            key={value}
            value={value}
            className={cn(
              'group inline-flex h-auto items-center gap-2 rounded-lg border border-transparent px-4 py-3 text-sm font-medium',
              'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]',
              'transition-all hover:bg-[var(--color-accent)] hover:text-[var(--color-foreground)]',
              'data-[state=active]:border-[var(--color-primary)]/20 data-[state=active]:bg-[var(--color-primary)]',
              'data-[state=active]:text-[var(--color-primary-foreground)] data-[state=active]:shadow-sm',
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            <span
              className={cn(
                'rounded-full bg-black/10 px-2 py-0.5 text-xs font-semibold tabular-nums',
                'group-data-[state=active]:bg-white/20',
              )}
            >
              {count}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(({ value, content }) => (
        <TabsContent key={value} value={value} className="mt-0 space-y-4 focus-visible:outline-none">
          {content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

// Re-export for consumers that need lower-level tabs
export { TabsPrimitive }
