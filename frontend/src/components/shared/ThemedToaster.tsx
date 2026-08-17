import { Toaster } from 'sonner'
import { useTheme } from '@/context/ThemeContext'
import { resolveTheme } from '@/lib/theme'

export function ThemedToaster() {
  const { theme } = useTheme()
  return (
    <Toaster
      position="top-right"
      closeButton
      theme={resolveTheme(theme)}
      toastOptions={{
        className: 'font-[family-name:var(--font-body)]',
        style: {
          background: 'var(--color-card)',
          color: 'var(--color-foreground)',
          border: '1px solid var(--color-border)',
        },
      }}
    />
  )
}
