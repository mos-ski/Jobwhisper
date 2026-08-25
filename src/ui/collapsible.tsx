import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Collapsible as BaseCollapsible } from '@base-ui-components/react/collapsible'

import { cn } from './cn'

export type CollapsibleProps = {
  readonly children: ReactNode
  readonly open?: boolean
  readonly defaultOpen?: boolean
  readonly onOpenChange?: (open: boolean) => void
  readonly disabled?: boolean
  readonly className?: string
}

export function Collapsible({ className, ...props }: CollapsibleProps) {
  return <BaseCollapsible.Root data-slot="collapsible" className={cn('', className)} {...props} />
}

export type CollapsibleTriggerProps = HTMLAttributes<HTMLButtonElement>

export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  function CollapsibleTrigger({ className, ...props }, ref) {
    return (
      <BaseCollapsible.Trigger
        ref={ref}
        data-slot="collapsible-trigger"
        className={cn('focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', className)}
        {...props}
      />
    )
  },
)

export type CollapsiblePanelProps = HTMLAttributes<HTMLDivElement>

export const CollapsiblePanel = forwardRef<HTMLDivElement, CollapsiblePanelProps>(
  function CollapsiblePanel({ className, children, ...props }, ref) {
    return (
      <BaseCollapsible.Panel
        ref={ref}
        data-slot="collapsible-panel"
        className={cn(
          'overflow-hidden data-[ending-style]:animate-accordion-up data-[starting-style]:animate-accordion-down motion-reduce:animate-none',
          className,
        )}
        {...props}
      >
        {children}
      </BaseCollapsible.Panel>
    )
  },
)
