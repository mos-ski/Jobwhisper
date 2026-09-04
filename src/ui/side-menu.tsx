import { forwardRef, type ReactNode } from 'react'

import { cn } from './cn'
import { Divider } from './divider'

export type SideMenuItem = {
  readonly label: string
  readonly href: string
  readonly icon: ReactNode
  readonly active?: boolean
  readonly dividerBefore?: boolean
  /** Count pill shown after the label — e.g. items awaiting action in that section. Hidden when 0. */
  readonly badgeCount?: number
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
                  'mx-3 flex w-[calc(100%-1.5rem)] min-h-9 items-center gap-3 overflow-hidden rounded-md py-1.5 font-medium leading-6 transition-colors duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                  collapsed ? 'justify-center px-0' : 'px-3',
                  item.active ? 'bg-accent-subtle text-accent-text' : 'text-ink hover:bg-surface-subtle',
                )}
                aria-current={item.active ? 'page' : undefined}
              >
                <span className="size-5 shrink-0 [&>svg]:size-5 [&>img]:size-5" aria-hidden="true">
                  {item.icon}
                </span>
                <span className={cn('min-w-0 flex-1 truncate text-sm', collapsed && 'sr-only')}>{item.label}</span>
                {item.badgeCount ? (
                  <span
                    className={cn(
                      'shrink-0 rounded-pill bg-danger px-1.5 text-[11px] font-bold leading-5 text-on-danger',
                      collapsed && 'sr-only',
                    )}
                  >
                    {item.badgeCount}
                    <span className="sr-only"> awaiting action</span>
                  </span>
                ) : null}
              </a>
            </div>
          ))}
          {children}
        </nav>
      </aside>
    )
  },
)
