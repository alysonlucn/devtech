import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userApi } from '@/api/user.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { AppShell } from '@/components/layout/AppShell'
import { appSidebarSections } from '@/components/layout/Sidebar'
import { DifficultyBadge } from '@/components/shared/DifficultyBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { projectStatusLabels } from '@/lib/labels'
import { getApiErrorMessage } from '@/lib/utils'
import { ProjectStatus } from '@/types/enums'

export function ProjectsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['user-projects'],
    queryFn: () => userApi.getProjects(),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProjectStatus }) =>
      userApi.updateProject(id, status),
    onSuccess: () => {
      toast.success('Projeto atualizado!')
      void queryClient.invalidateQueries({ queryKey: ['user-projects'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  return (
    <AppShell sidebarSections={appSidebarSections} title="Área do aluno">
      <PageHeader title="Meus projetos" description="Projetos práticos vinculados às tecnologias." />

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      )}

      {isError && <EmptyState title="Erro ao carregar projetos" />}

      {data && data.length === 0 && (
        <EmptyState title="Nenhum projeto iniciado" description="Inicie projetos a partir das páginas de tecnologia." />
      )}

      {data && data.length > 0 && (
        <div className="space-y-4">
          {data.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-base">{item.project?.title ?? 'Projeto'}</CardTitle>
                {item.project?.technology && (
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {item.project.technology.name}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {item.project?.description && (
                  <p className="text-sm line-clamp-3">
                    {item.project.description
                      .split('\n')
                      .find((line) => line.trim() && !line.startsWith('#')) ?? item.project.description}
                  </p>
                )}
                {item.project?.difficulty && (
                  <DifficultyBadge difficulty={item.project.difficulty} />
                )}
                <div className="flex flex-wrap items-center gap-3">
                  {item.project && (
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/app/desafios/${item.project.id}`}>Ver desafio</Link>
                    </Button>
                  )}
                  <Select
                    value={item.status}
                    onValueChange={(status) =>
                      updateMutation.mutate({ id: item.id, status: status as ProjectStatus })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(projectStatusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  )
}
