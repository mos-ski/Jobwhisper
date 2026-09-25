import { useId, useState } from 'react'
import { FileText, Upload } from 'lucide-react'

export type FunnelUploadProps = {
  /** Name of the file already chosen, if any. */
  readonly fileName?: string
  /** Why the last file was refused, stated as the fix. */
  readonly error?: string
  readonly onFile: (file: File) => void
  /** Defaults to "Your resume". */
  readonly label?: string
}

export const FUNNEL_UPLOAD_ACCEPT = '.pdf,.doc,.docx,.txt'

export function FunnelUpload({ fileName, error, onFile, label = 'Your resume' }: FunnelUploadProps) {
  const inputId = useId()
  const errorId = useId()
  const [dragging, setDragging] = useState(false)

  return (
    <div data-slot="funnel-upload" className="grid gap-2">
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
        className="grid cursor-pointer justify-items-center gap-3 rounded-panel border-2 border-dashed border-input bg-surface px-6 py-10 text-center transition-colors duration-normal ease-default hover:border-accent data-[dragging]:border-accent data-[dragging]:bg-accent-subtle has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus motion-reduce:transition-none"
      >
        {fileName ? <FileText aria-hidden="true" className="size-8 text-accent-text" /> : <Upload aria-hidden="true" className="size-8 text-ink-muted" />}
        <span className="text-base font-semibold text-ink">{fileName ? fileName : label}</span>
        <span className="text-sm text-ink-muted">{fileName ? 'Choose a different file' : 'Drop it here or choose a file. PDF, DOC, DOCX or TXT, up to 5 MB.'}</span>
        <input
          id={inputId}
          type="file"
          accept={FUNNEL_UPLOAD_ACCEPT}
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
      {error ? <p id={errorId} role="alert" className="text-sm text-danger">{error}</p> : null}
    </div>
  )
}
