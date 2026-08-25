import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, ArrowUp, Check, ChevronDown, Download, FileText, HelpCircle, Minus, Plus, Target, X } from 'lucide-react'

import type { ResumeBuilderSession, ResumeBuilderTab, ResumeChatState, ResumeDocument, ResumeHistoryRow, ResumeSectionId, ResumeTemplate } from '@/contracts/resume.draft'
import { AiSuggestionAction, cn, DataTable, Dialog, DialogClose, DialogPopup, DialogTitle, FormField, FormPanel, FormPanelFooter, FormTextArea, LightforthAiIcon, ListPickerDialog, ShellBar, SourcePicker, TipModal, TipModalTrigger, UploadedFileDialog } from '@/ui'
import { useTypewriter } from '@/hooks/useTypewriter'
import { clearDefaultResumePreference, getDefaultResumePreference, setDefaultResumePreference } from '@/lib/resume-preference'

export type ResumeUploadViewProps = {
  readonly homeHref: string
  readonly configureHref: string
  readonly historyHref: string
  readonly uploadedFileName: string
  readonly uploadedFileUrl?: string
  readonly savedResumes: readonly { readonly id: string; readonly title: string; readonly company: string; readonly atsScore: number }[]
}

export type ResumeConfigureViewProps = {
  readonly homeHref: string
  readonly editorHref: string
  readonly uploadHref: string
  readonly session: ResumeBuilderSession
}

export type ResumeEditorViewProps = {
  readonly homeHref: string
  readonly historyHref: string
  readonly document: ResumeDocument
  readonly session: ResumeBuilderSession
  readonly templates: readonly ResumeTemplate[]
  readonly tab: ResumeBuilderTab
  readonly chatState: ResumeChatState
  readonly jd?: string
}

export type ResumeHistoryViewProps = {
  readonly homeHref: string
  readonly createHref: string
  readonly editorHref: string
  readonly rows: readonly ResumeHistoryRow[]
}

const sectionLabels: Record<ResumeSectionId, string> = {
  'personal-information': 'Personal Information',
  'professional-summary': 'Professional Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  certifications: 'Certifications',
  projects: 'Projects',
  languages: 'Languages',
}

const downloadOptions = [
  { label: 'Download as PDF', value: 'pdf', icon: <FileText aria-hidden="true" className="size-4" /> },
  { label: 'Download as DOCX', value: 'docx', icon: <FileText aria-hidden="true" className="size-4" /> },
  { label: 'Download as TXT', value: 'txt', icon: <FileText aria-hidden="true" className="size-4" /> },
]

