import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, Rocket } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { resourceTypeLabels } from '@/lib/labels'
import { cn } from '@/lib/utils'
import type { Competency, ProjectSuggestion, Resource } from '@/types/entities'
import { ProgressStatus } from '@/types/enums'

export type StudyFocus =
  | { kind: 'start' }
  | { kind: 'resource'; resource: Resource }
  | { kind: 'project'; project: ProjectSuggestion }
  | { kind: 'ready' }
  | { kind: 'assessment' }
  | { kind: 'next'; technologyId: string; name: string }
  | { kind: 'done' }

export type StudyStage = 'study' | 'practice' | 'validate'

const STAGES: { id: StudyStage; label: string; number: number }[] = [
  { id: 'study', label: 'Estudar', number: 1 },
  { id: 'practice', label: 'Praticar', number: 2 },
  { id: 'validate', label: 'Validar', number: 3 },
]

interface TechnologyStudyPlanProps {
  technologyId: string
  resources: Resource[]
  projects: ProjectSuggestion[]
  competencies: Competency[]
  openedResourceIds: string[]
  onOpenResource: (resource: Resource) => void
  onStartProject?: (projectId: string) => void
  onMarkReady?: () => void
  markingReady?: boolean
  startingProjectId?: string | null
  status?: ProgressStatus
  className?: string
}

export function resolveStudyFocus(params: {
  status?: ProgressStatus
  resources: Resource[]
  projects: ProjectSuggestion[]
  openedResourceIds: string[]
  nextTechnology?: { id: string; name: string } | null
}): StudyFocus {
  const { status, resources, projects, openedResourceIds, nextTechnology } = params

  if (!status || status === ProgressStatus.NOT_STARTED) {
    return { kind: 'start' }
  }

  if (status === ProgressStatus.VALIDATED) {
    if (nextTechnology) {
      return { kind: 'next', technologyId: nextTechnology.id, name: nextTechnology.name }
    }
    return { kind: 'done' }
  }

  if (status === ProgressStatus.READY_FOR_ASSESSMENT) {
    return { kind: 'assessment' }
  }

  const nextResource = resources.find((r) => !openedResourceIds.includes(r.id))
  if (nextResource) return { kind: 'resource', resource: nextResource }

  if (projects.length > 0) return { kind: 'project', project: projects[0] }

  return { kind: 'ready' }
}

export function focusToStage(focus: StudyFocus): StudyStage {
  switch (focus.kind) {
    case 'start':
    case 'resource':
      return 'study'
    case 'project':
      return 'practice'
    case 'ready':
    case 'assessment':
    case 'next':
    case 'done':
      return 'validate'
  }
}

