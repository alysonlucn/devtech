import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Brain, Lightbulb, Send } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'
import { technologiesApi } from '@/api/technologies.api'
import { userApi } from '@/api/user.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AppShell } from '@/components/layout/AppShell'
import { appSidebarSections } from '@/components/layout/Sidebar'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { TechnologyAvatar } from '@/components/shared/TechnologyAvatar'
import { getApiErrorMessage } from '@/lib/utils'
import { cn } from '@/lib/utils'

const MIN_ANSWER = 10
const MAX_ASSESSMENT_QUESTIONS = 4

const schema = z.object({
  answers: z.array(
    z.object({
      answer: z.string().min(MIN_ANSWER, `Responda com pelo menos ${MIN_ANSWER} caracteres`),
    }),
  ).min(1),
})

type FormData = z.infer<typeof schema>

function assessmentCompetencies<T>(competencies: T[] | undefined): T[] {
  return (competencies ?? []).slice(0, MAX_ASSESSMENT_QUESTIONS)
}

export function AssessmentPage() {
  const { technologyId } = useParams<{ technologyId: string }>()
  const navigate = useNavigate()

  const { data: tech, isLoading } = useQuery({
    queryKey: ['technology', technologyId],
    queryFn: () => technologiesApi.getById(technologyId!),
    enabled: !!technologyId,
  })

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { answers: [] },
  })

  const answers = watch('answers')

  useEffect(() => {
    if (tech?.competencies?.length) {
      reset({
        answers: assessmentCompetencies(tech.competencies).map(() => ({ answer: '' })),
      })
    }
  }, [tech, reset])

  const mutation = useMutation({
    mutationFn: (formAnswers: FormData['answers']) => {
      const payload = assessmentCompetencies(tech?.competencies).map((c, i) => ({
        question: `Explique sua experiência com: ${c.title}`,
        answer: formAnswers[i]?.answer ?? '',
      }))
      return userApi.submitAssessment(technologyId!, payload)
    },
    onSuccess: (result) => {
      toast.success(`Avaliação concluída! Nota: ${result.score}`)
      navigate('/app/avaliacoes')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  function onSubmit(data: FormData) {
    mutation.mutate(data.answers)
  }

  if (isLoading) {
    return (
      <AppShell sidebarSections={appSidebarSections}>
        <LoadingSpinner fullPage />
      </AppShell>
    )
  }

  const questions = assessmentCompetencies(tech?.competencies)
  const isEvaluating = isSubmitting || mutation.isPending

  return (
    <AppShell sidebarSections={appSidebarSections} title="Área do aluno">
      <Link to={`/tecnologias/${technologyId}`} className="text-sm font-medium text-[var(--color-primary)] hover:underline">
        ← Voltar à tecnologia
      </Link>

      <div className="mt-6 flex items-start gap-4">
        {tech && (
          <TechnologyAvatar name={tech.name} slug={tech.slug} category={tech.category} size="lg" />
        )}
        <div>
          <h1 className="text-2xl font-bold">Avaliação: {tech?.name}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
            <Brain className="h-4 w-4" />
            {questions.length} perguntas · responda com honestidade — a IA avalia com base nas competências.
          </p>
        </div>
      </div>

      <Card className="mt-6 border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5">
        <CardContent className="flex gap-3 p-4">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]" />
          <div className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">
            <p className="font-medium text-[var(--color-foreground)]">O que a IA espera</p>
            <p className="mt-1">
              Exemplos concretos, projetos que você fez e conceitos que consegue explicar —
              quanto mais específico, melhor a avaliação.
            </p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {questions.map((competency, index) => {
          const length = answers?.[index]?.answer?.length ?? 0
          const meetsMin = length >= MIN_ANSWER

          return (
            <Card key={competency.id} className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[var(--color-primary)] to-[color-mix(in_oklch,var(--color-primary)_60%,var(--color-success))]" />
              <CardHeader>
                <CardTitle className="text-base">Pergunta {index + 1} de {questions.length}</CardTitle>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  Explique sua experiência com: <strong>{competency.title}</strong>
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`answer-${index}`}>Sua resposta</Label>
                  <Textarea
                    id={`answer-${index}`}
                    rows={5}
                    placeholder="Descreva projetos, conceitos que domina, desafios que enfrentou..."
                    {...register(`answers.${index}.answer`)}
                  />
                  <div className="flex items-center justify-between gap-2">
                    {errors.answers?.[index]?.answer ? (
                      <p className="text-sm text-red-600">{errors.answers[index]?.answer?.message}</p>
                    ) : (
                      <span className="text-xs text-[var(--color-muted-foreground)]">
                        Mínimo {MIN_ANSWER} caracteres
                      </span>
                    )}
                    <span
                      className={cn(
                        'text-xs tabular-nums',
                        meetsMin ? 'text-[var(--color-success)]' : 'text-[var(--color-muted-foreground)]',
                      )}
                    >
                      {length}/{MIN_ANSWER}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {errors.answers?.root && (
          <p className="text-sm text-red-600">{errors.answers.root.message}</p>
        )}

        <Button type="submit" size="lg" disabled={isEvaluating}>
          {isEvaluating ? (
            'A IA está avaliando suas respostas...'
          ) : (
            <>
              Enviar avaliação
              <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </AppShell>
  )
}
