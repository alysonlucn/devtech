import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface SidebarLink {
  to: string
  label: string
}

export interface SidebarSection {
  title: string
  links: SidebarLink[]
}

interface SidebarProps {
  links?: SidebarLink[]
  sections?: SidebarSection[]
}

export function Sidebar({ links, sections }: SidebarProps) {
  const resolvedSections = sections ?? (links ? [{ title: 'Menu', links }] : [])

  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <nav className="sticky top-20 space-y-6">
        {resolvedSections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-accent)]',
                      isActive && 'bg-[var(--color-accent)] text-[var(--color-primary)]',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export const appSidebarSections: SidebarSection[] = [
  {
    title: 'Aprender',
    links: [
      { to: '/app/dashboard', label: 'Painel' },
      { to: '/app/trilha', label: 'Minha trilha' },
      { to: '/app/progresso', label: 'Progresso' },
      { to: '/app/projetos', label: 'Projetos' },
    ],
  },
  {
    title: 'Ferramentas IA',
    links: [
      { to: '/app/recomendacoes', label: 'Recomendações' },
      { to: '/app/analise-vaga', label: 'Análise de vaga' },
      { to: '/app/avaliacoes', label: 'Avaliações' },
    ],
  },
  {
    title: 'Conta',
    links: [{ to: '/app/perfil', label: 'Perfil' }],
  },
]

/** @deprecated Use appSidebarSections */
export const appSidebarLinks: SidebarLink[] = appSidebarSections.flatMap((s) => s.links)

export const adminSidebarLinks: SidebarLink[] = [
  { to: '/admin/trilhas', label: 'Trilhas' },
  { to: '/admin/tecnologias', label: 'Tecnologias' },
]
