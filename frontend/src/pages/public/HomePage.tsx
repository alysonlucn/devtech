import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, BookOpen, Brain, CheckCircle2, Map, Target, TrendingUp } from 'lucide-react'
import { learningPathsApi } from '@/api/learning-paths.api'
import { technologiesApi } from '@/api/technologies.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PublicLayout } from '@/components/layout/AppShell'
import { TechnologyAvatar } from '@/components/shared/TechnologyAvatar'
import { useAuth } from '@/context/AuthContext'
import { getTrailNavigation } from '@/lib/trail-navigation'
import { getPathGradient } from '@/lib/technology-visuals'
import { cn } from '@/lib/utils'

const features = [
  { icon: Target, title: 'Trilhas personalizadas', description: 'Caminhos estruturados do básico ao avançado, com ordem clara do que estudar.', color: 'text-[var(--color-primary)] bg-[var(--color-primary)]/10' },
  { icon: TrendingUp, title: 'Progresso gamificado', description: 'XP, níveis, sequências diárias e validação de competências com avaliações práticas.', color: 'text-[var(--color-xp-foreground)] bg-[var(--color-xp)]/15' },
  { icon: Brain, title: 'Mentoria com IA', description: 'Recomendações personalizadas, análise de vagas e avaliações com IA para acelerar sua carreira.', color: 'text-[var(--color-success-foreground)] bg-[var(--color-success)]/12' },
  { icon: BookOpen, title: 'Catálogo curado', description: 'Tecnologias, recursos, projetos e competências organizados em um só lugar.', color: 'text-[var(--color-warning-foreground)] bg-[var(--color-warning)]/15' },
]

const steps = [
  { num: '1', title: 'Escolha sua trilha', desc: 'Backend, frontend, full stack — encontre seu caminho.' },
  { num: '2', title: 'Estude e pratique', desc: 'Recursos curados e projetos reais para cada tecnologia.' },
  { num: '3', title: 'Valide e evolua', desc: 'Avaliações com IA, XP e recomendações do próximo passo.' },
]

const roadmapNodes = [
  { label: 'Fundamentos', done: true },
  { label: 'Backend', done: true },
  { label: 'API & DB', current: true },
  { label: 'Frontend', done: false },
  { label: 'DevOps', done: false },
]

