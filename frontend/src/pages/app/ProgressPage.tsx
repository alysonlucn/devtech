import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/api/user.api'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { AppShell } from '@/components/layout/AppShell'
import { appSidebarSections } from '@/components/layout/Sidebar'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { TechnologyAvatar } from '@/components/shared/TechnologyAvatar'
import { ProgressStatus } from '@/types/enums'

export function ProgressPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['progress'],
    queryFn: () => userApi.getProgress(),
  })

  const validated = data?.filter((item) => item.status === ProgressStatus.VALIDATED).length ?? 0
  const total = data?.length ?? 0
  const pct = total > 0 ? Math.round((validated / total) * 100) : 0

  return (
    <AppShell sidebarSections={appSidebarSections}>
      <div className="mx-auto max-w-3xl">
        <PageHeader title="Progresso" description="Acompanhe o status de cada tecnologia." />

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
          </div>
        )}

        {isError && <EmptyState title="Erro ao carregar progresso" />}

        {data && data.length === 0 && (
          <EmptyState title="Nenhum progresso registrado" description="Inicie uma tecnologia para começar." />
        )}

        {data && data.length > 0 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">{validated} de {total} validadas</span>
                <span className="tabular-nums text-[var(--color-muted-foreground)]">{pct}%</span>
              </div>
              <Progress value={pct} variant="success" className="h-2.5" />
            </div>

            {data.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    {item.technology && (
                      <TechnologyAvatar
                        name={item.technology.name}
                        slug={item.technology.slug}
                        category={item.technology.category}
                        size="sm"
                      />
                    )}
                    <div className="min-w-0">
                      <Link to={`/tecnologias/${item.technologyId}`} className="font-medium hover:underline">
                        {item.technology?.name ?? item.technologyId}
                      </Link>
                      {item.score !== null && (
                        <p className="text-sm text-[var(--color-muted-foreground)]">Nota: {item.score}</p>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
