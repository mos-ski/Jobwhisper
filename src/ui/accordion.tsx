import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Accordion as BaseAccordion } from '@base-ui-components/react/accordion'
import { ChevronDown } from 'lucide-react'

import { cn } from './cn'

export type AccordionProps = {
  readonly children: ReactNode
  readonly defaultValue?: string[]
  readonly value?: string[]
  readonly onValueChange?: (value: string[]) => void
  readonly className?: string
}

export function Accordion({ className, ...props }: AccordionProps) {
  return <BaseAccordion.Root data-slot="accordion" className={cn('', className)} {...props} />
}

export type AccordionItemProps = HTMLAttributes<HTMLDivElement> & {
  readonly value: string
  readonly disabled?: boolean
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem({ className, value, disabled, children, ...props }, ref) {
    return (
      <BaseAccordion.Item
        ref={ref}
        data-slot="accordion-item"
        value={value}
        disabled={disabled}
        className={cn('border-b border-border', className)}
        {...props}
      >
        {children}
      </BaseAccordion.Item>
    )
  },
)

export type AccordionHeaderProps = HTMLAttributes<HTMLDivElement>

export const AccordionHeader = forwardRef<HTMLDivElement, AccordionHeaderProps>(
  function AccordionHeader({ className, children, ...props }, ref) {
    return (
      <BaseAccordion.Header
        ref={ref}
        data-slot="accordion-header"
        className={cn('', className)}
        {...props}
      >
        {children}
      </BaseAccordion.Header>
    )
  },
)

export type AccordionTriggerProps = HTMLAttributes<HTMLButtonElement>

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ className, children, ...props }, ref) {
    return (
      <BaseAccordion.Trigger
        ref={ref}
        data-slot="accordion-trigger"
        className={cn(
          'flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-ink transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus [&[data-panel-open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-ink-muted transition-transform duration-normal ease-default" />
      </BaseAccordion.Trigger>
    )
  },
)

export type AccordionPanelProps = HTMLAttributes<HTMLDivElement>

export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  function AccordionPanel({ className, children, ...props }, ref) {
    return (
      <BaseAccordion.Panel
        ref={ref}
        data-slot="accordion-panel"
        className={cn(
          'overflow-hidden text-sm text-ink-muted data-[ending-style]:animate-accordion-up data-[starting-style]:animate-accordion-down motion-reduce:animate-none',
          className,
        )}
        {...props}
      >
        <div className="pb-4 pt-0">{children}</div>
      </BaseAccordion.Panel>
    )
  },
)
