import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, Check, Map, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { learningPathsApi } from '@/api/learning-paths.api'
import { userApi } from '@/api/user.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AppShell } from '@/components/layout/AppShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { useAuth } from '@/context/AuthContext'
import { readIntendedLearningPathId } from '@/lib/trail-navigation'
import { getPathGradient } from '@/lib/technology-visuals'
import { getApiErrorMessage } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function OnboardingPage() {
  const { user, profile, refreshUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const intendedLearningPathId = readIntendedLearningPathId(location.state)

  const [step, setStep] = useState(intendedLearningPathId ? 1 : 0)
  const [selectedPathId, setSelectedPathId] = useState<string | null>(
    intendedLearningPathId ?? profile?.learningPathId ?? null,
  )

  const { data: paths, isLoading, isError } = useQuery({
    queryKey: ['learning-paths'],
    queryFn: () => learningPathsApi.list({ limit: 50 }),
  })

  const setPathMutation = useMutation({
    mutationFn: (learningPathId: string) => userApi.setLearningPath(learningPathId),
    onSuccess: async () => {
      toast.success('Trilha escolhida! Bora começar 🚀')
      await refreshUser()
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      void queryClient.invalidateQueries({ queryKey: ['roadmap'] })
      setStep(2)
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  useEffect(() => {
    if (profile?.learningPathId && step === 0) {
      navigate('/app/dashboard', { replace: true })
    }
  }, [profile?.learningPathId, step, navigate])

  useEffect(() => {
    if (!intendedLearningPathId || !paths?.data.length) return
    const exists = paths.data.some((path) => path.id === intendedLearningPathId)
    if (exists) {
      setSelectedPathId(intendedLearningPathId)
      setStep(1)
    }
  }, [intendedLearningPathId, paths])

  if (profile?.learningPathId && step === 0) {
    return null
  }

  function handleFinish() {
    navigate('/app/trilha', { replace: true })
  }

  return (
    <AppShell showMobileNav={false}>
      <div className="mx-auto max-w-3xl animate-fade-in-up">
        <div
          className="mb-8 flex items-center justify-center gap-2"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={step + 1}
          aria-label={`Etapa ${step + 1} de 3`}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === step ? 'w-8 bg-[var(--color-primary)]' : i < step ? 'w-2 bg-[var(--color-primary)]' : 'w-2 bg-[var(--color-border)]',
              )}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-deep)] text-[var(--color-primary-foreground)] shadow-lg">
              <Sparkles className="h-8 w-8" />
            </div>
            <h1 className="page-title sm:text-4xl">
              Bem-vindo, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-[var(--color-muted-foreground)]">
              O DevTech vai guiar sua evolução com trilhas estruturadas, progresso gamificado
              e recomendações de IA. Vamos configurar sua jornada em menos de 1 minuto.
            </p>
            <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
              {[
                { icon: Map, title: 'Trilha clara', desc: 'Saiba exatamente o que estudar' },
                { icon: Sparkles, title: 'IA personalizada', desc: 'Recomendações sob medida' },
                { icon: Check, title: 'Progresso real', desc: 'XP, sequências e validação' },
              ].map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="border-dashed">
                  <CardContent className="p-4">
                    <Icon className="mb-2 h-5 w-5 text-[var(--color-primary)]" />
                    <p className="font-semibold">{title}</p>
                    <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button size="lg" className="mt-8" onClick={() => setStep(1)}>
              Escolher minha trilha
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="mb-8 text-center">
              <h1 className="page-title">Qual trilha combina com você?</h1>
              <p className="mt-2 text-[var(--color-muted-foreground)]">
                Toque ou clique para selecionar o caminho da sua carreira.
              </p>
            </div>

            {isLoading && (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
              </div>
            )}

            {isError && <EmptyState title="Erro ao carregar trilhas" />}

            {paths && paths.data.length === 0 && (
              <EmptyState
                title="Nenhuma trilha disponível"
                description="Assim que as trilhas forem publicadas, você poderá escolher aqui."
              />
            )}

            {paths && paths.data.length > 0 && (
              <div className="space-y-3" role="listbox" aria-label="Trilhas disponíveis">
                {paths.data.map((path, index) => {
                  const isSelected = selectedPathId === path.id
                  return (
                    <button
                      key={path.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => setSelectedPathId(path.id)}
                      className={cn(
                        'path-select-card group w-full text-left',
                        isSelected && 'path-select-card--selected',
                      )}
                    >
                      <div className="flex overflow-hidden rounded-[inherit]">
                        <div
                          className={cn(
                            'w-1.5 shrink-0 bg-gradient-to-b transition-all duration-300 group-hover:w-3',
                            isSelected && 'w-3',
                            getPathGradient(index),
                          )}
                        />
                        <div className="flex flex-1 items-start gap-3 p-5">
                          <div className="min-w-0 flex-1">
                            <p className="text-lg font-semibold transition-colors duration-300 group-hover:text-[var(--color-primary)]">
                              {path.title}
                            </p>
                            <p className="mt-1 text-sm text-[var(--color-muted-foreground)] line-clamp-2">
                              {path.description}
                            </p>
                            <p className="mt-3 text-sm font-medium text-[var(--color-primary)]">
                              {isSelected ? 'Selecionada — confirme abaixo' : 'Toque para selecionar'}
                            </p>
                          </div>
                          <div
                            className={cn(
                              'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
                              isSelected
                                ? 'scale-100 border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                                : 'scale-90 border-[var(--color-border)] text-transparent group-hover:scale-100 group-hover:border-[var(--color-primary)]/50 group-hover:bg-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)]',
                            )}
                          >
                            <Check className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button variant="ghost" onClick={() => setStep(0)}>Voltar</Button>
              <Button
                size="lg"
                disabled={!selectedPathId || setPathMutation.isPending}
                onClick={() => selectedPathId && setPathMutation.mutate(selectedPathId)}
              >
                {setPathMutation.isPending ? 'Salvando...' : 'Confirmar trilha'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <Card className="overflow-hidden border-0 text-center shadow-lg">
            <div className="h-2 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-xp)]" />
            <CardHeader className="pb-2 pt-10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)]">
                <Check className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Tudo pronto!</CardTitle>
              <CardDescription className="text-base">
                Sua trilha está configurada. Comece pela primeira tecnologia e avance no seu ritmo.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button size="lg" onClick={handleFinish}>
                  Ver minha trilha
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/app/dashboard">Ir para o painel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
