import { useState } from 'react'
import { ArrowLeft, ChevronDown, FileText, Plus, X } from 'lucide-react'

import type { DesktopResponseType, DesktopSessionConfig, DesktopSessionKind } from '@/contracts/desktop.draft'
import type { ResumeDocument } from '@/contracts/resume.draft'
import { ClassicResume } from '@/features/resume/resume-templates'
import { Button, JobwhisperAiIcon, cn } from '@/ui'

export type DesktopConfigureViewProps = {
  readonly kind: DesktopSessionKind
  /** From `?step=`: 1 is who and what, 2 is how Copilot answers. */
  readonly step: 1 | 2
  readonly onStepChange: (step: 1 | 2) => void
  readonly roles: readonly string[]
  readonly knowledgeBase: readonly string[]
  /** The resume a picker would return, shown as a preview once attached. */
  readonly resume: { readonly name: string; readonly document: ResumeDocument }
  /** What WhisperAI drafts for Additional context. */
  readonly suggestedContext: string
  readonly models: readonly string[]
  readonly languages: readonly string[]
  readonly onBack: () => void
  readonly onStart: (config: DesktopSessionConfig) => void
}

const TITLES: Record<DesktopSessionKind, string> = { interview: 'Configure your interview', coding: 'Configure your coding session', meeting: 'Configure your meeting' }

const RESPONSE_TYPES: readonly { readonly value: DesktopResponseType; readonly label: string; readonly hint: string; readonly example: readonly string[] }[] = [
  {
    value: 'default',
    label: 'Default',
    hint: 'Best for candidates who want a direct, no-frills answer',
    example: ['We lost the checkout service for four hours the week before launch, so I took the incident myself.', 'I capped the retry storm at the gateway, and we were back inside our latency budget by morning.'],
  },
  {
    value: 'headlines',
    label: 'Headlines',
    hint: 'Best for glancing mid-answer: the points, not the sentences',
    example: ['Checkout down 4h, week before launch', 'Owned the incident, capped retries at the gateway', 'Back in latency budget by morning'],
  },
  {
    value: 'coaching',
    label: 'Coaching',
    hint: 'Best for practice: how to shape the answer, with a line to open on',
    example: ['Open with the stakes: a four-hour outage the week before launch.', 'Say what you owned, then the one fix, then the result in numbers.'],
  },
]

const field = 'min-h-12 w-full rounded-lg border border-input bg-surface px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus'

