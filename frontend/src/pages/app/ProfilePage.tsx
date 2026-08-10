import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { learningPathsApi } from '@/api/learning-paths.api'
import { userApi } from '@/api/user.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { AppShell } from '@/components/layout/AppShell'
import { appSidebarSections } from '@/components/layout/Sidebar'
import { PageHeader } from '@/components/shared/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { getApiErrorMessage } from '@/lib/utils'

export function ProfilePage() {
  const { user, profile, streak, refreshUser } = useAuth()
  const queryClient = useQueryClient()

  const { data: paths, isLoading } = useQuery({
    queryKey: ['learning-paths'],
    queryFn: () => learningPathsApi.list({ limit: 50 }),
  })

  const setPathMutation = useMutation({
    mutationFn: (learningPathId: string) => userApi.setLearningPath(learningPathId),
    onSuccess: async () => {
      toast.success('Trilha atualizada!')
      await refreshUser()
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      void queryClient.invalidateQueries({ queryKey: ['roadmap'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  return (
    <AppShell sidebarSections={appSidebarSections} title="Área do aluno">
      <PageHeader title="Perfil" description="Suas informações e configurações." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Dados pessoais</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="font-medium">Nome:</span> {user?.name}</p>
            <p><span className="font-medium">E-mail:</span> {user?.email}</p>
            <p><span className="font-medium">Função:</span> {user?.role === 'ADMIN' ? 'Administrador' : 'Usuário'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Estatísticas</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="font-medium">XP:</span> {profile?.totalXp ?? 0}</p>
            <p><span className="font-medium">Sequência atual:</span> {streak?.currentStreak ?? 0} dias</p>
            <p><span className="font-medium">Maior sequência:</span> {streak?.longestStreak ?? 0} dias</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Trilha de aprendizado</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-full max-w-sm" />
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Select
                  value={profile?.learningPathId ?? ''}
                  onValueChange={(id) => setPathMutation.mutate(id)}
                >
                  <SelectTrigger className="max-w-sm">
                    <SelectValue placeholder="Selecione uma trilha" />
                  </SelectTrigger>
                  <SelectContent>
                    {paths?.data.map((path) => (
                      <SelectItem key={path.id} value={path.id}>{path.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {setPathMutation.isPending && (
                  <Button variant="ghost" disabled>Salvando...</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
