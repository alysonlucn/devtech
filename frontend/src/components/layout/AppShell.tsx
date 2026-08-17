import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { Sidebar, type SidebarLink, type SidebarSection } from '@/components/layout/Sidebar'
import { useAuth } from '@/context/AuthContext'

interface AppShellProps {
  children: ReactNode
  sidebarLinks?: SidebarLink[]
  sidebarSections?: SidebarSection[]
  showMobileNav?: boolean
}

export function AppShell({
  children,
  sidebarLinks,
  sidebarSections,
  showMobileNav = true,
}: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <AppHeader />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 pb-24 lg:pb-8">
        {(sidebarLinks || sidebarSections) && (
          <Sidebar links={sidebarLinks} sections={sidebarSections} />
        )}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      {showMobileNav && <MobileNav />}
    </div>
  )
}

export function PublicLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-muted)]/30 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div>
            <p className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
              <GraduationCap className="h-5 w-5 text-[var(--color-primary)]" />
              DevTech
            </p>
            <p className="mt-2 max-w-xs text-sm text-[var(--color-muted-foreground)]">
              Trilhas, progresso gamificado e mentoria com IA para desenvolvedores.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
            <div className="space-y-2">
              <p className="font-semibold">Explorar</p>
              <Link to="/trilhas" className="block text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)]">
                Trilhas
              </Link>
              <Link to="/tecnologias" className="block text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)]">
                Tecnologias
              </Link>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Conta</p>
              {isAuthenticated ? (
                <>
                  <Link to="/app/dashboard" className="block text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)]">
                    Painel
                  </Link>
                  <Link to="/app/perfil" className="block text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)]">
                    Perfil
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)]">
                    Entrar
                  </Link>
                  <Link to="/register" className="block text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)]">
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl px-4 text-xs text-[var(--color-muted-foreground)] sm:px-6">
          © {new Date().getFullYear()} DevTech — Plataforma de mentoria para desenvolvedores
        </p>
      </footer>
    </div>
  )
}
