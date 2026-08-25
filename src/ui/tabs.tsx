import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Tabs as BaseTabs } from '@base-ui-components/react/tabs'

import { cn } from './cn'

export type TabsProps = {
  readonly defaultValue?: string
  readonly value?: string
  readonly onValueChange?: (value: string) => void
  readonly children: ReactNode
  readonly className?: string
}

export function Tabs({ className, ...props }: TabsProps) {
  return <BaseTabs.Root data-slot="tabs" className={cn('', className)} {...props} />
}

export const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { readonly children: ReactNode }>(
  function TabsList({ className, ...props }, ref) {
    return (
      <BaseTabs.List
        ref={ref}
        data-slot="tabs-list"
        className={cn('flex gap-6 overflow-x-auto border-b border-border', className)}
        {...props}
      />
    )
  },
)

export type TabsTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  readonly value: string
  readonly children: ReactNode
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger({ className, value, ...props }, ref) {
    return (
      <BaseTabs.Tab
        ref={ref}
        value={value}
        data-slot="tabs-trigger"
        className={cn(
          'shrink-0 whitespace-nowrap border-b-2 border-transparent pb-2 text-sm font-medium text-ink-muted transition-colors duration-normal ease-default hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus data-[active]:border-accent data-[active]:text-accent',
          className,
        )}
        {...props}
      />
    )
  },
)

export type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  readonly value: string
  readonly children: ReactNode
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent({ className, value, ...props }, ref) {
    return (
      <BaseTabs.Panel
        ref={ref}
        value={value}
        data-slot="tabs-content"
        className={cn('mt-4 focus-visible:outline-none', className)}
        {...props}
      />
    )
  },
)
