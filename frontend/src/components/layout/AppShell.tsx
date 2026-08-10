import { Link } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { Sidebar, type SidebarLink, type SidebarSection } from '@/components/layout/Sidebar'

interface AppShellProps {
  children: React.ReactNode
  sidebarLinks?: SidebarLink[]
  sidebarSections?: SidebarSection[]
  title?: string
  showMobileNav?: boolean
}

export function AppShell({
  children,
  sidebarLinks,
  sidebarSections,
  title,
  showMobileNav = true,
}: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 pb-24 lg:pb-8">
        {(sidebarLinks || sidebarSections) && (
          <Sidebar links={sidebarLinks} sections={sidebarSections} />
        )}
        <main className="flex-1 min-w-0">
          {title && <p className="mb-2 text-sm text-[var(--color-muted-foreground)]">{title}</p>}
          {children}
        </main>
      </div>
      {showMobileNav && <MobileNav />}
    </div>
  )
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[var(--color-border)] py-6 text-center text-sm text-[var(--color-muted-foreground)]">
        <p>
          DevTech — Plataforma de mentoria para desenvolvedores ·{' '}
          <Link to="/trilhas" className="underline hover:text-[var(--color-primary)]">Trilhas</Link>
          {' · '}
          <Link to="/tecnologias" className="underline hover:text-[var(--color-primary)]">Tecnologias</Link>
        </p>
      </footer>
    </div>
  )
}