function BuilderHeader({
  homeHref,
  current,
  action,
  onAtsClick,
}: {
  readonly homeHref: string
  readonly current: string
  readonly action?: 'download'
  readonly onAtsClick?: () => void
}) {
  const [downloadOpen, setDownloadOpen] = useState(false)
  const downloadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (downloadRef.current && !downloadRef.current.contains(e.target as Node)) setDownloadOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <ShellBar
      homeHref={homeHref}
      current={current}
      closeHref={action === 'download' ? undefined : homeHref}
      closeLabel="Close resume builder"
    >
      {onAtsClick ? (
        <button
          type="button"
          onClick={onAtsClick}
          className="hidden min-h-9 items-center gap-2 rounded-lg border border-border px-4 text-base font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus lg:inline-flex"
        >
          <Target aria-hidden="true" className="size-4" />
          ATS Score
        </button>
      ) : null}
      {action === 'download' ? (
        <div ref={downloadRef} className="relative">
          <button
            type="button"
            onClick={() => setDownloadOpen(!downloadOpen)}
            className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <Download aria-hidden="true" className="size-4" />
            Download
            <ChevronDown aria-hidden="true" className={cn('size-4 transition-transform', downloadOpen && 'rotate-180')} />
          </button>
          {downloadOpen ? (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-surface py-1 shadow-panel">
              {downloadOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDownloadOpen(false)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:bg-surface-subtle"
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </ShellBar>
  )
}

function Workspace({ children }: { readonly children: ReactNode }) {
  return <main className="min-h-screen bg-canvas text-ink">{children}</main>
}

function PaperShell({ children, compact = false }: { readonly children: ReactNode; readonly compact?: boolean }) {
  return (
    <article className={cn('mx-auto min-h-[56rem] w-full bg-surface p-8 shadow-panel', compact ? 'max-w-3xl' : 'max-w-[44rem]')} aria-label="Resume preview">
      {children}
    </article>
  )
}

function PageBreakLine({ top }: { readonly top: string }) {
  return (
    <div
      className="pointer-events-none absolute start-0 end-0 z-10 flex items-center gap-2 border-b-2 border-dashed border-accent py-1"
      style={{ top }}
      aria-hidden="true"
    >
      <span className="bg-paper px-1 text-[10px] font-medium uppercase tracking-wide text-accent-text">Page break</span>
    </div>
  )
}

function ResumePaper({ children, compact = false }: { readonly children: ReactNode; readonly compact?: boolean }) {
  const pageHeight = compact ? '42.35rem' : '56.94rem'
  return (
    <article
      className={cn(
        'relative mx-auto w-full bg-paper p-10 font-serif text-paper-ink shadow-xl ring-1 ring-paper-ink/10',
        compact ? 'max-w-3xl' : 'max-w-[44rem]',
      )}
      aria-label="Resume preview"
    >
      <PageBreakLine top={pageHeight} />
      <PageBreakLine top={`calc(${pageHeight} * 2)`} />
      <PageBreakLine top={`calc(${pageHeight} * 3)`} />
      {children}
    </article>
  )
}

function AiSuggestionLabel({ onClick }: { readonly onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-8 items-center gap-1.5 self-start text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      <LightforthAiIcon className="size-3.5 shrink-0" />
      <span className="bg-gradient-to-r from-accent to-accent-tertiary bg-clip-text text-transparent">AI Suggestion</span>
    </button>
  )
}

export function ResumeUploadView({ homeHref, configureHref, historyHref, uploadedFileName, uploadedFileUrl, savedResumes }: ResumeUploadViewProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [useAsDefault, setUseAsDefault] = useState(() => getDefaultResumePreference() !== null)

  return (
    <Workspace>
      <BuilderHeader homeHref={homeHref} current="Build a Resume" />
      <section className="px-4 py-8 lg:py-10">
        <PaperShell>
          <SourcePicker
            title="Upload a resume"
            options={[
              { label: 'Upload a Resume', hint: 'PDF, DOC, DOCX or TXT', onClick: () => setUploadDialogOpen(true) },
              { label: 'Use Lightforth Resume', icon: <LightforthAiIcon className="size-5" />, emphasis: 'strong', onClick: () => setPickerOpen(true) },
            ]}
            historyLink={{ label: 'View past resumes', href: historyHref }}
          />
        </PaperShell>
      </section>

      <ListPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        title="Use a Lightforth Resume"
        description="Pick a resume from your history to continue with."
        items={savedResumes.map((resume) => ({ id: resume.id, title: resume.title, subtitle: resume.company, meta: `ATS ${resume.atsScore}` }))}
        emptyLabel="No saved resumes yet. Upload one to get started."
        icon={<LightforthAiIcon className="size-4" />}
        onSelect={() => {
          setPickerOpen(false)
          setUploadDialogOpen(true)
        }}
      />

      <UploadedFileDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        fileName={uploadedFileName}
        fileUrl={uploadedFileUrl}
        continueHref={configureHref}
        defaultChecked={useAsDefault}
        onDefaultChange={(checked) => {
          setUseAsDefault(checked)
          if (checked) setDefaultResumePreference(uploadedFileName)
          else clearDefaultResumePreference()
        }}
      />
    </Workspace>
  )
}

const RESUME_JOB_DESCRIPTION_SUGGESTION =
  ' Looking for a Senior Product Manager with 5+ years of experience shipping AI-powered products, strong SQL and A/B testing skills, and a track record of driving measurable growth metrics.'

const GENERIC_JOB_DESCRIPTION =
  'We are looking for a motivated and detail-oriented professional to join our growing team. In this role, you will collaborate with cross-functional teams to drive projects from conception to delivery. You will analyse data, identify opportunities for improvement, and implement strategies that support business growth. The ideal candidate brings strong communication skills, a proactive mindset, and the ability to manage multiple priorities in a fast-paced environment. Experience with modern tools and frameworks, a passion for continuous learning, and a track record of delivering measurable results will set you apart.'

export function ResumeConfigureView({ homeHref, editorHref, uploadHref, session }: ResumeConfigureViewProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [isAutoFilled, setIsAutoFilled] = useState(true)
  const { type, isTyping } = useTypewriter()
  const [showTip, setShowTip] = useState(true)
  const [tipModalOpen, setTipModalOpen] = useState(false)
  const tipRef = useRef<HTMLDivElement>(null)

  function startTypewriter() {
    type(GENERIC_JOB_DESCRIPTION, (partial) => setJobDescription(partial), { durationMs: 1800 })
  }

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches
    if (isMobile) {
      setTipModalOpen(true)
      return
    }
    const timer = window.setTimeout(startTypewriter, 150)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleTipModalOpenChange(open: boolean) {
    setTipModalOpen(open)
    if (!open) startTypewriter()
  }

  function handleJdFocus() {
    if (!isAutoFilled) return
    type('', () => {})
    setJobDescription('')
    setIsAutoFilled(false)
  }

  useEffect(() => {
    if (!showTip) return
    function handleClickOutside(e: MouseEvent) {
      if (tipRef.current && !tipRef.current.contains(e.target as Node)) setShowTip(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showTip])

  function handleAiSuggestion() {
    const base = jobDescription
    setIsAutoFilled(false)
    type(RESUME_JOB_DESCRIPTION_SUGGESTION, (partial) => setJobDescription(base + partial))
  }

  const effectiveJd = jobDescription.trim() || GENERIC_JOB_DESCRIPTION
  const editorUrl = `${editorHref}&jd=${encodeURIComponent(effectiveJd)}`

  function handleContinue() {
    window.location.href = editorUrl
  }

  return (
    <Workspace>
      <BuilderHeader homeHref={homeHref} current="Build a Resume" />
      <section className="px-4 py-9">
        <FormPanel
          title="Configure your Resume"
          step="1/2"
          uploadedFile={{
            fileName: session.uploadedFileName,
            changeHref: uploadHref,
            onChangeClick: () => clearDefaultResumePreference(),
          }}
          footer={
            <footer className="flex items-center justify-between gap-4 border-t border-border px-6 py-4">
              <a href={uploadHref} className="inline-flex min-h-11 items-center gap-1 rounded-lg py-2.5 text-base font-semibold leading-6 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <ArrowLeft aria-hidden="true" className="size-4" />
                Back
              </a>
              <button
                type="button"
                onClick={handleContinue}
                className="inline-flex min-h-11 items-center justify-center gap-3 rounded-lg bg-accent px-4 py-2.5 text-base font-semibold leading-6 text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                Continue
                <ArrowRight aria-hidden="true" className="size-5" />
              </button>
            </footer>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField id="resume-name" label="Resume Name" placeholder="e.g. Senior PM Resume" />
            <FormField id="company-name" label="Company Name" placeholder="e.g. Google, Stripe" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-1.5">
              <label htmlFor="resume-job-description" className="text-sm font-medium leading-5 text-ink">
                Enter Job Description
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowTip(true)
                  setJobDescription('')
                  setIsAutoFilled(true)
                  type(GENERIC_JOB_DESCRIPTION, (partial) => setJobDescription(partial), { durationMs: 1800 })
                }}
                aria-label="Show help tooltip"
                className="hidden items-center justify-center rounded-full p-0.5 text-muted transition-colors hover:bg-accent-subtle hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:inline-flex"
              >
                <HelpCircle aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setJobDescription('')
                  setIsAutoFilled(true)
                  setTipModalOpen(true)
                }}
                aria-label="Show help tip"
                className="inline-flex items-center justify-center rounded-full p-0.5 text-muted transition-colors hover:bg-accent-subtle hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:hidden"
              >
                <HelpCircle aria-hidden="true" className="size-4" />
              </button>
            </div>
            <div className="relative mt-1.5">
              <textarea
                id="resume-job-description"
                value={jobDescription}
                onFocus={handleJdFocus}
                onChange={(event) => {
                  setJobDescription(event.target.value)
                  setIsAutoFilled(false)
                }}
                className={cn(
                  'min-h-40 w-full resize-none rounded-lg border border-input bg-surface px-3.5 py-3 text-base text-ink shadow-control outline-none placeholder:text-ink-muted transition-colors duration-normal ease-default focus:border-focus focus:ring-2 focus:ring-focus sm:text-sm disabled:cursor-not-allowed disabled:opacity-50',
                  isTyping && '!border-accent !shadow-[0_0_0_3px_var(--lf-accent-subtle)] transition-shadow duration-normal',
                )}
              />
              {showTip && (
                <div
                  ref={tipRef}
                  role="status"
                  className="absolute end-0 top-0 z-20 hidden w-64 translate-x-[calc(100%+12px)] rounded-xl bg-live-header p-4 text-brand-bar-text shadow-panel sm:block"
                >
                  <span aria-hidden="true" className="absolute start-0 top-6 -translate-x-1.5 rotate-45 size-3 bg-live-header" />
                  <button
                    type="button"
                    onClick={() => setShowTip(false)}
                    aria-label="Dismiss tip"
                    className="absolute end-2 top-2 rounded p-1 text-brand-bar-text/60 hover:text-brand-bar-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    <X aria-hidden="true" className="size-3" />
                  </button>
                <p className="text-sm font-semibold">Tailor your resume</p>
                <p className="mt-1 text-xs leading-relaxed text-brand-bar-text/80">
                  Paste a job description and Lightforth will automatically rewrite your resume to match key words.
                </p>
              </div>
              )}
            </div>
          </div>
          <TipModal
            open={tipModalOpen}
            onOpenChange={handleTipModalOpenChange}
            title="Tailor your resume"
            body="Paste a job description and Lightforth will automatically rewrite your resume to match key words."
          />
          <AiSuggestionAction onClick={handleAiSuggestion} disabled={isTyping} />
        </FormPanel>
      </section>
    </Workspace>
  )
}

function TabRail({ tab }: { readonly tab: ResumeBuilderTab }) {
  const tabs: readonly ResumeBuilderTab[] = ['chat', 'create', 'template']
  return (
    <div className="grid grid-cols-3 gap-0.5 rounded-lg bg-surface-subtle p-0.5 text-sm font-semibold">
      {tabs.map((item) => (
        <a
          key={item}
          href={`/v3/resume/editor?tab=${item}${item === 'chat' ? '&state=empty' : ''}`}
          className={cn('grid min-h-8 place-items-center rounded-md text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', item === tab ? 'bg-surface text-ink shadow-control' : '')}
          aria-current={item === tab ? 'page' : undefined}
        >
          {item[0].toUpperCase()}{item.slice(1)}
        </a>
      ))}
    </div>
  )
}

function PromptChips({ prompts, onSelect }: { readonly prompts: readonly string[]; readonly onSelect?: (prompt: string) => void }) {
  return (
    <div className="relative">
      <div className="flex gap-1.5 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSelect?.(prompt)}
            className="inline-flex min-h-7 shrink-0 items-center rounded-md border border-border bg-surface px-3 text-xs font-medium text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {prompt}
          </button>
        ))}
      </div>
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 end-0 w-8 bg-gradient-to-l from-surface to-transparent" />
    </div>
  )
}

