import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Clock, Layers, Search } from 'lucide-react'
import { learningPathsApi } from '@/api/learning-paths.api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { PublicLayout } from '@/components/layout/AppShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { aggregateTechnologyStats } from '@/lib/detail-utils'
import { difficultyLabels } from '@/lib/labels'
import { getTrailNavigation } from '@/lib/trail-navigation'
import { getPathGradient } from '@/lib/technology-visuals'
import { cn } from '@/lib/utils'
import type { LearningPath, Technology } from '@/types/entities'
import { TechnologyDifficulty } from '@/types/enums'

type DurationBucket = 'all' | 'short' | 'medium' | 'long'
type DifficultyFilter = 'all' | TechnologyDifficulty

const difficultyRank: Record<TechnologyDifficulty, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
}

function getPathTechnologies(path: LearningPath): Technology[] {
  return (path.technologies ?? [])
    .map((t) => t.technology)
    .filter((t): t is Technology => t !== undefined)
}

function derivePathDifficulty(techs: Technology[]): TechnologyDifficulty | null {
  if (techs.length === 0) return null
  let max: TechnologyDifficulty = TechnologyDifficulty.BEGINNER
  for (const tech of techs) {
    if (difficultyRank[tech.difficulty] > difficultyRank[max]) {
      max = tech.difficulty
    }
  }
  return max
}

function matchesDuration(hours: number, bucket: DurationBucket): boolean {
  if (bucket === 'all') return true
  if (bucket === 'short') return hours < 20
  if (bucket === 'medium') return hours >= 20 && hours <= 40
  return hours > 40
}

function LearningPathCard({
  path,
  index,
  isAuthenticated,
}: {
  path: LearningPath
  index: number
  isAuthenticated: boolean
}) {
  const techList = getPathTechnologies(path)
  const stats = aggregateTechnologyStats(techList)
  const techCount = path.technologies?.length ?? techList.length
  const difficulty = derivePathDifficulty(techList)
  const nav = getTrailNavigation(path.id, isAuthenticated)

  return (
    <Link to={nav.to} state={nav.state} className="group block focus-visible:outline-none">
      <Card className="path-card h-full overflow-hidden">
        <div className={cn('h-2 bg-gradient-to-r transition-all duration-300 group-hover:h-3', getPathGradient(index))} />
        <CardHeader>
          <CardTitle className="text-lg transition-colors group-hover:text-[var(--color-primary)]">
            {path.title}
          </CardTitle>
          <CardDescription className="line-clamp-3">{path.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm text-[var(--color-muted-foreground)]">
            <span className="flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              {techCount} tecnologias
            </span>
            {stats.estimatedTime > 0 && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                ~{stats.estimatedTime}h
              </span>
            )}
            {difficulty && (
              <span className="text-xs font-medium">
                {difficultyLabels[difficulty]}
              </span>
            )}
          </div>
          <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)]">
            {isAuthenticated ? 'Ver trilha' : 'Entrar para escolher'}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export function LearningPathsPage() {
  const { isAuthenticated } = useAuth()
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all')
  const [duration, setDuration] = useState<DurationBucket>('all')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['learning-paths'],
    queryFn: () => learningPathsApi.list({ limit: 50 }),
  })

  const filtered = useMemo(() => {
    if (!data?.data) return []
    const q = search.trim().toLowerCase()

    return data.data.filter((path) => {
      if (q && !path.title.toLowerCase().includes(q) && !path.description.toLowerCase().includes(q)) {
        return false
      }

      const techs = getPathTechnologies(path)
      const stats = aggregateTechnologyStats(techs)
      const pathDifficulty = derivePathDifficulty(techs)

      if (difficulty !== 'all' && pathDifficulty !== difficulty) return false
      if (!matchesDuration(stats.estimatedTime, duration)) return false

      return true
    })
  }, [data, search, difficulty, duration])

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <PageHeader
          title="Trilhas de aprendizado"
          description={
            isAuthenticated
              ? 'Escolha uma trilha e siga um caminho estruturado para evoluir na carreira.'
              : 'Explore as opções e entre na conta para escolher a sua trilha.'
          }
        />

        {!isLoading && !isError && data && data.data.length > 0 && (
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar trilhas..."
                className="pl-9"
                aria-label="Buscar trilhas"
              />
            </div>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyFilter)}
              className="h-9 rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm"
              aria-label="Filtrar por dificuldade"
            >
              <option value="all">Todas as dificuldades</option>
              <option value={TechnologyDifficulty.BEGINNER}>{difficultyLabels.BEGINNER}</option>
              <option value={TechnologyDifficulty.INTERMEDIATE}>{difficultyLabels.INTERMEDIATE}</option>
              <option value={TechnologyDifficulty.ADVANCED}>{difficultyLabels.ADVANCED}</option>
            </select>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value as DurationBucket)}
              className="h-9 rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm"
              aria-label="Filtrar por duração"
            >
              <option value="all">Qualquer duração</option>
              <option value="short">&lt; 20h</option>
              <option value="medium">20–40h</option>
              <option value="long">&gt; 40h</option>
            </select>
          </div>
        )}

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        )}

        {isError && (
          <EmptyState title="Erro ao carregar trilhas" description="Verifique se a API está em execução." emoji="⚠️" />
        )}

        {data && data.data.length === 0 && (
          <EmptyState title="Nenhuma trilha encontrada" description="As trilhas serão exibidas aqui quando disponíveis." />
        )}

        {data && data.data.length > 0 && filtered.length === 0 && (
          <EmptyState
            title="Nenhuma trilha corresponde aos filtros"
            description="Ajuste a busca, dificuldade ou duração e tente de novo."
          />
        )}

        {filtered.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((path, index) => (
              <LearningPathCard
                key={path.id}
                path={path}
                index={index}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
