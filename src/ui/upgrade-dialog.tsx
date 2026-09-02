import { Lock } from 'lucide-react'

import { Button } from './button'
import { Dialog, DialogClose, DialogPopup, DialogTitle } from './dialog'

export type UpgradeDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly title: string
  readonly message: string
  readonly ctaLabel: string
  readonly ctaHref: string
}

export function UpgradeDialog({ open, onOpenChange, title, message, ctaLabel, ctaHref }: UpgradeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup aria-label={title}>
        <DialogClose />
        <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl border border-border bg-surface-raised text-ink-muted shadow-control [&>svg]:size-5">
          <Lock aria-hidden="true" />
        </span>
        <DialogTitle className="mt-4">{title}</DialogTitle>
        <p className="mt-1 text-sm text-ink-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Not now
          </Button>
          <a
            href={ctaHref}
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {ctaLabel}
          </a>
        </div>
      </DialogPopup>
    </Dialog>
  )
}
