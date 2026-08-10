import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TechnologyAvatar } from '@/components/shared/TechnologyAvatar'
import type { Technology } from '@/types/entities'

interface NextStepCardProps {
  title: string
  description: string
  actionLabel: string
  actionTo: string
  technology?: Technology
  variant?: 'default' | 'onboarding'
}

export function NextStepCard({
  title,
  description,
  actionLabel,
  actionTo,
  technology,
  variant = 'default',
}: NextStepCardProps) {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-[var(--color-primary)] to-[color-mix(in_oklch,var(--color-primary)_55%,black)] text-white shadow-lg">
      <CardContent className="relative p-6 sm:p-8">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5 blur-xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            {technology ? (
              <TechnologyAvatar
                name={technology.name}
                slug={technology.slug}
                category={technology.category}
                size="lg"
                className="ring-white/30"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20">
                <Sparkles className="h-7 w-7" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-white/80">
                {variant === 'onboarding' ? 'Primeiro passo' : 'Seu próximo passo'}
              </p>
              <h2 className="mt-1 text-xl font-bold sm:text-2xl">{title}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85">{description}</p>
            </div>
          </div>
          <Button
            size="lg"
            variant="secondary"
            className="shrink-0 bg-white text-[var(--color-primary)] hover:bg-white/90"
            asChild
          >
            <Link to={actionTo}>
              {actionLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
