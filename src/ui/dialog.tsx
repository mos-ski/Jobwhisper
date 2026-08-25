import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'
import { X } from 'lucide-react'

import { cn } from './cn'

export type DialogProps = {
  readonly open?: boolean
  readonly onOpenChange?: (open: boolean) => void
  readonly children: ReactNode
}

export function Dialog({ children, ...props }: DialogProps) {
  return <BaseDialog.Root {...props}>{children}</BaseDialog.Root>
}

export const DialogTrigger = BaseDialog.Trigger

export type DialogPortalProps = {
  readonly children: ReactNode
}

export function DialogPortal({ children }: DialogPortalProps) {
  return <BaseDialog.Portal>{children}</BaseDialog.Portal>
}

export type DialogBackdropProps = HTMLAttributes<HTMLDivElement>

export const DialogBackdrop = forwardRef<HTMLDivElement, DialogBackdropProps>(
  function DialogBackdrop({ className, ...props }, ref) {
    return (
      <BaseDialog.Backdrop
        ref={ref}
        className={cn(
          'fixed inset-0 z-modal bg-overlay opacity-100 backdrop-blur-sm transition-opacity duration-normal ease-default data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none',
          className,
        )}
        {...props}
      />
    )
  },
)

export type DialogPopupPlacement = 'center' | 'start' | 'end' | 'end-sheet'

export type DialogPopupProps = HTMLAttributes<HTMLDivElement> & {
  readonly placement?: DialogPopupPlacement
}

const popupPlacements: Record<DialogPopupPlacement, string> = {
  // Mobile: bottom sheet (slides up from the bottom edge). sm+: centered modal card.
  center:
    'fixed inset-x-0 bottom-0 z-modal max-h-[85vh] w-full overflow-y-auto rounded-t-panel border-t border-border bg-surface p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-xl transition-transform duration-normal ease-default focus-visible:outline-none before:absolute before:inset-x-0 before:top-2 before:mx-auto before:h-1 before:w-10 before:rounded-pill before:bg-border before:content-[""] data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full motion-reduce:transition-none sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[calc(100vh-4rem)] sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-panel sm:border sm:pb-6 sm:transition-[opacity,transform] sm:before:hidden sm:data-[ending-style]:-translate-y-[calc(50%-0.5rem)] sm:data-[ending-style]:opacity-0 sm:data-[starting-style]:-translate-y-[calc(50%-0.5rem)] sm:data-[starting-style]:opacity-0',
  start:
    '-translate-x-full fixed inset-y-0 start-0 z-modal h-full w-72 max-w-[85vw] overflow-y-auto border-e border-border bg-surface shadow-xl transition-transform duration-normal ease-default focus-visible:outline-none data-[open]:translate-x-0 rtl:translate-x-full rtl:data-[open]:translate-x-0 motion-reduce:transition-none',
  end:
    'translate-x-full fixed inset-y-0 end-0 z-modal h-full w-80 max-w-[90vw] overflow-y-auto border-s border-border bg-surface shadow-xl transition-transform duration-normal ease-default focus-visible:outline-none data-[open]:translate-x-0 rtl:-translate-x-full rtl:data-[open]:translate-x-0 motion-reduce:transition-none',
  // Mobile: bottom sheet, same as `center`. lg+: side panel from the end edge, same as `end`.
  'end-sheet':
    'fixed inset-x-0 bottom-0 z-modal max-h-[85vh] w-full overflow-y-auto rounded-t-panel border-t border-border bg-surface shadow-xl transition-transform duration-normal ease-default focus-visible:outline-none before:absolute before:inset-x-0 before:top-2 before:mx-auto before:h-1 before:w-10 before:rounded-pill before:bg-border before:content-[""] data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full motion-reduce:transition-none lg:inset-x-auto lg:inset-y-0 lg:start-auto lg:end-0 lg:h-full lg:max-h-none lg:w-80 lg:max-w-[90vw] lg:translate-x-full lg:translate-y-0 lg:rounded-none lg:border-t-0 lg:border-s lg:before:hidden lg:data-[open]:translate-x-0 lg:data-[ending-style]:translate-y-0 lg:data-[starting-style]:translate-y-0 lg:rtl:-translate-x-full lg:rtl:data-[open]:translate-x-0',
}

export const DialogPopup = forwardRef<HTMLDivElement, DialogPopupProps>(
  function DialogPopup({ className, children, placement = 'center', ...props }, ref) {
    return (
      <BaseDialog.Portal>
        <DialogBackdrop />
        <BaseDialog.Popup ref={ref} className={cn(popupPlacements[placement], className)} {...props}>
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    )
  },
)

export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle({ className, ...props }, ref) {
    return (
      <BaseDialog.Title
        ref={ref}
        className={cn('text-lg font-semibold text-ink', className)}
        {...props}
      />
    )
  },
)

export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  function DialogDescription({ className, ...props }, ref) {
    return (
      <BaseDialog.Description
        ref={ref}
        className={cn('mt-1 text-sm text-ink-muted', className)}
        {...props}
      />
    )
  },
)

export type DialogCloseProps = HTMLAttributes<HTMLButtonElement>

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose({ className, ...props }, ref) {
    return (
      <BaseDialog.Close
        ref={ref}
        className={cn('absolute end-2 top-2 grid size-11 place-items-center rounded-soft text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', className)}
        {...props}
      >
        <X aria-hidden="true" className="size-4" />
      </BaseDialog.Close>
    )
  },
)
