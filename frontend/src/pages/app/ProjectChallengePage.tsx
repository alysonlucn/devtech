import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Rocket } from 'lucide-react'
import { toast } from 'sonner'
import { technologiesApi } from '@/api/technologies.api'
import { userApi } from '@/api/user.api'
import { Button } from '@/components/ui/button'
import { AppShell } from '@/components/layout/AppShell'
import { appSidebarSections } from '@/components/layout/Sidebar'
import { DifficultyBadge } from '@/components/shared/DifficultyBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { getApiErrorMessage } from '@/lib/utils'

function ChallengeBody({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/).filter(Boolean)

  return (
    <div className="space-y-4 text-sm leading-relaxed sm:text-base">
      {blocks.map((block, index) => {
        const lines = block.split('\n')
        if (lines[0]?.startsWith('## ')) {
          return (
            <div key={index} className="space-y-2">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
                {lines[0].replace(/^##\s+/, '')}
              </h2>
              {lines.length > 1 && (
                <div className="space-y-1 text-[var(--color-muted-foreground)]">
                  {lines.slice(1).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          )
        }

        if (lines.every((line) => /^[-*]\s+|^\d+\.\s+/.test(line.trim()) || !line.trim())) {
          return (
            <ul key={index} className="space-y-1.5 text-[var(--color-muted-foreground)]">
              {lines.filter(Boolean).map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                  <span>{line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '')}</span>
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={index} className="text-[var(--color-foreground)]">
            {block}
          </p>
        )
      })}
    </div>
  )
}

export function ProjectChallengePage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => technologiesApi.getProject(projectId!),
    enabled: !!projectId,
  })

  const { data: userProjects } = useQuery({
    queryKey: ['user-projects'],
    queryFn: () => userApi.getProjects(),
  })

  const alreadyStarted = userProjects?.some((p) => p.projectId === projectId)

  const startMutation = useMutation({
    mutationFn: () => userApi.startProject(projectId!),
    onSuccess: () => {
      toast.success('Desafio iniciado!')
      void queryClient.invalidateQueries({ queryKey: ['user-projects'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      navigate('/app/projetos')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  if (isLoading) {
    return (
      <AppShell sidebarSections={appSidebarSections}>
        <LoadingSpinner fullPage />
      </AppShell>
    )
  }

  if (isError || !project) {
    return (
      <AppShell sidebarSections={appSidebarSections}>
        <EmptyState title="Desafio não encontrado" />
      </AppShell>
    )
  }

  const backTo = project.technologyId
    ? `/tecnologias/${project.technologyId}`
    : '/app/projetos'

  return (
    <AppShell sidebarSections={appSidebarSections}>
      <div className="mx-auto max-w-3xl animate-fade-in-up">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        <header className="mt-6 space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <Rocket className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Desafio prático
              {project.technology?.name ? ` · ${project.technology.name}` : ''}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
            <DifficultyBadge difficulty={project.difficulty} />
          </div>
        </header>

        <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 sm:p-6">
          <ChallengeBody text={project.description} />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          {alreadyStarted ? (
            <Button size="lg" asChild>
              <Link to="/app/projetos">
                Ver em Meus projetos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={() => startMutation.mutate()}
              disabled={startMutation.isPending}
            >
              {startMutation.isPending ? 'Iniciando...' : 'Começar desafio'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          <Button size="lg" variant="outline" asChild>
            <Link to={backTo}>Continuar estudando</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
