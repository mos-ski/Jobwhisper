import { forwardRef, type SVGAttributes } from 'react'

import { cn } from './cn'

export type SpinnerSize = 'sm' | 'md' | 'lg'

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
}

export type SpinnerProps = SVGAttributes<SVGSVGElement> & {
  readonly size?: SpinnerSize
}

export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  function Spinner({ size = 'md', className, ...props }, ref) {
    return (
      <svg
        ref={ref}
        data-slot="spinner"
        aria-label="Loading"
        role="status"
        viewBox="0 0 24 24"
        fill="none"
        className={cn('animate-spin text-current', sizeClasses[size], className)}
        {...props}
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    )
  },
)
