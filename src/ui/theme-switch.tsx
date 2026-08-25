import { forwardRef, useCallback, useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

import { cn } from './cn'

type Theme = 'light' | 'dark'

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('lf-theme') as Theme | null
  return stored === 'dark' ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export type ThemeSwitchProps = {
  readonly className?: string
  readonly size?: 'sm' | 'md'
}

export const ThemeSwitch = forwardRef<HTMLButtonElement, ThemeSwitchProps>(
  function ThemeSwitch({ className, size = 'md' }, ref) {
    const [theme, setTheme] = useState<Theme>(getStoredTheme)

    useEffect(() => {
      applyTheme(theme)
      localStorage.setItem('lf-theme', theme)
    }, [theme])

    const cycle = useCallback(() => {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
    }, [])

    const icon = theme === 'light'
      ? <Sun aria-hidden="true" className={cn(size === 'sm' ? 'size-3.5' : 'size-4')} />
      : <Moon aria-hidden="true" className={cn(size === 'sm' ? 'size-3.5' : 'size-4')} />

    return (
      <button
        ref={ref}
        type="button"
        data-slot="theme-switch"
        data-theme={theme}
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        onClick={cycle}
        className={cn(
          'inline-flex items-center justify-center rounded-lg text-ink-muted transition-colors duration-normal ease-default hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
          size === 'sm' && 'size-8',
          size === 'md' && 'size-10',
          className,
        )}
      >
        {icon}
      </button>
    )
  },
)
