import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { X } from 'lucide-react'

import { cn } from './cn'

export type ChipVariant = 'default' | 'accent' | 'positive' | 'warning' | 'danger'

const variantClasses: Record<ChipVariant, string> = {
  default: 'border-border bg-surface-subtle text-ink-muted',
  accent: 'border-accent/20 bg-accent-subtle text-accent-text',
  positive: 'border-positive/20 bg-positive-surface text-positive',
  warning: 'border-warning/20 bg-warning-surface text-warning',
  danger: 'border-danger/20 bg-danger-surface text-danger',
}

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly variant?: ChipVariant
  readonly removable?: boolean
  readonly onRemove?: () => void
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  function Chip({ variant = 'default', removable = false, onRemove, className, children, ...props }, ref) {
    return (
      <span
        data-slot="chip"
        data-variant={variant}
        className={cn(
          'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-sm font-medium',
          variantClasses[variant],
          className,
        )}
      >
        {children}
        {removable ? (
          <button
            ref={ref}
            type="button"
            onClick={onRemove}
            className="ms-0.5 -me-1 grid size-4 place-items-center rounded-full hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            aria-label="Remove"
            {...props}
          >
            <X aria-hidden="true" className="size-3" />
          </button>
        ) : null}
      </span>
    )
  },
)
