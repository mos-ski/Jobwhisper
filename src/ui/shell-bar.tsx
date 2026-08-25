import { forwardRef, type ReactNode } from 'react'
import { Home, ChevronRight, X, Download } from 'lucide-react'

import { cn } from './cn'

export type ShellBarAction = {
  readonly label: string
  readonly href: string
  readonly icon?: ReactNode
}

export type ShellBarCrumb = {
  readonly label: string
  readonly href: string
}

export type ShellBarProps = {
  readonly homeHref: string
  readonly parent?: ShellBarCrumb
  readonly current: string
  readonly closeHref?: string
  readonly closeLabel?: string
  readonly action?: ShellBarAction
  readonly secondaryAction?: ShellBarAction
  readonly className?: string
  readonly children?: ReactNode
}

export const ShellBar = forwardRef<HTMLElement, ShellBarProps>(
  function ShellBar({ homeHref, parent, current, closeHref, closeLabel = 'Close', action, secondaryAction, className, children, ...props }, ref) {
    return (
      <header
        ref={ref}
        data-slot="shell-bar"
        className={cn('flex min-h-14 items-center justify-between overflow-hidden border-b border-border bg-surface px-4 py-2 text-sm', className)}
        {...props}
      >
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-3">
          <a href={homeHref} className="inline-flex min-h-9 shrink-0 items-center gap-3 rounded-soft text-base font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <Home aria-hidden="true" className="size-5" />
            Go Home
          </a>
          {parent ? (
            <>
              <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
              <a href={parent.href} className="shrink-0 truncate rounded-soft text-base font-semibold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus hover:underline">
                {parent.label}
              </a>
            </>
          ) : null}
          <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
          <span className="truncate text-base font-semibold text-ink" aria-current="page">
            {current}
          </span>
        </nav>

        <div className="flex min-h-9 shrink-0 items-center gap-8">
          {children}
          {secondaryAction ? (
            <a href={secondaryAction.href} className="hidden min-h-9 items-center gap-3 rounded-soft px-2 text-base font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:inline-flex">
              {secondaryAction.icon ? (
                <span className="shrink-0 [&>svg]:size-5">{secondaryAction.icon}</span>
              ) : null}
              {secondaryAction.label}
            </a>
          ) : null}
          {action ? (
            <a
              href={action.href}
              className="inline-flex min-h-9 items-center justify-center gap-3 rounded-lg bg-accent px-4 py-2 text-base font-semibold leading-6 text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <span className="shrink-0 [&>svg]:size-5">{action.icon ?? <Download aria-hidden="true" />}</span>
              {action.label}
            </a>
          ) : closeHref ? (
            <a href={closeHref} aria-label={closeLabel} className="grid size-9 place-items-center rounded-soft text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <X aria-hidden="true" className="size-4" />
            </a>
          ) : null}
        </div>
      </header>
    )
  },
)
