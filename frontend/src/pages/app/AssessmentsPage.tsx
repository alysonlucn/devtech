import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { technologiesApi } from '@/api/technologies.api'
import { userApi } from '@/api/user.api'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AppShell } from '@/components/layout/AppShell'
import { appSidebarSections } from '@/components/layout/Sidebar'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { TechnologyAvatar } from '@/components/shared/TechnologyAvatar'
import { cn, formatDate } from '@/lib/utils'

export function AssessmentsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => userApi.getAssessments(),
  })

  const { data: technologies } = useQuery({
    queryKey: ['technologies', 'assessments-lookup'],
    queryFn: () => technologiesApi.list({ limit: 200 }),
  })

  const techById = new Map((technologies?.data ?? []).map((tech) => [tech.id, tech]))

  return (
    <AppShell sidebarSections={appSidebarSections}>
      <div className="mx-auto max-w-3xl">
        <PageHeader title="Avaliações" description="Histórico das suas avaliações de competência." />

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
          </div>
        )}

        {isError && <EmptyState title="Erro ao carregar avaliações" />}

        {data && data.length === 0 && (
          <EmptyState title="Nenhuma avaliação realizada" description="Complete uma tecnologia e faça a avaliação." />
        )}

        {data && data.length > 0 && (
          <div className="space-y-3">
            {data.map((assessment) => {
              const tech = techById.get(assessment.technologyId)
              const passed = assessment.score >= 70
              return (
                <Card key={assessment.id}>
                  <CardContent className="py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        {tech && (
                          <TechnologyAvatar
                            name={tech.name}
                            slug={tech.slug}
                            category={tech.category}
                            size="sm"
                          />
                        )}
                        <div>
                          <Link to={`/tecnologias/${assessment.technologyId}`} className="font-medium hover:underline">
                            {tech?.name ?? 'Tecnologia'}
                          </Link>
                          <p className="text-sm text-[var(--color-muted-foreground)]">
                            {formatDate(assessment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                            passed
                              ? 'bg-[var(--color-success)]/15 text-[var(--color-success-foreground)]'
                              : 'bg-[var(--color-warning)]/18 text-[var(--color-warning-foreground)]',
                          )}
                        >
                          {passed ? 'Aprovado' : 'Revisar'} · {assessment.score}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">{assessment.feedback}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
