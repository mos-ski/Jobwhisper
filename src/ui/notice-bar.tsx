import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { X } from 'lucide-react'

import { cn } from './cn'

export type NoticeBarTone = 'info' | 'warning' | 'danger'

export type NoticeBarAction = {
  readonly label: string
  readonly onClick?: () => void
  readonly href?: string
}

/** The X is icon-only, so a dismissible notice has to supply its label. */
type NoticeBarDismiss =
  | { readonly onDismiss: () => void; readonly dismissLabel: string }
  | { readonly onDismiss?: never; readonly dismissLabel?: never }

export type NoticeBarProps = HTMLAttributes<HTMLDivElement> &
  NoticeBarDismiss & {
    readonly tone?: NoticeBarTone
    readonly icon?: ReactNode
    readonly action?: NoticeBarAction
  }

const toneStyles: Record<NoticeBarTone, string> = {
  info: 'border-accent/40 bg-accent-subtle text-accent-text',
  warning: 'border-warning/40 bg-warning-surface text-warning',
  danger: 'border-danger bg-danger text-on-danger',
}

const actionStyles: Record<NoticeBarTone, string> = {
  info: 'hover:bg-accent/15',
  warning: 'hover:bg-warning/15',
  danger: 'hover:bg-on-danger/15',
}

/**
 * A short interruption that sits over the thing it interrupts: one line, its action beside
 * it, and no more width than it needs. Full-bleed was the wrong shape for this — a stripe
 * across a 1440px session puts the message and its button a screen apart, and reads as
 * chrome rather than as something to act on.
 */
export const NoticeBar = forwardRef<HTMLDivElement, NoticeBarProps>(function NoticeBar(
  { className, tone = 'info', icon, action, onDismiss, dismissLabel, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      data-slot="notice-bar"
      data-tone={tone}
      className={cn(
        'flex min-h-11 w-fit max-w-full items-center gap-2 rounded-pill border pe-1 ps-4 text-sm shadow-control',
        toneStyles[tone],
        className,
      )}
      {...props}
    >
      {icon ? (
        <span aria-hidden="true" className="grid shrink-0 place-items-center">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 truncate font-medium leading-5">{children}</span>
      {action ? (
        action.href ? (
          <a
            href={action.href}
            onClick={(event) => event.stopPropagation()}
            className={cn(
              'inline-flex min-h-11 shrink-0 items-center rounded-pill px-3 font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
              actionStyles[tone],
            )}
          >
            {action.label}
          </a>
        ) : (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              action.onClick?.()
            }}
            className={cn(
              'inline-flex min-h-11 shrink-0 items-center rounded-pill px-3 font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
              actionStyles[tone],
            )}
          >
            {action.label}
          </button>
        )
      ) : null}
      {onDismiss ? (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={(event) => {
            event.stopPropagation()
            onDismiss()
          }}
          className={cn(
            'grid size-11 shrink-0 place-items-center rounded-pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
            actionStyles[tone],
          )}
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </div>
  )
})
