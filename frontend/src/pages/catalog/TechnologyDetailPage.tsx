import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { technologiesApi } from '@/api/technologies.api'
import { userApi } from '@/api/user.api'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AppShell, PublicLayout } from '@/components/layout/AppShell'
import { appSidebarSections } from '@/components/layout/Sidebar'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PrerequisiteCard } from '@/components/detail/PrerequisiteCard'
import {
  resolveStudyFocus,
  TechnologyStudyPlan,
  type StudyFocus,
} from '@/components/detail/TechnologyStudyPlan'
import { useAuth } from '@/context/AuthContext'
import {
  formatEstimatedTime,
  getProgressPercentage,
  hasProgress,
} from '@/lib/detail-utils'
import { difficultyLabels } from '@/lib/labels'
import {
  getOpenedResourceIds,
  markResourceOpened,
} from '@/lib/resource-progress'
import { getApiErrorMessage } from '@/lib/utils'
import type { Resource, RoadmapItem, Technology } from '@/types/entities'
import { ProgressStatus, ProjectStatus } from '@/types/enums'

function findTrailContext(roadmap: RoadmapItem[] | undefined, technologyId: string) {
  if (!roadmap?.length) return null
  const index = roadmap.findIndex((item) => item.technology.id === technologyId)
  if (index < 0) return null
  const next = roadmap[index + 1]?.technology
  return {
    position: index + 1,
    total: roadmap.length,
    next: next ? { id: next.id, name: next.name } : null,
    pathTitle: null as string | null,
  }
}

function focusLabel(focus: StudyFocus): string {
  switch (focus.kind) {
    case 'start':
      return 'Começar a estudar'
    case 'resource':
      return `Abrir próximo: ${focus.resource.title}`
    case 'project':
      return 'Ver desafio'
    case 'ready':
      return 'Marcar pronto para avaliação'
    case 'assessment':
      return 'Fazer avaliação'
    case 'next':
      return `Ir para ${focus.name}`
    case 'done':
      return 'Ver minha trilha'
  }
}

function MentorSidebar({
  focus,
  why,
  stage,
}: {
  focus: StudyFocus
  why: string
  stage: { study: string; practice: string; validate: string }
}) {
  return (
    <aside className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 lg:sticky lg:top-24 lg:self-start">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
          Agora
        </p>
        <p className="mt-1.5 text-sm font-semibold leading-snug">{focusLabel(focus)}</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">{why}</p>
      </div>

      <div className="space-y-2 border-t border-[var(--color-border)] pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
          Etapas
        </p>
        <ul className="space-y-1.5 text-sm">
          <li className="flex justify-between gap-2">
            <span>1. Estudar</span>
            <span className="text-[var(--color-muted-foreground)]">{stage.study}</span>
          </li>
          <li className="flex justify-between gap-2">
            <span>2. Praticar</span>
            <span className="text-[var(--color-muted-foreground)]">{stage.practice}</span>
          </li>
          <li className="flex justify-between gap-2">
            <span>3. Validar</span>
            <span className="text-[var(--color-muted-foreground)]">{stage.validate}</span>
          </li>
        </ul>
      </div>

      <Link
        to="/app/trilha"
        className="block text-center text-sm font-medium text-[var(--color-primary)] hover:underline"
      >
        ← Voltar à minha trilha
      </Link>
    </aside>
  )
}

