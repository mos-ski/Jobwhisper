import { useEffect, useRef, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

import { cn } from './cn'

export type FormSearchSelectFieldProps = {
  readonly id: string
  readonly label: string
  readonly options: readonly string[]
  readonly selected: readonly string[]
  readonly onSelectedChange: (next: readonly string[]) => void
  readonly placeholder?: string
  readonly searchPlaceholder?: string
  readonly maxSelected?: number
  readonly multiple?: boolean
  readonly dropdownPlacement?: 'top' | 'bottom'
  readonly className?: string
}

export function FormSearchSelectField({
  id,
  label,
  options,
  selected,
  onSelectedChange,
  placeholder = 'Search...',
  searchPlaceholder = 'Search...',
  maxSelected,
  multiple = true,
  dropdownPlacement = 'bottom',
  className,
}: FormSearchSelectFieldProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const atMax = multiple && maxSelected !== undefined && selected.length >= maxSelected
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(search.toLowerCase()) && !selected.includes(option))

  function addOption(option: string) {
    if (multiple) {
      onSelectedChange([...selected, option])
      setSearch('')
    } else {
      onSelectedChange([option])
      setSearch('')
      setOpen(false)
    }
  }

  function removeOption(option: string) {
    onSelectedChange(selected.filter((value) => value !== option))
  }

  return (
    <div className={cn('grid min-w-0 gap-1.5', className)} ref={ref}>
      <label htmlFor={id} className="text-sm font-medium leading-5 text-ink">
        {label}
      </label>
      <div className="relative min-w-0">
        <button
          type="button"
          id={id}
          onClick={() => !atMax && setOpen((value) => !value)}
          disabled={atMax}
          className="flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-input bg-surface px-3.5 py-2.5 text-start text-sm text-ink shadow-control outline-none transition-colors duration-normal ease-default focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className={cn('truncate', !multiple && selected[0] ? 'text-ink' : 'text-ink-muted')}>
            {!multiple && selected[0] ? selected[0] : atMax ? `Maximum ${maxSelected} selected` : placeholder}
          </span>
          <ChevronDown aria-hidden="true" className={cn('size-4 shrink-0 text-ink-muted transition-transform', open && 'rotate-180')} />
        </button>
        {open ? (
          <div
            className={cn(
              'absolute z-tooltip w-full rounded-lg border border-border bg-surface shadow-popover',
              dropdownPlacement === 'top' ? 'bottom-full mb-1' : 'mt-1',
            )}
          >
            <div className="border-b border-border p-2">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={searchPlaceholder}
                autoFocus
                className="w-full rounded-md border border-input bg-surface px-3 py-1.5 text-sm text-ink outline-none focus:border-focus focus:ring-1 focus:ring-focus"
              />
            </div>
            <div className="max-h-48 overflow-y-auto p-1">
              {filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => addOption(option)}
                  className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus"
                >
                  {option}
                </button>
              ))}
              {filteredOptions.length === 0 ? <p className="px-3 py-2 text-sm text-ink-muted">No results</p> : null}
            </div>
          </div>
        ) : null}
      </div>
      {multiple && selected.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((option) => (
            <span key={option} className="inline-flex items-center gap-1 rounded-md bg-accent-subtle px-2 py-0.5 text-xs font-medium text-accent-text">
              {option}
              <button
                type="button"
                onClick={() => removeOption(option)}
                className="rounded-full p-0.5 hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus"
                aria-label={`Remove ${option}`}
              >
                <X aria-hidden="true" className="size-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      {multiple && maxSelected !== undefined ? <p className="text-xs text-ink-muted">{atMax ? `Maximum ${maxSelected} reached` : `Up to ${maxSelected}`}</p> : null}
    </div>
  )
}
