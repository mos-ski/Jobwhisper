import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Check } from 'lucide-react'

import { cn } from './cn'

export type StepStatus = 'complete' | 'active' | 'pending'

export type StepItem = {
  readonly id: string
  readonly label: string
  readonly status: StepStatus
  readonly icon?: ReactNode
}

export type StepIndicatorProps = HTMLAttributes<HTMLOListElement> & {
  readonly steps: readonly StepItem[]
  readonly orientation?: 'horizontal' | 'vertical'
}

const statusClasses: Record<StepStatus, string> = {
  complete: 'bg-positive text-on-accent',
  active: 'bg-accent text-on-accent ring-2 ring-focus ring-offset-2 ring-offset-surface',
  pending: 'bg-surface-subtle text-ink-muted border border-border',
}

export const StepIndicator = forwardRef<HTMLOListElement, StepIndicatorProps>(
  function StepIndicator({ steps, orientation = 'horizontal', className, ...props }, ref) {
    return (
      <ol
        ref={ref}
        data-slot="step-indicator"
        className={cn(
          'flex flex-wrap items-center gap-3',
          orientation === 'vertical' ? 'flex-col items-start' : '',
          className,
        )}
        {...props}
      >
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-center gap-3">
            <span className={cn('grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold', statusClasses[step.status])}>
              {step.status === 'complete' ? (
                step.icon ?? <Check aria-hidden="true" className="size-4" />
              ) : (
                index + 1
              )}
            </span>
            <span className={cn('text-sm font-medium', step.status === 'active' ? 'text-ink' : step.status === 'complete' ? 'text-ink' : 'text-ink-muted')}>
              {step.label}
            </span>
            {index < steps.length - 1 && orientation === 'horizontal' && (
              <span className="h-px w-8 bg-border" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    )
  },
)
