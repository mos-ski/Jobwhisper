import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { JobwhisperMark } from '@/ui'
import { ThemeSwitch } from '@/ui/theme-switch'

export type HelpCenterLayoutProps = {
  readonly children: ReactNode
}

export function HelpCenterLayout({ children }: HelpCenterLayoutProps) {
  return (
    <div data-slot="help-center-layout" className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-sticky border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link
            to="/help"
            className="flex items-center gap-2 text-ink transition-colors duration-fast hover:text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <JobwhisperMark className="h-6" />
            <span className="text-sm font-semibold tracking-tight">Help Center</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/v3"
              className="text-sm text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              Open App
            </Link>
            <ThemeSwitch />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 text-xs text-ink-muted">
          <span>&copy; {new Date().getFullYear()} Jobwhisper</span>
          <div className="flex gap-4">
            <a href="mailto:support@jobwhisper.org" className="hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              Contact Support
            </a>
            <Link to="/v3" className="hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              Open App
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
