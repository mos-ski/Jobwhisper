import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

import { cn } from './cn'

export type BreadcrumbItemProps = {
  readonly label: string
  readonly href?: string
  readonly current?: boolean
}

export type BreadcrumbsProps = HTMLAttributes<nav> & {
  readonly items: readonly BreadcrumbItemProps[]
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  function Breadcrumbs({ items, className, ...props }, ref) {
    return (
      <nav ref={ref} aria-label="Breadcrumb" data-slot="breadcrumbs" className={cn('flex items-center gap-2 text-sm', className)} {...props}>
        {items.map((item, index) => (
          <span key={item.label} className="flex items-center gap-2">
            {index > 0 && <ChevronRight aria-hidden="true" className="size-3.5 text-ink-muted" />}
            {item.current || !item.href ? (
              <span aria-current={item.current ? 'page' : undefined} className="font-medium text-ink">
                {item.label}
              </span>
            ) : (
              <a href={item.href} className="text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                {item.label}
              </a>
            )}
          </span>
        ))}
      </nav>
    )
  },
)

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps & HTMLAttributes<HTMLLIElement>>(
  function BreadcrumbItem({ label, href, current, ...props }, ref) {
    return (
      <li ref={ref} {...props}>
        {current || !href ? (
          <span aria-current={current ? 'page' : undefined} className="font-medium text-ink">
            {label}
          </span>
        ) : (
          <a href={href} className="text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            {label}
          </a>
        )}
      </li>
    )
  },
)
