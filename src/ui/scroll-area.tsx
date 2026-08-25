import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { cn } from './cn'

export type ScrollAreaProps = HTMLAttributes<HTMLDivElement> & {
  readonly children: ReactNode
  readonly orientation?: 'vertical' | 'horizontal' | 'both'
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea({ className, children, orientation = 'vertical', ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="scroll-area"
        className={cn(
          'relative overflow-hidden',
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            'h-full w-full',
            orientation === 'vertical' && 'overflow-y-auto overflow-x-hidden',
            orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
            orientation === 'both' && 'overflow-auto',
            '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted',
          )}
        >
          {children}
        </div>
      </div>
    )
  },
)
