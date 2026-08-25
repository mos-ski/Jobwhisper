import { useState } from 'react'
import { Plus, X, FileText, Layers, File as FileIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CARD, BORDER, BLUE } from './shared'
import type { ContextDoc } from './resolveContextDocs'

function iconForType(type: string) {
  if (type === 'GitHub' || type === 'LinkedIn') return Layers
  if (type === 'Note') return FileIcon
  return FileText
}

interface ContextPickerFieldProps {
  docs: ContextDoc[]
  selected: ContextDoc[]
  onChange: (docs: ContextDoc[]) => void
}

export function ContextPickerField({ docs, selected, onChange }: ContextPickerFieldProps) {
  const [open, setOpen] = useState(false)

  const removeDoc = (id: string) => onChange(selected.filter(d => d.id !== id))

  return (
    <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
      <p className="mb-2 text-sm font-semibold text-white">Context <span className="font-normal text-white/40">(optional)</span></p>

      {selected.length === 0 ? (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-3 text-xs font-medium text-white/50 hover:border-white/30 hover:text-white/80 transition-colors"
          style={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <Plus className="h-3.5 w-3.5" /> Add context from your documents
        </button>
      ) : (
        <div className="space-y-1.5">
          {selected.map(doc => {
            const Icon = iconForType(doc.type)
            return (
              <div key={doc.id} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}` }}>
                <Icon className="h-3.5 w-3.5 shrink-0 text-white/50" />
                <span className="flex-1 truncate">{doc.name}</span>
                <button aria-label="Remove" onClick={() => removeDoc(doc.id)}>
                  <X className="h-3 w-3 text-white/50 hover:text-white" />
                </button>
              </div>
            )
          })}
          <button onClick={() => setOpen(true)} className="flex items-center gap-1 pt-1 text-xs font-semibold text-blue-400 hover:underline">
            <Plus className="h-3 w-3" /> Add more
          </button>
        </div>
      )}

      {open && (
        <ContextPickerModal
          docs={docs}
          initiallySelectedIds={new Set(selected.map(d => d.id))}
          onClose={() => setOpen(false)}
          onDone={ids => {
            onChange(docs.filter(d => ids.has(d.id)))
            setOpen(false)
          }}
        />
      )}
    </div>
  )
}

function ContextPickerModal({
  docs,
  initiallySelectedIds,
  onClose,
  onDone,
}: {
  docs: ContextDoc[]
  initiallySelectedIds: Set<string>
  onClose: () => void
  onDone: (ids: Set<string>) => void
}) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(initiallySelectedIds)

  const toggle = (id: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl p-6 shadow-2xl" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Select context documents</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-white/50 hover:text-white" /></button>
        </div>

        {docs.length === 0 ? (
          <p className="py-6 text-center text-sm text-white/50">No documents available yet.</p>
        ) : (
          <div className="mb-5 max-h-64 space-y-1.5 overflow-y-auto">
            {docs.map(doc => {
              const Icon = iconForType(doc.type)
              const isChecked = checkedIds.has(doc.id)
              return (
                <button
                  key={doc.id}
                  onClick={() => toggle(doc.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
                  style={{ background: isChecked ? 'rgba(26,122,255,0.15)' : 'transparent', border: `1px solid ${isChecked ? BLUE : BORDER}` }}
                >
                  <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 text-[10px] font-bold', isChecked ? 'border-blue-400 bg-blue-400 text-white' : 'border-white/30')}>
                    {isChecked ? '✓' : ''}
                  </span>
                  <Icon className="h-4 w-4 shrink-0 text-white/50" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{doc.name}</p>
                    <p className="text-[10px] text-white/40">{doc.type}</p>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <button onClick={() => onDone(checkedIds)} className="h-11 w-full rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ background: BLUE }}>
          Done
        </button>
      </div>
    </div>
  )
}
