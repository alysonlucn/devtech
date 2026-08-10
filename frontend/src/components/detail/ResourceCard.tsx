import {
  BookOpen,
  FileText,
  Film,
  GraduationCap,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { resourceTypeLabels } from '@/lib/labels'
import type { Resource } from '@/types/entities'
import type { ResourceType } from '@/types/enums'
import { cn } from '@/lib/utils'

const resourceIcons: Record<ResourceType, typeof BookOpen> = {
  video: Film,
  article: FileText,
  documentation: BookOpen,
  book: BookOpen,
  course: GraduationCap,
}

interface ResourceCardProps {
  resource: Resource
  className?: string
}

export function ResourceCard({ resource, className }: ResourceCardProps) {
  const Icon = resourceIcons[resource.type] ?? BookOpen

  return (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]">
            <Icon className="h-5 w-5 text-[var(--color-primary)]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold leading-snug">{resource.title}</h3>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              {resourceTypeLabels[resource.type]}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="shrink-0" asChild>
          <a href={resource.url} target="_blank" rel="noreferrer">
            Abrir
            <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
