import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { cn } from './cn'

export type ContentCardProps = HTMLAttributes<HTMLDivElement> & {
  readonly compact?: boolean
  readonly children: ReactNode
}

export const ContentCard = forwardRef<HTMLDivElement, ContentCardProps>(
  function ContentCard({ compact = false, children, className, ...props }, ref) {
    return (
      <article
        ref={ref}
        data-slot="content-card"
        data-compact={compact || undefined}
        className={cn(
          'mx-auto w-full bg-surface shadow-panel',
          compact ? 'max-w-[36rem]' : 'min-h-[56rem] max-w-[44rem]',
          'p-8',
          className,
        )}
        {...props}
      >
        {children}
      </article>
    )
  },
)
