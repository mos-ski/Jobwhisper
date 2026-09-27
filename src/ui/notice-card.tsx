import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { X } from 'lucide-react'

import { cn } from './cn'

export type NoticeCardTone = 'neutral' | 'warning' | 'danger'

export type NoticeCardAction = {
  readonly label: string
  readonly onClick?: () => void
  readonly href?: string
}

/** The X is icon-only, so a dismissible card has to supply its label. */
type NoticeCardDismiss =
  | { readonly onDismiss: () => void; readonly dismissLabel: string }
  | { readonly onDismiss?: never; readonly dismissLabel?: never }

export type NoticeCardProps = HTMLAttributes<HTMLDivElement> &
  NoticeCardDismiss & {
    readonly tone?: NoticeCardTone
    readonly title: string
    /** One line under the title: when it lifts, what it costs, what resets. */
    readonly description?: ReactNode
    readonly action?: NoticeCardAction
  }

const toneStyles: Record<NoticeCardTone, string> = {
  neutral: 'border-border bg-surface',
  warning: 'border-warning/40 bg-warning-surface',
  danger: 'border-danger/40 bg-danger-surface',
}

/**
 * The same notice as `NoticeBar`, shaped for a thumb: title, one line of detail, and the
 * action as a full-width button rather than a link at the end of a sentence. A one-line
 * strip works on a wide screen, where the action lands beside the text; on a phone it
 * leaves the only thing worth tapping as a few underlined words, so this stacks instead and
 * docks to the bottom of the screen where the thumb already is.
 */
export const NoticeCard = forwardRef<HTMLDivElement, NoticeCardProps>(function NoticeCard(
  { className, tone = 'neutral', title, description, action, onDismiss, dismissLabel, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      data-slot="notice-card"
      data-tone={tone}
      className={cn('rounded-panel border p-4 shadow-panel', toneStyles[tone], className)}
      {...props}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold leading-6 text-ink">{title}</p>
          {description ? <p className="mt-0.5 text-sm leading-5 text-ink-muted">{description}</p> : null}
        </div>
        {onDismiss ? (
          <button
            type="button"
            aria-label={dismissLabel}
            onClick={(event) => {
              event.stopPropagation()
              onDismiss()
            }}
            className="-me-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-pill text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        ) : null}
      </div>
      {action ? (
        action.href ? (
          <a
            href={action.href}
            onClick={(event) => event.stopPropagation()}
            className="mt-3 flex min-h-11 w-full items-center justify-center rounded-pill bg-surface-subtle px-4 text-sm font-semibold text-ink hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
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
            className="mt-3 flex min-h-11 w-full items-center justify-center rounded-pill bg-surface-subtle px-4 text-sm font-semibold text-ink hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {action.label}
          </button>
        )
      ) : null}
    </div>
  )
})
