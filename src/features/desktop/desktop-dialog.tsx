import { forwardRef, type HTMLAttributes } from 'react'
import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'

import { cn } from '@/ui'

import { useDesktopFrameElement } from './desktop-shell'

export type DesktopDialogPopupProps = HTMLAttributes<HTMLDivElement>

export const DesktopDialogPopup = forwardRef<HTMLDivElement, DesktopDialogPopupProps>(
  function DesktopDialogPopup({ className, children, ...props }, ref) {
    const frameEl = useDesktopFrameElement()

    return (
      <BaseDialog.Portal container={frameEl}>
        <BaseDialog.Backdrop className="absolute inset-0 z-modal bg-black/50 backdrop-blur-sm transition-opacity duration-normal ease-default data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none" />
        <BaseDialog.Popup
          ref={ref}
          className={cn(
            'absolute left-1/2 top-1/2 z-modal max-h-[calc(100%-2.5rem)] w-[calc(100%-2.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl shadow-xl transition-[opacity,transform] duration-normal ease-default focus-visible:outline-none data-[ending-style]:-translate-y-[calc(50%-0.5rem)] data-[ending-style]:opacity-0 data-[starting-style]:-translate-y-[calc(50%-0.5rem)] data-[starting-style]:opacity-0 motion-reduce:transition-none',
            className,
          )}
          {...props}
        >
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    )
  },
)
