import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Popover as BasePopover } from '@base-ui-components/react/popover'

import { cn } from './cn'

export type PopoverProps = {
  readonly children: ReactNode
  readonly open?: boolean
  readonly defaultOpen?: boolean
  readonly onOpenChange?: (open: boolean) => void
}

export function Popover({ children, ...props }: PopoverProps) {
  return <BasePopover.Root {...props}>{children}</BasePopover.Root>
}

export const PopoverTrigger = BasePopover.Trigger

export type PopoverContentProps = HTMLAttributes<HTMLDivElement> & {
  readonly align?: 'start' | 'center' | 'end'
  readonly side?: 'top' | 'right' | 'bottom' | 'left'
  readonly sideOffset?: number
}

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent({ className, children, align = 'center', side = 'bottom', sideOffset = 4, ...props }, ref) {
    return (
      <BasePopover.Portal>
        <BasePopover.Positioner align={align} side={side} sideOffset={sideOffset} className="z-dropdown">
          <BasePopover.Popup
            ref={ref}
            className={cn(
              'origin-[var(--transform-origin)] rounded-panel border border-border bg-surface p-4 shadow-popover transition-[opacity,transform] duration-fast ease-default data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 motion-reduce:transition-none',
              className,
            )}
            {...props}
          >
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    )
  },
)

export const PopoverClose = BasePopover.Close
