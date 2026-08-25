import type { ReactNode } from 'react'

import { Dialog, DialogClose, DialogPopup, DialogTitle } from './dialog'

export type ListPickerItem = {
  readonly id: string
  readonly title: string
  readonly subtitle?: string
  readonly meta?: string
}

export type ListPickerDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly title: string
  readonly description?: string
  readonly items: readonly ListPickerItem[]
  readonly emptyLabel: string
  readonly icon?: ReactNode
  readonly onSelect: (item: ListPickerItem) => void
}

export function ListPickerDialog({ open, onOpenChange, title, description, items, emptyLabel, icon, onSelect }: ListPickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup aria-label={title}>
        <DialogClose />
        <DialogTitle>{title}</DialogTitle>
        {description ? <p className="mt-1 text-sm text-ink-muted">{description}</p> : null}
        <div className="mt-4 grid max-h-80 gap-1 overflow-y-auto">
          {items.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-muted">{emptyLabel}</p>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className="flex min-h-14 items-center gap-3 rounded-lg px-3 text-start hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                {icon ? (
                  <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-subtle text-ink-muted [&>svg]:size-4">
                    {icon}
                  </span>
                ) : null}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">{item.title}</span>
                  {item.subtitle ? <span className="block truncate text-xs text-ink-muted">{item.subtitle}</span> : null}
                </span>
                {item.meta ? <span className="shrink-0 text-xs font-medium text-ink-muted">{item.meta}</span> : null}
              </button>
            ))
          )}
        </div>
      </DialogPopup>
    </Dialog>
  )
}
