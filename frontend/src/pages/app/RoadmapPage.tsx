import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'
import { userApi } from '@/api/user.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { AppShell } from '@/components/layout/AppShell'
import { appSidebarSections } from '@/components/layout/Sidebar'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { TechnologyAvatar } from '@/components/shared/TechnologyAvatar'
import { categoryLabels, difficultyLabels } from '@/lib/labels'
import { getApiErrorMessage } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { RoadmapItem } from '@/types/entities'
import { ProgressStatus } from '@/types/enums'

function findCurrentNodeId(items: RoadmapItem[]): string | null {
  const ready = items.find((i) => i.status === ProgressStatus.READY_FOR_ASSESSMENT)
  if (ready) return ready.technology.id
  const inProgress = items.find((i) => i.status === ProgressStatus.IN_PROGRESS)
  if (inProgress) return inProgress.technology.id
  const notStarted = items.find((i) => i.status === ProgressStatus.NOT_STARTED)
  return notStarted?.technology.id ?? null
}

export function RoadmapPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['roadmap'],
    queryFn: () => userApi.getRoadmap(),
  })

  const startMutation = useMutation({
    mutationFn: (technologyId: string) => userApi.startProgress(technologyId),
    onSuccess: (_data, technologyId) => {
      toast.success('Tecnologia iniciada! Bora estudar 🚀')
      void queryClient.invalidateQueries({ queryKey: ['roadmap'] })
      navigate(`/tecnologias/${technologyId}`)
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const readyMutation = useMutation({
    mutationFn: (progressId: string) => userApi.markReady(progressId),
    onSuccess: () => {
      toast.success('Pronto para avaliação!')
      void queryClient.invalidateQueries({ queryKey: ['roadmap'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const completedCount = data?.filter((i) => i.status === ProgressStatus.VALIDATED).length ?? 0
  const totalCount = data?.length ?? 0
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const currentId = data ? findCurrentNodeId(data) : null

  return (
    <AppShell sidebarSections={appSidebarSections}>
      <PageHeader
        title="Minha trilha"
        description="Foque no próximo passo — o restante fica em segundo plano."
      />

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-16" />
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      )}

      {isError && (
        <EmptyState title="Erro ao carregar a trilha" description="Escolha uma trilha no perfil." emoji="🗺️" />
      )}

      {data && data.length === 0 && (
        <EmptyState
          title="Nenhuma trilha selecionada"
          description="Escolha uma trilha de aprendizado no seu perfil."
          action={<Button asChild><Link to="/app/onboarding">Escolher trilha</Link></Button>}
        />
      )}

      {data && data.length > 0 && (
        <div className="space-y-8">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">
                {completedCount} de {totalCount} validadas
              </span>
              <span className="text-[var(--color-muted-foreground)]">{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-2.5" />
          </div>

          <div className="relative space-y-0">
            {data.map((item, index) => {
              const isCompleted = item.status === ProgressStatus.VALIDATED
              const isCurrent = item.technology.id === currentId

              return (
                <div
                  key={item.technology.id}
                  className={cn(
                    'relative flex gap-4 pb-8 transition-opacity',
                    !isCurrent && !isCompleted && 'opacity-60',
                    isCompleted && !isCurrent && 'opacity-70',
                  )}
                >
                  {index < data.length - 1 && (
                    <div
                      className={cn(
                        'absolute left-5 top-12 h-full w-0.5',
                        isCompleted ? 'bg-[var(--color-success)]/40' : 'bg-[var(--color-border)]',
                      )}
                    />
                  )}

                  <div
                    className={cn(
                      'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm',
                      isCompleted && 'bg-[var(--color-success)] text-[var(--color-primary-foreground)]',
                      isCurrent &&
                        !isCompleted &&
                        'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] ring-4 ring-[var(--color-primary)]/25',
                      !isCompleted &&
                        !isCurrent &&
                        'border-2 border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted-foreground)]',
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                  </div>

                  <Card
                    className={cn(
                      'flex-1',
                      isCurrent && 'border-2 border-[var(--color-primary)] shadow-md ring-2 ring-[var(--color-primary)]/15',
                      isCompleted && !isCurrent && 'border-[var(--color-success)]/25 bg-[var(--color-success)]/5',
                    )}
                  >
                    <CardContent className="py-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex gap-3">
                          <TechnologyAvatar
                            name={item.technology.name}
                            slug={item.technology.slug}
                            category={item.technology.category}
                            size="sm"
                          />
                          <div>
                            <Link
                              to={`/tecnologias/${item.technology.id}`}
                              className="font-semibold hover:underline"
                            >
                              {item.technology.name}
                            </Link>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <StatusBadge status={item.status} />
                              {isCurrent && (
                                <span className="text-xs text-[var(--color-muted-foreground)]">
                                  {categoryLabels[item.technology.category]} ·{' '}
                                  {difficultyLabels[item.technology.difficulty]}
                                </span>
                              )}
                            </div>
                            {item.score !== null && (
                              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                                Nota: <strong>{item.score}</strong>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {isCurrent && item.status === ProgressStatus.NOT_STARTED && (
                            <Button
                              size="sm"
                              onClick={() => startMutation.mutate(item.technology.id)}
                              disabled={startMutation.isPending}
                            >
                              Iniciar estudo
                            </Button>
                          )}

                          {isCurrent && item.status === ProgressStatus.IN_PROGRESS && (
                            <>
                              <Button size="sm" asChild>
                                <Link to={`/tecnologias/${item.technology.id}`}>Continuar estudo</Link>
                              </Button>
                              {item.progressId && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => readyMutation.mutate(item.progressId!)}
                                  disabled={readyMutation.isPending}
                                >
                                  Marcar pronto para avaliação
                                </Button>
                              )}
                            </>
                          )}

                          {isCurrent && item.status === ProgressStatus.READY_FOR_ASSESSMENT && (
                            <Button size="sm" asChild>
                              <Link to={`/app/avaliacoes/${item.technology.id}`}>Fazer avaliação</Link>
                            </Button>
                          )}

                          {isCompleted && (
                            <span className="text-sm text-[var(--color-success)]">Concluída</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </AppShell>
  )
}
