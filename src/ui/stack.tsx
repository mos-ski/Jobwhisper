import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { cn } from './cn'

export type StackDirection = 'column' | 'row'

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  readonly direction?: StackDirection
  readonly gap?: number
  readonly align?: 'start' | 'center' | 'end' | 'stretch'
  readonly wrap?: boolean
  readonly children: ReactNode
}

const alignClasses: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  function Stack({ direction = 'column', gap = 4, align, wrap = false, className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="stack"
        data-direction={direction}
        className={cn(
          'flex',
          direction === 'column' ? 'flex-col' : 'flex-row',
          `gap-${gap}`,
          align && alignClasses[align],
          wrap && 'flex-wrap',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
