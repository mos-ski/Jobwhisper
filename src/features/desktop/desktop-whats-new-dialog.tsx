import { Check } from 'lucide-react'

import type { DesktopReleaseNote } from '@/contracts/desktop.draft'
import { Button, Dialog, DialogClose, DialogPopup, DialogTitle } from '@/ui'

export type DesktopWhatsNewDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly note: DesktopReleaseNote
}

const date = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

export function DesktopWhatsNewDialog({ open, onOpenChange, note }: DesktopWhatsNewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="sm:max-w-md">
        <DialogTitle className="text-base font-semibold">What&rsquo;s new</DialogTitle>
        <p className="mt-2 flex items-baseline justify-between gap-3 pe-8">
          <span className="font-gowun text-lg text-ink">Version {note.version}</span>
          <span className="text-sm text-ink-muted">{date.format(new Date(note.date))}</span>
        </p>
        <ul className="mt-5 grid gap-5">
          {note.items.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-subtle text-accent-text"><Check className="size-3" /></span>
              <span>
                <span className="block text-sm font-semibold text-ink">{item.title}</span>
                <span className="mt-1 block text-sm leading-6 text-ink-muted">{item.detail}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Got it</Button>
        </div>
        <DialogClose aria-label="Close what's new" />
      </DialogPopup>
    </Dialog>
  )
}
