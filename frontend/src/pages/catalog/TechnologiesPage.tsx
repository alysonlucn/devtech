import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Clock } from 'lucide-react'
import { technologiesApi } from '@/api/technologies.api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { PublicLayout } from '@/components/layout/AppShell'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { DifficultyBadge } from '@/components/shared/DifficultyBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { TechnologyAvatar } from '@/components/shared/TechnologyAvatar'
import { categoryOptions } from '@/lib/labels'
import type { TechnologyCategory } from '@/types/enums'

export function TechnologiesPage() {
  const [category, setCategory] = useState<TechnologyCategory | 'all'>('all')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['technologies', category],
    queryFn: () =>
      technologiesApi.list({
        limit: 50,
        sort: 'order',
        ...(category !== 'all' ? { category } : {}),
      }),
  })

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <PageHeader
          title="Tecnologias"
          description="Explore o catálogo de tecnologias, recursos e projetos."
          action={
            <Select value={category} onValueChange={(v) => setCategory(v as TechnologyCategory | 'all')}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44" />)}
          </div>
        )}

        {isError && <EmptyState title="Erro ao carregar tecnologias" emoji="⚠️" />}

        {data && data.data.length === 0 && (
          <EmptyState title="Nenhuma tecnologia encontrada" />
        )}

        {data && data.data.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((tech) => (
              <Link key={tech.id} to={`/tecnologias/${tech.id}`}>
                <Card className="card-hover h-full">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <TechnologyAvatar name={tech.name} slug={tech.slug} category={tech.category} size="lg" />
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap gap-2">
                          <CategoryBadge category={tech.category} />
                          <DifficultyBadge difficulty={tech.difficulty} />
                        </div>
                        <CardTitle className="text-lg">{tech.name}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">{tech.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)]">
                      <Clock className="h-4 w-4" />
                      ~{tech.estimatedTime} horas estimadas
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
