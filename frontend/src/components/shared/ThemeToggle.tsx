import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeContext'
import type { ThemePreference } from '@/lib/theme'

const labels: Record<ThemePreference, string> = {
  system: 'Tema do sistema',
  light: 'Tema claro',
  dark: 'Tema escuro',
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, cycleTheme } = useTheme()
  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className={className}
      title={`${labels[theme]} — cliques para alternar`}
      aria-label={`${labels[theme]}. Alternar tema`}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}
