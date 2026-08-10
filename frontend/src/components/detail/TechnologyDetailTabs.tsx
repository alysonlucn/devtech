import { BookOpen, FolderKanban, Award, GitBranch } from 'lucide-react'
import { DetailTabs } from '@/components/detail/DetailTabs'
import { EmptyState } from '@/components/shared/EmptyState'
import { ResourceCard } from '@/components/detail/ResourceCard'
import { ProjectCard } from '@/components/detail/ProjectCard'
import { SkillBadge } from '@/components/detail/SkillBadge'
import { PrerequisiteCard } from '@/components/detail/PrerequisiteCard'
import type { Technology } from '@/types/entities'

interface TechnologyDetailTabsProps {
  technology: Technology
}

export function TechnologyDetailTabs({ technology }: TechnologyDetailTabsProps) {
  const resources = technology.resources ?? []
  const projects = technology.projects ?? []
  const competencies = technology.competencies ?? []
  const dependencies = technology.dependencies ?? []

  return (
    <DetailTabs
      defaultValue="resources"
      tabs={[
        {
          value: 'resources',
          label: 'Recursos',
          icon: BookOpen,
          count: resources.length,
          content: resources.length > 0 ? (
            <div className="space-y-4">
              {resources.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          ) : (
            <EmptyState
              emoji="📚"
              title="Nenhum recurso disponível"
              description="Os recursos de aprendizado serão adicionados em breve."
            />
          ),
        },
        {
          value: 'projects',
          label: 'Projetos',
          icon: FolderKanban,
          count: projects.length,
          content: projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              emoji="🚀"
              title="Nenhum projeto sugerido"
              description="Projetos práticos ajudam a consolidar o aprendizado. Volte em breve!"
            />
          ),
        },
        {
          value: 'competencies',
          label: 'Competências',
          icon: Award,
          count: competencies.length,
          content: competencies.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {competencies.map((c) => (
                <SkillBadge key={c.id} label={c.title} />
              ))}
            </div>
          ) : (
            <EmptyState
              emoji="🎯"
              title="Nenhuma competência cadastrada"
              description="As competências desta tecnologia serão definidas em breve."
            />
          ),
        },
        {
          value: 'dependencies',
          label: 'Pré-requisitos',
          icon: GitBranch,
          count: dependencies.length,
          content: dependencies.length > 0 ? (
            <div className="space-y-4">
              {dependencies.map((d) => (
                <PrerequisiteCard key={d.prerequisiteTechnologyId} dependency={d} />
              ))}
            </div>
          ) : (
            <EmptyState
              emoji="🎉"
              title="Nenhum pré-requisito"
              description="Você pode começar agora."
            />
          ),
        },
      ]}
    />
  )
}