function ChatEmptyState() {
  return (
    <div className="grid flex-1 place-items-center p-6 text-center">
      <div className="max-w-[15rem]">
        <p className="text-sm font-bold text-ink">Send a message to adjust your resume</p>
        <ol className="mt-4 grid gap-2 text-start text-xs text-ink-muted">
          <li className="flex items-start gap-2">
            <span aria-hidden="true" className="grid size-5 shrink-0 place-items-center rounded-pill bg-accent-subtle text-[11px] font-bold text-accent-text">1</span>
            Ask for rewrites, tone changes, or keyword targeting
          </li>
          <li className="flex items-start gap-2">
            <span aria-hidden="true" className="grid size-5 shrink-0 place-items-center rounded-pill bg-accent-subtle text-[11px] font-bold text-accent-text">2</span>
            Accept the changes, or keep editing
          </li>
        </ol>
      </div>
    </div>
  )
}

type ChatMessage = { readonly id: string; readonly author: 'candidate' | 'assistant'; readonly text: string }

const CHAT_PLACEHOLDER_EMPTY = 'Send a message for more adjustments…'
const CHAT_PLACEHOLDER_ACTIVE = 'Message Lightforth AI...'

function ChatComposer({
  prompts,
  draft,
  onDraftChange,
  onSend,
  hasMessages,
}: {
  readonly prompts: readonly string[]
  readonly draft: string
  readonly onDraftChange: (value: string) => void
  readonly onSend: () => void
  readonly hasMessages: boolean
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [draft])

  return (
    <div className="mt-auto">
      <PromptChips prompts={prompts} onSelect={onSend ? (prompt) => { onDraftChange(prompt); onSend() } : undefined} />
      <div className="px-3 pb-3">
        <label className="sr-only" htmlFor="resume-chat-message">
          Resume chat message
        </label>
        <div
          id="walkthrough-chat-input"
          className="flex items-end gap-2 rounded-2xl border border-border bg-surface py-2 pe-2 ps-3"
        >
          <textarea
            ref={textareaRef}
            id="resume-chat-message"
            rows={1}
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            className="max-h-40 w-full resize-none overflow-y-auto bg-surface py-1.5 text-sm leading-6 text-ink outline-none placeholder:text-ink-muted"
            placeholder={hasMessages ? CHAT_PLACEHOLDER_ACTIVE : CHAT_PLACEHOLDER_EMPTY}
          />
          <TipModalTrigger
            label="Show chat tips"
            title="Chat with Lightforth AI"
            body="Ask for rewrites, tone changes, or keyword targeting — Lightforth updates your resume in real time. Accept the changes, or keep editing."
            className="mb-1.5 shrink-0 sm:hidden"
          />
          <button
            type="button"
            onClick={onSend}
            aria-label="Send resume message"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <ArrowUp aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ChatSidebar({
  session,
  messages,
  isTyping,
  thinkingLabel,
  pendingSuggestion,
  draft,
  onDraftChange,
  onSend,
  onAccept,
  onReject,
}: {
  readonly session: ResumeBuilderSession
  readonly messages: readonly ChatMessage[]
  readonly isTyping: boolean
  readonly thinkingLabel: string
  readonly pendingSuggestion: boolean
  readonly draft: string
  readonly onDraftChange: (value: string) => void
  readonly onSend: () => void
  readonly onAccept: () => void
  readonly onReject: () => void
}) {
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = chatRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isTyping])

  return (
    <aside className="flex w-full flex-1 flex-col overflow-hidden border-e border-border bg-surface lg:h-full lg:w-[21.25rem] lg:flex-none">
      <div className="border-b border-border p-3">
        <TabRail tab="chat" />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        {messages.length === 0 ? (
          <ChatEmptyState />
        ) : (
          <div ref={chatRef} className="grid min-h-0 flex-1 auto-rows-min content-start gap-3 overflow-y-auto p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'max-w-[17rem] rounded-2xl px-4 py-3 text-sm leading-6 shadow-control',
                  message.author === 'candidate' ? 'ms-auto rounded-ee-sm bg-accent text-on-accent' : 'rounded-ss-sm bg-surface-subtle text-ink',
                )}
              >
                {message.text}
              </div>
            ))}
            {isTyping ? (
              <div className="flex items-center gap-2 rounded-2xl rounded-ss-sm bg-surface-subtle px-4 py-3" role="status" aria-label={thinkingLabel}>
                <span className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="size-1.5 animate-bounce rounded-pill bg-ink-muted motion-reduce:animate-none" style={{ animationDelay: `${i * 0.12}s` }} />
                  ))}
                </span>
                <span className="text-xs font-medium text-ink-muted">{thinkingLabel}</span>
              </div>
            ) : null}
            {pendingSuggestion ? (
              <div className="flex gap-2">
                <button type="button" onClick={onReject} className="inline-flex min-h-8 items-center gap-1 rounded-pill border border-border px-3 text-xs font-semibold text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <X aria-hidden="true" className="size-3" />
                  Reject All
                </button>
                <button type="button" onClick={onAccept} className="inline-flex min-h-8 items-center gap-1 rounded-pill bg-accent px-3 text-xs font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <Check aria-hidden="true" className="size-3" />
                  Accept All
                </button>
              </div>
            ) : null}
          </div>
        )}
        <ChatComposer
          prompts={session.promptSuggestions}
          draft={draft}
          onDraftChange={onDraftChange}
          onSend={onSend}
          hasMessages={messages.length > 0}
        />
      </div>
    </aside>
  )
}

