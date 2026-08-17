import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PublicLayout } from '@/components/layout/AppShell'
import { FormError, FormErrorBox } from '@/components/shared/FormError'
import { useAuth } from '@/context/AuthContext'
import { readIntendedLearningPathId } from '@/lib/trail-navigation'
import { getApiErrorMessage } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as { from?: { pathname?: string }; intendedLearningPathId?: string } | null
  const from = locationState?.from?.pathname ?? '/app/dashboard'
  const intendedLearningPathId = readIntendedLearningPathId(locationState)
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    setFormError(null)
    try {
      await login(data.email, data.password)
      toast.success('Acesso realizado com sucesso!')
      navigate(from, {
        replace: true,
        state: intendedLearningPathId ? { intendedLearningPathId } : undefined,
      })
    } catch (error) {
      const message = getApiErrorMessage(error, 'Não foi possível entrar. Verifique o e-mail e a senha.')
      setFormError(message)
      toast.error(message)
    }
  }

  return (
    <PublicLayout>
      <div className="hero-gradient flex min-h-[70vh] flex-col items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              {intendedLearningPathId
                ? 'Entre para confirmar a trilha escolhida'
                : 'Acesse sua conta DevTech'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    autoComplete="current-password"
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
              </div>

              <button
                type="button"
                className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] hover:underline"
                title="Em breve"
                onClick={() => toast.info('Recuperação de senha em breve')}
              >
                Esqueci a senha
              </button>

              <FormErrorBox>{formError}</FormErrorBox>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-[var(--color-muted-foreground)]">
              Seus dados ficam na sua conta DevTech
            </p>

            <p className="mt-4 text-center text-sm text-[var(--color-muted-foreground)]">
              Não tem conta?{' '}
              <Link
                to="/register"
                state={locationState ?? undefined}
                className="text-[var(--color-primary)] hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  )
}
