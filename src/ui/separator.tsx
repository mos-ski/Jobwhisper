import { forwardRef, type HTMLAttributes } from 'react'
import { Separator as BaseSeparator } from '@base-ui-components/react/separator'

import { cn } from './cn'

export type SeparatorOrientation = 'horizontal' | 'vertical'

export type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
  readonly orientation?: SeparatorOrientation
  readonly decorative?: boolean
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  function Separator({ className, orientation = 'horizontal', decorative = true, ...props }, ref) {
    return (
      <BaseSeparator
        ref={ref}
        data-slot="separator"
        orientation={orientation}
        decorative={decorative}
        className={cn(
          'shrink-0 bg-border',
          orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
          className,
        )}
        {...props}
      />
    )
  },
)