const sectionFields: Record<ResumeSectionId, readonly { readonly id: string; readonly label: string; readonly placeholder: string; readonly multiline?: boolean }[]> = {
  'personal-information': [
    { id: 'full-name', label: 'Full Name', placeholder: 'Adedamola Adewale' },
    { id: 'headline', label: 'Headline', placeholder: 'Senior Product Manager' },
  ],
  'professional-summary': [
    { id: 'summary', label: 'Summary', placeholder: 'A brief overview of your professional background and key strengths...', multiline: true },
  ],
  experience: [
    { id: 'company', label: 'Company', placeholder: 'Lightforth' },
    { id: 'title', label: 'Job Title', placeholder: 'Director of Product' },
    { id: 'bullets', label: 'Achievements', placeholder: 'Led a cross-functional team of 12 to ship...', multiline: true },
  ],
  education: [
    { id: 'school', label: 'School', placeholder: 'University of Lagos' },
    { id: 'degree', label: 'Degree', placeholder: 'B.Sc. Computer Science' },
  ],
  skills: [
    { id: 'skills', label: 'Skills', placeholder: 'Product Strategy, SQL, A/B Testing...', multiline: true },
  ],
  certifications: [
    { id: 'cert-name', label: 'Certification', placeholder: 'AWS Certified Cloud Practitioner' },
    { id: 'cert-issuer', label: 'Issuing Organization', placeholder: 'Amazon Web Services' },
  ],
  projects: [
    { id: 'project-name', label: 'Project Name', placeholder: 'AI Career Platform' },
    { id: 'project-description', label: 'Description', placeholder: 'Brief overview of the project, your role, and measurable outcomes...', multiline: true },
    { id: 'project-year', label: 'Year', placeholder: '2024' },
  ],
  languages: [
    { id: 'language', label: 'Language', placeholder: 'English' },
    { id: 'proficiency', label: 'Proficiency', placeholder: 'Native / Fluent / Conversational' },
  ],
}

function SectionEditor({
  pendingSuggestion,
  onSuggest,
  onAccept,
  onReject,
}: {
  readonly pendingSuggestion: boolean
  readonly onSuggest: () => void
  readonly onAccept: () => void
  readonly onReject: () => void
}) {
  const sections = Object.entries(sectionLabels) as ReadonlyArray<[ResumeSectionId, string]>
  const [expandedId, setExpandedId] = useState<ResumeSectionId | null>('professional-summary')

  return (
    <aside className="flex w-full flex-1 flex-col overflow-hidden border-e border-border bg-surface lg:h-full lg:w-[21.25rem] lg:flex-none">
      <div className="border-b border-border p-3">
        <TabRail tab="create" />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-auto px-3 py-1">
          {sections.map(([id, label]) => {
            const expanded = expandedId === id
            return (
              <section key={id} className="border-b border-border py-2">
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : id)}
                  aria-expanded={expanded}
                  className="flex min-h-10 w-full items-center justify-between text-sm font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {label}
                  <ChevronDown aria-hidden="true" className={cn('size-4 text-ink-muted transition-transform', expanded ? 'rotate-180' : '')} />
                </button>
                {expanded ? (
                  <div className="grid gap-3 pb-3">
                    {sectionFields[id].map((field) => (
                      <div key={field.id} className="grid gap-2">
                        <label htmlFor={`${id}-${field.id}`} className="text-xs font-medium text-ink-muted">
                          {field.label}
                        </label>
                        {field.multiline ? (
                          <textarea id={`${id}-${field.id}`} className="min-h-20 rounded-md border border-border bg-surface px-3 py-2 text-xs text-ink outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus" placeholder={field.placeholder} />
                        ) : (
                          <input id={`${id}-${field.id}`} type="text" className="min-h-9 rounded-md border border-border bg-surface px-3 text-xs text-ink outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus" placeholder={field.placeholder} />
                        )}
                      </div>
                    ))}
                    {pendingSuggestion ? (
                      <div className="flex gap-2">
                        <button type="button" onClick={onReject} className="inline-flex min-h-8 items-center gap-1 rounded-pill border border-border px-3 text-xs font-semibold text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                          <X aria-hidden="true" className="size-3" />
                          Reject All
                        </button>
                        <button type="button" onClick={onAccept} className="inline-flex min-h-8 items-center gap-1 rounded-pill bg-accent px-3 text-xs font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                          <Check aria-hidden="true" className="size-3" />
                          Accept All
                        </button>
                      </div>
                    ) : (
                      <AiSuggestionLabel onClick={onSuggest} />
                    )}
                  </div>
                ) : null}
              </section>
            )
          })}
        </div>
        <div className="border-t border-border p-3">
          <button type="button" className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-input text-sm font-medium text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <Plus aria-hidden="true" className="size-4" />
            Add Section
          </button>
        </div>
      </div>
    </aside>
  )
}

