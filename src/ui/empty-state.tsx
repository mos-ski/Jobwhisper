import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { cn } from './cn'

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  readonly icon?: ReactNode
  readonly title: string
  readonly description?: string
  readonly action?: ReactNode
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState({ icon, title, description, action, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="empty-state"
        className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}
        {...props}
      >
        {icon ? <div className="mb-4 text-ink-muted [&>svg]:size-10">{icon}</div> : null}
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        {description ? <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p> : null}
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    )
  },
)
