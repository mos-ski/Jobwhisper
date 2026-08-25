import { forwardRef } from 'react'
import { Switch as BaseSwitch } from '@base-ui-components/react/switch'

import { cn } from './cn'

export type SwitchProps = {
  readonly checked?: boolean
  readonly onCheckedChange?: (checked: boolean) => void
  readonly label?: string
  readonly disabled?: boolean
  readonly className?: string
  readonly 'aria-label'?: string
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch({ checked, onCheckedChange, label, disabled, className, ...rest }, ref) {
    const switchEl = (
      <BaseSwitch.Root
        ref={ref}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={rest['aria-label'] ?? label}
        data-slot="switch"
        className={cn(
          'group inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-muted transition-colors duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50',
          'group-data-[checked]:bg-accent',
          className,
        )}
      >
        <BaseSwitch.Thumb className="pointer-events-none block size-5 rounded-full bg-surface shadow-sm ring-0 transition-transform duration-normal ease-default group-data-[checked]:translate-x-5 group-data-[checked]:bg-on-accent group-data-[unchecked]:translate-x-0" />
      </BaseSwitch.Root>
    )

    if (label) {
      return (
        <label className="inline-flex items-center gap-3">
          {switchEl}
          <span className="text-sm font-medium text-ink">{label}</span>
        </label>
      )
    }

    return switchEl
  },
)
