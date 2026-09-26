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
  /** One accessible name per thumb, e.g. ["Minimum salary", "Maximum salary"]. Required for range sliders. */
  readonly thumbLabels?: readonly string[]
  /** Spoken value for a thumb, e.g. `(value) => '$80,000'`. */
  readonly formatValueText?: (value: number) => string
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
      thumbLabels,
      formatValueText,
      ...props
    },
    ref,
  ) {
    const thumbValues = value ?? defaultValue

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
          // Base UI reports a single-thumb change as a bare number; consumers always get an array.
          onValueChange={onValueChange ? (next: number | readonly number[]) => onValueChange(typeof next === 'number' ? [next] : [...next]) : undefined}
          orientation={orientation}
          disabled={disabled}
          className={cn(disabled && 'opacity-50')}
        >
          {/* Control is the part Base UI listens to for pointer drags; without it only the keyboard moves the thumbs. */}
          <BaseSlider.Control
            className={cn(
              'relative flex touch-none select-none items-center',
              orientation === 'vertical' ? 'h-48 w-5 flex-col' : 'h-11 w-full',
            )}
          >
            <BaseSlider.Track
              className={cn(
                'relative grow rounded-full bg-muted',
                orientation === 'vertical' ? 'h-full w-1.5' : 'h-1.5',
              )}
            >
              <BaseSlider.Indicator className="absolute rounded-full bg-accent" />
              {thumbValues.map((_, index) => (
                <BaseSlider.Thumb
                  key={index}
                  index={index}
                  getAriaLabel={thumbLabels ? (thumb) => thumbLabels[thumb] ?? '' : undefined}
                  getAriaValueText={formatValueText ? (_formatted, thumbValue) => formatValueText(thumbValue) : undefined}
                  className="block size-5 rounded-full border-2 border-accent bg-surface shadow-control transition-colors duration-fast ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface hover:bg-accent-subtle disabled:pointer-events-none"
                />
              ))}
            </BaseSlider.Track>
          </BaseSlider.Control>
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
