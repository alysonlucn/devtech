import { NavLink } from 'react-router-dom'
import {
  Briefcase,
  ClipboardCheck,
  FolderKanban,
  LayoutDashboard,
  Map,
  Sparkles,
  TrendingUp,
  User,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SidebarLink {
  to: string
  label: string
  icon?: LucideIcon
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
              {section.links.map((link) => {
                const Icon = link.icon
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-accent)]',
                        isActive && 'bg-[var(--color-accent)] text-[var(--color-primary)]',
                      )
                    }
                  >
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    {link.label}
                  </NavLink>
                )
              })}
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
      { to: '/app/dashboard', label: 'Painel', icon: LayoutDashboard },
      { to: '/app/trilha', label: 'Minha trilha', icon: Map },
      { to: '/app/progresso', label: 'Progresso', icon: TrendingUp },
      { to: '/app/projetos', label: 'Projetos', icon: FolderKanban },
    ],
  },
  {
    title: 'Ferramentas IA',
    links: [
      { to: '/app/recomendacoes', label: 'Recomendações', icon: Sparkles },
      { to: '/app/analise-vaga', label: 'Análise de vaga', icon: Briefcase },
      { to: '/app/avaliacoes', label: 'Avaliações', icon: ClipboardCheck },
    ],
  },
  {
    title: 'Conta',
    links: [{ to: '/app/perfil', label: 'Perfil', icon: User }],
  },
]

/** @deprecated Use appSidebarSections */
export const appSidebarLinks: SidebarLink[] = appSidebarSections.flatMap((s) => s.links)

export const adminSidebarLinks: SidebarLink[] = [
  { to: '/admin/trilhas', label: 'Trilhas', icon: Map },
  { to: '/admin/tecnologias', label: 'Tecnologias', icon: Sparkles },
]
