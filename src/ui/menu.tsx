import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Menu as BaseMenu } from '@base-ui-components/react/menu'

import { cn } from './cn'

export type MenuProps = {
  readonly children: ReactNode
}

export function Menu({ children }: MenuProps) {
  return <BaseMenu.Root>{children}</BaseMenu.Root>
}

export const MenuTrigger = BaseMenu.Trigger

export type MenuContentProps = HTMLAttributes<HTMLDivElement> & {
  readonly align?: 'start' | 'center' | 'end'
  readonly side?: 'top' | 'right' | 'bottom' | 'left'
}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  function MenuContent({ className, children, align = 'end', side = 'bottom', ...props }, ref) {
    return (
      <BaseMenu.Portal>
        <BaseMenu.Positioner align={align} side={side} sideOffset={4} className="z-dropdown outline-none">
          <BaseMenu.Popup
            ref={ref}
            className={cn(
              'min-w-40 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-popover transition-[opacity,transform] duration-fast ease-default data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 motion-reduce:transition-none',
              className,
            )}
            {...props}
          >
            {children}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    )
  },
)

export type MenuItemVariant = 'default' | 'danger'

export type MenuItemProps = HTMLAttributes<HTMLDivElement> & {
  readonly variant?: MenuItemVariant
  readonly icon?: ReactNode
}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  function MenuItem({ className, variant = 'default', icon, children, ...props }, ref) {
    return (
      <BaseMenu.Item
        ref={ref}
        className={cn(
          'flex min-h-9 cursor-pointer items-center gap-2 px-3 text-sm font-medium leading-5 outline-none data-[highlighted]:bg-surface-subtle',
          variant === 'danger' ? 'text-danger' : 'text-ink',
          className,
        )}
        {...props}
      >
        {icon ? <span aria-hidden="true" className="shrink-0 [&>svg]:size-4">{icon}</span> : null}
        {children}
      </BaseMenu.Item>
    )
  },
)

export function MenuSeparator({ className }: { readonly className?: string }) {
  return <div role="separator" className={cn('my-1 h-px bg-border', className)} />
}
