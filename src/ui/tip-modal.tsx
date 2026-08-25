import { useState, type ReactNode } from 'react'
import { HelpCircle } from 'lucide-react'

import { cn } from './cn'
import { Dialog, DialogPopup, DialogTitle } from './dialog'

export type TipModalItem = {
  readonly icon?: ReactNode
  readonly title: string
  readonly body: string
}

export type TipModalProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly title: string
  readonly body?: string
  readonly items?: readonly TipModalItem[]
  readonly actionLabel?: string
}

export function TipModal({ open, onOpenChange, title, body, items, actionLabel = 'Okay' }: TipModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup aria-label={title}>
        <DialogTitle>{title}</DialogTitle>
        {body ? <p className="mt-2 text-sm leading-6 text-ink-muted">{body}</p> : null}
        {items && items.length > 0 ? (
          <div className="mt-4 grid gap-4">
            {items.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                {item.icon ? (
                  <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-subtle text-accent-text [&>svg]:size-4">
                    {item.icon}
                  </span>
                ) : null}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="mt-0.5 text-sm leading-6 text-ink-muted">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          {actionLabel}
        </button>
      </DialogPopup>
    </Dialog>
  )
}

export type TipModalTriggerProps = Omit<TipModalProps, 'open' | 'onOpenChange'> & {
  readonly label: string
  readonly className?: string
}

export function TipModalTrigger({ label, className, ...tipModalProps }: TipModalTriggerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        className={cn(
          'inline-flex items-center justify-center rounded-full p-0.5 text-muted transition-colors hover:bg-accent-subtle hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
          className,
        )}
      >
        <HelpCircle aria-hidden="true" className="size-4" />
      </button>
      <TipModal open={open} onOpenChange={setOpen} {...tipModalProps} />
    </>
  )
}
