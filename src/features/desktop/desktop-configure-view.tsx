import { useState, type ChangeEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown, FileText, Plus, X, Zap } from 'lucide-react'

import { copilotSetup } from '@/mocks/copilot'
import { contextDocumentRows } from '@/mocks/documents'
import { Checkbox, Dialog, DialogClose, DialogPopup, DialogTitle } from '@/ui'

const AI_SUGGESTION =
  'Focus on the last two years of product launches — probe for measurable impact, cross-functional negotiation, and how they handled a launch that slipped.'

function DarkField({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <div className="grid flex-1 gap-1.5">
      <label className="text-sm font-medium text-white">{label}</label>
      {children}
    </div>
  )
}

function DarkSelect({ value, onChange, options }: { readonly value: string; readonly onChange: (value: string) => void; readonly options: readonly string[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
        className="w-full appearance-none rounded-lg bg-white/10 px-3 py-2.5 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#0d1929] text-white">
            {option}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white/60" />
    </div>
  )
}

export function DesktopConfigureView() {
  const navigate = useNavigate()
  const [targetRole, setTargetRole] = useState(copilotSetup.targetRole)
  const [companyName, setCompanyName] = useState(copilotSetup.companyName)
  const [interviewType, setInterviewType] = useState('Introductory')
  const [difficulty, setDifficulty] = useState('Medium')
  const [additionalContext, setAdditionalContext] = useState(copilotSetup.additionalContext)
  const [selectedDocIds, setSelectedDocIds] = useState<ReadonlySet<string>>(new Set())
  const [pickerOpen, setPickerOpen] = useState(false)

  function toggleDoc(id: string) {
    setSelectedDocIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex h-full min-h-[520px] items-center justify-center bg-live-workspace px-6 py-12">
      <div className="w-full max-w-[485px] overflow-hidden rounded-lg bg-[#0d1929] shadow-panel">
        <div className="flex items-center justify-center border-b border-white/15 py-8">
          <h1 className="text-xl font-medium text-white">Configure your interview</h1>
        </div>

        <div className="flex items-center justify-between rounded-b-lg bg-[rgba(221,241,255,0.13)] px-4 py-1.5">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <FileText aria-hidden="true" className="size-3.5 shrink-0 text-[#ea4335]" />
            <span className="truncate text-xs text-white">{copilotSetup.uploadedFileName}</span>
            <X aria-hidden="true" className="size-3 shrink-0 text-white/60" />
          </span>
          <button type="button" className="shrink-0 text-[10.5px] font-semibold text-[#0052ff] underline underline-offset-2">
            Change
          </button>
        </div>

        <div className="grid gap-3 p-8">
          <div className="flex gap-6">
            <DarkField label="Interview type">
              <DarkSelect value={interviewType} onChange={setInterviewType} options={['Introductory', 'Behavioral', 'Product case']} />
            </DarkField>
            <DarkField label="Difficulty">
              <DarkSelect value={difficulty} onChange={setDifficulty} options={['Easy', 'Medium', 'Hard']} />
            </DarkField>
          </div>

          <div className="flex gap-6">
            <DarkField label="Target Role">
              <input
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                placeholder="Ex. Product Manager"
                className="w-full rounded-lg bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              />
            </DarkField>
            <DarkField label="Company Name">
              <input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="Ex. Google"
                className="w-full rounded-lg bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              />
            </DarkField>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">
                Documents <span className="text-xs font-normal text-white/60">(optional)</span>
              </p>
              <button type="button" onClick={() => setPickerOpen(true)} className="inline-flex items-center gap-1 text-xs font-medium text-white">
                <Plus aria-hidden="true" className="size-3" />
                Add Documents
              </button>
            </div>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex flex-wrap items-center justify-center gap-2 rounded-lg border border-dashed border-white/16 bg-white/[0.01] px-3 py-3.5 text-xs text-white/50"
            >
              {selectedDocIds.size > 0 ? (
                contextDocumentRows
                  .filter((doc) => selectedDocIds.has(doc.id))
                  .map((doc) => (
                    <span key={doc.id} className="inline-flex items-center gap-1.5 rounded-pill border border-white/16 bg-white/10 px-3 py-1 text-xs text-white">
                      <FileText aria-hidden="true" className="size-3.5 text-white/60" />
                      {doc.name}
                    </span>
                  ))
              ) : (
                <>
                  <Plus aria-hidden="true" className="size-3.5" />
                  Add context, notes, or other docs
                </>
              )}
            </button>
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-white">Additional context</label>
            <textarea
              value={additionalContext}
              onChange={(event) => setAdditionalContext(event.target.value)}
              rows={5}
              className="w-full resize-y rounded-lg bg-white/10 px-3.5 py-3 text-sm text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            />
            <button
              type="button"
              onClick={() => setAdditionalContext(AI_SUGGESTION)}
              className="ms-auto inline-flex items-center gap-1.5 text-sm font-semibold"
            >
              <Zap aria-hidden="true" className="size-3.5 shrink-0 text-[#ff5e93]" />
              <span className="bg-gradient-to-r from-[#134abe] to-[#ff5e93] bg-clip-text text-transparent">AI Suggestion</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/15 px-6 py-4">
          <button type="button" onClick={() => navigate('/desktop/permissions')} className="inline-flex items-center gap-1 text-base font-semibold text-white">
            <ArrowLeft aria-hidden="true" className="size-[18px]" />
            Back
          </button>
          <button
            type="button"
            onClick={() => navigate('/desktop/session')}
            className="inline-flex min-h-11 w-[150px] items-center justify-center rounded-lg border-2 border-white/12 bg-[#0052ff] px-4 text-base font-semibold text-white shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18),inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)]"
          >
            Continue
          </button>
        </div>
      </div>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogPopup aria-label="Add documents from Knowledge Base" className="sm:max-w-md">
          <DialogClose />
          <DialogTitle>Add from Knowledge Base</DialogTitle>
          <p className="mt-1 text-sm text-ink-muted">Select the documents you want Jobwhisper to use as context for this session.</p>
          <div className="mt-4 grid max-h-72 gap-1 overflow-y-auto">
            {contextDocumentRows.map((doc) => (
              <label key={doc.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 hover:bg-surface-subtle">
                <Checkbox checked={selectedDocIds.has(doc.id)} onCheckedChange={() => toggleDoc(doc.id)} aria-label={doc.name} />
                <FileText aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
                <span className="min-w-0 flex-1 truncate text-sm text-ink">{doc.name}</span>
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPickerOpen(false)}
            className="mt-4 flex min-h-11 w-full items-center justify-center rounded-lg bg-accent text-sm font-semibold text-on-accent"
          >
            Done
          </button>
        </DialogPopup>
      </Dialog>
    </div>
  )
}
