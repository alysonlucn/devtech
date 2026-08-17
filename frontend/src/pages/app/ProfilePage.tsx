import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Flame, Star, Zap } from 'lucide-react'
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
import { StatCard } from '@/components/shared/StatCard'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { useAuth } from '@/context/AuthContext'
import { getLevelInfo } from '@/lib/gamification'
import { getApiErrorMessage } from '@/lib/utils'

export function ProfilePage() {
  const { user, profile, streak, refreshUser } = useAuth()
  const queryClient = useQueryClient()
  const levelInfo = profile ? getLevelInfo(profile.totalXp) : null

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

  const currentPath = paths?.data.find((path) => path.id === profile?.learningPathId)

  return (
    <AppShell sidebarSections={appSidebarSections}>
      <PageHeader title="Perfil" description="Suas informações, progresso e trilha." />

      <Card className="mb-6 overflow-hidden">
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          {user?.name && <UserAvatar name={user.name} size="lg" />}
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-sm text-[var(--color-muted-foreground)]">{user?.email}</p>
            <p className="mt-2 text-sm">
              {user?.role === 'ADMIN' ? 'Administrador' : 'Aluno'}
              {currentPath ? ` · ${currentPath.title}` : ''}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Nível"
          value={`Nv. ${levelInfo?.level ?? 1}`}
          subtitle={levelInfo?.title}
          icon={Zap}
          iconClassName="text-[var(--color-xp-foreground)]"
          progress={levelInfo?.progressToNext}
          progressVariant="xp"
          highlight
        />
        <StatCard
          label="XP total"
          value={profile?.totalXp ?? 0}
          subtitle={`${levelInfo?.xpForNextLevel ?? 0} XP para o próximo nível`}
          icon={Star}
          iconClassName="text-[var(--color-xp-foreground)]"
        />
        <StatCard
          label="Sequência"
          value={`${streak?.currentStreak ?? 0} dias`}
          subtitle={`Recorde: ${streak?.longestStreak ?? 0} dias`}
          icon={Flame}
          iconClassName="text-[var(--color-warning-foreground)]"
        />
      </div>

      <Card>
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
    </AppShell>
  )
}
