import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { cn } from './cn'

export type AppShellProps = HTMLAttributes<HTMLDivElement> & {
  readonly sidebar?: ReactNode
  readonly header?: ReactNode
  readonly children: ReactNode
}

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  function AppShell({ sidebar, header, children, className, ...props }, ref) {
    return (
      <div ref={ref} data-slot="app-shell" className={cn('min-h-screen bg-canvas text-ink', className)} {...props}>
        {header}
        <div className="flex">
          {sidebar}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    )
  },
)
