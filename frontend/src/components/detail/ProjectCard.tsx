import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Clock, Rocket } from 'lucide-react'
import { toast } from 'sonner'
import { userApi } from '@/api/user.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DifficultyBadge } from '@/components/shared/DifficultyBadge'
import { useAuth } from '@/context/AuthContext'
import { getApiErrorMessage } from '@/lib/utils'
import type { ProjectSuggestion } from '@/types/entities'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: ProjectSuggestion
  className?: string
}

function projectSummary(description: string): string {
  return (
    description.split('\n').find((line) => line.trim() && !line.startsWith('#')) ??
    description
  )
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const startMutation = useMutation({
    mutationFn: () => userApi.startProject(project.id),
    onSuccess: () => {
      toast.success('Desafio iniciado!')
      void queryClient.invalidateQueries({ queryKey: ['user-projects'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  return (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <CardContent className="space-y-4 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]">
            <Rocket className="h-5 w-5 text-[var(--color-primary)]" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold leading-snug">{project.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)] line-clamp-3">
              {projectSummary(project.description)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <DifficultyBadge difficulty={project.difficulty} />
            <span className="inline-flex items-center gap-1 text-xs text-[var(--color-muted-foreground)]">
              <Clock className="h-3.5 w-3.5" />
              Projeto prático
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link to={isAuthenticated ? `/app/desafios/${project.id}` : '/login'}>
                Ver desafio
              </Link>
            </Button>
            {isAuthenticated ? (
              <Button
                size="sm"
                onClick={() => startMutation.mutate()}
                disabled={startMutation.isPending}
              >
                {startMutation.isPending ? 'Iniciando...' : 'Começar'}
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link to="/login">Começar</Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
