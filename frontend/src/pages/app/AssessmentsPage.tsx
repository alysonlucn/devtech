import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/api/user.api'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AppShell } from '@/components/layout/AppShell'
import { appSidebarSections } from '@/components/layout/Sidebar'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { formatDate } from '@/lib/utils'

export function AssessmentsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => userApi.getAssessments(),
  })

  return (
    <AppShell sidebarSections={appSidebarSections} title="Área do aluno">
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
          {data.map((assessment) => (
            <Card key={assessment.id}>
              <CardContent className="py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link to={`/tecnologias/${assessment.technologyId}`} className="font-medium hover:underline">
                      Tecnologia
                    </Link>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      {formatDate(assessment.createdAt)} · Nota: {assessment.score}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold ${assessment.score >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {assessment.score >= 70 ? 'Aprovado' : 'Revisar'}
                  </span>
                </div>
                <p className="mt-2 text-sm">{assessment.feedback}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  )
}
