import { forwardRef, useEffect, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { Select } from '@base-ui-components/react/select'

import { cn } from './cn'
import { Dialog, DialogPopup, DialogTitle } from './dialog'

export type SelectFieldOption = {
  readonly label: string
  readonly value: string
}

export type SelectFieldProps = {
  readonly id: string
  readonly label: string
  readonly hideLabel?: boolean
  readonly options: readonly SelectFieldOption[]
  readonly error?: string
  readonly value?: string
  readonly defaultValue?: string
  readonly onValueChange?: (value: string) => void
  readonly placeholder?: string
  readonly disabled?: boolean
  readonly required?: boolean
  readonly name?: string
  readonly className?: string
}

const MOBILE_SEARCH_THRESHOLD = 8

export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
  function SelectField(
    { id, label, hideLabel, options, error, value, defaultValue, onValueChange, placeholder = 'Select', disabled, required, name, className },
    ref,
  ) {
    const errorId = `${id}-error`
    const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? '')
    const [mobileOpen, setMobileOpen] = useState(false)
    const [search, setSearch] = useState('')

    useEffect(() => {
      if (value !== undefined) setInternalValue(value)
    }, [value])

    function handleChange(next: string) {
      setInternalValue(next)
      onValueChange?.(next)
    }

    function closeMobile() {
      setMobileOpen(false)
      setSearch('')
    }

    const selectedOption = options.find((option) => option.value === internalValue)
    const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()))

    return (
      <div data-slot="select-field" className="grid gap-1.5">
        <label htmlFor={id} className={cn('text-sm font-medium text-ink', hideLabel && 'sr-only')}>
          {label}
        </label>
        <Select.Root value={internalValue} onValueChange={(next) => handleChange(next as string)} disabled={disabled} required={required} name={name}>
          <div className="hidden lg:block">
            <Select.Trigger
              ref={ref}
              id={id}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className={cn(
                'flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-input bg-surface py-2.5 ps-3 pe-3 text-start text-sm leading-6 text-ink shadow-control outline-none transition-colors duration-normal ease-default focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50 data-[popup-open]:border-focus',
                error && 'border-danger focus-visible:border-danger focus-visible:ring-danger/20',
                className,
              )}
            >
              <Select.Value className="truncate">
                {(selected: string | null) => {
                  const match = options.find((option) => option.value === selected)
                  return match ? match.label : placeholder
                }}
              </Select.Value>
              <Select.Icon className="shrink-0 text-ink-muted">
                <ChevronDown aria-hidden="true" className="size-4" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner className="z-tooltip outline-none" sideOffset={4}>
                <Select.Popup className="max-h-64 min-w-[var(--anchor-width)] overflow-y-auto rounded-lg border border-border bg-surface py-1 shadow-popover outline-none">
                  {options.map((option) => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      className="flex min-h-9 cursor-pointer items-center justify-between gap-2 px-3 text-sm text-ink outline-none data-[highlighted]:bg-surface-subtle data-[selected]:font-semibold"
                    >
                      <Select.ItemText>{option.label}</Select.ItemText>
                      <Select.ItemIndicator className="text-accent">
                        <Check aria-hidden="true" className="size-4" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </div>
        </Select.Root>
        <button
          type="button"
          id={`${id}-mobile-trigger`}
          aria-label={hideLabel ? label : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onClick={() => setMobileOpen(true)}
          disabled={disabled}
          className={cn(
            'flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-input bg-surface py-2.5 ps-3 pe-3 text-start text-sm leading-6 text-ink shadow-control outline-none transition-colors duration-normal ease-default focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50 lg:hidden',
            error && 'border-danger focus-visible:border-danger focus-visible:ring-danger/20',
            className,
          )}
        >
          <span className={cn('truncate', selectedOption ? 'text-ink' : 'text-ink-muted')}>{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
        </button>
        <Dialog open={mobileOpen} onOpenChange={(next) => (next ? setMobileOpen(true) : closeMobile())}>
          <DialogPopup placement="center">
            <DialogTitle>{label}</DialogTitle>
            {options.length > MOBILE_SEARCH_THRESHOLD ? (
              <div className="relative mt-4">
                <Search aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-ink-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search..."
                  autoFocus
                  className="w-full rounded-lg border border-input bg-surface py-2.5 ps-9 pe-3 text-sm text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus"
                />
              </div>
            ) : null}
            <div className="-mx-2 mt-3 max-h-[50vh] overflow-y-auto">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    handleChange(option.value)
                    closeMobile()
                  }}
                  className="flex min-h-11 w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-start text-base text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus"
                >
                  {option.label}
                  {option.value === internalValue ? <Check aria-hidden="true" className="size-4 shrink-0 text-accent" /> : null}
                </button>
              ))}
              {filteredOptions.length === 0 ? <p className="px-3 py-2 text-sm text-ink-muted">No results</p> : null}
            </div>
          </DialogPopup>
        </Dialog>
        {error ? (
          <p id={errorId} role="alert" aria-live="polite" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)
