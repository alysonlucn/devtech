import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'
import { learningPathsApi } from '@/api/learning-paths.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { AppShell } from '@/components/layout/AppShell'
import { adminSidebarLinks } from '@/components/layout/Sidebar'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { getApiErrorMessage } from '@/lib/utils'
import type { LearningPath } from '@/types/entities'

const schema = z.object({
  title: z.string().min(2, 'Mínimo 2 caracteres'),
  slug: z.string().min(2).optional().or(z.literal('')),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
})

type FormData = z.infer<typeof schema>

export function AdminLearningPathsPage() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<LearningPath | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['learning-paths'],
    queryFn: () => learningPathsApi.list({ limit: 100 }),
  })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const createMutation = useMutation({
    mutationFn: (input: FormData) =>
      learningPathsApi.create({
        ...input,
        slug: input.slug || undefined,
      }),
    onSuccess: () => {
      toast.success('Trilha criada!')
      void queryClient.invalidateQueries({ queryKey: ['learning-paths'] })
      closeDialog()
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: FormData }) =>
      learningPathsApi.update(id, { ...input, slug: input.slug || undefined }),
    onSuccess: () => {
      toast.success('Trilha atualizada!')
      void queryClient.invalidateQueries({ queryKey: ['learning-paths'] })
      closeDialog()
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => learningPathsApi.remove(id),
    onSuccess: () => {
      toast.success('Trilha excluída!')
      void queryClient.invalidateQueries({ queryKey: ['learning-paths'] })
      setDeleteId(null)
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  function openCreate() {
    setEditing(null)
    reset({ title: '', slug: '', description: '' })
    setDialogOpen(true)
  }

  function openEdit(path: LearningPath) {
    setEditing(path)
    reset({ title: path.title, slug: path.slug, description: path.description })
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditing(null)
  }

  function onSubmit(form: FormData) {
    if (editing) {
      updateMutation.mutate({ id: editing.id, input: form })
    } else {
      createMutation.mutate(form)
    }
  }

  return (
    <AppShell sidebarLinks={adminSidebarLinks} title="Administração">
      <PageHeader
        title="Trilhas"
        description="Gerencie trilhas de aprendizado."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nova trilha
          </Button>
        }
      />

      {isLoading && <Skeleton className="h-40" />}

      {data && data.data.length === 0 && <EmptyState title="Nenhuma trilha cadastrada" />}

      {data && data.data.length > 0 && (
        <div className="space-y-3">
          {data.data.map((path) => (
            <Card key={path.id}>
              <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link to={`/admin/trilhas/${path.id}`} className="font-medium hover:underline">
                    {path.title}
                  </Link>
                  <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-1">{path.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/trilhas/${path.id}`}>Tecnologias</Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(path)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(path.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar trilha' : 'Nova trilha'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input {...register('title')} />
              {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Identificador na URL (opcional)</Label>
              <Input {...register('slug')} />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea {...register('description')} />
              {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Excluir trilha"
        description="Esta ação não pode ser desfeita."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
      />
    </AppShell>
  )
}
