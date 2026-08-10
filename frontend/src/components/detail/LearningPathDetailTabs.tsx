import { Layers, BookOpen, FolderKanban, Award } from 'lucide-react'
import { DetailTabs } from '@/components/detail/DetailTabs'
import { EmptyState } from '@/components/shared/EmptyState'
import { ResourceCard } from '@/components/detail/ResourceCard'
import { ProjectCard } from '@/components/detail/ProjectCard'
import { SkillBadge } from '@/components/detail/SkillBadge'
import { TechnologyListCard } from '@/components/detail/TechnologyListCard'
import type { LearningPathTechnology, UserTechnologyProgress } from '@/types/entities'

interface LearningPathDetailTabsProps {
  technologies: LearningPathTechnology[]
  progressList?: UserTechnologyProgress[]
}

export function LearningPathDetailTabs({
  technologies,
  progressList = [],
}: LearningPathDetailTabsProps) {
  const sorted = [...technologies].sort((a, b) => a.order - b.order)

  const allResources = sorted.flatMap((t) => t.technology?.resources ?? [])
  const allProjects = sorted.flatMap((t) => t.technology?.projects ?? [])
  const competencyTitles = [
    ...new Set(
      sorted.flatMap((t) => (t.technology?.competencies ?? []).map((c) => c.title)),
    ),
  ]

  return (
    <DetailTabs
      defaultValue="technologies"
      tabs={[
        {
          value: 'technologies',
          label: 'Tecnologias',
          icon: Layers,
          count: sorted.length,
          content: sorted.length > 0 ? (
            <div className="space-y-4">
              {sorted.map((item, index) => {
                if (!item.technology) return null
                const progress = progressList.find((p) => p.technologyId === item.technologyId)
                return (
                  <TechnologyListCard
                    key={item.technologyId}
                    technology={item.technology}
                    order={index + 1}
                    status={progress?.status}
                    to={`/tecnologias/${item.technologyId}`}
                  />
                )
              })}
            </div>
          ) : (
            <EmptyState
              emoji="🗺️"
              title="Nenhuma tecnologia nesta trilha"
              description="Esta trilha ainda não possui tecnologias cadastradas."
            />
          ),
        },
        {
          value: 'resources',
          label: 'Recursos',
          icon: BookOpen,
          count: allResources.length,
          content: allResources.length > 0 ? (
            <div className="space-y-4">
              {allResources.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          ) : (
            <EmptyState
              emoji="📚"
              title="Nenhum recurso disponível"
              description="Explore as tecnologias individuais para acessar recursos de aprendizado."
            />
          ),
        },
        {
          value: 'projects',
          label: 'Projetos',
          icon: FolderKanban,
          count: allProjects.length,
          content: allProjects.length > 0 ? (
            <div className="space-y-4">
              {allProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              emoji="🚀"
              title="Nenhum projeto sugerido"
              description="Projetos práticos estarão disponíveis nas tecnologias desta trilha."
            />
          ),
        },
        {
          value: 'competencies',
          label: 'Competências',
          icon: Award,
          count: competencyTitles.length,
          content: competencyTitles.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {competencyTitles.map((title) => (
                <SkillBadge key={title} label={title} />
              ))}
            </div>
          ) : (
            <EmptyState
              emoji="🎯"
              title="Nenhuma competência cadastrada"
              description="As competências serão exibidas conforme forem definidas nas tecnologias."
            />
          ),
        },
      ]}
    />
  )
}
