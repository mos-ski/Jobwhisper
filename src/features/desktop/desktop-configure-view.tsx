import { useState, type ChangeEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown, FileText, Plus, Sparkles, X, Zap } from 'lucide-react'

import type { CopilotModelTier } from '@/contracts/copilot.draft'
import { KnowledgeBasePickerDialog } from '@/features/documents/knowledge-base-picker-dialog'
import { copilotSetup } from '@/mocks/copilot'
import { contextDocumentRows } from '@/mocks/documents'

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

function DarkCheckboxRow({ checked, onChange, label, hint }: { readonly checked: boolean; readonly onChange: (checked: boolean) => void; readonly label: string; readonly hint: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 rounded border-white/30 bg-white/10 text-[#0052ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      />
      <span>
        <span className="block text-sm font-medium text-white">{label}</span>
        <span className="block text-xs text-white/60">{hint}</span>
      </span>
    </label>
  )
}

export function DesktopConfigureView() {
  const navigate = useNavigate()
  const [targetRole, setTargetRole] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [interviewType, setInterviewType] = useState('Introductory')
  const [difficulty, setDifficulty] = useState('Medium')
  const [additionalContext, setAdditionalContext] = useState(copilotSetup.additionalContext)
  const [selectedDocIds, setSelectedDocIds] = useState<ReadonlySet<string>>(new Set())
  const [pickerOpen, setPickerOpen] = useState(false)
  const [documents, setDocuments] = useState(contextDocumentRows)
  const [modelTier, setModelTier] = useState<CopilotModelTier>(copilotSetup.modelTier)
  const [responseLanguage, setResponseLanguage] = useState(copilotSetup.responseLanguage)
  const [autoAnswer, setAutoAnswer] = useState(copilotSetup.autoAnswer)
  const [saveTranscript, setSaveTranscript] = useState(copilotSetup.saveTranscript)

  function handleFillFromResume() {
    setTargetRole(copilotSetup.targetRole)
    setCompanyName(copilotSetup.companyName)
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

          <button
            type="button"
            onClick={handleFillFromResume}
            className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-[#0052ff]"
          >
            <Sparkles aria-hidden="true" className="size-3.5" />
            Fill fields from resume
          </button>

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
                documents
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
              <Zap aria-hidden="true" className="size-3.5 shrink-0 text-[#0052ff]" />
              <span className="text-[#0052ff]">AI Suggestion</span>
            </button>
          </div>

          <div className="flex gap-6">
            <DarkField label="Model">
              <DarkSelect value={modelTier === 'balanced' ? 'Balanced' : 'Precision'} onChange={(value) => setModelTier(value === 'Balanced' ? 'balanced' : 'precision')} options={['Balanced', 'Precision']} />
            </DarkField>
            <DarkField label="Response language">
              <DarkSelect value={responseLanguage} onChange={setResponseLanguage} options={['English', 'Spanish', 'French', 'German', 'Portuguese', 'Mandarin Chinese']} />
            </DarkField>
          </div>

          <div className="grid gap-3 border-t border-white/15 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Behavior</p>
            <DarkCheckboxRow checked={autoAnswer} onChange={setAutoAnswer} label="Auto Answer (Beta)" hint="Copilot answers live-interviewer questions automatically." />
            <DarkCheckboxRow checked={saveTranscript} onChange={setSaveTranscript} label="Save Transcript" hint="Keep a written transcript of this session in your history." />
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

      <KnowledgeBasePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        documents={documents}
        selectedIds={selectedDocIds}
        onConfirm={setSelectedDocIds}
        onAddDocument={(doc) => setDocuments((prev) => [...prev, doc])}
        description="Select the documents you want Jobwhisper to use as context for this session."
        listMaxHeightClassName="max-h-72"
      />
    </div>
  )
}
