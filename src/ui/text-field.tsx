import { forwardRef, type InputHTMLAttributes } from 'react'

import { cn } from './cn'

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  readonly id: string
  readonly label: string
  readonly error?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ className, id, label, error, disabled, ...props }, ref) {
    const errorId = `${id}-error`

    return (
      <div data-slot="text-field" className="grid gap-1.5">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'min-h-11 rounded-lg border border-input bg-surface px-3 py-2.5 text-sm leading-6 text-ink shadow-control outline-none transition-colors duration-normal ease-default placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} role="alert" aria-live="polite" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)
