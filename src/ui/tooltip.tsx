import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Tooltip as BaseTooltip } from '@base-ui-components/react/tooltip'

import { cn } from './cn'

export type TooltipProps = {
  readonly children: ReactNode
  readonly delayDuration?: number
}

export function Tooltip({ children, delayDuration = 300 }: TooltipProps) {
  return <BaseTooltip.Root delay={delayDuration}>{children}</BaseTooltip.Root>
}

export const TooltipTrigger = BaseTooltip.Trigger

export type TooltipContentProps = HTMLAttributes<HTMLDivElement>

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent({ className, children, ...props }, ref) {
    return (
      <BaseTooltip.Portal>
        <BaseTooltip.Popup
          ref={ref}
          className={cn(
            'z-tooltip rounded-lg bg-surface-inverse px-3 py-1.5 text-sm text-surface shadow-lg',
            className,
          )}
          {...props}
        >
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Portal>
    )
  },
)
