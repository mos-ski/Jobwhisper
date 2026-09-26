import { useEffect, useRef, type ReactNode } from 'react'
import { WifiOff, X } from 'lucide-react'

import { JobwhisperMark } from '@/ui'

export type FunnelShellProps = {
  /** Names the current step in the header. */
  readonly label: string
  /** 0 to 1. */
  readonly progress: number
  readonly onClose: () => void
  /** Defaults to "Leave setup". */
  readonly closeLabel?: string
  /** Rendered between the header and the body, e.g. an offline banner. */
  readonly notice?: ReactNode
  /** Pinned under the body; omit for steps whose actions live in the body. */
  readonly footer?: ReactNode
  readonly children: ReactNode
}

export function FunnelShell({ label, progress, onClose, closeLabel = 'Leave setup', notice, footer, children }: FunnelShellProps) {
  const bodyRef = useRef<HTMLElement>(null)
  const percent = Math.round(Math.min(Math.max(progress, 0), 1) * 100)

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
    // The funnel is the public website, and the website is light-only. Dark mode is a
    // preference of the signed-in web app, so pin the subtree to light tokens here instead
    // of letting a reader's stored choice or dark system repaint these screens.
    <div data-slot="funnel-shell" data-theme="light" className="flex h-dvh flex-col bg-canvas text-ink">
      <header className="shrink-0 border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 py-2 sm:px-6">
          <a href="/" aria-label="Jobwhisper home" className="inline-flex min-h-11 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <JobwhisperMark className="h-6 w-auto text-ink" />
          </a>
          <span className="ms-auto truncate text-sm font-medium text-ink-muted">{label}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors duration-normal ease-default hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div role="progressbar" aria-label="Setup progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} className="h-1 w-full bg-accent-subtle">
          <div className="h-full bg-accent transition-[width] duration-slow ease-default motion-reduce:transition-none" style={{ width: `${percent}%` }} />
        </div>
      </header>

      {notice}

      <main ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-14">{children}</div>
      </main>

      {footer ? (
        <footer className="shrink-0 border-t border-border bg-surface">
          <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3 sm:px-6">{footer}</div>
        </footer>
      ) : null}
    </div>
  )
}

export type FunnelTitleProps = {
  readonly children: ReactNode
  readonly id?: string
}

export function FunnelTitle({ children, id }: FunnelTitleProps) {
  return <h1 id={id} data-slot="funnel-title" className="font-gowun text-3xl font-bold leading-tight text-ink sm:text-4xl">{children}</h1>
}

export function FunnelOfflineNotice() {
  return (
    <p role="status" data-slot="funnel-offline-notice" className="flex shrink-0 items-center justify-center gap-2 bg-warning-surface px-4 py-2 text-center text-sm text-ink">
      <WifiOff aria-hidden="true" className="size-4 shrink-0" />
      You are offline. Your answers stay on this page, and you can carry on when you are back online.
    </p>
  )
}
