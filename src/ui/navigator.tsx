import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { cn } from './cn'

export type NavigatorItem = {
  readonly id: string
  readonly label: string
  readonly icon?: ReactNode
  readonly href?: string
  readonly active?: boolean
  readonly disabled?: boolean
  readonly onClick?: () => void
}

export type NavigatorProps = HTMLAttributes<HTMLElement> & {
  readonly items: readonly NavigatorItem[]
  readonly logo?: ReactNode
  readonly logoHref?: string
  readonly actions?: ReactNode
  readonly footer?: ReactNode
  readonly collapsed?: boolean
}

export const Navigator = forwardRef<HTMLElement, NavigatorProps>(
  function Navigator({ className, items, logo, logoHref, actions, footer, collapsed = false, ...props }, ref) {
    return (
      <nav
        ref={ref}
        data-slot="navigator"
        className={cn(
          'flex h-full flex-col border-e border-border bg-surface',
          collapsed ? 'w-16' : 'w-60',
          className,
        )}
        {...props}
      >
        {logo && (
          <div className={cn('flex h-14 items-center border-b border-border', collapsed ? 'justify-center px-2' : 'px-4')}>
            {logoHref ? (
              <a href={logoHref} className="flex items-center gap-2">
                {logo}
              </a>
            ) : (
              logo
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-2">
          {items.map((item) => (
            <div key={item.id} className="px-2">
              {item.href ? (
                <a
                  href={item.href}
                  data-slot="navigator-item"
                  data-active={item.active || undefined}
                  className={cn(
                    'flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-normal ease-default',
                    item.active
                      ? 'bg-accent-subtle text-accent'
                      : 'text-ink-muted hover:bg-surface-subtle hover:text-ink',
                    item.disabled && 'pointer-events-none opacity-50',
                    collapsed && 'justify-center px-2',
                  )}
                  onClick={item.onClick}
                >
                  {item.icon && <span className="shrink-0 [&>svg]:size-5">{item.icon}</span>}
                  {!collapsed && <span>{item.label}</span>}
                </a>
              ) : (
                <button
                  type="button"
                  data-slot="navigator-item"
                  data-active={item.active || undefined}
                  disabled={item.disabled}
                  className={cn(
                    'flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition-colors duration-normal ease-default',
                    item.active
                      ? 'bg-accent-subtle text-accent'
                      : 'text-ink-muted hover:bg-surface-subtle hover:text-ink',
                    item.disabled && 'pointer-events-none opacity-50',
                    collapsed && 'justify-center px-2',
                  )}
                  onClick={item.onClick}
                >
                  {item.icon && <span className="shrink-0 [&>svg]:size-5">{item.icon}</span>}
                  {!collapsed && <span>{item.label}</span>}
                </button>
              )}
            </div>
          ))}
        </div>

        {actions && (
          <div className={cn('border-t border-border px-2 py-2', collapsed && 'px-2')}>
            {actions}
          </div>
        )}

        {footer && (
          <div className={cn('border-t border-border px-3 py-3', collapsed && 'px-2')}>
            {footer}
          </div>
        )}
      </nav>
    )
  },
)

export const NavigatorGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { readonly label?: string }>(
  function NavigatorGroup({ className, label, children, ...props }, ref) {
    return (
      <div ref={ref} className={cn('py-1', className)} {...props}>
        {label && (
          <div className="px-5 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-muted">
            {label}
          </div>
        )}
        {children}
      </div>
    )
  },
)