function TemplateSidebar({ templates, selectedTemplateId }: { readonly templates: readonly ResumeTemplate[]; readonly selectedTemplateId: string }) {
  return (
    <aside className="flex w-full flex-1 flex-col overflow-hidden border-e border-border bg-surface lg:h-full lg:w-[21.25rem] lg:flex-none">
      <div className="border-b border-border p-3">
        <TabRail tab="template" />
      </div>
      <div className="grid flex-1 grid-cols-2 gap-3 overflow-auto p-3">
        {templates.map((template) => {
          const isSelected = template.id === selectedTemplateId
          return (
            <button
              key={template.id}
              type="button"
              className={cn(
                'overflow-hidden rounded-lg border text-start transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                isSelected ? 'border-accent shadow-panel' : 'border-border hover:shadow-control',
              )}
            >
              <span className="relative block aspect-[3/4] bg-surface-subtle">
                {isSelected ? (
                  <span className="absolute start-2 top-2 grid size-7 place-items-center rounded-pill bg-positive text-on-accent">
                    <Check aria-hidden="true" className="size-3.5" />
                  </span>
                ) : null}
              </span>
              <span className="block p-2.5">
                <span className={cn('block text-xs font-semibold leading-4', isSelected ? 'text-accent' : 'text-ink')}>{template.name}</span>
                <span className="mt-1 block line-clamp-2 text-[11px] leading-3 text-ink-muted">{template.description}</span>
              </span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

function ClassicResume({
  document,
  showImproved,
  highlightChanges,
  typedSummary,
  isTypingSummary,
}: {
  readonly document: ResumeDocument
  readonly showImproved: boolean
  readonly highlightChanges: boolean
  readonly typedSummary?: string | null
  readonly isTypingSummary?: boolean
}) {
  return (
    <ResumePaper>
      <header className="border-b border-paper-ink pb-4 text-center">
        <h1 className="text-3xl font-bold tracking-wide">{document.candidateName}</h1>
        <p className="mt-2 text-xs text-paper-muted">
          <a href={`mailto:${document.email}`} className="text-accent-text underline">{document.email}</a> | {document.location} | {document.linkedinUrl} | {document.portfolioUrl}
        </p>
      </header>
      <section className="mt-5">
        <h2 className="border-b border-paper-ink pb-1 text-sm font-bold uppercase tracking-wide">Professional Summary</h2>
        <p
          className={cn(
            'mt-2 rounded-sm text-xs italic leading-5 transition-shadow duration-normal ease-default',
            highlightChanges ? 'bg-accent-subtle text-accent-text' : 'text-paper-ink',
            isTypingSummary && 'shadow-[0_0_0_3px_var(--lf-accent-subtle)]',
          )}
        >
          {typedSummary !== null && typedSummary !== undefined ? typedSummary : showImproved ? document.improvedSummary : document.summary}
          {isTypingSummary ? (
            <span aria-hidden="true" className="ms-0.5 inline-block h-3 w-px animate-pulse bg-accent-text align-middle motion-reduce:animate-none" />
          ) : null}
        </p>
      </section>
      <section className="mt-5">
        <h2 className="border-b border-paper-ink pb-1 text-sm font-bold uppercase tracking-wide">Experience</h2>
        <div className="grid gap-5 pt-3">
          {document.roles.map((role, roleIndex) => {
            const bullets =
              showImproved && roleIndex === 0
                ? role.bullets.map((bullet, index) => (index < 2 ? document.improvedFirstRoleBullets[index] ?? bullet : bullet))
                : role.bullets
            return (
              <article key={`${role.company}-${role.period}`}>
                <div className="flex items-start justify-between gap-4 text-xs">
                  <div>
                    <h3 className="font-bold">{role.company}</h3>
                    <p className="italic text-paper-muted">{role.location}</p>
                    <p className="italic">{role.title}</p>
                  </div>
                  <p className="shrink-0 text-end text-paper-muted">{role.period}</p>
                </div>
                <ul className="mt-2 list-disc space-y-1.5 ps-5 text-xs leading-5">
                  {bullets.map((bullet, index) => (
                    <li key={bullet} className={cn(highlightChanges && roleIndex === 0 && index < 2 ? 'bg-accent-subtle text-accent-text' : '')}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </section>
      <section className="mt-5">
        <h2 className="border-b border-paper-ink pb-1 text-sm font-bold uppercase tracking-wide">Skills</h2>
        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
          {(showImproved ? document.improvedSkills : document.skills).slice(0, showImproved ? 22 : 14).map((skill) => (
            <span key={skill} className={cn(highlightChanges && !document.skills.includes(skill) ? 'bg-accent-subtle font-semibold text-accent-text' : undefined)}>
              {skill}
            </span>
          ))}
        </div>
      </section>
      <section className="mt-5">
        <h2 className="border-b border-paper-ink pb-1 text-sm font-bold uppercase tracking-wide">Certifications</h2>
        {document.certifications.map((certification) => (
          <div key={certification.name} className="mt-2 flex justify-between gap-4 text-xs">
            <div>
              <h3 className="font-bold">{certification.name}</h3>
              <p className="text-paper-muted">{certification.issuer}</p>
            </div>
            <p>{certification.year}</p>
          </div>
        ))}
      </section>
      <section className="mt-5">
        <h2 className="border-b border-paper-ink pb-1 text-sm font-bold uppercase tracking-wide">Projects</h2>
        <div className="grid gap-4 pt-3">
          {document.projects.map((project) => (
            <article key={project.name}>
              <div className="flex items-start justify-between gap-4 text-xs">
                <h3 className="font-bold">{project.name}</h3>
                <p className="shrink-0 text-end text-paper-muted">{project.year}</p>
              </div>
              <p className="mt-1 text-xs leading-5 text-paper-ink">{project.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-5">
        <h2 className="border-b border-paper-ink pb-1 text-sm font-bold uppercase tracking-wide">Languages</h2>
        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
          {document.languages.map((item) => (
            <div key={item.language} className="flex justify-between gap-2">
              <span className="font-medium">{item.language}</span>
              <span className="text-paper-muted">{item.proficiency}</span>
            </div>
          ))}
        </div>
      </section>
    </ResumePaper>
  )
}

function ExecutiveResume({ document }: { readonly document: ResumeDocument }) {
  return (
    <ResumePaper compact>
      <header className="pb-4">
        <h1 className="text-2xl font-bold tracking-wide">{document.candidateName}</h1>
        <p className="mt-2 text-xs text-paper-muted">{document.email} | {document.location} | {document.linkedinUrl} | {document.portfolioUrl}</p>
      </header>
      <div className="grid gap-4">
        {[
          ['Professional Summary', document.improvedSummary],
          ['Experience', document.roles[0]?.bullets.join(' ') ?? ''],
          ['Education', `${document.education[0]?.school ?? ''} - ${document.education[0]?.degree ?? ''}`],
          ['Skills', document.skills.join(' · ')],
          ['Certifications', document.certifications.map((item) => `${item.name}, ${item.issuer}`).join(' · ')],
          ['Projects', document.projects.map((item) => `${item.name} (${item.year})`).join(' · ')],
          ['Languages', document.languages.map((item) => `${item.language}: ${item.proficiency}`).join(' · ')],
        ].map(([title, body]) => (
          <section key={title} className="grid grid-cols-[1rem_1fr] gap-3">
            <span className="mt-1 size-2 rounded-soft border border-paper-ink" />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wide">{title}</h2>
              <p className="mt-2 text-xs leading-5 text-paper-muted">{body}</p>
            </div>
          </section>
        ))}
      </div>
    </ResumePaper>
  )
}

function ZoomControls({ zoom, onChange }: { readonly zoom: number; readonly onChange: (zoom: number) => void }) {
  const label = `${Math.round(zoom * 100)}%`
  return (
    <div className="absolute end-4 top-4 z-10 hidden items-center gap-1 rounded-pill border border-border bg-surface px-2 py-1 text-xs font-medium text-ink-muted shadow-control lg:flex">
      <button
        type="button"
        aria-label="Zoom out"
        onClick={() => onChange(Math.max(0.5, Number((zoom - 0.1).toFixed(2))))}
        className="grid size-6 place-items-center rounded-pill hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <Minus aria-hidden="true" className="size-3" />
      </button>
      <span className="min-w-[2.5rem] text-center">{label}</span>
      <button
        type="button"
        aria-label="Zoom in"
        onClick={() => onChange(Math.min(1.5, Number((zoom + 0.1).toFixed(2))))}
        className="grid size-6 place-items-center rounded-pill hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <Plus aria-hidden="true" className="size-3" />
      </button>
    </div>
  )
}

function InlineChangeControls({ onAccept, onReject }: { readonly onAccept: () => void; readonly onReject: () => void }) {
  return (
    <div id="walkthrough-diff-actions" className="absolute end-40 top-36 hidden gap-2 lg:flex">
      <button type="button" onClick={onReject} aria-label="Decline change" className="grid size-8 place-items-center rounded-soft border border-border bg-surface text-ink-muted shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        <X aria-hidden="true" className="size-4" />
      </button>
      <button type="button" onClick={onAccept} aria-label="Accept change" className="grid size-8 place-items-center rounded-soft bg-accent text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        <Check aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}

type SuggestionChange = {
  readonly id: string
  readonly section: string
  readonly before: string
  readonly after: string
}

function ChangeCarousel({ changes, typedSummary }: { readonly changes: readonly SuggestionChange[]; readonly typedSummary: string | null }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    function handleScroll() {
      const scrollLeft = el!.scrollLeft
      const cardWidth = el!.offsetWidth * 0.85
      const idx = Math.round(scrollLeft / cardWidth)
      setActiveIndex(Math.min(idx, changes.length - 1))
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [changes.length])

  if (changes.length === 0) return null

  return (
    <>
      <div ref={scrollRef} className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pt-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {changes.map((change, i) => (
          <div key={change.id} className="w-[85%] shrink-0 snap-center rounded-xl border border-border bg-surface-subtle p-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-accent">{change.section}</p>
            {i === 0 && typedSummary !== null ? (
              <>
                <p className="mb-2 text-xs text-ink-muted">Updated:</p>
                <p className="text-sm leading-6 text-ink">{typedSummary}</p>
              </>
            ) : (
              <>
                <p className="mb-1 text-xs font-medium text-ink-muted">Before</p>
                <p className="mb-3 text-sm leading-6 text-danger/80 line-through decoration-danger/60 line-clamp-3">{change.before}</p>
                <p className="mb-1 text-xs font-medium text-ink">After</p>
                <p className="text-sm leading-6 text-ink">{change.after}</p>
              </>
            )}
          </div>
        ))}
      </div>
      {changes.length > 1 ? (
        <div className="flex items-center justify-center gap-1.5 px-4 py-2">
          {changes.map((_, i) => (
            <span key={i} className={cn('size-1.5 rounded-pill transition-colors', i === activeIndex ? 'bg-accent' : 'bg-border')} />
          ))}
        </div>
      ) : null}
    </>
  )
}

function ResumePreviewTray({
  onOpen,
  pendingSuggestion,
  changeCount,
  atsScore,
}: {
  readonly onOpen: () => void
  readonly pendingSuggestion: boolean
  readonly changeCount: number
  readonly atsScore: number
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex shrink-0 flex-col items-center rounded-t-2xl border-t border-border bg-surface pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-panel lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      <span aria-hidden="true" className="mt-2 h-1 w-10 shrink-0 rounded-pill bg-border" />
      <span className="flex min-h-12 w-full items-center justify-between gap-3 px-4">
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-subtle text-ink-muted">
            <FileText aria-hidden="true" className="size-4" />
          </span>
          <span className="min-w-0 text-start">
            <span className="block text-sm font-semibold text-ink">Resume Preview</span>
            <span className="block truncate text-xs text-ink-muted">
              {pendingSuggestion ? `${changeCount} change${changeCount === 1 ? '' : 's'} to review` : `ATS Score ${atsScore}%`}
            </span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {pendingSuggestion ? <span aria-hidden="true" className="size-2 rounded-pill bg-accent" /> : null}
          <ChevronDown aria-hidden="true" className="size-4 -rotate-90 text-ink-muted" />
        </span>
      </span>
    </button>
  )
}

function ResumePreviewDialog({
  open,
  onOpenChange,
  document,
  tab,
  showImproved,
  pendingSuggestion,
  changes,
  typedSummary,
  atsScore,
  onAccept,
  onReject,
  onAtsClick,
}: {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly document: ResumeDocument
  readonly tab: ResumeBuilderTab
  readonly showImproved: boolean
  readonly pendingSuggestion: boolean
  readonly changes: readonly SuggestionChange[]
  readonly typedSummary: string | null
  readonly atsScore: number
  readonly onAccept: () => void
  readonly onReject: () => void
  readonly onAtsClick: () => void
}) {
  const [downloadOpen, setDownloadOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup placement="center" aria-label="Resume preview" className="flex max-h-[85vh] flex-col p-0 sm:max-h-[calc(100vh-4rem)]">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 pb-3 pt-6">
          <div className="flex items-center gap-2">
            {pendingSuggestion ? <LightforthAiIcon className="size-4" /> : <FileText aria-hidden="true" className="size-4 text-ink-muted" />}
            <DialogTitle className="text-sm">{pendingSuggestion ? 'Review Changes' : 'Resume Preview'}</DialogTitle>
            {pendingSuggestion ? (
              <span className="rounded-pill bg-accent-subtle px-2 py-0.5 text-[10px] font-bold text-accent-text">{changes.length}</span>
            ) : (
              <span className="rounded-pill bg-positive-surface px-2 py-0.5 text-[10px] font-bold text-positive">ATS {atsScore}%</span>
            )}
          </div>
          <DialogClose className="static" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {pendingSuggestion ? (
            <ChangeCarousel changes={changes} typedSummary={typedSummary} />
          ) : (
            <div className="bg-canvas px-4 py-6">
              {tab === 'template' ? (
                <ExecutiveResume document={document} />
              ) : (
                <ClassicResume document={document} showImproved={showImproved} highlightChanges={false} typedSummary={null} isTypingSummary={false} />
              )}
            </div>
          )}
        </div>

        {pendingSuggestion ? (
          <div className="flex shrink-0 gap-2 border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <button type="button" onClick={onReject} className="flex-1 inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-border text-sm font-semibold text-ink-muted hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <X aria-hidden="true" className="size-3.5" />
              Reject All
            </button>
            <button type="button" onClick={onAccept} className="flex-1 inline-flex min-h-10 items-center justify-center gap-1 rounded-lg bg-accent text-sm font-semibold text-on-accent hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Check aria-hidden="true" className="size-3.5" />
              Accept All
            </button>
          </div>
        ) : (
          <div className="flex shrink-0 gap-2 border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={() => {
                onOpenChange(false)
                onAtsClick()
              }}
              className="flex-1 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <Target aria-hidden="true" className="size-4" />
              ATS Score {atsScore}%
            </button>
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setDownloadOpen((value) => !value)}
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-semibold text-on-accent hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <Download aria-hidden="true" className="size-4" />
                Download
              </button>
              {downloadOpen ? (
                <div className="absolute inset-x-0 bottom-full z-50 mb-2 rounded-xl border border-border bg-surface py-1 shadow-panel">
                  {downloadOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDownloadOpen(false)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:bg-surface-subtle"
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </DialogPopup>
    </Dialog>
  )
}

function WalkthroughTooltip({
  targetId,
  side = 'right',
  title,
  body,
  actionLabel,
  onAction,
  onDismiss,
}: {
  readonly targetId: string
  readonly side?: 'right' | 'left'
  readonly title: string
  readonly body: string
  readonly actionLabel: string
  readonly onAction: () => void
  readonly onDismiss: () => void
}) {
  const [coords, setCoords] = useState<{ readonly top: number; readonly left: number } | null>(null)

  useEffect(() => {
    function updatePosition() {
      const target = document.getElementById(targetId)
      if (!target) {
        setCoords(null)
        return
      }
      const rect = target.getBoundingClientRect()
      const offset = 16
      const top = rect.top + rect.height / 2 - 140
      const left = side === 'right' ? rect.right + offset : rect.left - offset - 288
      setCoords({ top, left })
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    const timers = [100, 400, 1000].map((delay) => window.setTimeout(updatePosition, delay))
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [targetId, side])

  if (!coords) return null

  return (
    <div
      role="status"
      style={{ top: coords.top, left: coords.left }}
      className="fixed z-20 hidden w-72 rounded-xl bg-live-header p-4 text-brand-bar-text shadow-panel lg:block"
    >
      <span aria-hidden="true" className={cn('absolute bottom-6 size-3 rotate-45 bg-live-header', side === 'right' ? '-start-1.5' : '-end-1.5')} />
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss tip"
        className="absolute end-2 top-2 rounded p-1 text-brand-bar-text/60 hover:text-brand-bar-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <X aria-hidden="true" className="size-3" />
      </button>
      <h2 className="pe-5 text-sm font-bold">{title}</h2>
      <p className="mt-1 text-xs leading-relaxed text-brand-bar-text/80">{body}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-3 inline-flex min-h-7 items-center rounded-lg bg-surface px-3 text-xs font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        {actionLabel}
      </button>
    </div>
  )
}

function AtsScoreDrawer({
  open,
  onOpenChange,
  atsScore,
  atsBreakdown,
  atsContext,
  atsStrengths,
  atsGaps,
  atsPrompt,
}: {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly atsScore: number
  readonly atsBreakdown: readonly { readonly label: string; readonly score: number }[]
  readonly atsContext: string
  readonly atsStrengths: readonly string[]
  readonly atsGaps: readonly string[]
  readonly atsPrompt: string
}) {
  const grade = atsScore >= 80 ? 'Excellent match' : atsScore >= 60 ? 'Good match' : 'Needs work'
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (typeof navigator === 'undefined') return
    navigator.clipboard.writeText(atsPrompt).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup placement="end-sheet" aria-label="ATS score breakdown" className="flex max-h-[85vh] flex-col p-0 lg:max-h-none">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <DialogTitle className="text-base">ATS Score</DialogTitle>
          <DialogClose className="static" />
        </div>
        <div className="grid flex-1 gap-6 overflow-y-auto p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-4">
            <div
              aria-hidden="true"
              className="grid size-16 shrink-0 place-items-center rounded-pill"
              style={{ background: `conic-gradient(var(--lf-accent) ${atsScore}%, var(--lf-surface-subtle) 0)` }}
            >
              <div className="grid size-12 place-items-center rounded-pill bg-surface text-sm font-black text-ink">{atsScore}%</div>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{grade}</p>
              <p className="mt-0.5 text-xs text-ink-muted">Based on the job description you pasted</p>
            </div>
          </div>

          <p className="text-sm leading-6 text-ink-muted">{atsContext}</p>

          <div className="grid gap-3">
            {atsBreakdown.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs font-medium text-ink">
                  <span>{item.label}</span>
                  <span className="text-ink-muted">{item.score}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-pill bg-surface-subtle">
                  <div className="h-full rounded-pill bg-accent" style={{ inlineSize: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>

          <section className="grid gap-3">
            <h3 className="text-sm font-semibold text-ink">What is working</h3>
            <div className="grid gap-3">
              {atsStrengths.map((strength) => (
                <p key={strength} className="text-sm leading-6 text-ink-muted">
                  {strength}
                </p>
              ))}
            </div>
          </section>

          <section className="grid gap-3">
            <h3 className="text-sm font-semibold text-ink">What is missing</h3>
            <div className="grid gap-3">
              {atsGaps.map((gap) => (
                <p key={gap} className="text-sm leading-6 text-ink-muted">
                  {gap}
                </p>
              ))}
            </div>
          </section>

          <section className="grid gap-3">
            <h3 className="text-sm font-semibold text-ink">Suggested fix</h3>
            <div className="rounded-lg border border-border bg-surface-subtle p-4">
              <p className="text-sm leading-6 text-ink">{atsPrompt}</p>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex min-h-9 items-center rounded-lg border border-input bg-surface px-3 text-xs font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {copied ? 'Copied' : 'Copy prompt'}
                </button>
              </div>
            </div>
          </section>
        </div>
      </DialogPopup>
    </Dialog>
  )
}

const THINKING_LABELS = ['Thinking…', 'Reading your resume…', 'Fetching from your Knowledge Base…', 'Pulling the job description…']

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)')
    const handler = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return isMobile
}

export function ResumeEditorView({ homeHref, document, session, templates, tab, chatState, jd }: ResumeEditorViewProps) {
  const hasJd = Boolean(jd && jd.trim())
  const [messages, setMessages] = useState<readonly ChatMessage[]>(() => {
    if (hasJd) {
      return [
        { id: 'jd-candidate', author: 'candidate', text: jd!.trim() },
        { id: 'jd-assistant', author: 'assistant', text: "I've tailored your resume to match the job description — review the highlighted changes below and accept or reject them." },
      ]
    }
    if (chatState === 'suggestions') {
      return [
        { id: 'seed-candidate', author: 'candidate', text: session.chatPrompt },
        { id: 'seed-assistant', author: 'assistant', text: session.aiResponse },
      ]
    }
    return []
  })
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [thinkingLabel, setThinkingLabel] = useState(THINKING_LABELS[0])
  const [pendingSuggestion, setPendingSuggestion] = useState(hasJd || chatState === 'suggestions')
  const [hasAcceptedChanges, setHasAcceptedChanges] = useState(false)
  const [atsOpen, setAtsOpen] = useState(false)
  const [showPostAcceptTip, setShowPostAcceptTip] = useState(false)
  const [typedSummary, setTypedSummary] = useState<string | null>(null)
  const { type: typeSummary, isTyping: isTypingSummary } = useTypewriter()
  const [zoom, setZoom] = useState(() => {
    const parsed = parseInt(session.zoomLabel.replace('%', ''), 10)
    return Number.isFinite(parsed) ? parsed / 100 : 0.85
  })
  const [previewOpen, setPreviewOpen] = useState(false)
  const isMobileViewport = useIsMobileViewport()

  function revealSuggestion() {
    setPendingSuggestion(true)
    typeSummary(document.improvedSummary, setTypedSummary, { durationMs: 1000 })
    if (isMobileViewport) setPreviewOpen(true)
  }

  function handleSend() {
    const trimmed = draft.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { id: `msg-${Date.now()}`, author: 'candidate', text: trimmed }])
    setDraft('')
    setIsTyping(true)
    let labelIndex = 0
    setThinkingLabel(THINKING_LABELS[0])
    const labelTimer = window.setInterval(() => {
      labelIndex = (labelIndex + 1) % THINKING_LABELS.length
      setThinkingLabel(THINKING_LABELS[labelIndex])
    }, 1000)
    window.setTimeout(() => {
      window.clearInterval(labelTimer)
      setMessages((prev) => [...prev, { id: `msg-${Date.now()}-ai`, author: 'assistant', text: "I've updated your resume based on that — review the highlighted changes below and accept or reject them." }])
      setIsTyping(false)
      revealSuggestion()
    }, 4000)
  }

  function handleAccept() {
    setHasAcceptedChanges(true)
    setPendingSuggestion(false)
    setTypedSummary(null)
    setPreviewOpen(false)
    setShowPostAcceptTip(true)
  }

  function handleReject() {
    setPendingSuggestion(false)
    setTypedSummary(null)
    setPreviewOpen(false)
    setShowPostAcceptTip(true)
  }

  const showImproved = hasAcceptedChanges || pendingSuggestion
  const changes: readonly SuggestionChange[] = pendingSuggestion
    ? [
        { id: 'professional-summary', section: 'Professional Summary', before: document.summary, after: document.improvedSummary },
        {
          id: 'experience-highlights',
          section: `Experience — ${document.roles[0]?.company ?? 'Current Role'}`,
          before: document.roles[0]?.bullets.slice(0, 2).join(' ') ?? '',
          after: document.improvedFirstRoleBullets.join(' '),
        },
        {
          id: 'skills',
          section: 'Skills',
          before: document.skills.join(', '),
          after: document.improvedSkills.join(', '),
        },
      ]
    : []

  return (
    <Workspace>
      <BuilderHeader homeHref={homeHref} current="Build a Resume" action="download" onAtsClick={() => setAtsOpen(true)} />
      <section className="relative flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden lg:flex-row">
        {tab === 'chat' ? (
          <ChatSidebar
            session={session}
            messages={messages}
            isTyping={isTyping}
            thinkingLabel={thinkingLabel}
            pendingSuggestion={pendingSuggestion}
            draft={draft}
            onDraftChange={setDraft}
            onSend={handleSend}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ) : null}
        {tab === 'create' ? (
          <SectionEditor pendingSuggestion={pendingSuggestion} onSuggest={revealSuggestion} onAccept={handleAccept} onReject={handleReject} />
        ) : null}
        {tab === 'template' ? <TemplateSidebar templates={templates} selectedTemplateId={session.selectedTemplateId} /> : null}
        <ResumePreviewTray
          onOpen={() => setPreviewOpen(true)}
          pendingSuggestion={pendingSuggestion}
          changeCount={changes.length}
          atsScore={document.atsScore}
        />
        <div className="relative hidden flex-1 overflow-auto bg-canvas px-4 py-8 lg:block lg:px-8">
          <ZoomControls zoom={zoom} onChange={setZoom} />
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
            {tab === 'template' ? (
              <ExecutiveResume document={document} />
            ) : (
              <ClassicResume
                document={document}
                showImproved={showImproved}
                highlightChanges={pendingSuggestion}
                typedSummary={typedSummary}
                isTypingSummary={isTypingSummary}
              />
            )}
          </div>
          {pendingSuggestion && (tab === 'chat' || tab === 'create') ? (
            <InlineChangeControls onAccept={handleAccept} onReject={handleReject} />
          ) : null}
          {showPostAcceptTip ? (
            <WalkthroughTooltip
              targetId="walkthrough-chat-input"
              side="right"
              title="Keep refining"
              body="Ask for more rewrites, accept the changes, or keep editing — your resume updates in real time."
              actionLabel="Got it"
              onAction={() => setShowPostAcceptTip(false)}
              onDismiss={() => setShowPostAcceptTip(false)}
            />
          ) : null}
        </div>
      </section>
      <AtsScoreDrawer
        open={atsOpen}
        onOpenChange={setAtsOpen}
        atsScore={document.atsScore}
        atsBreakdown={document.atsBreakdown}
        atsContext={document.atsContext}
        atsStrengths={document.atsStrengths}
        atsGaps={document.atsGaps}
        atsPrompt={document.atsPrompt}
      />
      <ResumePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        document={document}
        tab={tab}
        showImproved={showImproved}
        pendingSuggestion={pendingSuggestion}
        changes={changes}
        typedSummary={typedSummary}
        atsScore={document.atsScore}
        onAccept={handleAccept}
        onReject={handleReject}
        onAtsClick={() => setAtsOpen(true)}
      />
      {isMobileViewport ? (
        <TipModal
          open={showPostAcceptTip}
          onOpenChange={setShowPostAcceptTip}
          title="Keep refining"
          body="Ask for more rewrites, accept the changes, or keep editing — your resume updates in real time."
        />
      ) : null}
    </Workspace>
  )
}

export function ResumeHistoryView({ homeHref, createHref, editorHref, rows }: ResumeHistoryViewProps) {
  return (
    <Workspace>
      <BuilderHeader homeHref={homeHref} current="History" />
      <section className="px-4 py-8 lg:px-12 xl:px-24">
        <DataTable
          title="Past Resumes"
          searchLabel="Search past resumes"
          action={{ label: 'Create New', href: createHref }}
          rows={rows}
          itemLabel={(row) => row.title}
          className="mx-auto max-w-7xl"
          onRowClick={() => {
            window.location.href = editorHref
          }}
          columns={[
            { key: 'title', label: 'Title', className: 'w-[18rem]', render: (row) => <span className="font-medium">{row.title}</span> },
            {
              key: 'ats-score',
              label: 'ATS Score',
              className: 'w-[9rem]',
              render: (row) => <span className="rounded-pill bg-positive-surface px-2.5 py-0.5 text-xs font-bold leading-4 text-positive">{row.atsScore}</span>,
            },
            { key: 'company', label: 'Company', className: 'w-[13rem]', render: (row) => row.company },
            { key: 'duration', label: 'Duration', className: 'w-[8rem]', render: (row) => row.duration },
            { key: 'created-at', label: 'Date & Time', className: 'w-[16rem]', render: (row) => row.createdAtLabel },
          ]}
        />
      </section>
    </Workspace>
  )
}
