import { useRef, useState } from 'react'
import { Upload, Zap } from 'lucide-react'

export interface UploadedResume {
  name: string
  size: string
}

interface Props {
  onUpload: (resume: UploadedResume) => void
}

export default function ResumeUploadDropdown({ onUpload }: Props) {
  const [open, setOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
    onUpload({ name: file.name, size: `${sizeMB}MB` })
    setOpen(false)
    // reset so the same file can be re-selected
    e.target.value = ''
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="upload-cta-pulse flex w-full items-center justify-between rounded-2xl bg-[#D6E9FF] px-5 py-5 transition-colors hover:bg-[#c4dfff]"
      >
        <span className="flex items-center gap-3 text-base font-semibold text-foreground">
          <span className="text-2xl font-light text-slate-500">+</span>
          Upload a Resume
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            fileRef.current?.click()
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-400 transition-colors hover:bg-slate-500"
        >
          <Upload className="h-5 w-5 text-white" />
        </button>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
            <button
              onClick={() => {
                setOpen(false)
                fileRef.current?.click()
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Upload className="h-4 w-4 text-muted-foreground" />
              Upload a Resume
            </button>
            <button
              onClick={() => {
                onUpload({ name: 'Lightforth_Resume.pdf', size: '1.2MB' })
                setOpen(false)
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Zap className="h-4 w-4 fill-primary text-primary" />
              Use Lightforth Resume
            </button>
          </div>
        </>
      )}

      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
