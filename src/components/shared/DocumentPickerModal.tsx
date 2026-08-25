import { useState } from 'react'
import { X, Upload, Sparkles, FileText, Layers, File as FileIcon, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_CONTEXT_SOURCES } from '@/lib/mockContextSources'

type DocPickerStep = 'choose' | 'cv' | 'context' | 'other'

function iconForContextType(type: string) {
  if (type === 'GitHub' || type === 'LinkedIn') return Layers
  if (type === 'Note') return FileIcon
  return FileText
}

interface DocumentPickerModalProps {
  onClose: () => void
  onAdd: (doc: { name: string; type: string }) => void
}

export default function DocumentPickerModal({ onClose, onAdd }: DocumentPickerModalProps) {
  const [step, setStep]             = useState<DocPickerStep>('choose')
  const [cvType, setCvType]         = useState<'lightforth' | 'upload'>('lightforth')
  const [selected, setSelected]     = useState<Set<string>>(new Set())

  const toggleContext = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleAddContext = () => {
    const docs = MOCK_CONTEXT_SOURCES.filter(s => selected.has(s.id))
    docs.forEach(d => onAdd({ name: d.name, type: d.type }))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-slate-950/45 p-4">
      <div className="lf-panel w-full max-w-[480px] p-0 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            {step !== 'choose' && (
              <button onClick={() => setStep('choose')} className="mr-1 rounded p-1 text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            <h2 className="text-lg font-bold text-foreground">
              {step === 'choose'  && 'Add Documents'}
              {step === 'cv'      && 'Choose Resume'}
              {step === 'context' && 'Select Context Sources'}
              {step === 'other'   && 'Upload a Document'}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">

          {/* Step 1: Choose type */}
          {step === 'choose' && (
            <>
              <p className="lf-label mb-4">What type of document do you want to add?</p>

              <button onClick={() => setStep('cv')}
                className="flex w-full items-center gap-4 rounded-lg border border-border bg-white px-4 py-3.5 text-left transition hover:border-primary/50 hover:bg-primary/5 group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">CV / Resume</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Upload a new resume or use your Lightforth resume</p>
                </div>
              </button>

              <button onClick={() => setStep('context')}
                className="flex w-full items-center gap-4 rounded-lg border border-border bg-white px-4 py-3.5 text-left transition hover:border-primary/50 hover:bg-primary/5 group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Layers className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">Context Sources</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Pull from your saved context library — GitHub, LinkedIn, notes & more</p>
                </div>
              </button>

              <button onClick={() => setStep('other')}
                className="flex w-full items-center gap-4 rounded-lg border border-border bg-white px-4 py-3.5 text-left transition hover:border-primary/50 hover:bg-primary/5 group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">Other Document</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Upload any PDF, DOCX, or MD file</p>
                </div>
              </button>
            </>
          )}

          {/* Step 2a: CV / Resume */}
          {step === 'cv' && (
            <>
              <p className="lf-label mb-3">Choose resume</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setCvType('lightforth')}
                  className={cn(
                    'relative flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors',
                    cvType === 'lightforth' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:bg-muted',
                  )}
                >
                  {cvType === 'lightforth' && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border border-primary bg-white px-2 py-0.5 text-[9px] font-bold text-primary">RECOMMENDED</span>
                  )}
                  <Sparkles className="h-4 w-4" /> Use Lightforth Resume
                </button>
                <button
                  onClick={() => setCvType('upload')}
                  className={cn(
                    'flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors',
                    cvType === 'upload' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:bg-muted',
                  )}
                >
                  <Upload className="h-4 w-4" /> Upload a Resume
                </button>
              </div>

              {cvType === 'lightforth' && (
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 fill-red-500 text-red-500 shrink-0" />
                  <span className="flex-1 truncate">Darnell_Smith_resume.pdf</span>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                </div>
              )}

              {cvType === 'upload' && (
                <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 px-6 py-8 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition">
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-foreground">Click to upload</p>
                  <p className="text-xs text-muted-foreground mt-0.5">PDF, DOCX — max 10MB</p>
                  <input type="file" accept=".pdf,.docx,.doc" className="sr-only" onChange={e => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    onAdd({ name: file.name, type: 'CV' })
                    onClose()
                  }} />
                </label>
              )}

              <div className="flex gap-3 border-t border-border pt-4">
                <button onClick={() => setStep('choose')} className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Back
                </button>
                <button
                  onClick={() => { onAdd({ name: cvType === 'lightforth' ? 'Darnell_Smith_resume.pdf' : 'Resume', type: 'CV' }); onClose() }}
                  className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
                >
                  Add Resume →
                </button>
              </div>
            </>
          )}

          {/* Step 2b: Context Sources */}
          {step === 'context' && (
            <>
              <p className="lf-label mb-3">Select sources to include</p>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {MOCK_CONTEXT_SOURCES.map(src => {
                  const Icon = iconForContextType(src.type)
                  const isChecked = selected.has(src.id)
                  return (
                    <button key={src.id} onClick={() => toggleContext(src.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all',
                        isChecked ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-muted/30'
                      )}>
                      <span className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 text-[10px] font-bold transition-colors',
                        isChecked ? 'border-primary bg-primary text-white' : 'border-border'
                      )}>
                        {isChecked ? '✓' : ''}
                      </span>
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">{src.name}</p>
                        <p className="text-[10px] text-muted-foreground">{src.type}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-3 border-t border-border pt-4">
                <button onClick={() => setStep('choose')} className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Back
                </button>
                <button onClick={handleAddContext} disabled={selected.size === 0}
                  className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-40">
                  Add {selected.size > 0 ? `${selected.size} ` : ''}Source{selected.size !== 1 ? 's' : ''} →
                </button>
              </div>
            </>
          )}

          {/* Step 2c: Other Document */}
          {step === 'other' && (
            <>
              <p className="lf-label mb-3">Upload a document</p>
              <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 px-6 py-10 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition">
                <Upload className="h-7 w-7 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">Click to upload or drag & drop</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, DOC, MD — max 10MB</p>
                <input type="file" accept=".pdf,.docx,.doc,.md" className="sr-only" onChange={e => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  onAdd({ name: file.name, type: 'Document' })
                  onClose()
                }} />
              </label>
              <button onClick={() => setStep('choose')} className="w-full rounded-lg border border-border py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Back
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
