import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'
import { technologiesApi } from '@/api/technologies.api'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { AppShell } from '@/components/layout/AppShell'
import { adminSidebarLinks } from '@/components/layout/Sidebar'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { DifficultyBadge } from '@/components/shared/DifficultyBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { FormError } from '@/components/shared/FormError'
import { categoryOptions, difficultyOptions } from '@/lib/labels'
import { getApiErrorMessage } from '@/lib/utils'
import type { Technology } from '@/types/entities'
import { TechnologyCategory, TechnologyDifficulty } from '@/types/enums'

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().optional().or(z.literal('')),
  description: z.string().min(10),
  whyLearn: z.string().min(10),
  whenLearn: z.string().min(10),
  estimatedTime: z.number().int().positive(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  order: z.number().int().min(0),
  category: z.enum(['FUNDAMENTALS', 'BACKEND', 'FRONTEND', 'DEVOPS', 'DATABASE', 'TOOLING']),
})

type FormData = z.infer<typeof schema>

export function AdminTechnologiesPage() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Technology | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['technologies'],
    queryFn: () => technologiesApi.list({ limit: 100, sort: 'order' }),
  })

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      difficulty: TechnologyDifficulty.BEGINNER,
      category: TechnologyCategory.FUNDAMENTALS,
      order: 0,
    },
  })

  const createMutation = useMutation({
    mutationFn: (input: FormData) =>
      technologiesApi.create({ ...input, slug: input.slug || undefined }),
    onSuccess: () => {
      toast.success('Tecnologia criada!')
      void queryClient.invalidateQueries({ queryKey: ['technologies'] })
      closeDialog()
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: FormData }) =>
      technologiesApi.update(id, { ...input, slug: input.slug || undefined }),
    onSuccess: () => {
      toast.success('Tecnologia atualizada!')
      void queryClient.invalidateQueries({ queryKey: ['technologies'] })
      closeDialog()
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => technologiesApi.remove(id),
    onSuccess: () => {
      toast.success('Tecnologia excluída!')
      void queryClient.invalidateQueries({ queryKey: ['technologies'] })
      setDeleteId(null)
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  function openCreate() {
    setEditing(null)
    reset({
      name: '', slug: '', description: '', whyLearn: '', whenLearn: '',
      estimatedTime: 10, difficulty: TechnologyDifficulty.BEGINNER,
      order: 0, category: TechnologyCategory.FUNDAMENTALS,
    })
    setDialogOpen(true)
  }

  function openEdit(tech: Technology) {
    setEditing(tech)
    reset({
      name: tech.name, slug: tech.slug, description: tech.description,
      whyLearn: tech.whyLearn, whenLearn: tech.whenLearn,
      estimatedTime: tech.estimatedTime, difficulty: tech.difficulty,
      order: tech.order, category: tech.category,
    })
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditing(null)
  }

  function onSubmit(form: FormData) {
    if (editing) updateMutation.mutate({ id: editing.id, input: form })
    else createMutation.mutate(form)
  }

  return (
    <AppShell sidebarLinks={adminSidebarLinks}>
      <PageHeader
        title="Tecnologias"
        description="Gerencie o catálogo de tecnologias."
        action={<Button onClick={openCreate}><Plus className="h-4 w-4" />Nova tecnologia</Button>}
      />

      {isLoading && <Skeleton className="h-40" />}
      {data && data.data.length === 0 && <EmptyState title="Nenhuma tecnologia cadastrada" />}

      {data && data.data.length > 0 && (
        <div className="space-y-3">
          {data.data.map((tech) => (
            <Card key={tech.id}>
              <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 mb-1">
                    <CategoryBadge category={tech.category} />
                    <DifficultyBadge difficulty={tech.difficulty} />
                  </div>
                  <Link to={`/admin/tecnologias/${tech.id}`} className="font-medium hover:underline">{tech.name}</Link>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/tecnologias/${tech.id}`}>Detalhes</Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(tech)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(tech.id)}>
                    <Trash2 className="h-4 w-4 text-[var(--color-destructive)]" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Editar tecnologia' : 'Nova tecnologia'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input {...register('name')} />
                <FormError>{errors.name?.message}</FormError>
              </div>
              <div className="space-y-2">
                <Label>Identificador na URL (opcional)</Label>
                <Input {...register('slug')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea {...register('description')} />
            </div>
            <div className="space-y-2">
              <Label>Por que aprender</Label>
              <Textarea {...register('whyLearn')} />
            </div>
            <div className="space-y-2">
              <Label>Quando aprender</Label>
              <Textarea {...register('whenLearn')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tempo estimado (h)</Label>
                <Input type="number" {...register('estimatedTime', { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Ordem</Label>
                <Input type="number" {...register('order', { valueAsNumber: true })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Dificuldade</Label>
                <Select value={watch('difficulty')} onValueChange={(v) => setValue('difficulty', v as FormData['difficulty'])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {difficultyOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={watch('category')} onValueChange={(v) => setValue('category', v as FormData['category'])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Excluir tecnologia"
        description="Esta ação não pode ser desfeita."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
      />
    </AppShell>
  )
}
