import { forwardRef, type ReactNode } from 'react'

import { cn } from './cn'
import { Divider } from './divider'

export type SideMenuItem = {
  readonly label: string
  readonly href: string
  readonly icon: ReactNode
  readonly active?: boolean
  readonly dividerBefore?: boolean
}

export type SideMenuProps = {
  readonly items: readonly SideMenuItem[]
  readonly className?: string
  readonly children?: ReactNode
  readonly width?: number
  readonly collapsed?: boolean
  readonly collapsedWidth?: number
}

export const SideMenu = forwardRef<HTMLElement, SideMenuProps>(
  function SideMenu({ items, className, children, width = 224, collapsed = false, collapsedWidth = 72, ...props }, ref) {
    return (
      <aside
        ref={ref}
        data-slot="side-menu"
        data-collapsed={collapsed ? 'true' : undefined}
        className={cn('hidden shrink-0 overflow-hidden bg-surface transition-[width] duration-200 ease-out motion-reduce:transition-none lg:block', className)}
        style={{ width: collapsed ? collapsedWidth : width }}
        {...props}
      >
        <nav aria-label="Primary" className="flex min-h-[calc(100vh-3.5rem)] flex-col pt-3 text-sm">
          {items.map((item) => (
            <div key={item.label}>
              {item.dividerBefore ? (
                <div className="flex w-full items-center justify-center p-6">
                  <Divider />
                </div>
              ) : null}
              <a
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex min-h-9 w-full items-center gap-3 overflow-hidden rounded py-1.5 font-medium leading-6 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                  collapsed ? 'justify-center px-0' : 'px-6',
                )}
                aria-current={item.active ? 'page' : undefined}
              >
                <span className="size-5 shrink-0 text-ink [&>svg]:size-5 [&>img]:size-5" aria-hidden="true">
                  {item.icon}
                </span>
                <span className={cn('min-w-0 flex-1 truncate text-sm text-ink', collapsed && 'sr-only')}>{item.label}</span>
              </a>
            </div>
          ))}
          {children}
        </nav>
      </aside>
    )
  },
)
