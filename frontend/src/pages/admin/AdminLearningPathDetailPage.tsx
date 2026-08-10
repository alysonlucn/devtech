import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { learningPathsApi } from '@/api/learning-paths.api'
import { technologiesApi } from '@/api/technologies.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { AppShell } from '@/components/layout/AppShell'
import { adminSidebarLinks } from '@/components/layout/Sidebar'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { getApiErrorMessage } from '@/lib/utils'

export function AdminLearningPathDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [selectedTech, setSelectedTech] = useState('')
  const [removeTechId, setRemoveTechId] = useState<string | null>(null)

  const pathQuery = useQuery({
    queryKey: ['learning-path', id],
    queryFn: () => learningPathsApi.getById(id!),
    enabled: !!id,
  })

  const techQuery = useQuery({
    queryKey: ['learning-path-technologies', id],
    queryFn: () => learningPathsApi.getTechnologies(id!),
    enabled: !!id,
  })

  const allTechQuery = useQuery({
    queryKey: ['technologies'],
    queryFn: () => technologiesApi.list({ limit: 100 }),
  })

  const addMutation = useMutation({
    mutationFn: (technologyId: string) =>
      learningPathsApi.addTechnology(id!, { technologyId, order: (techQuery.data?.length ?? 0) + 1 }),
    onSuccess: () => {
      toast.success('Tecnologia adicionada!')
      setSelectedTech('')
      void queryClient.invalidateQueries({ queryKey: ['learning-path-technologies', id] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const removeMutation = useMutation({
    mutationFn: (technologyId: string) => learningPathsApi.removeTechnology(id!, technologyId),
    onSuccess: () => {
      toast.success('Tecnologia removida!')
      setRemoveTechId(null)
      void queryClient.invalidateQueries({ queryKey: ['learning-path-technologies', id] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  if (pathQuery.isLoading) return <AppShell sidebarLinks={adminSidebarLinks}><LoadingSpinner fullPage /></AppShell>

  const path = pathQuery.data
  const linkedIds = new Set(techQuery.data?.map((t) => t.technologyId) ?? [])
  const availableTechs = allTechQuery.data?.data.filter((t) => !linkedIds.has(t.id)) ?? []

  return (
    <AppShell sidebarLinks={adminSidebarLinks} title="Administração">
      <Link to="/admin/trilhas" className="text-sm text-[var(--color-primary)] hover:underline">← Voltar</Link>
      <h1 className="mt-4 text-2xl font-bold">{path?.title}</h1>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select value={selectedTech} onValueChange={setSelectedTech}>
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Selecionar tecnologia" />
          </SelectTrigger>
          <SelectContent>
            {availableTechs.map((t) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => selectedTech && addMutation.mutate(selectedTech)}
          disabled={!selectedTech || addMutation.isPending}
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {techQuery.isLoading && <Skeleton className="mt-6 h-32" />}

      {techQuery.data && techQuery.data.length === 0 && (
        <EmptyState title="Nenhuma tecnologia na trilha" className="mt-6" />
      )}

      <div className="mt-6 space-y-2">
        {techQuery.data?.sort((a, b) => a.order - b.order).map((item, index) => (
          <Card key={item.technologyId}>
            <CardContent className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[var(--color-muted-foreground)]">{index + 1}.</span>
                <span>{item.technology?.name ?? item.technologyId}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setRemoveTechId(item.technologyId)}>
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={!!removeTechId}
        onOpenChange={(open) => !open && setRemoveTechId(null)}
        title="Remover tecnologia"
        description="A tecnologia será removida desta trilha."
        onConfirm={() => removeTechId && removeMutation.mutate(removeTechId)}
        loading={removeMutation.isPending}
      />
    </AppShell>
  )
}
