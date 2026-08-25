import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner'

import { cn } from './cn'

export type ToastProps = HTMLAttributes<HTMLDivElement>

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  function Toast({ className, ...props }, ref) {
    return <div ref={ref} data-slot="toast" className={cn('', className)} {...props} />
  },
)

export function Toaster() {
  return <SonnerToaster richColors closeButton position="bottom-right" />
}

export const toast = {
  success: (message: string, options?: { description?: string }) =>
    sonnerToast.success(message, options),
  error: (message: string, options?: { description?: string }) =>
    sonnerToast.error(message, options),
  info: (message: string, options?: { description?: string }) =>
    sonnerToast.info(message, options),
  warning: (message: string, options?: { description?: string }) =>
    sonnerToast.warning(message, options),
  default: (message: string, options?: { description?: string }) =>
    sonnerToast(message, options),
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
}
