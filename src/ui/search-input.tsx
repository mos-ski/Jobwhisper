import { forwardRef, type InputHTMLAttributes } from 'react'
import { Search, X } from 'lucide-react'

import { cn } from './cn'

export type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> & {
  readonly id?: string
  readonly onClear?: () => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ className, value, onClear, placeholder = 'Search...', ...props }, ref) {
    return (
      <div data-slot="search-input" className="relative">
        <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
        <input
          ref={ref}
          type="search"
          value={value}
          placeholder={placeholder}
          className={cn(
            'min-h-10 w-full rounded-lg border border-input bg-surface ps-9 pe-9 text-sm text-ink outline-none placeholder:text-ink-muted transition-colors duration-normal ease-default focus:border-focus focus:ring-2 focus:ring-focus',
            className,
          )}
          {...props}
        />
        {value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute end-2.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            aria-label="Clear search"
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
        ) : null}
      </div>
    )
  },
)
