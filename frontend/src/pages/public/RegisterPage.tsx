import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Check, Eye, EyeOff, X } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PublicLayout } from '@/components/layout/AppShell'
import { FormError } from '@/components/shared/FormError'
import { useAuth } from '@/context/AuthContext'
import { readIntendedLearningPathId } from '@/lib/trail-navigation'
import { cn, getApiErrorMessage } from '@/lib/utils'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Inclua ao menos uma letra maiúscula')
    .regex(/[a-z]/, 'Inclua ao menos uma letra minúscula')
    .regex(/[0-9]/, 'Inclua ao menos um número'),
})

type RegisterForm = z.infer<typeof registerSchema>

const passwordRules = [
  { id: 'length', label: 'Pelo menos 8 caracteres', test: (v: string) => v.length >= 8 },
  { id: 'upper', label: 'Uma letra maiúscula', test: (v: string) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'Uma letra minúscula', test: (v: string) => /[a-z]/.test(v) },
  { id: 'number', label: 'Um número', test: (v: string) => /[0-9]/.test(v) },
]

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const intendedLearningPathId = readIntendedLearningPathId(location.state)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { password: '' },
  })

  const passwordValue = watch('password') ?? ''

  async function onSubmit(data: RegisterForm) {
    try {
      await registerUser(data.name, data.email, data.password)
      toast.success('Conta criada com sucesso!')
      navigate('/app/onboarding', {
        state: intendedLearningPathId ? { intendedLearningPathId } : undefined,
      })
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Erro ao criar conta'))
    }
  }

  return (
    <PublicLayout>
      <div className="hero-gradient flex min-h-[70vh] flex-col items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>
              {intendedLearningPathId
                ? 'Crie sua conta para confirmar a trilha escolhida'
                : 'Comece sua jornada no DevTech'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  {...register('name')}
                />
                <FormError>{errors.name?.message}</FormError>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                <FormError>{errors.email?.message}</FormError>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="pr-10"
                    aria-invalid={!!errors.password}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FormError>{errors.password?.message}</FormError>

                <ul className="mt-2 space-y-1.5" aria-label="Requisitos da senha">
                  {passwordRules.map((rule) => {
                    const ok = rule.test(passwordValue)
                    return (
                      <li
                        key={rule.id}
                        className={cn(
                          'flex items-center gap-2 text-xs',
                          ok ? 'text-[var(--color-success-foreground)]' : 'text-[var(--color-muted-foreground)]',
                        )}
                      >
                        {ok ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                        {rule.label}
                      </li>
                    )
                  })}
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Criando...' : 'Cadastrar'}
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-[var(--color-muted-foreground)]">
              Seus dados ficam na sua conta DevTech
            </p>

            <p className="mt-4 text-center text-sm text-[var(--color-muted-foreground)]">
              Já tem conta?{' '}
              <Link
                to="/login"
                state={location.state ?? undefined}
                className="text-[var(--color-primary)] hover:underline"
              >
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  )
}
