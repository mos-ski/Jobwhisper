import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'solid' | 'outline' }>(
  ({ variant = 'solid', className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'flex min-w-[160px] sm:min-w-[220px] md:min-w-[300px] px-6 sm:px-10 md:px-14 py-4 sm:py-5 md:py-[17.657px] tracking-widest flex-col items-center justify-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl md:rounded-[20px] font-bold text-xs sm:text-sm md:text-base transition-all duration-200 uppercase focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'solid'
          ? 'bg-primary text-white shadow-[inset_5.886px_0_5.886px_rgba(0,0,0,0.1),inset_0_5.886px_5.886px_rgba(0,0,0,0.1)] hover:bg-primary/90'
          : 'border-2 border-primary text-primary bg-white hover:bg-primary/5',
        className,
      )}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">{children}</span>
    </button>
  ),
)
Button.displayName = 'Button'

export function Pill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-3 py-1 rounded-full border border-primary/50 bg-white text-primary font-bold text-xs',
        className,
      )}
    >
      {children}
    </span>
  )
}