function RoadmapIllustration() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-none border-y border-[var(--color-border)] bg-[var(--color-card)] sm:rounded-2xl sm:border"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_oklch,var(--color-primary)_12%,transparent),transparent_55%),radial-gradient(ellipse_at_80%_80%,color-mix(in_oklch,var(--color-success)_10%,transparent),transparent_50%)]" />
      <div className="relative mx-auto flex max-w-md flex-col items-stretch gap-0 px-6 py-10 sm:px-10 sm:py-12">
        {roadmapNodes.map((node, index) => (
          <div key={node.label} className="flex gap-4">
            <div className="flex w-10 flex-col items-center">
              <div
                className={cn(
                  'z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold shadow-sm',
                  node.done && 'border-[var(--color-success)] bg-[var(--color-success)] text-[var(--color-primary-foreground)]',
                  node.current &&
                    'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)] ring-4 ring-[var(--color-primary)]/25',
                  !node.done &&
                    !node.current &&
                    'border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted-foreground)]',
                )}
              >
                {node.done ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
              </div>
              {index < roadmapNodes.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 flex-1 min-h-8',
                    node.done ? 'bg-[var(--color-success)]/50' : 'bg-[var(--color-border)]',
                  )}
                />
              )}
            </div>
            <div className={cn('pb-8 pt-1.5', index === roadmapNodes.length - 1 && 'pb-0')}>
              <p
                className={cn(
                  'font-[family-name:var(--font-display)] text-base font-semibold',
                  node.current && 'text-[var(--color-primary)]',
                  !node.done && !node.current && 'text-[var(--color-muted-foreground)]',
                )}
              >
                {node.label}
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
                {node.done ? 'Validado' : node.current ? 'Em foco agora' : 'Próximo na trilha'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HomePage() {
  const { isAuthenticated } = useAuth()

  const { data: paths, isLoading: pathsLoading } = useQuery({
    queryKey: ['learning-paths'],
    queryFn: () => learningPathsApi.list({ limit: 6 }),
  })

  const { data: technologies, isLoading: techsLoading } = useQuery({
    queryKey: ['technologies', 'home'],
    queryFn: () => technologiesApi.list({ limit: 6, sort: 'order' }),
  })

  return (
    <PublicLayout>
      <section className="hero-gradient">
        <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="animate-fade-in-up lg:py-8">
              <p className="mb-4 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-[var(--color-primary)] sm:text-5xl lg:text-6xl">
                DevTech
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
                Pare de adivinhar o que estudar em seguida
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-[var(--color-muted-foreground)]">
                Trilhas claras, progresso gamificado e IA que aponta o próximo passo da sua carreira.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                {isAuthenticated ? (
                  <Button size="lg" asChild>
                    <Link to="/app/dashboard">
                      Continuar aprendendo
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild>
                      <Link to="/register">
                        Começar grátis
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link to="/trilhas">Explorar trilhas</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="animate-fade-in-up [animation-delay:120ms] lg:-mr-6 lg:justify-self-stretch">
              <RoadmapIllustration />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--color-border)] py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 text-sm text-[var(--color-muted-foreground)] sm:gap-12 sm:px-6">
          <span className="flex items-center gap-2">
            <Map className="h-4 w-4 text-[var(--color-primary)]" />
            {paths?.meta?.total ?? paths?.data.length ?? '—'} trilhas
          </span>
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[var(--color-primary)]" />
            {technologies?.meta?.total ?? technologies?.data.length ?? '—'} tecnologias
          </span>
        </div>
      </section>

      {(pathsLoading || (paths && paths.data.length > 0)) && (
        <section className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">Trilhas disponíveis</h2>
                <p className="mt-2 text-[var(--color-muted-foreground)]">
                  {isAuthenticated
                    ? 'Escolha um caminho estruturado para o seu próximo passo.'
                    : 'Entre na conta para escolher a trilha e começar sua jornada.'}
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/trilhas">Ver todas <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            {pathsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paths!.data.slice(0, 3).map((path, index) => {
                  const nav = getTrailNavigation(path.id, isAuthenticated)
                  return (
                    <Link key={path.id} to={nav.to} state={nav.state} className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]">
                      <Card className="path-card h-full overflow-hidden">
                        <div className={cn('h-1.5 bg-gradient-to-r transition-all duration-300 group-hover:h-2.5', getPathGradient(index))} />
                        <CardHeader>
                          <CardTitle className="text-lg transition-colors group-hover:text-[var(--color-primary)]">
                            {path.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">{path.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)]">
                            {isAuthenticated ? 'Explorar trilha' : 'Entrar para escolher'}
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Como funciona</h2>
          <p className="mt-2 text-[var(--color-muted-foreground)]">Três passos para sair do zero ao próximo nível</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.num} className="relative text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-lg font-bold text-[var(--color-primary-foreground)] shadow-md">
                {step.num}
              </div>
              <h3 className="font-semibold text-lg">{step.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {(techsLoading || (technologies && technologies.data.length > 0)) && (
        <section className="bg-[var(--color-muted)]/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">Tecnologias do catálogo</h2>
                <p className="mt-2 text-[var(--color-muted-foreground)]">Do básico ao avançado, com recursos e projetos.</p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/tecnologias">Ver catálogo <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            {techsLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {technologies!.data.slice(0, 6).map((tech) => (
                  <Link key={tech.id} to={`/tecnologias/${tech.id}`} className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]">
                    <Card className="card-hover">
                      <CardContent className="flex items-center gap-4 p-4">
                        <TechnologyAvatar name={tech.name} slug={tech.slug} category={tech.category} />
                        <div className="min-w-0">
                          <p className="font-semibold transition-colors group-hover:text-[var(--color-primary)]">{tech.name}</p>
                          <p className="text-sm text-[var(--color-muted-foreground)]">~{tech.estimatedTime}h estimadas</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="card-hover border-0 shadow-sm">
              <CardHeader>
                <div className={cn('mb-2 inline-flex rounded-lg p-2.5', feature.color)}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-deep)] py-16 text-[var(--color-primary-foreground)]">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <CheckCircle2 className="mx-auto mb-4 h-10 w-10 opacity-90" />
          <h2 className="text-2xl font-bold sm:text-3xl">
            {isAuthenticated ? 'Continue de onde parou' : 'Pronto para evoluir na carreira?'}
          </h2>
          <p className="mt-4 text-[var(--color-primary-foreground)]/85">
            {isAuthenticated
              ? 'Acesse sua trilha, acompanhe o progresso e avance no próximo passo.'
              : 'Crie sua conta gratuita, escolha uma trilha e comece hoje mesmo.'}
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8 bg-[var(--color-primary-foreground)] text-[var(--color-primary)] hover:bg-[var(--color-primary-foreground)]/90"
            asChild
          >
            {isAuthenticated ? (
              <Link to="/app/trilha">
                Ver minha trilha
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link to="/register">
                Criar conta grátis
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </Button>
        </div>
      </section>
    </PublicLayout>
  )
}
