import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { GraduationCap, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const publicLinks = [
  { to: '/trilhas', label: 'Trilhas' },
  { to: '/tecnologias', label: 'Tecnologias' },
]

export function Header() {
  const { isAuthenticated, isAdmin } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <GraduationCap className="h-6 w-6 text-[var(--color-primary)]" />
          DevTech
        </Link>

        <nav className="hidden items-center gap-6 sm:flex" aria-label="Navegação principal">
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors hover:text-[var(--color-primary)]',
                  isActive && 'text-[var(--color-primary)]',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/dashboard">Área do aluno</Link>
              </Button>
              {isAdmin && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/trilhas">Administração</Link>
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Cadastrar</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent
          className="fixed inset-y-0 right-0 left-auto top-0 z-50 flex h-full w-[min(100%,20rem)] max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-l border-[var(--color-border)] p-0 shadow-xl data-[state=open]:animate-none"
          aria-describedby={undefined}
        >
          <DialogHeader className="border-b border-[var(--color-border)] p-4 text-left">
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[var(--color-primary)]" />
              Menu
            </DialogTitle>
            <DialogDescription className="sr-only">Navegação do site DevTech</DialogDescription>
          </DialogHeader>

          <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Menu mobile">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-[var(--color-accent)]',
                    isActive && 'bg-[var(--color-accent)] text-[var(--color-primary)]',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="my-3 border-t border-[var(--color-border)]" />

            {isAuthenticated ? (
              <>
                <Button variant="default" className="w-full justify-start" asChild>
                  <Link to="/app/dashboard" onClick={closeMenu}>
                    Área do aluno
                  </Link>
                </Button>
                {isAdmin && (
                  <Button variant="outline" className="mt-2 w-full justify-start" asChild>
                    <Link to="/admin/trilhas" onClick={closeMenu}>
                      Administração
                    </Link>
                  </Button>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login" onClick={closeMenu}>
                    Entrar
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link to="/register" onClick={closeMenu}>
                    Cadastrar
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </DialogContent>
      </Dialog>
    </header>
  )
}
