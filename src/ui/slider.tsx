import { forwardRef, type HTMLAttributes } from 'react'
import { Slider as BaseSlider } from '@base-ui-components/react/slider'

import { cn } from './cn'

export type SliderProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  readonly value?: number[]
  readonly defaultValue?: number[]
  readonly min?: number
  readonly max?: number
  readonly step?: number
  readonly onValueChange?: (value: number[]) => void
  readonly orientation?: 'horizontal' | 'vertical'
  readonly disabled?: boolean
  readonly label?: string
  readonly showValue?: boolean
  readonly minLabel?: string
  readonly maxLabel?: string
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  function Slider(
    {
      className,
      value,
      defaultValue = [0],
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      orientation = 'horizontal',
      disabled = false,
      label,
      showValue = false,
      minLabel,
      maxLabel,
      ...props
    },
    ref,
  ) {
    return (
      <div ref={ref} data-slot="slider" className={cn('flex flex-col gap-2', className)} {...props}>
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && (
              <label className="text-sm font-medium text-ink">{label}</label>
            )}
            {showValue && value && (
              <span className="text-sm text-ink-muted">{value[0]}</span>
            )}
          </div>
        )}
        <BaseSlider.Root
          value={value}
          defaultValue={defaultValue}
          min={min}
          max={max}
          step={step}
          onValueChange={onValueChange}
          orientation={orientation}
          disabled={disabled}
          className={cn(
            'relative flex touch-none select-none items-center',
            orientation === 'vertical' ? 'h-48 w-5 flex-col' : 'h-5 w-full',
            disabled && 'opacity-50',
          )}
        >
          <BaseSlider.Track
            className={cn(
              'relative grow rounded-full bg-muted',
              orientation === 'vertical' ? 'w-1.5' : 'h-1.5',
            )}
          >
            <BaseSlider.Indicator className="absolute rounded-full bg-accent" />
          </BaseSlider.Track>
          <BaseSlider.Thumb
            className={cn(
              'block size-5 rounded-full border-2 border-accent bg-surface shadow-control transition-colors duration-fast ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface hover:bg-accent-subtle disabled:pointer-events-none',
            )}
          />
        </BaseSlider.Root>
        {(minLabel || maxLabel) && (
          <div className="flex items-center justify-between">
            {minLabel && <span className="text-xs text-muted">{minLabel}</span>}
            {maxLabel && <span className="text-xs text-muted">{maxLabel}</span>}
          </div>
        )}
      </div>
    )
  },
)
