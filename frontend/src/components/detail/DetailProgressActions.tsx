import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userApi } from '@/api/user.api'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { getApiErrorMessage } from '@/lib/utils'
import type { UserTechnologyProgress } from '@/types/entities'
import { ProgressStatus } from '@/types/enums'

interface TechnologyProgressActionsProps {
  technologyId: string
  progress?: UserTechnologyProgress
}

export function TechnologyProgressActions({
  technologyId,
  progress,
}: TechnologyProgressActionsProps) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const startMutation = useMutation({
    mutationFn: () => userApi.startProgress(technologyId),
    onSuccess: () => {
      toast.success('Tecnologia iniciada!')
      void queryClient.invalidateQueries({ queryKey: ['progress'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const readyMutation = useMutation({
    mutationFn: () => userApi.markReady(progress!.id),
    onSuccess: () => {
      toast.success('Marcado como pronto para avaliação!')
      void queryClient.invalidateQueries({ queryKey: ['progress'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  if (!isAuthenticated) return null

  const showAssessment =
    progress?.status === ProgressStatus.IN_PROGRESS ||
    progress?.status === ProgressStatus.READY_FOR_ASSESSMENT

  const scrollToContent = () => {
    document.getElementById('detail-content')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {!progress && (
        <Button
          size="lg"
          onClick={() => startMutation.mutate()}
          disabled={startMutation.isPending}
        >
          {startMutation.isPending ? 'Iniciando...' : 'Iniciar'}
        </Button>
      )}
      {progress?.status === ProgressStatus.IN_PROGRESS && (
        <>
          <Button size="lg" onClick={scrollToContent}>
            Continuar
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="hidden sm:inline-flex"
            onClick={() => readyMutation.mutate()}
            disabled={readyMutation.isPending}
          >
            {readyMutation.isPending ? 'Salvando...' : 'Pronto para avaliação'}
          </Button>
        </>
      )}
      {progress?.status === ProgressStatus.READY_FOR_ASSESSMENT && (
        <Button size="lg" asChild>
          <Link to={`/app/avaliacoes/${technologyId}`}>Continuar</Link>
        </Button>
      )}
      {progress?.status === ProgressStatus.VALIDATED && (
        <Button size="lg" onClick={scrollToContent}>
          Continuar
        </Button>
      )}
      {showAssessment && (
        <Button size="lg" variant="outline" asChild>
          <Link to={`/app/avaliacoes/${technologyId}`}>Fazer avaliação</Link>
        </Button>
      )}
    </>
  )
}

interface LearningPathProgressActionsProps {
  learningPathId: string
  isCurrentPath: boolean
  hasStarted: boolean
}

export function LearningPathProgressActions({
  learningPathId,
  isCurrentPath,
  hasStarted,
}: LearningPathProgressActionsProps) {
  const { isAuthenticated, refreshUser } = useAuth()
  const queryClient = useQueryClient()

  const setPathMutation = useMutation({
    mutationFn: () => userApi.setLearningPath(learningPathId),
    onSuccess: async () => {
      toast.success('Trilha iniciada!')
      await refreshUser()
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      void queryClient.invalidateQueries({ queryKey: ['roadmap'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  if (!isAuthenticated) {
    return (
      <Button size="lg" asChild>
        <Link
          to="/login"
          state={{
            from: { pathname: '/app/onboarding' },
            intendedLearningPathId: learningPathId,
          }}
        >
          Entrar para iniciar
        </Link>
      </Button>
    )
  }

  if (isCurrentPath && hasStarted) {
    return (
      <Button size="lg" asChild>
        <Link to="/app/trilha">Continuar</Link>
      </Button>
    )
  }

  return (
    <Button
      size="lg"
      onClick={() => setPathMutation.mutate()}
      disabled={setPathMutation.isPending}
    >
      {setPathMutation.isPending ? 'Iniciando...' : 'Iniciar'}
    </Button>
  )
}
