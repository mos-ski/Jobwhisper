import { useId, useState } from 'react'
import { Upload } from 'lucide-react'

export type FunnelUploadProps = {
  /** Name of the file already chosen, if any. */
  readonly fileName?: string
  /** Why the last file was refused, stated as the fix. */
  readonly error?: string
  readonly onFile: (file: File) => void
  /** Accessible name for the file input. */
  readonly label?: string
}

export const FUNNEL_UPLOAD_ACCEPT = '.pdf,.doc,.docx,.txt'

export function FunnelUpload({ fileName, error, onFile, label = 'Your resume' }: FunnelUploadProps) {
  const inputId = useId()
  const errorId = useId()
  const [dragging, setDragging] = useState(false)

  return (
    <div data-slot="funnel-upload" className="grid w-full gap-2">
      <div className="w-full overflow-hidden rounded-xl border border-border bg-surface">
        <label
          htmlFor={inputId}
          data-dragging={dragging || undefined}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            const file = event.dataTransfer.files?.[0]
            if (file) onFile(file)
          }}
          className="flex min-h-[340px] cursor-pointer flex-col items-center justify-center gap-3.5 rounded-[10px] border border-dashed border-input p-6 text-center transition-colors duration-fast hover:border-accent data-[dragging]:border-accent data-[dragging]:bg-accent-subtle has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus"
        >
          <span className="grid size-12 place-items-center rounded-xl border border-border bg-surface shadow-control">
            <Upload aria-hidden="true" className="size-5 text-ink" />
          </span>
          <span className="grid gap-1">
            <strong className="text-[15px] font-medium text-ink">{fileName ?? 'Drop a resume here, or browse files'}</strong>
            <span className="text-[13px] text-ink-muted">{fileName ? 'Resume uploaded' : 'PDF, DOC, DOCX or TXT · up to 5 MB'}</span>
          </span>
          {fileName ? (
            <span className="text-[13px] font-semibold text-accent-text underline underline-offset-4">Change resume</span>
          ) : (
            <span className="rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-on-accent">Import resume</span>
          )}
          <input
            id={inputId}
            type="file"
            accept={FUNNEL_UPLOAD_ACCEPT}
            aria-label={label}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? true : undefined}
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onFile(file)
              event.target.value = ''
            }}
            className="sr-only"
          />
        </label>
      </div>
      {error ? <p id={errorId} role="alert" className="text-center text-sm text-danger">{error}</p> : null}
    </div>
  )
}
