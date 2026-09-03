import { useState, type ComponentType, type HTMLAttributes } from 'react'
import { FileText, Plus } from 'lucide-react'

import type { ContextDocumentRow } from '@/contracts/documents.draft'
import { Button, Checkbox, Dialog, DialogClose, DialogPopup, DialogTitle, FormTextArea } from '@/ui'

export type KnowledgeBasePickerDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly documents: readonly ContextDocumentRow[]
  readonly selectedIds: ReadonlySet<string>
  readonly onConfirm: (ids: ReadonlySet<string>) => void
  readonly onAddDocument: (doc: ContextDocumentRow) => void
  readonly description: string
  readonly listMaxHeightClassName?: string
  /** Overrides the popup shell — used to confine the dialog within the simulated desktop app window. */
  readonly popupComponent?: ComponentType<HTMLAttributes<HTMLDivElement>>
}

let pastedDocCounter = 0

export function KnowledgeBasePickerDialog({
  open,
  onOpenChange,
  documents,
  selectedIds,
  onConfirm,
  onAddDocument,
  description,
  listMaxHeightClassName = 'max-h-60',
  popupComponent: Popup = DialogPopup,
}: KnowledgeBasePickerDialogProps) {
  const [draftIds, setDraftIds] = useState<ReadonlySet<string>>(selectedIds)
  const [addOpen, setAddOpen] = useState(false)
  const [pastedText, setPastedText] = useState('')
  const allSelected = documents.length > 0 && documents.every((doc) => draftIds.has(doc.id))

  function toggleDoc(id: string) {
    setDraftIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    setDraftIds(allSelected ? new Set() : new Set(documents.map((doc) => doc.id)))
  }

  function handleSavePastedDoc() {
    const trimmed = pastedText.trim()
    if (!trimmed) return
    pastedDocCounter += 1
    const newDoc: ContextDocumentRow = {
      id: `context-document-pasted-${pastedDocCounter}`,
      name: trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed,
      kind: 'DOCX',
      sizeOrUrl: `${trimmed.length} characters`,
      addedAtLabel: 'Just now',
    }
    onAddDocument(newDoc)
    setDraftIds((prev) => new Set(prev).add(newDoc.id))
    setPastedText('')
    setAddOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setDraftIds(selectedIds)
        onOpenChange(next)
      }}
    >
      <Popup aria-label="Add documents from Knowledge Base">
        <DialogClose />
        <DialogTitle>Add from Knowledge Base</DialogTitle>
        <p className="mt-1 text-sm text-ink-muted">{description}</p>

        {documents.length > 0 ? (
          <label className="mt-4 flex min-h-9 cursor-pointer items-center gap-3 rounded-lg border-b border-border px-3 pb-2 text-sm font-medium text-ink">
            <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} aria-label="Select all documents" />
            Select all
          </label>
        ) : null}

        <div className={`mt-1 grid ${listMaxHeightClassName} gap-1 overflow-y-auto`}>
          {documents.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-muted">No documents in your Knowledge Base yet.</p>
          ) : (
            documents.map((doc) => (
              <label key={doc.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 hover:bg-surface-subtle">
                <Checkbox checked={draftIds.has(doc.id)} onCheckedChange={() => toggleDoc(doc.id)} aria-label={doc.name} />
                <FileText aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{doc.name}</span>
                <span className="shrink-0 text-xs text-ink-muted">{doc.sizeOrUrl}</span>
              </label>
            ))
          )}
        </div>

        {addOpen ? (
          <div className="mt-4 grid gap-2 rounded-lg border border-border p-3">
            <FormTextArea
              id="kb-picker-paste-text"
              label="Paste document text"
              value={pastedText}
              onChange={(event) => setPastedText(event.target.value)}
              placeholder="Paste a job description, notes, or any context text…"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={handleSavePastedDoc} disabled={!pastedText.trim()}>Save document</Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-text hover:text-accent"
            >
              <Plus aria-hidden="true" className="size-4" />
              Add document
            </button>
            <a href="/v3/documents/add" className="text-xs font-medium text-ink-muted underline underline-offset-4 hover:text-ink">
              More ways to add — go to Documents
            </a>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              onConfirm(draftIds)
              onOpenChange(false)
            }}
          >
            Add Selected
          </Button>
        </div>
      </Popup>
    </Dialog>
  )
}
