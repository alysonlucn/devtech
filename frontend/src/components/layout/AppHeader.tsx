import { Link } from 'react-router-dom'
import { GraduationCap, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { getLevelInfo } from '@/lib/gamification'

export function AppHeader() {
  const { user, profile, logout, isAdmin } = useAuth()
  const levelInfo = profile ? getLevelInfo(profile.totalXp) : null

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/app/dashboard"
          className="flex shrink-0 items-center gap-2 font-bold text-lg tracking-tight"
        >
          <GraduationCap className="h-6 w-6 text-[var(--color-primary)]" />
          DevTech
        </Link>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {levelInfo && (
            <>
              <div
                className="flex items-center gap-1.5 rounded-lg bg-[var(--color-muted)] px-2 py-1 sm:hidden"
                title={`${levelInfo.currentXp} XP · ${levelInfo.title}`}
              >
                <span className="text-xs font-semibold text-[var(--color-xp)]">
                  Nv.{levelInfo.level}
                </span>
              </div>
              <div
                className="hidden items-center gap-2 rounded-lg bg-[var(--color-muted)] px-2.5 py-1.5 sm:flex"
                title={`${levelInfo.currentXp} XP · ${levelInfo.title}`}
              >
                <span className="text-xs font-semibold text-[var(--color-xp)]">
                  Nv. {levelInfo.level}
                </span>
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--color-border)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-xp)] transition-all"
                    style={{ width: `${levelInfo.progressToNext}%` }}
                  />
                </div>
                <span className="text-xs text-[var(--color-muted-foreground)] tabular-nums">
                  {levelInfo.currentXp} XP
                </span>
              </div>
            </>
          )}

          {isAdmin && (
            <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/admin/trilhas">Admin</Link>
            </Button>
          )}

          <Link
            to="/app/perfil"
            className="flex min-w-0 items-center gap-1.5 sm:gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-[var(--color-accent)]"
          >
            <User className="hidden h-4 w-4 shrink-0 text-[var(--color-muted-foreground)] sm:block" />
            <span className="truncate text-sm font-medium max-w-[8rem] sm:max-w-[12rem]">
              {user?.name}
            </span>
          </Link>

          <Button variant="ghost" size="icon" onClick={logout} title="Sair" aria-label="Sair da conta">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