function CatalogView({ tech }: { tech: Technology }) {
  const resources = tech.resources ?? []
  const projects = tech.projects ?? []
  const competencies = tech.competencies ?? []
  const dependencies = tech.dependencies ?? []

  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          to="/tecnologias"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Tecnologias
        </Link>

        <header className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted-foreground)]">
            <span>{difficultyLabels[tech.difficulty]}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatEstimatedTime(tech.estimatedTime)}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{tech.name}</h1>
          <p className="text-base leading-relaxed text-[var(--color-muted-foreground)]">
            {tech.whyLearn || tech.description}
          </p>
          {tech.whenLearn && (
            <p className="text-sm text-[var(--color-muted-foreground)]">
              <span className="font-medium text-[var(--color-foreground)]">Quando estudar: </span>
              {tech.whenLearn}
            </p>
          )}
        </header>

        <div className="mt-8">
          <Button size="lg" asChild>
            <Link
              to="/login"
              state={{ from: { pathname: `/tecnologias/${tech.id}` } }}
            >
              Entrar para estudar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <section className="mt-12 space-y-3 border-t border-[var(--color-border)] pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
            O que você encontra aqui
          </h2>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            {resources.length} recurso{resources.length === 1 ? '' : 's'}
            {projects.length > 0 && ` · ${projects.length} projeto${projects.length === 1 ? '' : 's'}`}
            {competencies.length > 0 &&
              ` · ${competencies.length} competência${competencies.length === 1 ? '' : 's'} na avaliação`}
          </p>
        </section>

        {dependencies.length > 0 && (
          <section className="mt-10 space-y-3">
            <h2 className="font-semibold">Pré-requisitos</h2>
            <div className="space-y-3">
              {dependencies.map((d) => (
                <PrerequisiteCard key={d.prerequisiteTechnologyId} dependency={d} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PublicLayout>
  )
}

export function TechnologyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [openedIds, setOpenedIds] = useState<string[]>(() =>
    id ? getOpenedResourceIds(id) : [],
  )

  useEffect(() => {
    if (id) setOpenedIds(getOpenedResourceIds(id))
  }, [id])

  const { data: tech, isLoading, isError } = useQuery({
    queryKey: ['technology', id],
    queryFn: () => technologiesApi.getById(id!),
    enabled: !!id,
  })

  const { data: progressList } = useQuery({
    queryKey: ['progress'],
    queryFn: () => userApi.getProgress(),
    enabled: isAuthenticated,
  })

  const { data: roadmap } = useQuery({
    queryKey: ['roadmap'],
    queryFn: () => userApi.getRoadmap(),
    enabled: isAuthenticated,
  })

  const { data: userProjects } = useQuery({
    queryKey: ['user-projects'],
    queryFn: () => userApi.getProjects(),
    enabled: isAuthenticated,
  })

  const progress = progressList?.find((p) => p.technologyId === id)
  const trail = id ? findTrailContext(roadmap, id) : null

  const startMutation = useMutation({
    mutationFn: () => userApi.startProgress(id!),
    onSuccess: () => {
      toast.success('Estudo iniciado!')
      void queryClient.invalidateQueries({ queryKey: ['progress'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      void queryClient.invalidateQueries({ queryKey: ['roadmap'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const readyMutation = useMutation({
    mutationFn: () => userApi.markReady(progress!.id),
    onSuccess: () => {
      toast.success('Marcado como pronto para avaliação!')
      void queryClient.invalidateQueries({ queryKey: ['progress'] })
      void queryClient.invalidateQueries({ queryKey: ['roadmap'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const projectMutation = useMutation({
    mutationFn: (projectId: string) => userApi.startProject(projectId),
    onSuccess: () => {
      toast.success('Desafio iniciado! Marque como concluído quando terminar.')
      void queryClient.invalidateQueries({ queryKey: ['user-projects'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const completeProjectMutation = useMutation({
    mutationFn: (userProjectId: string) =>
      userApi.updateProject(userProjectId, ProjectStatus.FINISHED),
    onSuccess: () => {
      toast.success('Prática marcada como concluída!')
      void queryClient.invalidateQueries({ queryKey: ['user-projects'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const handleOpenResource = useCallback(
    (resource: Resource) => {
      if (!id) return
      const next = markResourceOpened(id, resource.id)
      setOpenedIds(next)
    },
    [id],
  )

  const resources = tech?.resources ?? []
  const projects = tech?.projects ?? []
  const competencies = tech?.competencies ?? []
  const dependencies = tech?.dependencies ?? []

  const finishedProjectIds = useMemo(
    () =>
      (userProjects ?? [])
        .filter((p) => p.status === ProjectStatus.FINISHED)
        .map((p) => p.projectId),
    [userProjects],
  )

  const status = progress?.status
  const focus = useMemo(
    () =>
      resolveStudyFocus({
        status,
        resources: tech?.resources ?? [],
        projects: tech?.projects ?? [],
        openedResourceIds: openedIds,
        finishedProjectIds,
        nextTechnology: trail?.next,
      }),
    [status, tech?.resources, tech?.projects, openedIds, finishedProjectIds, trail?.next],
  )

  const progressPercentage =
    progress && hasProgress(progress.status)
      ? getProgressPercentage(progress.status, progress.score)
      : 0

  const stage = {
    study:
      resources.length === 0
        ? '—'
        : `${openedIds.filter((rid) => resources.some((r) => r.id === rid)).length}/${resources.length}`,
    practice:
      projects.length === 0
        ? '—'
        : `${projects.filter((p) => finishedProjectIds.includes(p.id)).length}/${projects.length}`,
    validate:
      status === ProgressStatus.VALIDATED
        ? 'Concluído'
        : status === ProgressStatus.READY_FOR_ASSESSMENT
          ? 'Liberado'
          : 'Pendente',
  }

  const mentorWhy =
    focus.kind === 'resource'
      ? 'Comece pelo material em destaque. Depois avance para o próximo recurso.'
      : focus.kind === 'project'
        ? 'Consolide o aprendizado com um desafio prático antes de validar.'
        : focus.kind === 'ready'
          ? 'Quando sentir domínio das competências, marque pronto e faça a avaliação.'
          : focus.kind === 'assessment'
            ? 'A avaliação cobra as competências listadas no plano.'
            : focus.kind === 'next'
              ? 'Esta etapa está validada. Siga para a próxima tecnologia da trilha.'
              : tech?.whenLearn || 'Inicie para acompanhar progresso e liberar a avaliação.'

  function runPrimaryAction() {
    if (focus.kind === 'start') {
      startMutation.mutate()
      return
    }
    if (focus.kind === 'resource') {
      handleOpenResource(focus.resource)
      return
    }
    if (focus.kind === 'ready' && progress?.id) {
      readyMutation.mutate()
    }
  }

  if (isLoading) {
    if (isAuthenticated) {
      return (
        <AppShell sidebarSections={appSidebarSections}>
          <LoadingSpinner fullPage />
        </AppShell>
      )
    }
    return (
      <PublicLayout>
        <LoadingSpinner fullPage />
      </PublicLayout>
    )
  }

  if (isError || !tech || !id) {
    if (isAuthenticated) {
      return (
        <AppShell sidebarSections={appSidebarSections}>
          <div className="mx-auto max-w-7xl px-4 py-8">
            <EmptyState title="Tecnologia não encontrada" />
          </div>
        </AppShell>
      )
    }
    return (
      <PublicLayout>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <EmptyState title="Tecnologia não encontrada" />
        </div>
      </PublicLayout>
    )
  }

  if (!isAuthenticated) {
    return <CatalogView tech={tech} />
  }

  const canMarkReady =
    (resources.length === 0 || resources.every((r) => openedIds.includes(r.id))) &&
    (projects.length === 0 || projects.every((p) => finishedProjectIds.includes(p.id)))

  const secondaryLink =
    status === ProgressStatus.IN_PROGRESS && progress?.id && canMarkReady ? (
      <button
        type="button"
        className="text-sm font-medium text-[var(--color-muted-foreground)] underline-offset-4 hover:text-[var(--color-foreground)] hover:underline"
        onClick={() => readyMutation.mutate()}
        disabled={readyMutation.isPending}
      >
        {readyMutation.isPending ? 'Salvando...' : 'Marcar pronto para avaliação'}
      </button>
    ) : status === ProgressStatus.READY_FOR_ASSESSMENT ? (
      <a
        href="#detail-content"
        className="text-sm font-medium text-[var(--color-muted-foreground)] underline-offset-4 hover:underline"
      >
        Revisar recursos
      </a>
    ) : status === ProgressStatus.VALIDATED ? (
      <Link
        to="/app/trilha"
        className="text-sm font-medium text-[var(--color-muted-foreground)] underline-offset-4 hover:underline"
      >
        Revisar trilha
      </Link>
    ) : null

  return (
    <AppShell sidebarSections={appSidebarSections}>
      <div className="mx-auto max-w-7xl animate-fade-in-up">
        <Link
          to="/app/trilha"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Minha trilha
          {trail && (
            <span className="font-normal text-[var(--color-muted-foreground)]">
              · passo {trail.position} de {trail.total}
            </span>
          )}
        </Link>

        <header className="mt-6 space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{tech.name}</h1>
                {status && <StatusBadge status={status} />}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted-foreground)]">
                <span>{difficultyLabels[tech.difficulty]}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {formatEstimatedTime(tech.estimatedTime)}
                </span>
                {progressPercentage > 0 && (
                  <>
                    <span>·</span>
                    <span>{progressPercentage}% concluído</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {progressPercentage > 0 && (
            <Progress value={progressPercentage} className="h-2 max-w-md" />
          )}

          <details className="max-w-3xl rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/25 px-5 py-3 group">
            <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-primary)] marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="inline-flex w-full items-center justify-between gap-2">
                Por que estudar isso agora
                <span className="text-xs font-normal text-[var(--color-muted-foreground)] group-open:hidden">
                  ver
                </span>
                <span className="hidden text-xs font-normal text-[var(--color-muted-foreground)] group-open:inline">
                  ocultar
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed">
              {tech.whyLearn || tech.description}
            </p>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
              {trail ? (
                <>
                  Passo {trail.position} de {trail.total}
                  {trail.next ? (
                    <>
                      {' '}
                      · depois: <span className="font-medium text-[var(--color-foreground)]">{trail.next.name}</span>
                    </>
                  ) : (
                    ' · última da trilha'
                  )}
                </>
              ) : tech.whenLearn ? (
                tech.whenLearn
              ) : null}
            </p>
          </details>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {focus.kind === 'resource' ? (
              <Button size="lg" asChild>
                <a
                  href={focus.resource.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleOpenResource(focus.resource)}
                >
                  {focusLabel(focus)}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            ) : focus.kind === 'project' ? (
              <Button size="lg" asChild>
                <Link to={`/app/desafios/${focus.project.id}`}>
                  Ver desafio
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : focus.kind === 'assessment' ? (
              <Button size="lg" asChild>
                <Link to={`/app/avaliacoes/${tech.id}`}>
                  Fazer avaliação
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : focus.kind === 'next' ? (
              <Button size="lg" asChild>
                <Link to={`/tecnologias/${focus.technologyId}`}>
                  Ir para {focus.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : focus.kind === 'done' ? (
              <Button size="lg" asChild>
                <Link to="/app/trilha">
                  Ver minha trilha
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={runPrimaryAction}
                disabled={
                  startMutation.isPending ||
                  readyMutation.isPending ||
                  projectMutation.isPending
                }
              >
                {(startMutation.isPending || readyMutation.isPending || projectMutation.isPending)
                  ? 'Salvando...'
                  : focusLabel(focus)}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            {secondaryLink}
          </div>
        </header>

        {dependencies.length > 0 && (
          <section className="mt-10 space-y-3">
            <h2 className="font-semibold">Pré-requisitos</h2>
            <div className="space-y-3">
              {dependencies.map((d) => (
                <PrerequisiteCard key={d.prerequisiteTechnologyId} dependency={d} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 flex flex-col gap-10 xl:flex-row xl:gap-12">
          <div className="min-w-0 flex-1">
            <TechnologyStudyPlan
              technologyId={tech.id}
              resources={resources}
              projects={projects}
              competencies={competencies}
              openedResourceIds={openedIds}
              onOpenResource={handleOpenResource}
              userProjects={userProjects}
              onStartProject={(projectId) => projectMutation.mutate(projectId)}
              onCompleteProject={(userProjectId) => completeProjectMutation.mutate(userProjectId)}
              onMarkReady={() => readyMutation.mutate()}
              markingReady={readyMutation.isPending}
              startingProjectId={projectMutation.isPending ? projectMutation.variables ?? null : null}
              completingProjectId={
                completeProjectMutation.isPending ? completeProjectMutation.variables ?? null : null
              }
              status={status}
            />
          </div>
          <div className="xl:w-[18rem] xl:shrink-0">
            <MentorSidebar
              focus={focus}
              why={mentorWhy}
              stage={stage}
            />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
