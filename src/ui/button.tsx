import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

import { cn } from './cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'border border-input bg-surface text-ink hover:bg-surface-subtle',
  ghost: 'text-accent-text hover:bg-accent-subtle',
  danger: 'bg-danger text-on-danger hover:bg-danger-hover',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-8 px-3 py-1.5 text-sm leading-5',
  md: 'min-h-10 px-4 py-2 text-sm leading-6',
  lg: 'min-h-11 px-5 py-2.5 text-base leading-6',
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly variant?: ButtonVariant
  readonly size?: ButtonSize
  readonly leadingIcon?: ReactNode
  readonly loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant = 'primary',
      size = 'md',
      leadingIcon,
      loading = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        data-loading={loading || undefined}
        type={type}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-3 rounded-lg font-semibold shadow-control transition-colors duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <svg aria-hidden="true" className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : leadingIcon ? (
          <span className="shrink-0 [&>svg]:size-4">{leadingIcon}</span>
        ) : null}
        {children}
      </button>
    )
  },
)
