import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { learningPathsApi } from '@/api/learning-paths.api'
import { userApi } from '@/api/user.api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PublicLayout } from '@/components/layout/AppShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { DetailPageLayout } from '@/components/detail/DetailPageLayout'
import { DetailSidebar } from '@/components/detail/DetailSidebar'
import { LearningSection } from '@/components/detail/DetailPageLayout'
import { PageHero } from '@/components/detail/PageHero'
import { LearningPathDetailTabs } from '@/components/detail/LearningPathDetailTabs'
import {
  LearningPathProgressActions,
} from '@/components/detail/DetailProgressActions'
import { useAuth } from '@/context/AuthContext'
import {
  aggregateTechnologyStats,
  calculatePathProgress,
  collectCompetencyTitles,
  formatEstimatedTime,
  hasProgress,
} from '@/lib/detail-utils'
import type { Technology } from '@/types/entities'
import { ProgressStatus } from '@/types/enums'

export function LearningPathDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated, profile } = useAuth()

  const pathQuery = useQuery({
    queryKey: ['learning-path', id],
    queryFn: () => learningPathsApi.getById(id!),
    enabled: !!id,
  })

  const techQuery = useQuery({
    queryKey: ['learning-path-technologies', id],
    queryFn: () => learningPathsApi.getTechnologies(id!),
    enabled: !!id,
  })

  const { data: progressList } = useQuery({
    queryKey: ['progress'],
    queryFn: () => userApi.getProgress(),
    enabled: isAuthenticated,
  })

  if (pathQuery.isLoading) return <PublicLayout><LoadingSpinner fullPage /></PublicLayout>
  if (pathQuery.isError || !pathQuery.data) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <EmptyState title="Trilha não encontrada" />
        </div>
      </PublicLayout>
    )
  }

  const path = pathQuery.data
  const technologies = techQuery.data ?? []
  const sorted = [...technologies].sort((a, b) => a.order - b.order)
  const techList = sorted
    .map((t) => t.technology)
    .filter((t): t is Technology => t !== undefined)
  const stats = aggregateTechnologyStats(techList)
  const learningItems = collectCompetencyTitles(techList)

  const technologyIds = sorted.map((t) => t.technologyId)
  const pathProgress =
    isAuthenticated && progressList
      ? calculatePathProgress(technologyIds, progressList)
      : undefined

  const isCurrentPath = profile?.learningPathId === path.id
  const hasStarted =
    isAuthenticated &&
    progressList !== undefined &&
    technologyIds.some((techId) => {
      const p = progressList.find((pr) => pr.technologyId === techId)
      return p && hasProgress(p.status)
    })

  const hasAssessmentReady =
    isAuthenticated &&
    progressList !== undefined &&
    technologyIds.some((techId) => {
      const p = progressList.find((pr) => pr.technologyId === techId)
      return (
        p?.status === ProgressStatus.IN_PROGRESS ||
        p?.status === ProgressStatus.READY_FOR_ASSESSMENT
      )
    })

  const sidebarItems = [
    { label: 'Tecnologias', value: sorted.length },
    { label: 'Tempo estimado', value: formatEstimatedTime(stats.estimatedTime) },
    { label: 'Recursos', value: stats.resourcesCount },
    { label: 'Projetos', value: stats.projectsCount },
    { label: 'Competências', value: stats.competenciesCount },
    {
      label: 'Avaliação',
      value: hasAssessmentReady ? 'Disponível' : 'Indisponível',
    },
  ]

  return (
    <PublicLayout>
      <DetailPageLayout
        hero={
          <PageHero
            backTo="/trilhas"
            backLabel="Voltar"
            badges={
              <>
                <Badge variant="outline">Trilha</Badge>
                <Badge variant="secondary">{sorted.length} tecnologias</Badge>
              </>
            }
            title={path.title}
            description={path.description}
            estimatedTime={stats.estimatedTime}
            resourcesCount={stats.resourcesCount}
            projectsCount={stats.projectsCount}
            competenciesCount={stats.competenciesCount}
            progressPercentage={pathProgress && pathProgress > 0 ? pathProgress : undefined}
            actions={
              <>
                <LearningPathProgressActions
                  learningPathId={path.id}
                  isCurrentPath={isCurrentPath}
                  hasStarted={hasStarted}
                />
                {hasAssessmentReady && (
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/app/trilha">Fazer avaliação</Link>
                  </Button>
                )}
              </>
            }
          />
        }
        sidebar={
          <DetailSidebar
            items={sidebarItems}
            progressPercentage={pathProgress && pathProgress > 0 ? pathProgress : undefined}
          />
        }
      >
        <LearningSection items={learningItems} />
        <div id="detail-content">
          {techQuery.isLoading ? (
            <EmptyState title="Carregando conteúdo..." />
          ) : (
            <LearningPathDetailTabs
              technologies={sorted}
              progressList={progressList}
            />
          )}
        </div>
      </DetailPageLayout>
    </PublicLayout>
  )
}
