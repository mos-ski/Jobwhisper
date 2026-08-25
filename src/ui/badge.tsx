import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from './cn'

export type BadgeVariant = 'neutral' | 'accent' | 'positive' | 'warning' | 'danger' | 'info'
export type BadgeSize = 'sm' | 'md'

const variants: Record<BadgeVariant, string> = {
  neutral: 'border-border bg-surface-subtle text-ink-muted',
  accent: 'border-focus bg-surface text-accent-text',
  positive: 'border-positive/20 bg-positive-surface text-positive',
  warning: 'border-warning/20 bg-warning-surface text-warning',
  danger: 'border-danger/20 bg-danger-surface text-danger',
  info: 'border-info/20 bg-info-surface text-info',
}

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs leading-4',
  md: 'px-2.5 py-0.5 text-sm leading-5',
}

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  readonly variant?: BadgeVariant
  readonly size?: BadgeSize
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge({ className, variant = 'neutral', size = 'md', ...props }, ref) {
    return (
      <span
        ref={ref}
        data-slot="badge"
        data-variant={variant}
        data-size={size}
        className={cn(
          'inline-flex items-center rounded-full border font-medium',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    )
  },
)
