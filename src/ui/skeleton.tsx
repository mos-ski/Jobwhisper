import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from './cn'

export type SkeletonProps = HTMLAttributes<HTMLDivElement>

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="skeleton"
        aria-hidden="true"
        className={cn('animate-pulse rounded-lg bg-surface-subtle motion-reduce:animate-none', className)}
        {...props}
      />
    )
  },
)
