import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Dialog, DialogBackdrop, DialogPopup, DialogPortal, DialogTitle, DialogDescription, DialogClose } from './dialog'

import { cn } from './cn'

export type SheetSide = 'left' | 'right' | 'top' | 'bottom'

export type SheetProps = {
  readonly open?: boolean
  readonly onOpenChange?: (open: boolean) => void
  readonly children: ReactNode
}

export function Sheet({ children, ...props }: SheetProps) {
  return <Dialog {...props}>{children}</Dialog>
}

export const SheetTrigger = Dialog

export type SheetContentProps = HTMLAttributes<HTMLDivElement> & {
  readonly side?: SheetSide
}

const sideStyles: Record<SheetSide, string> = {
  left: 'fixed inset-y-0 start-0 h-full w-72 max-w-[85vw] -translate-x-full border-e border-border data-[open]:translate-x-0 rtl:translate-x-full rtl:data-[open]:translate-x-0',
  right: 'fixed inset-y-0 end-0 h-full w-80 max-w-[90vw] translate-x-full border-s border-border data-[open]:translate-x-0 rtl:-translate-x-full rtl:data-[open]:translate-x-0',
  top: 'fixed inset-x-0 start-0 w-full -translate-y-full border-b border-border data-[open]:translate-y-0',
  bottom: 'fixed inset-x-0 bottom-0 w-full translate-y-full border-t border-border data-[open]:translate-y-0',
}

export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(
  function SheetContent({ className, children, side = 'right', ...props }, ref) {
    return (
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup
          ref={ref}
          placement={side === 'left' ? 'start' : side === 'right' ? 'end' : 'center'}
          className={cn(
            'z-modal overflow-y-auto bg-surface shadow-xl transition-transform duration-normal ease-default focus-visible:outline-none motion-reduce:transition-none',
            sideStyles[side],
            className,
          )}
          {...props}
        >
          {children}
        </DialogPopup>
      </DialogPortal>
    )
  },
)

export const SheetTitle = DialogTitle
export const SheetDescription = DialogDescription
export const SheetClose = DialogClose
