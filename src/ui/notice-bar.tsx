import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { X } from 'lucide-react'

import { cn } from './cn'

export type NoticeBarTone = 'neutral' | 'warning' | 'danger'

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
  neutral: 'bg-surface-subtle text-ink',
  warning: 'bg-warning-surface text-warning',
  danger: 'bg-danger-surface text-danger',
}

/**
 * A quiet line of state docked to the surface it belongs to: the message on one side, the
 * one thing to do about it on the other, and nothing else. No icon, no border, no shadow,
 * no card — it is a status line, not an alert, and dressing it up as an alert is what makes
 * it shout over the work it is interrupting.
 *
 * Tone tints the strip rather than filling it. Meaning lives in the words, so a reader who
 * cannot separate the tints still reads the same notice.
 */
export const NoticeBar = forwardRef<HTMLDivElement, NoticeBarProps>(function NoticeBar(
  { className, tone = 'neutral', icon, action, onDismiss, dismissLabel, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      data-slot="notice-bar"
      data-tone={tone}
      className={cn('flex min-h-11 w-full items-center gap-3 px-4 text-sm', toneStyles[tone], className)}
      {...props}
    >
      {icon ? (
        <span aria-hidden="true" className="grid shrink-0 place-items-center">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 truncate leading-5">{children}</span>
      {action ? (
        action.href ? (
          <a
            href={action.href}
            onClick={(event) => event.stopPropagation()}
            className="inline-flex min-h-11 shrink-0 items-center px-1 font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
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
            className="inline-flex min-h-11 shrink-0 items-center px-1 font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
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
          className="-me-3 grid size-11 shrink-0 place-items-center opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </div>
  )
})