export function DesktopConfigureView({ kind, step, onStepChange, roles, knowledgeBase, resume, suggestedContext, models, languages, onBack, onStart }: DesktopConfigureViewProps) {
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [resumeAttached, setResumeAttached] = useState(false)
  const [documents, setDocuments] = useState<readonly string[]>([])
  const [pickingDocuments, setPickingDocuments] = useState(false)
  const [context, setContext] = useState('')
  const [responseType, setResponseType] = useState<DesktopResponseType>('default')
  const [model, setModel] = useState(models[0] ?? '')
  const [language, setLanguage] = useState(languages[0] ?? '')
  const [answerOnlyWhenAsked, setAnswerOnlyWhenAsked] = useState(false)
  const [saveTranscript, setSaveTranscript] = useState(true)
  const selectedType = RESPONSE_TYPES.find((type) => type.value === responseType) ?? RESPONSE_TYPES[0]!

  return (
    <div className="flex h-full items-start justify-center px-6 pb-6 pt-2">
      <form
        className="flex max-h-full w-full max-w-xl flex-col rounded-panel bg-surface shadow-panel"
        onSubmit={(event) => {
          event.preventDefault()
          if (step === 1) return onStepChange(2)
          onStart({ kind, role, company, resumeName: resumeAttached ? resume.name : undefined, documentNames: documents, context, responseType, model, language, answerOnlyWhenAsked, saveTranscript })
        }}
      >
        <header className="grid justify-items-center gap-3 px-8 pt-8">
          <h1 className="font-gowun text-2xl text-ink">{TITLES[kind]}</h1>
          <div aria-label={`Step ${step} of 2`} className="flex gap-1">
            {[1, 2].map((dot) => <span key={dot} aria-hidden="true" className={cn('h-1.5 w-7 rounded-full', dot === step ? 'bg-accent' : 'bg-border')} />)}
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
          {step === 1 ? (
            <div className="grid gap-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="relative">
                  <span className="sr-only">{kind === 'meeting' ? 'Meeting title' : 'Target role'}</span>
                  {kind === 'meeting' ? (
                    <input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Meeting title" className={field} />
                  ) : (
                    <>
                      <select value={role} onChange={(event) => setRole(event.target.value)} className={cn(field, 'appearance-none pe-9', !role && 'text-ink-muted')}>
                        <option value="">Target role</option>
                        {roles.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                      <ChevronDown aria-hidden="true" className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
                    </>
                  )}
                </label>
                <label>
                  <span className="sr-only">Company</span>
                  <input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Company" className={field} />
                </label>
              </div>

              <section aria-labelledby="desktop-resume" className="grid gap-2">
                <h2 id="desktop-resume" className="text-sm font-semibold text-ink">Resume <span className="font-normal text-ink-muted">(optional)</span></h2>
                <button type="button" onClick={() => setResumeAttached(true)} className="grid min-h-20 place-items-center gap-1 rounded-lg border border-dashed border-border bg-surface-subtle px-4 py-4 text-sm font-medium text-ink hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  {resumeAttached ? (
                    <>
                      <span className="flex items-center gap-2 font-semibold"><FileText aria-hidden="true" className="size-4" />{resume.name}</span>
                      <span className="text-ink-muted">Change</span>
                    </>
                  ) : 'Attach a resume'}
                </button>
                {resumeAttached ? (
                  <>
                    <div aria-label={`Preview of ${resume.name}`} className="h-72 overflow-hidden rounded-lg border border-border">
                      <div className="origin-top scale-[0.62] [width:161%] -translate-x-[19%]">
                        <ClassicResume document={resume.document} showImproved={false} highlightChanges={false} showPageBreaks={false} />
                      </div>
                    </div>
                    <button type="button" onClick={() => setResumeAttached(false)} className="min-h-9 justify-self-end rounded-md text-sm font-semibold text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Remove resume</button>
                  </>
                ) : null}
              </section>

              <section aria-labelledby="desktop-documents" className="grid gap-2">
                <h2 id="desktop-documents" className="text-sm font-semibold text-ink">Documents <span className="font-normal text-ink-muted">(optional)</span></h2>
                <div className="grid gap-3 rounded-lg border border-dashed border-border bg-surface-subtle p-4">
                  {documents.length > 0 ? (
                    <ul className="flex flex-wrap justify-center gap-2">
                      {documents.map((name) => (
                        <li key={name} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border bg-surface ps-3 text-sm font-medium text-ink">
                          <FileText aria-hidden="true" className="size-4 text-ink-muted" />
                          {name}
                          <button type="button" aria-label={`Remove ${name}`} onClick={() => setDocuments((current) => current.filter((item) => item !== name))} className="grid size-9 place-items-center rounded-full text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                            <X aria-hidden="true" className="size-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <button type="button" aria-expanded={pickingDocuments} onClick={() => setPickingDocuments((open) => !open)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md text-sm font-medium text-ink hover:text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    <Plus aria-hidden="true" className="size-4" />
                    Add from Knowledge Base
                  </button>
                  {pickingDocuments ? (
                    <fieldset className="grid gap-1 rounded-lg border border-border bg-surface p-2">
                      <legend className="sr-only">Knowledge Base documents</legend>
                      {knowledgeBase.map((name) => (
                        <label key={name} className="flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2 text-sm text-ink hover:bg-surface-subtle">
                          <input type="checkbox" checked={documents.includes(name)} onChange={(event) => setDocuments((current) => (event.target.checked ? [...current, name] : current.filter((item) => item !== name)))} className="size-4 accent-[var(--lf-accent)]" />
                          {name}
                        </label>
                      ))}
                    </fieldset>
                  ) : null}
                </div>
              </section>

              <label className="grid gap-1.5">
                <span className="text-sm font-semibold text-ink">Additional context</span>
                <textarea value={context} onChange={(event) => setContext(event.target.value)} rows={6} placeholder="What should Copilot know or lean on? Paste the job post, a brief, or the points you want to land." className="w-full rounded-lg border border-input bg-surface p-3 text-sm leading-6 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" />
              </label>
              <button type="button" onClick={() => setContext(suggestedContext)} className="inline-flex min-h-9 items-center gap-1.5 justify-self-end rounded-md text-sm font-semibold text-accent-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <JobwhisperAiIcon className="size-4" />
                WhisperAI
                <span className="sr-only">: draft the context for me</span>
              </button>
            </div>
          ) : (
            <div className="grid gap-5">
              <fieldset className="grid gap-2">
                <legend className="mb-2 text-sm font-semibold text-ink">Response type</legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {RESPONSE_TYPES.map((type) => (
                    <label key={type.value} className={cn('flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 text-sm font-semibold', responseType === type.value ? 'border-accent bg-accent-subtle text-accent-text' : 'border-border text-ink hover:bg-surface-subtle')}>
                      <input type="radio" name="response-type" value={type.value} checked={responseType === type.value} onChange={() => setResponseType(type.value)} className="size-4 accent-[var(--lf-accent)]" />
                      {type.label}
                    </label>
                  ))}
                </div>
                <p className="text-sm text-ink-muted">{selectedType.hint}</p>
                <div className="rounded-lg bg-surface-subtle p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{selectedType.label} looks like</p>
                  <div className="mt-2 grid gap-1.5 text-sm leading-6 text-ink">
                    {selectedType.example.map((line) => <p key={line}>{responseType === 'headlines' ? `• ${line}` : line}</p>)}
                  </div>
                </div>
              </fieldset>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="relative grid gap-1.5">
                  <span className="text-sm font-semibold text-ink">Model</span>
                  <select value={model} onChange={(event) => setModel(event.target.value)} className={cn(field, 'appearance-none pe-9')}>
                    {models.map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <ChevronDown aria-hidden="true" className="pointer-events-none absolute bottom-4 end-3 size-4 text-ink-muted" />
                </label>
                <label className="relative grid gap-1.5">
                  <span className="text-sm font-semibold text-ink">Response language</span>
                  <select value={language} onChange={(event) => setLanguage(event.target.value)} className={cn(field, 'appearance-none pe-9')}>
                    {languages.map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <ChevronDown aria-hidden="true" className="pointer-events-none absolute bottom-4 end-3 size-4 text-ink-muted" />
                </label>
              </div>

              <fieldset className="grid gap-3">
                <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">Behavior</legend>
                <label className="flex cursor-pointer gap-3">
                  <input type="checkbox" checked={answerOnlyWhenAsked} onChange={(event) => setAnswerOnlyWhenAsked(event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[var(--lf-accent)]" />
                  <span>
                    <span className="block text-sm font-semibold text-ink">Answer only when I ask</span>
                    <span className="block text-sm text-ink-muted">Off, Copilot answers on its own as the conversation goes. On, it waits for the trigger key, or Get answer.</span>
                  </span>
                </label>
                <label className="flex cursor-pointer gap-3">
                  <input type="checkbox" checked={saveTranscript} onChange={(event) => setSaveTranscript(event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[var(--lf-accent)]" />
                  <span>
                    <span className="block text-sm font-semibold text-ink">Save transcript</span>
                    <span className="block text-sm text-ink-muted">Keep a written transcript of this session in your history.</span>
                  </span>
                </label>
              </fieldset>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-border px-8 py-5">
          <button type="button" onClick={step === 2 ? () => onStepChange(1) : onBack} className="inline-flex min-h-10 items-center gap-2 rounded-md text-sm font-semibold text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
            Back
          </button>
          <Button type="submit" disabled={step === 1 && !role.trim()}>{step === 1 ? 'Continue' : 'Start session'}</Button>
        </footer>
      </form>
    </div>
  )
}
