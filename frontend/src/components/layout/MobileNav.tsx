import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Briefcase,
  ClipboardCheck,
  FolderKanban,
  LayoutDashboard,
  Map,
  MoreHorizontal,
  Shield,
  Sparkles,
  TrendingUp,
  User,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const primaryLinks = [
  { to: '/app/dashboard', label: 'Painel', icon: LayoutDashboard },
  { to: '/app/trilha', label: 'Trilha', icon: Map },
  { to: '/app/progresso', label: 'Progresso', icon: TrendingUp },
  { to: '/app/avaliacoes', label: 'Avaliações', icon: ClipboardCheck },
]

const moreLinks = [
  { to: '/app/projetos', label: 'Projetos', icon: FolderKanban },
  { to: '/app/recomendacoes', label: 'Recomendações', icon: Sparkles },
  { to: '/app/analise-vaga', label: 'Análise de vaga', icon: Briefcase },
  { to: '/app/perfil', label: 'Perfil', icon: User },
]

const morePaths = moreLinks.map((link) => link.to)

export function MobileNav() {
  const { isAdmin } = useAuth()
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)

  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/app/onboarding')) {
    return null
  }

  const moreActive =
    morePaths.some((path) => location.pathname.startsWith(path)) ||
    (isAdmin && location.pathname.startsWith('/admin'))

  function closeMore() {
    setMoreOpen(false)
  }

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur lg:hidden"
        aria-label="Navegação do app"
      >
        <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
          {primaryLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-1 flex-col items-center gap-1 px-1 py-3 text-[0.7rem] font-medium transition-colors sm:text-xs',
                  isActive
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 px-1 py-3 text-[0.7rem] font-medium transition-colors sm:text-xs',
              moreActive
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
            )}
            aria-label="Mais opções"
          >
            <MoreHorizontal className="h-5 w-5" />
            Mais
          </button>
        </div>
      </nav>

      <Dialog open={moreOpen} onOpenChange={setMoreOpen}>
        <DialogContent
          className="fixed inset-x-0 bottom-0 top-auto left-1/2 z-50 flex w-full max-w-lg -translate-x-1/2 translate-y-0 flex-col gap-0 rounded-t-2xl rounded-b-none border border-[var(--color-border)] border-b-0 p-0 shadow-xl data-[state=open]:slide-in-from-bottom-4"
          aria-describedby={undefined}
        >
          <DialogHeader className="border-b border-[var(--color-border)] p-4 text-left">
            <DialogTitle>Mais</DialogTitle>
            <DialogDescription className="sr-only">Outras seções do app</DialogDescription>
          </DialogHeader>

          <nav className="flex flex-col gap-1 p-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {moreLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMore}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-[var(--color-accent)]',
                    isActive && 'bg-[var(--color-accent)] text-[var(--color-primary)]',
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </NavLink>
            ))}

            {isAdmin && (
              <NavLink
                to="/admin/trilhas"
                onClick={closeMore}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-[var(--color-accent)]',
                    isActive && 'bg-[var(--color-accent)] text-[var(--color-primary)]',
                  )
                }
              >
                <Shield className="h-5 w-5 shrink-0" />
                Admin
              </NavLink>
            )}
          </nav>
        </DialogContent>
      </Dialog>
    </>
  )
}
