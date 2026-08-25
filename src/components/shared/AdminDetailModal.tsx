import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export type DetailField = {
  label: string
  value: ReactNode
}

type AdminDetailModalProps = {
  title: string
  subtitle?: string
  fields: DetailField[]
  onClose: () => void
  actions?: ReactNode
}

export function AdminDetailModal({ title, subtitle, fields, onClose, actions }: AdminDetailModalProps) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-950/30" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-border bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fields.map(({ label, value }) => (
              <div key={label} className="rounded-lg border border-border p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
              </div>
            ))}
          </div>
          {actions && <div className="mt-5 flex gap-2">{actions}</div>}
        </div>
      </div>
    </>
  )
}
