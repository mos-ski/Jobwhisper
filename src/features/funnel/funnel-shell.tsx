import { useEffect, useRef, type ReactNode } from 'react'
import { WifiOff, X } from 'lucide-react'

import { cn, JobwhisperMark } from '@/ui'

export type FunnelShellWidth = 'narrow' | 'wide'

export type FunnelShellProps = {
  /** Names the current step in the header. */
  readonly label: string
  readonly stepCount: number
  /** 1-based; how many segments of the progress line are filled. */
  readonly currentStep: number
  readonly onClose: () => void
  /** Defaults to "Leave setup". */
  readonly closeLabel?: string
  /** Rendered under the header, e.g. an offline banner. */
  readonly notice?: ReactNode
  /** Pinned under the body; omit for steps whose actions live in the body. */
  readonly footer?: ReactNode
  /** `narrow` for questions and forms, `wide` for results that need room. Defaults to `narrow`. */
  readonly width?: FunnelShellWidth
  readonly children: ReactNode
}

const widths: Record<FunnelShellWidth, string> = {
  narrow: 'max-w-xl',
  wide: 'max-w-3xl',
}

export function FunnelShell({ label, stepCount, currentStep, onClose, closeLabel = 'Leave setup', notice, footer, width = 'narrow', children }: FunnelShellProps) {
  const bodyRef = useRef<HTMLElement>(null)
  const filled = Math.min(Math.max(currentStep, 0), stepCount)
  const percent = stepCount > 0 ? Math.round((filled / stepCount) * 100) : 0

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  // Each step replaces the body, so the previous step's scroll position means nothing here.
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [label])

  return (
    // Light only, like the landing page the funnels are entered from; the tokens re-scope to light under this attribute.
    <div data-slot="funnel-shell" data-width={width} data-theme="light" className="flex h-dvh flex-col bg-surface text-ink">
      <header className="shrink-0 px-3 pt-3 sm:px-6 sm:pt-5">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 rounded-full bg-surface-inverse py-1 pe-1 ps-4 text-surface sm:ps-6">
          <a href="/" aria-label="Jobwhisper home" className="inline-flex min-h-11 items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <JobwhisperMark className="h-5 w-auto text-surface sm:h-6" />
          </a>
          <span className="ms-auto truncate text-sm font-medium">{label}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div
          role="progressbar"
          aria-label="Setup progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="mx-auto mt-3 flex w-full max-w-3xl gap-1 px-2"
        >
          {Array.from({ length: stepCount }, (_, index) => (
            <span
              key={index}
              className={cn('h-1 flex-1 rounded-full', index < filled ? 'bg-accent' : 'bg-border')}
            />
          ))}
        </div>
      </header>

      {notice}

      <main ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn('mx-auto w-full px-4 pb-10 pt-8 sm:px-6 sm:pb-16 sm:pt-14', widths[width])}>{children}</div>
      </main>

      {footer ? (
        // The safe-area inset keeps the pinned action clear of the home indicator on notched phones.
        <footer className="shrink-0 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
          <div className={cn('mx-auto flex w-full items-center gap-3 px-4 py-3 sm:px-6', widths[width])}>{footer}</div>
        </footer>
      ) : null}
    </div>
  )
}

export type FunnelTitleProps = {
  readonly children: ReactNode
  readonly id?: string
  /** A short line above the title, e.g. "Your ATS score". */
  readonly eyebrow?: string
  /** Defaults to `center`; `start` for detail screens that read like a document. */
  readonly align?: 'center' | 'start'
}

export function FunnelTitle({ children, id, eyebrow, align = 'center' }: FunnelTitleProps) {
  return (
    <div data-slot="funnel-title" className={cn('grid gap-3', align === 'center' ? 'text-center' : 'text-start')}>
      {eyebrow ? <p className="text-sm font-semibold text-accent-text">{eyebrow}</p> : null}
      <h1 id={id} className="text-balance font-gowun text-3xl font-bold leading-tight text-ink sm:text-5xl">{children}</h1>
    </div>
  )
}

export function FunnelOfflineNotice() {
  return (
    <div className="shrink-0 px-3 pt-3 sm:px-6">
      <p role="status" data-slot="funnel-offline-notice" className="mx-auto flex max-w-3xl items-center justify-center gap-2 rounded-full bg-warning-surface px-4 py-2 text-center text-sm text-ink">
        <WifiOff aria-hidden="true" className="size-4 shrink-0" />
        You are offline. Your answers stay on this page, and you can carry on when you are back online.
      </p>
    </div>
  )
}
