import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Flame, Hand, Star, Trophy, TrendingUp, Zap, CheckCircle2 } from 'lucide-react'
import { userApi } from '@/api/user.api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AppShell } from '@/components/layout/AppShell'
import { appSidebarSections } from '@/components/layout/Sidebar'
import { EmptyState } from '@/components/shared/EmptyState'
import { NextStepCard } from '@/components/shared/NextStepCard'
import { StatCard } from '@/components/shared/StatCard'
import { TechnologyAvatar } from '@/components/shared/TechnologyAvatar'
import { useAuth } from '@/context/AuthContext'
import { getLevelInfo, getStreakMessage } from '@/lib/gamification'

function resolveNextStep(data: NonNullable<Awaited<ReturnType<typeof userApi.getDashboard>>>) {
  const inProgress = data.inProgressTechnologies[0]
  if (inProgress) {
    return {
      title: inProgress.name,
      description: 'Continue de onde parou. Revise os recursos e avance para a avaliação.',
      actionLabel: 'Continuar',
      actionTo: `/tecnologias/${inProgress.id}`,
      technology: inProgress,
    }
  }

  const next = data.remainingTechnologies[0]
  if (next) {
    return {
      title: next.name,
      description: 'Esta é a próxima tecnologia da sua trilha. Inicie agora e ganhe XP!',
      actionLabel: 'Iniciar tecnologia',
      actionTo: `/tecnologias/${next.id}`,
      technology: next,
    }
  }

  if (data.completedTechnologies.length > 0) {
    return {
      title: 'Parabéns! Trilha concluída',
      description: 'Veja recomendações personalizadas da IA para continuar evoluindo.',
      actionLabel: 'Ver recomendações',
      actionTo: '/app/recomendacoes',
    }
  }

  return {
    title: 'Explore sua trilha',
    description: 'Veja o mapa completo das tecnologias e comece sua jornada.',
    actionLabel: 'Ver minha trilha',
    actionTo: '/app/trilha',
  }
}

export function DashboardPage() {
  const { user } = useAuth()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => userApi.getDashboard(),
  })

  const levelInfo = data ? getLevelInfo(data.xp) : null
  const nextStep = data ? resolveNextStep(data) : null

  return (
    <AppShell sidebarSections={appSidebarSections}>
      <div className="mb-8">
        <h1 className="page-title flex items-center gap-2">
          Olá, {user?.name?.split(' ')[0] ?? 'dev'}!
          <Hand className="h-7 w-7 text-[var(--color-primary)]" aria-hidden />
        </h1>
        <p className="mt-2 text-[var(--color-muted-foreground)]">
          Aqui está sua visão geral e o que fazer agora.
        </p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-36" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
        </div>
      )}

      {isError && <EmptyState title="Erro ao carregar o painel" emoji="😕" />}

      {data && nextStep && (
        <>
          <div className="mb-8">
            <NextStepCard {...nextStep} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Nível"
              value={`Nv. ${levelInfo?.level}`}
              subtitle={levelInfo?.title}
              icon={Zap}
              iconClassName="text-[var(--color-xp-foreground)]"
              progress={levelInfo?.progressToNext}
              progressVariant="xp"
              highlight
            />
            <StatCard
              label="XP total"
              value={data.xp}
              subtitle={`${levelInfo?.xpForNextLevel ?? 0} XP para o próximo nível`}
              icon={Star}
              iconClassName="text-[var(--color-xp-foreground)]"
            />
            <StatCard
              label="Sequência"
              value={`${data.currentStreak} dias`}
              subtitle={getStreakMessage(data.currentStreak)}
              icon={Flame}
              iconClassName="text-[var(--color-warning-foreground)]"
            />
            <StatCard
              label="Progresso na trilha"
              value={`${Math.round(data.progressPercentage)}%`}
              subtitle={`${data.completedTechnologies.length} tecnologias validadas`}
              icon={TrendingUp}
              iconClassName="text-[var(--color-primary)]"
              progress={data.progressPercentage}
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Concluídas</CardTitle>
                <Trophy className="h-4 w-4 text-[var(--color-xp)]" />
              </CardHeader>
              <CardContent className="space-y-3">
                {data.completedTechnologies.length === 0 ? (
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Nenhuma ainda — comece pela sua trilha!
                  </p>
                ) : data.completedTechnologies.map((t) => (
                  <Link key={t.id} to={`/tecnologias/${t.id}`} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[var(--color-accent)]">
                    <TechnologyAvatar name={t.name} slug={t.slug} category={t.category} size="sm" />
                    <span className="text-sm font-medium">{t.name}</span>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Em progresso ({data.inProgressTechnologies.length})</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {data.inProgressTechnologies.length === 0 ? (
                  <p className="text-sm text-[var(--color-muted-foreground)]">Nenhuma em andamento</p>
                ) : data.inProgressTechnologies.map((t) => (
                  <Link key={t.id} to={`/tecnologias/${t.id}`} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[var(--color-accent)]">
                    <TechnologyAvatar name={t.name} slug={t.slug} category={t.category} size="sm" />
                    <span className="text-sm font-medium">{t.name}</span>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Competências dominadas</CardTitle></CardHeader>
              <CardContent>
                {data.competencies.length === 0 ? (
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Valide tecnologias para desbloquear competências
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {data.competencies.slice(0, 8).map((c) => (
                      <li key={c} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-success)]" /> {c}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {data.remainingTechnologies.length > 0 && (
            <Card className="mt-6">
              <CardHeader><CardTitle className="text-base">Próximas na trilha</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {data.remainingTechnologies.slice(0, 5).map((t) => (
                    <Link
                      key={t.id}
                      to={`/tecnologias/${t.id}`}
                      className="flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-accent)]"
                    >
                      <TechnologyAvatar name={t.name} slug={t.slug} category={t.category} size="sm" />
                      {t.name}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </AppShell>
  )
}
