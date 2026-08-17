import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, BookOpen, Lightbulb, RefreshCw, Rocket } from 'lucide-react'
import { technologiesApi } from '@/api/technologies.api'
import { userApi } from '@/api/user.api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AppShell } from '@/components/layout/AppShell'
import { appSidebarSections } from '@/components/layout/Sidebar'
import { EmptyState } from '@/components/shared/EmptyState'
import { MentorCard } from '@/components/shared/MentorCard'
import { PageHeader } from '@/components/shared/PageHeader'
import type { Technology } from '@/types/entities'

function findTechByName(technologies: Technology[] | undefined, name: string) {
  if (!technologies) return undefined
  const needle = name.trim().toLowerCase()
  return technologies.find((t) => t.name.toLowerCase() === needle)
}

export function RecommendationsPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => userApi.getRecommendations(),
  })

  const { data: technologies } = useQuery({
    queryKey: ['technologies', 'recommendations-lookup'],
    queryFn: () => technologiesApi.list({ limit: 200 }),
  })

  const techList = technologies?.data

  return (
    <AppShell sidebarSections={appSidebarSections}>
      <PageHeader
        title="Recomendações"
        description="Sugestões personalizadas geradas por IA com base no seu progresso."
        action={
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        }
      />

      {isFetching && !isLoading && (
        <p className="mb-4 text-sm text-[var(--color-muted-foreground)]">
          Consultando seu progresso...
        </p>
      )}

      {isLoading && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-muted-foreground)]">Consultando seu progresso...</p>
          <Skeleton className="h-40" />
          <Skeleton className="h-32" />
        </div>
      )}

      {isError && <EmptyState title="Erro ao carregar recomendações" emoji="🤖" />}

      {data && (
        <div className="space-y-5 animate-fade-in-up">
          <MentorCard title="Próximo passo recomendado">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-warning)]/20 text-[var(--color-warning)]">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1 space-y-4">
                <p className="text-base leading-relaxed">{data.nextStep}</p>
                <Button asChild>
                  <Link to="/app/trilha">
                    Ir para minha trilha
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </MentorCard>

          {data.technologiesToReview.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[var(--color-primary)]" />
                  <h3 className="font-semibold">Tecnologias para revisar</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.technologiesToReview.map((name) => {
                    const tech = findTechByName(techList, name)
                    if (tech) {
                      return (
                        <Link key={name} to={`/tecnologias/${tech.id}`}>
                          <Badge variant="secondary" className="cursor-pointer hover:underline">
                            {name}
                          </Badge>
                        </Link>
                      )
                    }
                    return (
                      <Badge key={name} variant="secondary">
                        {name}
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {data.recommendedProject && (
            <Card className="border-[var(--color-success)]/30 bg-gradient-to-br from-[var(--color-success)]/10 to-transparent">
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-[var(--color-success)]" />
                  <h3 className="font-semibold">Projeto recomendado</h3>
                </div>
                <p className="leading-relaxed text-[var(--color-foreground)]/80">{data.recommendedProject}</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/app/projetos">
                    Ver projetos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <MentorCard title="Por que essa recomendação?">
            <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)] italic">
              "{data.reasoning}"
            </p>
          </MentorCard>
        </div>
      )}
    </AppShell>
  )
}
