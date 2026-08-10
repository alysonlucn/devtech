import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowRight, Briefcase, CheckCircle2, Sparkles, XCircle } from 'lucide-react'
import { technologiesApi } from '@/api/technologies.api'
import { userApi } from '@/api/user.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { AppShell } from '@/components/layout/AppShell'
import { appSidebarSections } from '@/components/layout/Sidebar'
import { PageHeader } from '@/components/shared/PageHeader'
import { getApiErrorMessage } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { JobAnalysisResult, Technology } from '@/types/entities'

const schema = z.object({
  jobDescription: z.string().min(50, 'Descreva a vaga com pelo menos 50 caracteres'),
})

type FormData = z.infer<typeof schema>

const loadingStages = [
  'Lendo a vaga...',
  'Comparando com seu perfil...',
  'Montando o plano...',
]

function findTechByName(technologies: Technology[] | undefined, name: string) {
  if (!technologies) return undefined
  const needle = name.trim().toLowerCase()
  return technologies.find((t) => t.name.toLowerCase() === needle)
}

function MatchRing({ percentage }: { percentage: number }) {
  const size = 128
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference

  const strokeColor =
    percentage >= 70
      ? 'var(--color-success)'
      : percentage >= 40
        ? 'var(--color-warning)'
        : 'oklch(0.55 0.2 25)'

  const textColor =
    percentage >= 70
      ? 'text-[var(--color-success)]'
      : percentage >= 40
        ? 'text-[var(--color-warning)]'
        : 'text-red-600'

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-secondary)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <span className={cn('absolute inset-0 flex items-center justify-center text-3xl font-bold', textColor)}>
          {percentage}%
        </span>
      </div>
      <p className="mt-3 text-sm font-medium text-[var(--color-muted-foreground)]">Compatibilidade</p>
    </div>
  )
}

export function JobAnalysisPage() {
  const [result, setResult] = useState<JobAnalysisResult | null>(null)
  const [stageIndex, setStageIndex] = useState(0)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const { data: technologies } = useQuery({
    queryKey: ['technologies', 'job-analysis-lookup'],
    queryFn: () => technologiesApi.list({ limit: 200 }),
  })

  const techList = technologies?.data

  const mutation = useMutation({
    mutationFn: (jobDescription: string) => userApi.analyzeJob(jobDescription),
    onSuccess: (data) => {
      setResult(data)
      toast.success('Análise concluída!')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  useEffect(() => {
    if (!mutation.isPending) {
      setStageIndex(0)
      return
    }
    const id = window.setInterval(() => {
      setStageIndex((i) => (i + 1) % loadingStages.length)
    }, 2200)
    return () => window.clearInterval(id)
  }, [mutation.isPending])

  function onSubmit(data: FormData) {
    mutation.mutate(data.jobDescription)
  }

  return (
    <AppShell sidebarSections={appSidebarSections} title="Área do aluno">
      <PageHeader
        title="Análise de vaga"
        description="Cole a descrição de uma vaga e veja seu nível de compatibilidade."
      />

      <Card className="mb-8 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[var(--color-primary)] to-[color-mix(in_oklch,var(--color-primary)_60%,var(--color-success))]" />
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
              <Briefcase className="h-4 w-4" />
              Cole a descrição completa da vaga abaixo
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobDescription" className="sr-only">Descrição da vaga</Label>
              <Textarea
                id="jobDescription"
                placeholder="Ex: Buscamos desenvolvedor Full Stack com experiência em React, Node.js, TypeScript..."
                rows={8}
                className="resize-none"
                {...register('jobDescription')}
              />
              {errors.jobDescription && (
                <p className="text-sm text-red-600">{errors.jobDescription.message}</p>
              )}
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse-soft" />
                  {loadingStages[stageIndex]}
                </>
              ) : (
                'Analisar vaga'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6 animate-fade-in-up">
          <Card>
            <CardContent className="flex flex-col items-center gap-6 py-8 sm:flex-row sm:justify-around">
              <MatchRing percentage={result.matchPercentage} />
              <div className="max-w-sm text-center sm:text-left">
                <h3 className="text-lg font-semibold">
                  {result.matchPercentage >= 70
                    ? 'Ótimo match! Você está bem preparado.'
                    : result.matchPercentage >= 40
                      ? 'Match parcial — há lacunas a preencher.'
                      : 'Ainda há bastante caminho — mas temos um plano!'}
                </h3>
                <Progress value={result.matchPercentage} className="mt-4 h-3" />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-[var(--color-success)]/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-[var(--color-success)]">
                  <CheckCircle2 className="h-5 w-5" />
                  Tecnologias que você domina
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.matchedTechnologies.length === 0 ? (
                  <p className="text-sm text-[var(--color-muted-foreground)]">Nenhuma correspondência ainda</p>
                ) : (
                  <ul className="space-y-2">
                    {result.matchedTechnologies.map((name) => {
                      const tech = findTechByName(techList, name)
                      return (
                        <li key={name} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-success)]" />
                          {tech ? (
                            <Link
                              to={`/tecnologias/${tech.id}`}
                              className="font-medium text-[var(--color-success)] hover:underline"
                            >
                              {name}
                            </Link>
                          ) : (
                            <span>{name}</span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-red-800">
                  <XCircle className="h-5 w-5" />
                  Tecnologias faltantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.missingTechnologies.length === 0 ? (
                  <p className="text-sm text-[var(--color-muted-foreground)]">Nenhuma lacuna identificada</p>
                ) : (
                  <ul className="space-y-3">
                    {result.missingTechnologies.map((name) => {
                      const tech = findTechByName(techList, name)
                      return (
                        <li key={name} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                          <span className="flex items-center gap-2 text-red-800">
                            <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                            {name}
                          </span>
                          {tech ? (
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/tecnologias/${tech.id}`}>
                                Estudar {name}
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" asChild>
                              <Link to="/app/trilha">
                                Ver trilha
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-5 w-5 text-[var(--color-primary)]" />
                Plano sugerido pela IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.suggestedPlan}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  )
}
