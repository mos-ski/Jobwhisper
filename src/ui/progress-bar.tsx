import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from './cn'

export type ProgressSize = 'sm' | 'md' | 'lg'

export type ProgressProps = HTMLAttributes<HTMLDivElement> & {
  readonly value?: number
  readonly max?: number
  readonly size?: ProgressSize
  readonly color?: 'accent' | 'positive' | 'warning' | 'danger'
  readonly label?: string
  readonly showValue?: boolean
  readonly indeterminate?: boolean
}

const sizeStyles: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

const colorStyles: Record<string, string> = {
  accent: 'bg-accent',
  positive: 'bg-positive',
  warning: 'bg-warning',
  danger: 'bg-danger',
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressProps>(
  function ProgressBar(
    {
      className,
      value = 0,
      max = 100,
      size = 'md',
      color = 'accent',
      label,
      showValue = false,
      indeterminate = false,
      ...props
    },
    ref,
  ) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div ref={ref} data-slot="progress" className={cn('flex flex-col gap-1.5', className)} {...props}>
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && <span className="text-sm font-medium text-ink">{label}</span>}
            {showValue && (
              <span className="text-sm text-ink-muted">{Math.round(percentage)}%</span>
            )}
          </div>
        )}
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
          className={cn(
            'w-full overflow-hidden rounded-full bg-muted',
            sizeStyles[size],
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-normal ease-default',
              colorStyles[color],
              indeterminate && 'w-full animate-indeterminate',
            )}
            style={indeterminate ? undefined : { width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  },
)
