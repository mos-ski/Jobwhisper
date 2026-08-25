import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from './cn'

export type VisuallyHiddenProps = HTMLAttributes<HTMLSpanElement>

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ className, ...props }, ref) {
    return (
      <span
        ref={ref}
        className={cn(
          'absolute size-px overflow-hidden whitespace-nowrap border-0 p-0',
          '[clip:rect(0,0,0,0)]',
          '[clip-path:inset(50%)]',
          '[height:1px]',
          '[width:1px]',
          className,
        )}
        {...props}
      />
    )
  },
)
