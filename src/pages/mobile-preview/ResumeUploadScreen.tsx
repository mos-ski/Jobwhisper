import { useEffect, useState } from 'react'
import { FileText, Upload, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Phase = 'upload' | 'parsing' | 'done'

const FIELDS = [
  { label: 'Full name', extracted: 'Darnell Smith' },
  { label: 'Email address', extracted: 'darnell.smith@email.com' },
  { label: 'Phone number', extracted: '+1 (555) 123-4567' },
  { label: 'Work experience', extracted: '6 years · Product Designer' },
  { label: 'Skills', extracted: 'Figma, React, Prototyping, UX Research' },
]

export function ResumeUploadScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('upload')
  const [progress, setProgress] = useState(0)
  const [revealed, setRevealed] = useState(0)

  const handleUpload = () => {
    setPhase('parsing')
    setProgress(0)
    setRevealed(0)
  }

  useEffect(() => {
    if (phase !== 'parsing') return
    const p = setInterval(() => {
      setProgress((v) => {
        if (v >= 100) {
          clearInterval(p)
          setPhase('done')
          return 100
        }
        return v + 3
      })
    }, 50)
    return () => clearInterval(p)
  }, [phase])

  useEffect(() => {
    if (phase !== 'parsing') return
    const t = setInterval(() => {
      setRevealed((v) => {
        if (v >= FIELDS.length) {
          clearInterval(t)
          return v
        }
        return v + 1
      })
    }, 600)
    return () => clearInterval(t)
  }, [phase])

  return (
    <div className="flex min-h-0 flex-1 flex-col px-6 pb-8 pt-6">
      <h2 className="text-sm font-semibold text-neutral-900">Resume</h2>
      <p className="mt-0.5 text-xs text-neutral-500">
        {phase === 'upload' && 'Upload your resume and we\'ll handle the rest.'}
        {phase === 'parsing' && 'Reading your resume…'}
        {phase === 'done' && 'Your resume has been parsed successfully.'}
      </p>

      <div className="mt-6 flex flex-1 flex-col">
        {phase === 'upload' && (
          <button
            onClick={handleUpload}
            className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 transition-colors hover:border-[#2563EB]/40 hover:bg-[#2563EB]/5"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2563EB]">
              <Upload size={24} />
            </span>
            <div className="text-center">
              <p className="text-sm font-semibold text-neutral-900">Upload your resume</p>
              <p className="mt-1 text-xs text-neutral-400">PDF, DOCX, or TXT</p>
            </div>
          </button>
        )}

        {(phase === 'parsing' || phase === 'done') && (
          <div className="flex flex-1 flex-col justify-start gap-5">
            <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2563EB]">
                <FileText size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-900">Darnell_Smith_Resume.pdf</p>
                <p className="text-xs text-neutral-400">248 KB</p>
              </div>
              {phase === 'done' && <CheckCircle size={20} className="text-green-500" />}
            </div>

            {phase === 'parsing' && (
              <>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full rounded-full bg-[#2563EB] transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="space-y-3">
                  {FIELDS.slice(0, revealed).map((field) => (
                    <div key={field.label} className="flex items-center gap-3 text-sm">
                      <Loader2 size={14} className="animate-spin text-[#2563EB]" />
                      <span className="text-neutral-500">{field.label}</span>
                      <span className="ml-auto font-medium text-neutral-900">{field.extracted}</span>
                    </div>
                  ))}
                  {revealed < FIELDS.length && (
                    <div className="flex items-center gap-3 text-sm text-neutral-300">
                      <span className="h-3.5 w-3.5 rounded-full border border-neutral-300" />
                      <span>{FIELDS[revealed].label}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {phase === 'done' && (
              <div className="space-y-3">
                {FIELDS.map((field) => (
                  <div key={field.label} className="flex items-center gap-3 text-sm">
                    <CheckCircle size={14} className="text-green-500" />
                    <span className="text-neutral-500">{field.label}</span>
                    <span className="ml-auto font-medium text-neutral-900">{field.extracted}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={onComplete}
        disabled={phase !== 'done'}
        className={cn(
          'mt-6 w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors',
          phase === 'done'
            ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]'
            : 'bg-neutral-200 text-neutral-400'
        )}
      >
        {phase === 'upload' ? 'Upload a file to continue' : phase === 'parsing' ? 'Parsing resume…' : 'Continue'}
      </button>
    </div>
  )
}
