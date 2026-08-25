import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { cn } from './cn'

export type WorkspaceProps = HTMLAttributes<HTMLDivElement> & {
  readonly children: ReactNode
}

export const Workspace = forwardRef<HTMLDivElement, WorkspaceProps>(
  function Workspace({ children, className, ...props }, ref) {
    return (
      <main ref={ref} data-slot="workspace" className={cn('min-h-screen bg-canvas text-ink', className)} {...props}>
        {children}
      </main>
    )
  },
)
