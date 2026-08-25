import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from './cn'

export type CardProps = HTMLAttributes<HTMLDivElement>

export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="card"
        className={cn('rounded-panel border border-border bg-surface shadow-panel', className)}
        {...props}
      />
    )
  },
)
