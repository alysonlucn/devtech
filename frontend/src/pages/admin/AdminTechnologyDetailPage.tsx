import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { AppShell } from '@/components/layout/AppShell'
import { adminSidebarLinks } from '@/components/layout/Sidebar'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { difficultyOptions, resourceTypeOptions } from '@/lib/labels'
import { getApiErrorMessage } from '@/lib/utils'
import { TechnologyDifficulty } from '@/types/enums'

const resourceSchema = z.object({
  title: z.string().min(2),
  type: z.string().min(1),
  url: z.string().url(),
})

const projectSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
})

const competencySchema = z.object({
  title: z.string().min(2),
})

export function AdminTechnologyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [dialogType, setDialogType] = useState<'resource' | 'project' | 'competency' | 'dependency' | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; extra?: string } | null>(null)

  const { data: tech, isLoading } = useQuery({
    queryKey: ['technology', id],
    queryFn: () => technologiesApi.getById(id!),
    enabled: !!id,
  })

  const { data: allTechs } = useQuery({
    queryKey: ['technologies'],
    queryFn: () => technologiesApi.list({ limit: 100 }),
    enabled: dialogType === 'dependency',
  })

  const resourceForm = useForm({ resolver: zodResolver(resourceSchema), defaultValues: { title: '', type: 'article', url: '' } })
  const projectForm = useForm({ resolver: zodResolver(projectSchema), defaultValues: { title: '', description: '', difficulty: TechnologyDifficulty.BEGINNER } })
  const competencyForm = useForm({ resolver: zodResolver(competencySchema), defaultValues: { title: '' } })
  const [depId, setDepId] = useState('')

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ['technology', id] })

  const createResource = useMutation({
    mutationFn: (data: z.infer<typeof resourceSchema>) => technologiesApi.createResource(id!, data),
    onSuccess: () => { toast.success('Recurso criado!'); invalidate(); setDialogType(null); resourceForm.reset() },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const createProject = useMutation({
    mutationFn: (data: z.infer<typeof projectSchema>) => technologiesApi.createProject(id!, data),
    onSuccess: () => { toast.success('Projeto criado!'); invalidate(); setDialogType(null); projectForm.reset() },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const createCompetency = useMutation({
    mutationFn: (data: z.infer<typeof competencySchema>) => technologiesApi.createCompetency(id!, data),
    onSuccess: () => { toast.success('Competência criada!'); invalidate(); setDialogType(null); competencyForm.reset() },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const createDependency = useMutation({
    mutationFn: (prerequisiteTechnologyId: string) =>
      technologiesApi.createDependency(id!, { prerequisiteTechnologyId }),
    onSuccess: () => { toast.success('Dependência criada!'); invalidate(); setDialogType(null); setDepId('') },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const deleteResource = useMutation({
    mutationFn: (resourceId: string) => technologiesApi.removeResource(resourceId),
    onSuccess: () => { toast.success('Recurso excluído!'); invalidate(); setDeleteTarget(null) },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const deleteProject = useMutation({
    mutationFn: (projectId: string) => technologiesApi.removeProject(projectId),
    onSuccess: () => { toast.success('Projeto excluído!'); invalidate(); setDeleteTarget(null) },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const deleteCompetency = useMutation({
    mutationFn: (competencyId: string) => technologiesApi.removeCompetency(competencyId),
    onSuccess: () => { toast.success('Competência excluída!'); invalidate(); setDeleteTarget(null) },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const deleteDependency = useMutation({
    mutationFn: ({ techId, prereqId }: { techId: string; prereqId: string }) =>
      technologiesApi.removeDependency(techId, prereqId),
    onSuccess: () => { toast.success('Dependência removida!'); invalidate(); setDeleteTarget(null) },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  if (isLoading) return <AppShell sidebarLinks={adminSidebarLinks}><LoadingSpinner fullPage /></AppShell>
  if (!tech) return <AppShell sidebarLinks={adminSidebarLinks}><EmptyState title="Tecnologia não encontrada" /></AppShell>

  const linkedDepIds = new Set(tech.dependencies?.map((d) => d.prerequisiteTechnologyId) ?? [])
  const availableDeps = allTechs?.data.filter((t) => t.id !== id && !linkedDepIds.has(t.id)) ?? []

  function handleDelete() {
    if (!deleteTarget) return
    switch (deleteTarget.type) {
      case 'resource': deleteResource.mutate(deleteTarget.id); break
      case 'project': deleteProject.mutate(deleteTarget.id); break
      case 'competency': deleteCompetency.mutate(deleteTarget.id); break
      case 'dependency': deleteDependency.mutate({ techId: id!, prereqId: deleteTarget.id }); break
    }
  }

  return (
    <AppShell sidebarLinks={adminSidebarLinks} title="Administração">
      <Link to="/admin/tecnologias" className="text-sm text-[var(--color-primary)] hover:underline">← Voltar</Link>
      <h1 className="mt-4 text-2xl font-bold">{tech.name}</h1>

      <Tabs defaultValue="resources" className="mt-6">
        <TabsList>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="competencies">Competências</TabsTrigger>
          <TabsTrigger value="dependencies">Dependências</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          <Button size="sm" onClick={() => setDialogType('resource')}><Plus className="h-4 w-4" />Adicionar recurso</Button>
          {tech.resources?.length ? tech.resources.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div><p className="font-medium">{r.title}</p><p className="text-sm text-[var(--color-muted-foreground)]">{r.url}</p></div>
                <Button variant="ghost" size="icon" onClick={() => setDeleteTarget({ type: 'resource', id: r.id })}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </CardContent>
            </Card>
          )) : <EmptyState title="Nenhum recurso" />}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Button size="sm" onClick={() => setDialogType('project')}><Plus className="h-4 w-4" />Adicionar projeto</Button>
          {tech.projects?.length ? tech.projects.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div><p className="font-medium">{p.title}</p><p className="text-sm">{p.description}</p></div>
                <Button variant="ghost" size="icon" onClick={() => setDeleteTarget({ type: 'project', id: p.id })}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </CardContent>
            </Card>
          )) : <EmptyState title="Nenhum projeto" />}
        </TabsContent>

        <TabsContent value="competencies" className="space-y-4">
          <Button size="sm" onClick={() => setDialogType('competency')}><Plus className="h-4 w-4" />Adicionar competência</Button>
          {tech.competencies?.length ? tech.competencies.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex items-center justify-between py-3">
                <p>{c.title}</p>
                <Button variant="ghost" size="icon" onClick={() => setDeleteTarget({ type: 'competency', id: c.id })}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </CardContent>
            </Card>
          )) : <EmptyState title="Nenhuma competência" />}
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <Button size="sm" onClick={() => setDialogType('dependency')}><Plus className="h-4 w-4" />Adicionar dependência</Button>
          {tech.dependencies?.length ? tech.dependencies.map((d) => (
            <Card key={d.prerequisiteTechnologyId}>
              <CardContent className="flex items-center justify-between py-3">
                <p>{d.prerequisiteTechnology?.name ?? d.prerequisiteTechnologyId}</p>
                <Button variant="ghost" size="icon" onClick={() => setDeleteTarget({ type: 'dependency', id: d.prerequisiteTechnologyId })}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </CardContent>
            </Card>
          )) : <EmptyState title="Nenhuma dependência" />}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogType === 'resource'} onOpenChange={(o) => !o && setDialogType(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo recurso</DialogTitle></DialogHeader>
          <form onSubmit={resourceForm.handleSubmit((d) => createResource.mutate(d))} className="space-y-4">
            <div className="space-y-2"><Label>Título</Label><Input {...resourceForm.register('title')} /></div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={resourceForm.watch('type')} onValueChange={(v) => resourceForm.setValue('type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{resourceTypeOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Link</Label><Input {...resourceForm.register('url')} /></div>
            <DialogFooter><Button type="submit" disabled={createResource.isPending}>Salvar</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === 'project'} onOpenChange={(o) => !o && setDialogType(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo projeto</DialogTitle></DialogHeader>
          <form onSubmit={projectForm.handleSubmit((d) => createProject.mutate(d))} className="space-y-4">
            <div className="space-y-2"><Label>Título</Label><Input {...projectForm.register('title')} /></div>
            <div className="space-y-2"><Label>Descrição</Label><Textarea {...projectForm.register('description')} /></div>
            <div className="space-y-2">
              <Label>Dificuldade</Label>
              <Select value={projectForm.watch('difficulty')} onValueChange={(v) => projectForm.setValue('difficulty', v as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{difficultyOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <DialogFooter><Button type="submit" disabled={createProject.isPending}>Salvar</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === 'competency'} onOpenChange={(o) => !o && setDialogType(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova competência</DialogTitle></DialogHeader>
          <form onSubmit={competencyForm.handleSubmit((d) => createCompetency.mutate(d))} className="space-y-4">
            <div className="space-y-2"><Label>Título</Label><Input {...competencyForm.register('title')} /></div>
            <DialogFooter><Button type="submit" disabled={createCompetency.isPending}>Salvar</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === 'dependency'} onOpenChange={(o) => !o && setDialogType(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova dependência</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Select value={depId} onValueChange={setDepId}>
              <SelectTrigger><SelectValue placeholder="Pré-requisito" /></SelectTrigger>
              <SelectContent>{availableDeps.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
            </Select>
            <DialogFooter>
              <Button onClick={() => depId && createDependency.mutate(depId)} disabled={!depId || createDependency.isPending}>Salvar</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Confirmar exclusão"
        description="Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        loading={deleteResource.isPending || deleteProject.isPending || deleteCompetency.isPending || deleteDependency.isPending}
      />
    </AppShell>
  )
}
