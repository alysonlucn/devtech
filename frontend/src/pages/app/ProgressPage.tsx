import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/api/user.api'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AppShell } from '@/components/layout/AppShell'
import { appSidebarSections } from '@/components/layout/Sidebar'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'

export function ProgressPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['progress'],
    queryFn: () => userApi.getProgress(),
  })

  return (
    <AppShell sidebarSections={appSidebarSections} title="Área do aluno">
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
        <div className="space-y-3">
          {data.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link to={`/tecnologias/${item.technologyId}`} className="font-medium hover:underline">
                    {item.technology?.name ?? item.technologyId}
                  </Link>
                  {item.score !== null && (
                    <p className="text-sm text-[var(--color-muted-foreground)]">Nota: {item.score}</p>
                  )}
                </div>
                <StatusBadge status={item.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  )
}
