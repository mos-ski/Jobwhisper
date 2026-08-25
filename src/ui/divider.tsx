import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from './cn'

export type DividerOrientation = 'horizontal' | 'vertical'

export type DividerProps = HTMLAttributes<HTMLDivElement> & {
  readonly orientation?: DividerOrientation
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  function Divider({ className, orientation = 'horizontal', ...props }, ref) {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        data-slot="divider"
        className={cn(
          orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch',
          'bg-border',
          className,
        )}
        {...props}
      />
    )
  },
)
