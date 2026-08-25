import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Radio } from '@base-ui-components/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui-components/react/radio-group'

import { cn } from './cn'

export type RadioGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  readonly value?: string
  readonly onValueChange?: (value: string) => void
  readonly label?: string
  readonly name?: string
  readonly children: ReactNode
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup({ value, onValueChange, label, name, className, children, ...props }, ref) {
    return (
      <BaseRadioGroup
        ref={ref}
        value={value}
        onValueChange={(next) => onValueChange?.(next as string)}
        name={name}
        data-slot="radio-group"
        aria-label={label}
        className={cn('grid gap-2', className)}
        {...props}
      >
        {label ? <span className="text-sm font-medium text-ink">{label}</span> : null}
        {children}
      </BaseRadioGroup>
    )
  },
)

export type RadioGroupItemProps = HTMLAttributes<HTMLSpanElement> & {
  readonly value: string
  readonly itemLabel?: string
}

export const RadioGroupItem = forwardRef<HTMLElement, RadioGroupItemProps>(
  function RadioGroupItem({ value, itemLabel, className, ...props }, ref) {
    const radioEl = (
      <Radio.Root
        ref={ref}
        value={value}
        data-slot="radio-group-item"
        className={cn(
          'relative grid size-4 shrink-0 place-items-center rounded-full border border-input bg-surface transition-colors duration-normal ease-default before:absolute before:-inset-3.5 before:content-[""] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface data-[checked]:border-accent disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <Radio.Indicator className="flex items-center justify-center">
          <span className="size-2 rounded-full bg-accent" />
        </Radio.Indicator>
      </Radio.Root>
    )

    if (itemLabel) {
      return (
        <label className="inline-flex items-center gap-2">
          {radioEl}
          <span className="text-sm font-medium text-ink">{itemLabel}</span>
        </label>
      )
    }

    return radioEl
  },
)