export function TechnologyStudyPlan({
  technologyId,
  resources,
  projects,
  competencies,
  openedResourceIds,
  onOpenResource,
  onStartProject,
  onMarkReady,
  markingReady,
  startingProjectId,
  status,
  className,
}: TechnologyStudyPlanProps) {
  const focus = resolveStudyFocus({
    status,
    resources,
    projects,
    openedResourceIds,
  })
  const suggestedStage = focusToStage(focus)
  const [activeStage, setActiveStage] = useState<StudyStage>(suggestedStage)

  useEffect(() => {
    setActiveStage(suggestedStage)
  }, [suggestedStage, technologyId])

  const openedCount = resources.filter((r) => openedResourceIds.includes(r.id)).length
  const studyDone = resources.length === 0 || openedCount >= resources.length
  const validateDone = status === ProgressStatus.VALIDATED

  const stageProgress: Record<StudyStage, string> = {
    study: resources.length > 0 ? `${openedCount}/${resources.length}` : '—',
    practice: projects.length > 0 ? `0/${projects.length}` : '—',
    validate:
      status === ProgressStatus.VALIDATED
        ? 'OK'
        : status === ProgressStatus.READY_FOR_ASSESSMENT
          ? 'Liberado'
          : 'Pendente',
  }

  const doneFlags: Record<StudyStage, boolean> = {
    study: studyDone && !!status && status !== ProgressStatus.NOT_STARTED,
    practice:
      (projects.length === 0 && studyDone && !!status && status !== ProgressStatus.NOT_STARTED) ||
      status === ProgressStatus.READY_FOR_ASSESSMENT ||
      status === ProgressStatus.VALIDATED,
    validate: validateDone,
  }

  const activeIndex = STAGES.findIndex((s) => s.id === activeStage)

  function goPrev() {
    if (activeIndex > 0) setActiveStage(STAGES[activeIndex - 1].id)
  }

  function goNext() {
    if (activeIndex < STAGES.length - 1) setActiveStage(STAGES[activeIndex + 1].id)
  }

  return (
    <section id="detail-content" className={cn('space-y-5', className)}>
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          Plano de estudo
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Uma etapa de cada vez — avance quando estiver pronto.
        </p>
      </div>

      <div
        className="flex gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-1"
        role="tablist"
        aria-label="Etapas do plano"
      >
        {STAGES.map((stage) => {
          const isActive = activeStage === stage.id
          const isSuggested = suggestedStage === stage.id
          return (
            <button
              key={stage.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveStage(stage.id)}
              className={cn(
                'relative flex flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-2.5 text-center transition-colors sm:flex-row sm:justify-center sm:gap-2',
                isActive
                  ? 'bg-[var(--color-card)] text-[var(--color-foreground)] shadow-sm'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                  doneFlags[stage.id]
                    ? 'bg-[var(--color-success)] text-white'
                    : isActive
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-border)] text-[var(--color-muted-foreground)]',
                )}
              >
                {doneFlags[stage.id] ? '✓' : stage.number}
              </span>
              <span className="text-xs font-semibold sm:text-sm">{stage.label}</span>
              <span className="hidden text-[10px] text-[var(--color-muted-foreground)] sm:inline">
                {stageProgress[stage.id]}
              </span>
              {isSuggested && !isActive && (
                <span className="absolute -top-1 right-1 h-2 w-2 rounded-full bg-[var(--color-primary)]" title="Etapa sugerida" />
              )}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        className="min-h-[14rem] rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:p-5"
      >
        {activeStage === 'study' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">1. Estudar</h3>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                Abra os materiais na ordem. O destaque é o próximo da fila.
              </p>
            </div>
            {resources.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-muted-foreground)]">
                Nenhum recurso cadastrado — avance para Praticar.
              </p>
            ) : (
              <ul className="space-y-2">
                {resources.map((resource, index) => {
                  const opened = openedResourceIds.includes(resource.id)
                  const isFirstIncomplete =
                    !opened &&
                    resources.findIndex((r) => !openedResourceIds.includes(r.id)) === index
                  const isFocus =
                    focus.kind === 'resource' && focus.resource.id === resource.id

                  return (
                    <li
                      key={resource.id}
                      className={cn(
                        'flex flex-col gap-3 rounded-xl border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between',
                        isFocus || isFirstIncomplete
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-2 ring-[var(--color-primary)]/15'
                          : opened
                            ? 'border-[var(--color-border)] bg-[var(--color-muted)]/20 opacity-70'
                            : 'border-[var(--color-border)]',
                      )}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              'inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold',
                              opened
                                ? 'border-[var(--color-success)] bg-[var(--color-success)] text-white'
                                : 'border-[var(--color-border)] text-[var(--color-muted-foreground)]',
                            )}
                          >
                            {opened ? '✓' : index + 1}
                          </span>
                          <p className="font-medium">{resource.title}</p>
                          {(isFocus || isFirstIncomplete) && !opened && (
                            <span className="rounded-md bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                              Comece por aqui
                            </span>
                          )}
                        </div>
                        <p className="mt-1 pl-7 text-sm text-[var(--color-muted-foreground)]">
                          {resourceTypeLabels[resource.type]}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={isFocus || isFirstIncomplete ? 'default' : 'outline'}
                        className="shrink-0"
                        asChild
                      >
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => onOpenResource(resource)}
                        >
                          Abrir
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}

        {activeStage === 'practice' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">2. Praticar</h3>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                Consolide o que estudou com um desafio real.
              </p>
            </div>
            {projects.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-muted-foreground)]">
                Sem projeto sugerido — vá para Validar quando se sentir pronto.
              </p>
            ) : (
              <ul className="space-y-2">
                {projects.map((project) => {
                  const isFocus = focus.kind === 'project' && focus.project.id === project.id
                  return (
                    <li
                      key={project.id}
                      className={cn(
                        'rounded-xl border px-4 py-4',
                        isFocus
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-2 ring-[var(--color-primary)]/15'
                          : 'border-[var(--color-border)]',
                      )}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]">
                            <Rocket className="h-4 w-4 text-[var(--color-primary)]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium">{project.title}</p>
                            <p className="mt-1 text-sm text-[var(--color-muted-foreground)] line-clamp-2">
                              {project.description.split('\n').find((line) => line.trim() && !line.startsWith('#')) ??
                                project.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:justify-end">
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/app/desafios/${project.id}`}>Ver desafio</Link>
                          </Button>
                          {onStartProject ? (
                            <Button
                              size="sm"
                              variant={isFocus ? 'default' : 'secondary'}
                              disabled={startingProjectId === project.id}
                              onClick={() => onStartProject(project.id)}
                            >
                              {startingProjectId === project.id ? 'Iniciando...' : 'Começar'}
                            </Button>
                          ) : (
                            <Button size="sm" asChild>
                              <Link to={`/app/desafios/${project.id}`}>Começar</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}

        {activeStage === 'validate' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">3. Validar</h3>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                A avaliação cobra as competências abaixo.
              </p>
            </div>
            <div
              className={cn(
                'rounded-xl border px-4 py-4',
                focus.kind === 'assessment' || focus.kind === 'ready'
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-2 ring-[var(--color-primary)]/15'
                  : 'border-[var(--color-border)]',
              )}
            >
              <p className="font-medium">Avaliação de competências</p>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                {status === ProgressStatus.VALIDATED
                  ? 'Você já validou esta tecnologia.'
                  : status === ProgressStatus.READY_FOR_ASSESSMENT
                    ? 'Liberada — envie suas respostas quando quiser.'
                    : status === ProgressStatus.IN_PROGRESS
                      ? 'Quando se sentir preparado, marque pronto e faça a avaliação.'
                      : 'Comece a estudar para desbloquear a validação.'}
              </p>

              {competencies.length > 0 && (
                <ul className="mt-4 space-y-1.5">
                  {competencies.map((c) => (
                    <li key={c.id} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                      {c.title}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {status === ProgressStatus.IN_PROGRESS && onMarkReady && (
                  <Button
                    size="sm"
                    onClick={onMarkReady}
                    disabled={markingReady}
                  >
                    {markingReady ? 'Salvando...' : 'Pronto para avaliação'}
                  </Button>
                )}
                {status === ProgressStatus.READY_FOR_ASSESSMENT && (
                  <Button size="sm" asChild>
                    <Link to={`/app/avaliacoes/${technologyId}`}>Fazer avaliação</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={goPrev}
          disabled={activeIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <p className="text-xs text-[var(--color-muted-foreground)]">
          Etapa {activeIndex + 1} de {STAGES.length}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={goNext}
          disabled={activeIndex === STAGES.length - 1}
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}
