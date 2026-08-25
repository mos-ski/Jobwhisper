import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Mic,
  MicOff,
  Pause,
  PhoneOff,
  Play,
  Settings,
  Video,
  VideoOff,
  Volume2,
  X,
} from 'lucide-react'

import type {
  InterviewHistoryRow,
  InterviewLiveSession,
  InterviewPrepSession,
  InterviewReport,
  InterviewReportStep,
  InterviewRubricStatus,
  InterviewerVoice,
} from '@/contracts/interview.draft'
import type { ContextDocumentRow } from '@/contracts/documents.draft'
import type { ResumeHistoryRow } from '@/contracts/resume.draft'
import { centsToCredits, creditsToCents, formatCreditAmountWithUsd } from '@/lib/credits'
import { AddFundsDialog, AiSuggestionAction, Avatar, Badge, Button, Checkbox, cn, DataTable, Dialog, DialogClose, DialogPopup, DialogTitle, DocumentDropAction, FormField, FormPanel, FormPanelFooter, FormSelectField, FormTextArea, LightforthAiIcon, ListPickerDialog, ShellBar, SourcePicker, Tabs, TabsContent, TabsList, TabsTrigger, UploadedFileDialog } from '@/ui'
import { useCameraStream } from '@/hooks/useCameraStream'
import { clearDefaultResumePreference, getDefaultResumePreference, setDefaultResumePreference } from '@/lib/resume-preference'
import { useTypewriter } from '@/hooks/useTypewriter'

export type InterviewUploadViewProps = {
  readonly homeHref: string
  readonly configureHref: string
  readonly historyHref: string
  readonly uploadedFileName: string
  readonly savedResumes: readonly ResumeHistoryRow[]
}

export type InterviewConfigureViewProps = {
  readonly homeHref: string
  readonly uploadHref: string
  readonly voiceHref: string
  readonly session: InterviewPrepSession
  readonly knowledgeBaseDocuments?: readonly ContextDocumentRow[]
}

export type InterviewVoiceViewProps = {
  readonly homeHref: string
  readonly configureHref: string
  readonly sessionHref: string
  readonly voices: readonly InterviewerVoice[]
}

export type InterviewSessionViewProps = {
  readonly voiceHref: string
  readonly completeHref: string
  readonly session: InterviewLiveSession
  readonly isLoading?: boolean
}

export type InterviewCompleteViewProps = {
  readonly homeHref: string
  readonly sessionHref: string
  readonly preparingReportHref: string
  readonly companyName?: string
}

export type InterviewPreparingReportViewProps = {
  readonly homeHref: string
  readonly steps: readonly InterviewReportStep[]
  readonly onComplete?: () => void
}

export type InterviewHistoryViewProps = {
  readonly homeHref: string
  readonly createHref: string
  readonly reportHref: string
  readonly rows: readonly InterviewHistoryRow[]
}

export type InterviewReportViewProps = {
  readonly homeHref: string
  readonly scenariosHref: string
  readonly practiceHref: string
  readonly report: InterviewReport
  readonly isLoading?: boolean
}

function InterviewHeader({
  homeHref,
  current,
  historyHref,
}: {
  readonly homeHref: string
  readonly current: string
  readonly historyHref?: string
}) {
  return (
    <ShellBar
      homeHref={homeHref}
      current={current}
      parent={historyHref ? { label: 'History', href: historyHref } : undefined}
      closeHref={homeHref}
      closeLabel="Close interview prep"
    />
  )
}

function Workspace({ children }: { readonly children: ReactNode }) {
  return <main className="min-h-screen bg-canvas text-ink">{children}</main>
}

function PaperShell({ children, label = 'Interview prep workspace' }: { readonly children: ReactNode; readonly label?: string }) {
  return (
    <article className="mx-auto min-h-[56rem] w-full max-w-[44rem] bg-surface p-8 shadow-panel" aria-label={label}>
      {children}
    </article>
  )
}

function FooterActions({
  backHref,
  continueHref,
  continueLabel,
}: {
  readonly backHref: string
  readonly continueHref: string
  readonly continueLabel: string
}) {
  return (
    <div className="flex items-center justify-between border-t border-border px-6 py-4">
      <a href={backHref} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back
      </a>
      <a href={continueHref} className="inline-flex min-h-11 min-w-36 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        {continueLabel}
      </a>
    </div>
  )
}

export function InterviewUploadView({ homeHref, configureHref, historyHref, uploadedFileName, savedResumes }: InterviewUploadViewProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [useAsDefault, setUseAsDefault] = useState(() => getDefaultResumePreference() !== null)

  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="Interview Prep" />
      <section className="px-4 py-8 lg:py-10">
        <PaperShell>
          <SourcePicker
            title="Upload a resume"
            options={[
              { label: 'Upload a Resume', hint: 'PDF, DOC, DOCX or TXT', onClick: () => setUploadDialogOpen(true) },
              { label: 'Use Lightforth Resume', icon: <LightforthAiIcon className="size-5" />, emphasis: 'strong', onClick: () => setPickerOpen(true) },
            ]}
            historyLink={{ label: 'View interview history', href: historyHref }}
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

const INTERVIEW_AI_SUGGESTION =
  ' Ask the interviewer how success is measured in the first 90 days, and be ready to walk through one metric you personally moved.'

export function InterviewConfigureView({ homeHref, uploadHref, voiceHref, session, knowledgeBaseDocuments = [] }: InterviewConfigureViewProps) {
  const [additionalContext, setAdditionalContext] = useState(session.additionalContext)
  const [selectedDocIds, setSelectedDocIds] = useState<ReadonlySet<string>>(new Set())
  const [pickerOpen, setPickerOpen] = useState(false)
  const [draftDocIds, setDraftDocIds] = useState<ReadonlySet<string>>(new Set())
  const selectedDocuments = knowledgeBaseDocuments.filter((doc) => selectedDocIds.has(doc.id))
  const { type, isTyping } = useTypewriter()

  function handleAiSuggestion() {
    const base = additionalContext
    type(INTERVIEW_AI_SUGGESTION, (partial) => setAdditionalContext(base + partial))
  }

  function openDocumentPicker() {
    setDraftDocIds(selectedDocIds)
    setPickerOpen(true)
  }

  function toggleDraftDoc(id: string) {
    setDraftDocIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="Interview Prep" />
      <section className="px-4 py-9">
        <FormPanel
          title="Configure your interview"
          step="1/2"
          uploadedFile={{
            fileName: session.uploadedFileName,
            changeHref: uploadHref,
            onChangeClick: () => clearDefaultResumePreference(),
          }}
          footer={<FormPanelFooter backHref={uploadHref} nextHref={voiceHref} />}
        >
          <div className="grid gap-3 sm:grid-cols-2">
              <FormSelectField
                id="interview-type"
                label="Interview type"
                defaultValue="introductory"
                options={[
                  { label: 'Introductory', value: 'introductory' },
                  { label: 'Behavioral', value: 'behavioral' },
                  { label: 'Product case', value: 'product-case' },
                ]}
              />
              <FormSelectField
                id="interview-difficulty"
                label="Difficulty"
                defaultValue="medium"
                options={[
                  { label: 'Easy', value: 'easy' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Hard', value: 'hard' },
                ]}
              />
              <FormField id="target-role" label="Target Role" placeholder="e.g. Senior Software Engineer" />
              <FormField id="interview-company" label="Company Name" placeholder="e.g. Google, Meta" />
          </div>
          <DocumentDropAction onTrigger={openDocumentPicker} hint="Add from Knowledge Base">
            {selectedDocuments.length > 0 ? (
              <span className="flex flex-wrap justify-center gap-2">
                {selectedDocuments.map((doc) => (
                  <span key={doc.id} className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-3 py-1 text-xs font-medium text-ink">
                    <FileText aria-hidden="true" className="size-3.5 text-ink-muted" />
                    {doc.name}
                  </span>
                ))}
              </span>
            ) : undefined}
          </DocumentDropAction>
          <FormTextArea
            id="interview-additional-context"
            label="Additional context"
            value={additionalContext}
            onChange={(event) => setAdditionalContext(event.target.value)}
            className={cn(isTyping && 'ring-2 ring-accent shadow-[0_0_0_4px_var(--lf-accent-subtle)] transition-shadow duration-normal')}
          />
          <AiSuggestionAction onClick={handleAiSuggestion} disabled={isTyping} />
        </FormPanel>
      </section>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogPopup aria-label="Add documents from Knowledge Base">
          <DialogClose />
          <DialogTitle>Add from Knowledge Base</DialogTitle>
          <p className="mt-1 text-sm text-ink-muted">Select the documents you want the interviewer to use as context for this session.</p>
          <div className="mt-4 grid max-h-80 gap-1 overflow-y-auto">
            {knowledgeBaseDocuments.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-muted">No documents in your Knowledge Base yet.</p>
            ) : (
              knowledgeBaseDocuments.map((doc) => (
                <label key={doc.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 hover:bg-surface-subtle">
                  <Checkbox checked={draftDocIds.has(doc.id)} onCheckedChange={() => toggleDraftDoc(doc.id)} aria-label={doc.name} />
                  <FileText aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{doc.name}</span>
                  <span className="shrink-0 text-xs text-ink-muted">{doc.sizeOrUrl}</span>
                </label>
              ))
            )}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setPickerOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                setSelectedDocIds(draftDocIds)
                setPickerOpen(false)
              }}
            >
              Add Selected
            </Button>
          </div>
        </DialogPopup>
      </Dialog>
    </Workspace>
  )
}

export function InterviewVoiceView({ homeHref, configureHref, sessionHref, voices }: InterviewVoiceViewProps) {
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const speakPreview = (voice: InterviewerVoice) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(`Hello, I'm ${voice.name}. I'll be your interviewer today. Let's get ready to practice.`)
    utterance.rate = 0.95
    utterance.pitch = 0.9
    utterance.volume = 0.8
    window.speechSynthesis.speak(utterance)
  }

  const handleSelect = (voice: InterviewerVoice) => {
    if (selectedVoiceId === voice.id) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setSelectedVoiceId(voice.id)
    if (voice.audioSrc) {
      const audio = new Audio(voice.audioSrc)
      audio.volume = 0.5
      audio.play().catch(() => speakPreview(voice))
      audioRef.current = audio
    } else {
      speakPreview(voice)
    }
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const isDisabled = selectedVoiceId === null

  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="Interview Prep" />
      <section className="px-4 py-9">
        <div className="mx-auto w-full max-w-[720px]">
          <div className="border border-border bg-surface shadow-control">
            <div className="flex items-center justify-center gap-2 border-b border-border px-8 py-6">
              <h1 className="text-lg font-medium">Choose interviewer voice</h1>
              <span className="text-xs text-ink-muted">2/2</span>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 px-4 py-6 sm:grid-cols-2 sm:px-10 sm:py-8 lg:grid-cols-3">
              {voices.map((voice) => {
                const isSelected = selectedVoiceId === voice.id
                return (
                    <label
                      key={voice.id}
                      className="group grid cursor-pointer gap-1.5 rounded-xl p-1.5 text-left"
                    >
                    <input
                      type="radio"
                      name="interviewer"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => handleSelect(voice)}
                    />
                    <span className="relative block aspect-square w-full overflow-hidden rounded-lg bg-surface-subtle">
                      <img src={voice.imageSrc} alt="" className="absolute inset-0 size-full object-cover transition-all duration-200 group-hover:brightness-110" />
                      {!isSelected && (
                        <span className="absolute inset-0 bg-accent/0 transition-colors duration-200 group-hover:bg-accent/20" />
                      )}
                      {isSelected ? (
                        <span className="absolute inset-0 grid place-items-center">
                          <span className="absolute inset-0 bg-accent opacity-85" />
                          <span className="relative rounded bg-overlay px-2.5 py-0.5 text-xs font-semibold text-on-danger">selected</span>
                        </span>
                      ) : null}
                    </span>
                    <span className="grid gap-1.5 text-left pt-1">
                      <span className="block text-sm font-semibold leading-5 text-ink">{voice.name}</span>
                      <span className="block text-xs font-medium leading-4 text-accent-text">{voice.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-ink-muted line-clamp-2">{voice.summary}</span>
                    </span>
                  </label>
                )
              })}
            </div>
            <p className="border-t border-border px-6 py-3 text-xs leading-5 text-ink-muted">
              Before you start: check that your microphone is on and working. You can mute or turn off your camera at any time
              during the session. You'll only be charged for the time you're in session.
            </p>
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <a href={configureHref} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <ArrowLeft aria-hidden="true" className="size-4" />
                Back
              </a>
              <a
                href={isDisabled ? undefined : sessionHref}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : undefined}
                className={cn(
                  'inline-flex min-h-11 min-w-36 items-center justify-center rounded-lg px-4 text-sm font-semibold shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                  isDisabled
                    ? 'cursor-not-allowed bg-surface-subtle text-ink-muted'
                    : 'bg-accent text-on-accent',
                )}
              >
                Start Interview
              </a>
            </div>
          </div>
        </div>
      </section>
    </Workspace>
  )
}

function ParticipantCard({ participant, active }: { readonly participant: InterviewLiveSession['interviewer']; readonly active?: boolean }) {
  const isCandidate = participant.label.includes('You')
  return (
    <figure className="grid w-[13rem] max-w-full gap-[18px] text-brand-bar-text">
      <div
        className={cn(
          'relative aspect-[208/222] w-full overflow-hidden transition-shadow duration-normal ease-default',
          isCandidate ? 'bg-[var(--lf-live-avatar-warm)]' : 'bg-[var(--lf-live-avatar-neutral)]',
          active && 'ring-4 ring-accent shadow-[0_0_32px_var(--lf-focus)]',
        )}
      >
        <img src={participant.imageSrc} alt="" className="absolute inset-0 size-full object-cover" />
        <figcaption className="absolute inset-x-3 bottom-3 inline-flex min-h-7 items-center gap-2 bg-[var(--lf-live-scrim)] px-2.5 py-1.5">
          {isCandidate ? (
            <Mic aria-hidden="true" className={cn('size-3.5', active ? 'animate-pulse text-danger motion-reduce:animate-none' : 'text-positive')} />
          ) : (
            <Volume2 aria-hidden="true" className={cn('size-3.5', active && 'text-accent-text')} />
          )}
          <span className="truncate text-xs font-semibold leading-4">{participant.label}</span>
        </figcaption>
      </div>
      <figcaption className="grid gap-0.5">
        <p className="truncate text-[15px] font-semibold leading-[22px]">{participant.name}</p>
        <p className="truncate text-[13.5px] leading-[21px] text-accent-text">{participant.title}</p>
      </figcaption>
    </figure>
  )
}

function LoadingBar({ className }: { readonly className?: string }) {
  return <span aria-hidden="true" className={cn('block animate-pulse rounded-lg bg-surface-subtle motion-reduce:animate-none', className)} />
}

function LiveLoadingBar({ className }: { readonly className?: string }) {
  return <span aria-hidden="true" className={cn('block animate-pulse rounded-lg bg-[var(--lf-live-message)] motion-reduce:animate-none', className)} />
}

function SignalStrength({ label }: { readonly label: string }) {
  return (
    <div className="flex items-end gap-1 text-positive" aria-label={label}>
      <span aria-hidden="true" className="h-1.5 w-1 rounded-soft bg-positive" />
      <span aria-hidden="true" className="h-2 w-1 rounded-soft bg-positive" />
      <span aria-hidden="true" className="h-3 w-1 rounded-soft bg-positive" />
      <span aria-hidden="true" className="h-4 w-1 rounded-soft bg-positive" />
    </div>
  )
}

function InterviewSessionLoadingView() {
  return (
    <main className="min-h-screen bg-[var(--lf-live-canvas)] text-brand-bar-text">
      <div role="status" aria-label="Loading live interview session" className="sr-only">
        Loading live interview session
      </div>
      <header className="flex min-h-[57px] items-center justify-between border-b border-[var(--lf-live-border)] bg-[var(--lf-live-header)] px-5 py-3">
        <LiveLoadingBar className="h-5 w-56 max-w-[55vw]" />
        <LiveLoadingBar className="h-9 w-32" />
      </header>
      <div className="flex min-h-10 items-center bg-[var(--lf-live-strip)] px-5">
        <LiveLoadingBar className="h-5 w-36" />
      </div>
      <section className="grid gap-3 p-3 xl:grid-cols-[minmax(0,1fr)_28.5rem]">
        <div className="min-h-[38rem] overflow-hidden rounded-panel border border-[var(--lf-live-border)] bg-[var(--lf-live-panel)]">
          <div className="flex min-h-[57px] items-center border-b border-[var(--lf-live-border)] px-4 py-3">
            <LiveLoadingBar className="h-5 w-36" />
          </div>
          <div className="p-5">
            <div className="grid min-h-[32rem] place-items-center xl:h-[calc(100vh-16.8125rem)]">
              <div className="grid gap-6 sm:grid-cols-2">
                <LiveLoadingBar className="h-72 w-52 rounded-none" />
                <LiveLoadingBar className="h-72 w-52 rounded-none" />
              </div>
            </div>
          </div>
        </div>
        <aside className="min-h-[32rem] rounded-panel border border-[var(--lf-live-border)] bg-[var(--lf-live-panel)]">
          <div className="flex min-h-[57px] items-center border-b border-[var(--lf-live-border)] px-4 py-3">
            <LiveLoadingBar className="h-5 w-20" />
          </div>
          <div className="grid gap-4 p-6">
            <LiveLoadingBar className="ms-auto h-32 w-72 max-w-full" />
            <LiveLoadingBar className="h-28 w-72 max-w-full" />
          </div>
        </aside>
      </section>
    </main>
  )
}

type LiveSessionPhase = 'ready' | 'asking' | 'answering' | 'done'

type LiveTranscriptTurn = {
  readonly id: string
  readonly speaker: 'interviewer' | 'candidate'
  readonly text: string
}

const SIMULATED_ANSWERS: Record<string, string> = {
  'question-1':
    'At my last role, we had three competing priorities and only two frontend engineers available. I set up a quick scoring framework based on revenue impact, user impact, and engineering effort. The highest-ROI item was a checkout flow improvement that could lift conversion by 8%. I presented the tradeoffs to stakeholders, got alignment, and we shipped it in two sprints. The result was a 12% increase in completed purchases.',
  'question-2':
    'We ran an A/B test on a new onboarding flow and the data showed a 15% improvement in activation. I pushed to ship it fully. But two weeks later, cohort analysis revealed the lift was driven by a spike in power users, not the broader base. I owned the mistake, rolled it back, and we redesigned the test to segment by user type. That taught me to always look at distribution, not just averages.',
  'question-3':
    'I usually start by asking the engineering lead to walk me through their concern in detail. In one case, the lead felt a scope cut would hurt long-term maintainability. I listened, asked clarifying questions, and we found a middle ground: we shipped a slimmer version for the deadline and scheduled a follow-up sprint for the technical debt. The key is treating it as a shared problem, not a tug-of-war.',
  'question-4':
    'I owned the launch of a self-serve analytics dashboard from design through to release. I coordinated with data engineering, defined the success metric, ran the beta with 50 customers, and handled the go-to-market. We hit 40% adoption in the first month. What I would change is earlier involvement of customer support, because they got unexpected questions on day one that we could have anticipated.',
  'question-5':
    'I see the biggest opportunity in expanding the platform with API integrations. Right now customers have to manually export data to connect their existing tools. If we offered native integrations with the top five tools in our space, we could reduce churn by making the product stickier and open up a new acquisition channel through partner listings.',
}

function DraggableCandidatePiP({ name, imageSrc, videoEnabled }: { readonly name: string; readonly imageSrc: string; readonly videoEnabled: boolean }) {
  const ref = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [pos, setPos] = useState<{ readonly x: number; readonly y: number } | null>(null)
  const dragState = useRef<{ readonly startX: number; readonly startY: number; readonly originX: number; readonly originY: number } | null>(null)
  const draggedRef = useRef(false)
  const { stream, request, stop } = useCameraStream()

  useEffect(() => {
    if (videoEnabled) {
      void request({ video: true })
    } else {
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoEnabled])

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream ?? null
  }, [stream])

  useEffect(() => {
    function handleMove(event: PointerEvent) {
      if (!dragState.current || !ref.current) return
      draggedRef.current = true
      const { startX, startY, originX, originY } = dragState.current
      const size = ref.current.offsetWidth
      const maxX = window.innerWidth - size - 12
      const maxY = window.innerHeight - size - 12
      const nextX = Math.min(Math.max(originX + (event.clientX - startX), 12), Math.max(maxX, 12))
      const nextY = Math.min(Math.max(originY + (event.clientY - startY), 12), Math.max(maxY, 12))
      setPos({ x: nextX, y: nextY })
    }
    function handleUp() {
      dragState.current = null
    }
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }
  }, [])

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!ref.current) return
    draggedRef.current = false
    const rect = ref.current.getBoundingClientRect()
    dragState.current = { startX: event.clientX, startY: event.clientY, originX: rect.left, originY: rect.top }
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-label={`${name}, drag to reposition`}
      onPointerDown={handlePointerDown}
      onClick={(event) => {
        if (draggedRef.current) event.preventDefault()
      }}
      className="fixed z-20 size-24 cursor-grab touch-none overflow-hidden rounded-full shadow-xl ring-2 ring-white/40 transition-shadow active:cursor-grabbing active:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
      style={pos ? { left: pos.x, top: pos.y } : { top: '5.5rem', right: '1rem' }}
    >
      {stream ? (
        <video ref={videoRef} autoPlay muted playsInline className="size-full scale-x-[-1] object-cover" />
      ) : imageSrc ? (
        <img src={imageSrc} alt="" className="size-full object-cover" />
      ) : (
        <Avatar name={name} size="xl" className="size-full text-2xl" />
      )}
    </button>
  )
}

function InterviewLiveSettingsModal({
  open,
  onOpenChange,
  settingsTab,
  setSettingsTab,
  autoScroll,
  setAutoScroll,
  scrollSpeed,
  setScrollSpeed,
  fontSize,
  setFontSize,
  sessionTitle,
}: {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly settingsTab: 'live' | 'session'
  readonly setSettingsTab: (tab: 'live' | 'session') => void
  readonly autoScroll: boolean
  readonly setAutoScroll: (value: boolean) => void
  readonly scrollSpeed: number
  readonly setScrollSpeed: (value: number) => void
  readonly fontSize: number
  readonly setFontSize: (value: number) => void
  readonly sessionTitle: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup aria-label="Session settings" className="border-white/10 bg-[#1a2332] text-white before:bg-white/20 sm:max-w-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button type="button" onClick={() => onOpenChange(false)} className="grid size-8 place-items-center rounded-lg text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30" aria-label="Close settings">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="mt-4 flex max-h-[65vh] flex-col gap-4 overflow-y-auto sm:max-h-[22rem] sm:flex-row sm:gap-0">
          <nav className="flex shrink-0 gap-1 overflow-x-auto sm:w-44 sm:flex-col sm:gap-0 sm:border-r sm:border-white/10 sm:pe-4">
            <button
              type="button"
              onClick={() => setSettingsTab('live')}
              className={cn(
                'shrink-0 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors sm:w-full',
                settingsTab === 'live' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white',
              )}
            >
              Live Controls
            </button>
            <button
              type="button"
              onClick={() => setSettingsTab('session')}
              className={cn(
                'shrink-0 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors sm:mt-1 sm:w-full',
                settingsTab === 'session' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white',
              )}
            >
              Session
            </button>
          </nav>
          <div className="flex-1 sm:ps-6">
            {settingsTab === 'live' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Auto-scroll</p>
                    <p className="mt-0.5 text-xs text-slate-400">Always keeps the transcript pinned to the latest message</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoScroll}
                    onClick={() => setAutoScroll(!autoScroll)}
                    className={cn('relative flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors', autoScroll ? 'bg-green-500' : 'bg-white/20')}
                  >
                    <span className={cn('block h-5 w-5 rounded-full bg-white shadow transition-transform', autoScroll ? 'translate-x-5' : 'translate-x-0')} />
                  </button>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Auto-scroll speed</p>
                    <span className="text-sm text-slate-400">{scrollSpeed}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={scrollSpeed}
                    onChange={(e) => setScrollSpeed(Number(e.target.value))}
                    className="mt-2 w-full accent-[#3b82f6]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Font size</p>
                    <span className="text-sm text-slate-400">{fontSize}</span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={20}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="mt-2 w-full accent-[#3b82f6]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Advance the session</p>
                    <p className="mt-0.5 text-xs text-slate-400">Press this key (or tap the interviewer) to move through each question</p>
                  </div>
                  <span className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium">Space</span>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Role</span>
                  <span className="text-sm font-semibold">{sessionTitle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Resume</span>
                  <span className="text-sm font-semibold">Lightforth Resume</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Skip setup</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={false}
                    className="relative flex h-6 w-11 shrink-0 items-center rounded-full bg-white/20 px-0.5 transition-colors"
                  >
                    <span className="block h-5 w-5 rounded-full bg-white shadow translate-x-0 transition-transform" />
                  </button>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <button type="button" className="w-full rounded-lg border border-white/20 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
                    Reset — show setup next time
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogPopup>
    </Dialog>
  )
}

const SESSION_RATE_CENTS_PER_MIN = 80
const SESSION_START_BALANCE_CENTS = 60
const QUICK_TOPUP_CREDITS = [25, 50, 100]

export function InterviewSessionView({ voiceHref, completeHref, session, isLoading = false }: InterviewSessionViewProps) {
  const [phase, setPhase] = useState<LiveSessionPhase>('ready')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [transcript, setTranscript] = useState<readonly LiveTranscriptTurn[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settingsTab, setSettingsTab] = useState<'live' | 'session'>('live')
  const [autoScroll, setAutoScroll] = useState(true)
  const [scrollSpeed, setScrollSpeed] = useState(3)
  const [fontSize, setFontSize] = useState(14)
  const [isMuted, setIsMuted] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 1279px)').matches)
  const [balanceCents, setBalanceCents] = useState(SESSION_START_BALANCE_CENTS)
  const [sessionPaused, setSessionPaused] = useState(false)
  const [topUpOpen, setTopUpOpen] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const phaseRef = useRef(phase)
  const questionIndexRef = useRef(questionIndex)
  const pausedRef = useRef(sessionPaused)
  phaseRef.current = phase
  questionIndexRef.current = questionIndex
  pausedRef.current = sessionPaused

  useEffect(() => {
    if (phase === 'ready' || sessionPaused) return
    const id = window.setInterval(() => {
      const perTickCents = SESSION_RATE_CENTS_PER_MIN / 60
      setBalanceCents((prev) => {
        const next = Math.max(0, prev - perTickCents)
        if (next <= 0 && prev > 0) {
          setSessionPaused(true)
          setTopUpOpen(true)
        }
        return next
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [phase, sessionPaused])

  const lowBalance = balanceCents > 0 && balanceCents <= SESSION_START_BALANCE_CENTS * 0.2

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1279px)')
    const handler = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!autoScroll) return
    const el = chatRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [transcript, phase, autoScroll])

  function handleAddFunds(amountCredits: number) {
    setBalanceCents((prev) => prev + creditsToCents(amountCredits))
    setSessionPaused(false)
  }

  function speakQuestion(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setPhase('answering')
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => {
      setIsSpeaking(false)
      setPhase('answering')
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      setPhase('answering')
    }
    window.speechSynthesis.speak(utterance)
  }

  function advanceSession() {
    if (pausedRef.current) return
    const currentPhase = phaseRef.current
    const currentIndex = questionIndexRef.current
    const questions = session.questions

    if (currentPhase === 'ready' || currentPhase === 'done') {
      const question = questions[0]
      if (!question) return
      setQuestionIndex(0)
      setTranscript([{ id: `${question.id}-q`, speaker: 'interviewer', text: question.text }])
      setPhase('asking')
      speakQuestion(question.text)
      return
    }

    if (currentPhase === 'asking') {
      window.speechSynthesis?.cancel()
      setIsSpeaking(false)
      setPhase('answering')
      return
    }

    if (currentPhase === 'answering') {
      const nextIndex = currentIndex + 1
      if (nextIndex >= questions.length) {
        setTranscript((prev) => [...prev, { id: `answer-${currentIndex}`, speaker: 'candidate', text: SIMULATED_ANSWERS[questions[currentIndex]?.id] ?? 'Answered' }])
        setPhase('done')
        return
      }
      const nextQuestion = questions[nextIndex]
      setTranscript((prev) => [
        ...prev,
        { id: `answer-${currentIndex}`, speaker: 'candidate', text: SIMULATED_ANSWERS[questions[currentIndex]?.id] ?? 'Answered' },
        { id: `${nextQuestion.id}-q`, speaker: 'interviewer', text: nextQuestion.text },
      ])
      setQuestionIndex(nextIndex)
      setPhase('asking')
      speakQuestion(nextQuestion.text)
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== 'Space') return
      const target = event.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
      event.preventDefault()
      advanceSession()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.speechSynthesis?.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return <InterviewSessionLoadingView />
  }

  if (isMobile) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div
          className="fixed inset-0 z-0 flex flex-col bg-gradient-to-b from-[#0b1220] to-black pt-[6.5rem] pb-[7.5rem]"
          onClick={phase === 'done' ? undefined : advanceSession}
        >
          <div ref={chatRef} className="min-h-0 flex-1 overflow-y-auto px-4">
            <div className="grid auto-rows-min gap-3">
              {transcript.length === 0 ? (
                <p className="text-sm italic leading-6 text-white/60">
                  Your interviewer's questions and a log of your answers will appear here as the session runs — tap anywhere (or press Space) to begin.
                </p>
              ) : (
                transcript.map((turn) => (
                  <article
                    key={turn.id}
                    className={cn(
                      'max-w-[16.75rem] overflow-hidden text-sm leading-[22.75px] text-brand-bar-text shadow-control',
                      turn.speaker === 'candidate' ? 'ms-auto rounded-bl-[16px] rounded-br-sm rounded-tl-[16px] rounded-tr-[16px] bg-accent' : 'rounded-bl-sm rounded-br-[16px] rounded-tl-[16px] rounded-tr-[16px] bg-[var(--lf-live-message)]',
                    )}
                  >
                    <p className="px-3.5 py-2.5">{turn.text}</p>
                  </article>
                ))
              )}
              {phase === 'answering' ? (
                <div className="ms-auto flex items-center gap-1.5 rounded-bl-[16px] rounded-br-sm rounded-tl-[16px] rounded-tr-[16px] bg-accent/40 px-3.5 py-2.5" role="status" aria-label="Recording your answer">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="size-1.5 animate-bounce rounded-pill bg-brand-bar-text motion-reduce:animate-none" style={{ animationDelay: `${i * 0.12}s` }} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <p className="pointer-events-none px-5 pb-1 text-center text-xs text-white/40">Tap anywhere to continue</p>
        </div>

        <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-3 bg-gradient-to-b from-black/20 to-transparent px-4 pb-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <a href={voiceHref} aria-label="Back to interviewer voices" className="grid size-9 shrink-0 place-items-center rounded-full bg-black/30 text-white backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
            <ArrowLeft aria-hidden="true" className="size-4" />
          </a>
          <div className="min-w-0 text-center">
            <p className="truncate text-sm font-semibold leading-5">{session.title}</p>
            <p className="text-xs leading-4 text-white/70">
              {session.timer} · {session.interviewer.label}
            </p>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-black/30 backdrop-blur-sm" aria-hidden="true">
            <SignalStrength label={session.signalLabel} />
          </span>
        </div>

        <DraggableCandidatePiP name={session.candidate.name} imageSrc={session.candidate.imageSrc} videoEnabled={videoEnabled} />

        {lowBalance && !sessionPaused ? (
          <div role="status" className="fixed inset-x-4 top-20 z-20 flex items-center justify-between gap-3 rounded-lg bg-warning-surface px-4 py-2.5 text-sm text-warning shadow-panel">
            <span>Running low on balance</span>
            <button type="button" onClick={(event) => { event.stopPropagation(); setTopUpOpen(true) }} className="shrink-0 font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              Add funds
            </button>
          </div>
        ) : null}
        {sessionPaused ? (
          <div role="status" className="fixed inset-x-4 top-20 z-20 flex items-center justify-between gap-3 rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-on-danger shadow-panel">
            <span>Session paused</span>
            <button type="button" onClick={(event) => { event.stopPropagation(); setTopUpOpen(true) }} className="shrink-0 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              Add funds
            </button>
          </div>
        ) : null}

        <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-center gap-4 bg-gradient-to-t from-black/25 to-transparent px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-10">
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            aria-label="Session settings"
            className="grid size-14 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Settings aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setIsMuted((prev) => !prev)
            }}
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            aria-pressed={isMuted}
            className={cn(
              'grid size-14 place-items-center rounded-full backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
              isMuted ? 'bg-danger/90 text-on-danger hover:bg-danger' : 'bg-white/15 text-white hover:bg-white/25',
            )}
          >
            {isMuted ? <MicOff aria-hidden="true" className="size-5" /> : <Mic aria-hidden="true" className="size-5" />}
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setVideoEnabled((prev) => !prev)
            }}
            aria-label={videoEnabled ? 'Turn off video' : 'Turn on video'}
            aria-pressed={!videoEnabled}
            className={cn(
              'grid size-14 place-items-center rounded-full backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
              !videoEnabled ? 'bg-danger/90 text-on-danger hover:bg-danger' : 'bg-white/15 text-white hover:bg-white/25',
            )}
          >
            {videoEnabled ? <Video aria-hidden="true" className="size-5" /> : <VideoOff aria-hidden="true" className="size-5" />}
          </button>
          <a
            href={completeHref}
            aria-label="End session"
            className="grid size-14 place-items-center rounded-full bg-danger text-on-danger shadow-lg transition-colors hover:bg-danger/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <PhoneOff aria-hidden="true" className="size-5" />
          </a>
        </div>

        <InterviewLiveSettingsModal
          open={showSettings}
          onOpenChange={setShowSettings}
          settingsTab={settingsTab}
          setSettingsTab={setSettingsTab}
          autoScroll={autoScroll}
          setAutoScroll={setAutoScroll}
          scrollSpeed={scrollSpeed}
          setScrollSpeed={setScrollSpeed}
          fontSize={fontSize}
          setFontSize={setFontSize}
          sessionTitle={session.title}
        />
        <AddFundsDialog
          open={topUpOpen}
          onOpenChange={setTopUpOpen}
          currentBalance={Math.ceil(centsToCredits(balanceCents))}
          quickAmounts={QUICK_TOPUP_CREDITS}
          formatAmount={formatCreditAmountWithUsd}
          onAddFunds={handleAddFunds}
          description="You're out of balance for this session. Add funds to keep going — your session will resume right where you left off."
        />
      </main>
    )
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[var(--lf-live-canvas)] text-brand-bar-text">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[var(--lf-live-border)] bg-[var(--lf-live-header)] px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <a href={voiceHref} aria-label="Back to interviewer voices" className="grid size-7 shrink-0 place-items-center rounded-soft text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <ArrowLeft aria-hidden="true" className="size-4" />
          </a>
          <h1 className="truncate text-sm font-medium leading-5">{session.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium leading-5 text-ink-muted">{session.timer}</span>
          <a href={completeHref} className="inline-flex min-h-9 items-center justify-center rounded-lg bg-danger px-4 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            End Session
          </a>
        </div>
      </header>
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--lf-live-border)] bg-[var(--lf-live-strip)] px-5 py-1">
        <div className="flex items-center gap-4">
          <SignalStrength label={session.signalLabel} />
          <span className="text-sm font-medium leading-5 text-positive">{session.signalLabel}</span>
          <span className="text-sm italic leading-5 text-ink-muted">{session.activityLabel}</span>
        </div>
        <button type="button" onClick={() => setShowSettings(true)} className="min-h-8 items-center gap-3 rounded-soft px-2 text-sm font-medium text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:inline-flex">
          <Settings aria-hidden="true" className="size-4" />
          Settings
        </button>
      </div>
      {lowBalance && !sessionPaused ? (
        <div role="status" className="flex shrink-0 items-center justify-between gap-3 border-b border-warning bg-warning-surface px-5 py-2 text-sm text-warning">
          <span>Running low on balance.</span>
          <button type="button" onClick={() => setTopUpOpen(true)} className="shrink-0 font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            Add funds
          </button>
        </div>
      ) : null}
      {sessionPaused ? (
        <div role="status" className="flex shrink-0 items-center justify-between gap-3 border-b border-danger bg-danger px-5 py-2 text-sm font-semibold text-on-danger">
          <span>Session paused — you&apos;re out of balance.</span>
          <button type="button" onClick={() => setTopUpOpen(true)} className="shrink-0 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            Add funds to continue
          </button>
        </div>
      ) : null}
      <section className="flex min-h-0 flex-1 flex-col gap-3 p-3 xl:flex-row">
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-panel border border-[var(--lf-live-border)] bg-[var(--lf-live-panel)]">
          <div className="flex shrink-0 items-center justify-between border-b border-[var(--lf-live-border)] px-4 py-3">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold leading-5">
              Live Simulator
              <span className="size-2 rounded-pill bg-danger" />
            </h2>
          </div>
          <div
            className={cn('flex min-h-0 flex-1 items-center justify-center p-5', phase !== 'done' && 'cursor-pointer')}
            onClick={phase === 'done' ? undefined : advanceSession}
          >
            <div className="grid w-fit justify-center gap-6 sm:grid-cols-2">
              <ParticipantCard participant={session.interviewer} active={isSpeaking} />
              <ParticipantCard participant={session.candidate} active={phase === 'answering'} />
            </div>
          </div>
        </section>
        <aside className="flex min-h-0 flex-1 flex-col rounded-panel border border-[var(--lf-live-border)] bg-[var(--lf-live-panel)] xl:w-[28.5rem] xl:flex-none">
          <div className="flex shrink-0 items-center justify-between border-b border-[var(--lf-live-border)] px-4 py-3">
            <h2 className="text-sm font-medium leading-5">Transcript</h2>
          </div>
          <div ref={chatRef} className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-7">
            <div className="grid auto-rows-min gap-3">
              {transcript.length === 0 ? (
                <p className="text-sm leading-6 text-ink-muted">
                  Your interviewer's questions and a log of your answers will appear here as the session runs — press Space (or tap the interviewer) to begin.
                </p>
              ) : (
                transcript.map((turn) => (
                  <article
                    key={turn.id}
                    className={cn(
                      'max-w-[16.75rem] overflow-hidden text-sm leading-[22.75px] text-brand-bar-text shadow-control',
                      turn.speaker === 'candidate' ? 'ms-auto rounded-bl-[16px] rounded-br-sm rounded-tl-[16px] rounded-tr-[16px] bg-accent' : 'rounded-bl-sm rounded-br-[16px] rounded-tl-[16px] rounded-tr-[16px] bg-[var(--lf-live-message)]',
                    )}
                  >
                    <p className="px-3.5 py-2.5">{turn.text}</p>
                  </article>
                ))
              )}
              {phase === 'answering' ? (
                <div className="ms-auto flex items-center gap-1.5 rounded-bl-[16px] rounded-br-sm rounded-tl-[16px] rounded-tr-[16px] bg-accent/40 px-3.5 py-2.5" role="status" aria-label="Recording your answer">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="size-1.5 animate-bounce rounded-pill bg-brand-bar-text motion-reduce:animate-none" style={{ animationDelay: `${i * 0.12}s` }} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      </section>

      <InterviewLiveSettingsModal
        open={showSettings}
        onOpenChange={setShowSettings}
        settingsTab={settingsTab}
        setSettingsTab={setSettingsTab}
        autoScroll={autoScroll}
        setAutoScroll={setAutoScroll}
        scrollSpeed={scrollSpeed}
        setScrollSpeed={setScrollSpeed}
        fontSize={fontSize}
        setFontSize={setFontSize}
        sessionTitle={session.title}
      />
      <AddFundsDialog
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        currentBalance={Math.ceil(centsToCredits(balanceCents))}
        quickAmounts={QUICK_TOPUP_CREDITS}
        formatAmount={formatCreditAmountWithUsd}
        onAddFunds={handleAddFunds}
        description="You're out of balance for this session. Add funds to keep going — your session will resume right where you left off."
      />
    </main>
  )
}

export function InterviewCompleteView({ homeHref, sessionHref, preparingReportHref, companyName }: InterviewCompleteViewProps) {
  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="Interview Prep" />
      <section className="px-4 py-12">
        <form className="mx-auto w-full max-w-xl border border-border bg-surface shadow-control">
          <div className="grid gap-5 px-8 py-10 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-positive-surface text-positive">
              <Check aria-hidden="true" className="size-8" />
            </span>
            <h1 className="text-2xl font-bold leading-8">Your Interview is complete!</h1>
            <p className="mx-auto max-w-md text-sm leading-6 text-ink-muted">
              Thank you for completing your AI interview{companyName ? ` with ${companyName}` : ''}.
            </p>
            <p className="mx-auto max-w-md rounded-panel bg-surface-subtle px-5 py-5 text-sm leading-6 text-ink-muted">
              Your responses have been recorded and evaluated by Lightforth AI. Review the coaching report for your strengths, gaps, transcript, and next practice step.
            </p>
          </div>
          <FooterActions backHref={sessionHref} continueHref={preparingReportHref} continueLabel="See Report" />
        </form>
      </section>
    </Workspace>
  )
}

export function InterviewPreparingReportView({ homeHref, steps, onComplete }: InterviewPreparingReportViewProps) {
  type StepStatus = InterviewReportStep['status']
  const [statusById, setStatusById] = useState<Record<string, StepStatus>>(() => {
    const initial: Record<string, StepStatus> = {}
    steps.forEach((step, index) => {
      initial[step.id] = index === 0 ? 'active' : 'pending'
    })
    return initial
  })
  const [showSkeleton, setShowSkeleton] = useState(false)

  useEffect(() => {
    let cancelled = false
    const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

    async function run() {
      for (let i = 0; i < steps.length; i++) {
        await wait(900)
        if (cancelled) return
        setStatusById((prev) => {
          const next = { ...prev, [steps[i].id]: 'complete' as StepStatus }
          const upcoming = steps[i + 1]
          if (upcoming) next[upcoming.id] = 'active'
          return next
        })
      }
      await wait(400)
      if (cancelled) return
      setShowSkeleton(true)
      await wait(1600)
      if (cancelled) return
      onComplete?.()
    }

    void run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="Interview Prep" />
      <section className="px-4 py-12">
        <div className="mx-auto w-full max-w-lg border border-border bg-surface shadow-control">
          <div className="flex items-center justify-center gap-2 border-b border-border px-8 py-8">
            <h1 className="text-xl font-medium">Preparing your coaching report...</h1>
            <span className="text-sm text-ink-muted">1/2</span>
          </div>
          <div className="grid gap-4 p-8">
            <div className="grid gap-4">
              {steps.map((step) => {
                const status = statusById[step.id] ?? step.status
                return (
                  <div key={step.id} className="flex items-center gap-3">
                    <span className={cn('grid size-8 place-items-center rounded-full transition-colors duration-normal ease-default', status === 'complete' ? 'bg-positive text-on-accent' : status === 'active' ? 'bg-accent-subtle text-accent-text' : 'bg-surface-subtle text-ink-muted')}>
                      {status === 'complete' ? (
                        <Check aria-hidden="true" className="size-4" />
                      ) : (
                        <span className={cn('size-2.5 rounded-full', status === 'active' ? 'bg-accent animate-pulse motion-reduce:animate-none' : 'bg-muted')} />
                      )}
                    </span>
                    <span className={cn('text-sm font-semibold transition-colors duration-normal ease-default', status === 'pending' && 'text-ink-muted')}>{step.label}</span>
                  </div>
                )
              })}
            </div>
            {showSkeleton ? (
              <div className="mt-2 grid gap-3" role="status" aria-label="Loading your coaching report">
                <div className="h-20 animate-pulse rounded-panel bg-surface-subtle motion-reduce:animate-none" />
                <div className="h-28 animate-pulse rounded-panel bg-surface-subtle motion-reduce:animate-none" />
                <div className="h-16 animate-pulse rounded-panel bg-surface-subtle motion-reduce:animate-none" />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </Workspace>
  )
}

export function InterviewHistoryView({ homeHref, createHref, reportHref, rows }: InterviewHistoryViewProps) {
  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="History" />
      <section className="px-4 py-8 lg:px-12 xl:px-24">
        <DataTable
          title="Past Interview Practice"
          searchLabel="Search interview history"
          action={{ label: 'Create New', href: createHref }}
          rows={rows}
          itemLabel={(row) => row.title}
          selectable={false}
          className="mx-auto max-w-7xl"
          onRowClick={(row) => { window.location.href = `${reportHref}?id=${row.id}` }}
          columns={[
            { key: 'title', label: 'Title', className: 'w-[14rem]', render: (row) => <span className="font-medium">{row.title}</span> },
            {
              key: 'score',
              label: 'Score',
              className: 'w-[6rem]',
              render: (row) => <span className="rounded-pill bg-positive-surface px-2.5 py-0.5 text-xs font-bold leading-4 text-positive">{row.score}</span>,
            },
            { key: 'company', label: 'Company', className: 'w-[10rem]', render: (row) => row.company },
            { key: 'duration', label: 'Duration', className: 'w-[6rem]', render: (row) => row.duration },
            { key: 'date-time', label: 'Date & Time', className: 'w-[12rem]', render: (row) => row.dateTime },
          ]}
        />
      </section>
    </Workspace>
  )
}

function InterviewReportLoadingView({ homeHref }: { readonly homeHref: string }) {
  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="Interview Prep" />
      <div role="status" aria-label="Loading interview report" className="sr-only">
        Loading interview report
      </div>
      <section className="px-4 py-12">
        <article className="mx-auto min-h-[82rem] w-full max-w-[81.5rem] bg-surface px-8 py-12 shadow-panel sm:px-10 lg:px-12">
          <LoadingBar className="h-6 w-40" />
          <section className="mt-8 rounded-panel border border-border px-6 py-6 shadow-control lg:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <LoadingBar className="size-20 rounded-pill" />
                <div className="grid gap-3">
                  <LoadingBar className="h-8 w-96 max-w-[52vw]" />
                  <LoadingBar className="h-5 w-72 max-w-[45vw]" />
                </div>
              </div>
              <LoadingBar className="h-14 w-44" />
            </div>
          </section>
          <section className="mt-6 flex flex-col gap-6 rounded-panel border border-border px-6 py-6 shadow-control sm:flex-row sm:items-center lg:px-8">
            <LoadingBar className="size-32 rounded-pill" />
            <div className="grid flex-1 gap-4">
              <LoadingBar className="h-7 w-52" />
              <LoadingBar className="h-6 w-full" />
              <LoadingBar className="h-6 w-4/5" />
            </div>
          </section>
          <section className="mt-6 rounded-panel border border-border p-6 shadow-control lg:p-8">
            <LoadingBar className="h-8 w-72" />
            <div className="mt-8 grid gap-8">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="grid gap-3 border-t border-border pt-6 first:border-t-0 first:pt-0">
                  <LoadingBar className="h-6 w-48" />
                  <LoadingBar className="h-5 w-2/3" />
                  <LoadingBar className="h-3 w-full rounded-pill" />
                </div>
              ))}
            </div>
          </section>
          <section className="mt-6 rounded-panel border border-border p-6 shadow-control lg:p-8">
            <LoadingBar className="h-7 w-36" />
            <div className="mt-5 grid gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <LoadingBar key={index} className="h-24 w-full" />
              ))}
            </div>
          </section>
        </article>
      </section>
    </Workspace>
  )
}

const rubricToneClasses: Record<InterviewRubricStatus, string> = {
  strong: 'bg-positive-surface text-positive',
  partial: 'bg-warning-surface text-warning',
  'needs-work': 'bg-danger-surface text-danger',
}

const rubricLabel: Record<InterviewRubricStatus, string> = {
  strong: 'Strong',
  partial: 'Partial',
  'needs-work': 'Needs work',
}

type RubricSortColumn = 'status' | 'notes'
type RubricSort = { readonly column: RubricSortColumn; readonly direction: 'asc' | 'desc' }

export function InterviewReportView({ homeHref, scenariosHref, practiceHref, report, isLoading = false }: InterviewReportViewProps) {
  const [rubricSort, setRubricSort] = useState<RubricSort | null>(null)

  if (isLoading) {
    return <InterviewReportLoadingView homeHref={homeHref} />
  }

  const sortedRubric = rubricSort
    ? [...report.rubric].sort((a, b) => {
        const cmp = String(a[rubricSort.column]).localeCompare(String(b[rubricSort.column]))
        return rubricSort.direction === 'asc' ? cmp : -cmp
      })
    : report.rubric

  function toggleRubricSort(column: RubricSortColumn) {
    setRubricSort((prev) => {
      if (prev?.column !== column) return { column, direction: 'asc' }
      return prev.direction === 'asc' ? { column, direction: 'desc' } : null
    })
  }

  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="Interview Prep" historyHref={scenariosHref} />
      <section className="px-4 pb-16">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-4 pt-8">
          <article className="w-full bg-surface shadow-panel">
            <div className="flex min-h-[5rem] items-center border-b border-border px-8">
              <h1 className="text-xl font-medium leading-5 text-ink">Report</h1>
            </div>

            <div className="px-8 pt-6">
              <Tabs defaultValue="summary">
                <TabsList>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="details">Interview Details</TabsTrigger>
                  <TabsTrigger value="call">Call details</TabsTrigger>
                </TabsList>

                <TabsContent value="summary">
                  <div className="flex flex-col gap-6 pb-8">
                    <div className="flex flex-col gap-5 rounded-panel border border-border p-6 shadow-control sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <img src={report.interviewerImageSrc} alt="" className="size-16 rounded-full border-2 border-border object-cover shadow-control" />
                        <div>
                          <h2 className="text-2xl font-bold leading-8">{report.title}</h2>
                          <p className="mt-1 text-sm text-ink-muted">{report.subtitle}</p>
                        </div>
                      </div>
                      <a href={practiceHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                        <Play aria-hidden="true" className="size-4" />
                        Practice Again
                      </a>
                    </div>

                    <div className="flex flex-col items-start gap-6 rounded-panel border border-border p-6 shadow-control sm:flex-row sm:items-center">
                      <div className="grid size-28 shrink-0 place-items-center rounded-full border-8 border-positive/30 bg-positive-surface text-4xl font-black text-positive">
                        {report.score}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold leading-8">Summary</h2>
                        <p className="mt-2 text-base leading-7 text-ink-muted">{report.summary}</p>
                      </div>
                    </div>

                    <ScorecardSection title="What Went Well" items={report.whatWentWell} />
                    <ScorecardSection title="What Needs Work" items={report.whatNeedsWork} divider />
                    <ScorecardSection title="Knowledge Gaps" items={report.knowledgeGaps} divider />
                    <ScorecardSection title="Suggested Questions for Future Interviews" items={report.suggestedQuestions} divider />
                  </div>
                </TabsContent>

                <TabsContent value="details">
                  <div className="pb-8">
                    <RubricTable rows={sortedRubric} sort={rubricSort} onSort={toggleRubricSort} toneClasses={rubricToneClasses} label={rubricLabel} />
                  </div>
                </TabsContent>

                <TabsContent value="call">
                  <div className="flex flex-col gap-6 pb-8">
                    <div className="rounded-panel border border-border p-6 shadow-control lg:p-8">
                      <h3 className="text-lg font-bold leading-7">Call Recording</h3>
                      <div className="mt-4 flex min-h-16 items-center gap-4 rounded-panel border border-border bg-surface-subtle p-3">
                        <button type="button" aria-label="Play recording" className="grid size-12 place-items-center rounded-lg bg-accent text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                          <Play aria-hidden="true" className="size-5" />
                        </button>
                        <span className="font-mono text-base text-ink-muted">0:00</span>
                        <div className="h-1.5 flex-1 rounded-full bg-border">
                          <div className="h-full w-1/3 rounded-full bg-accent" />
                        </div>
                        <button type="button" aria-label="Pause recording" className="grid size-10 place-items-center rounded-lg text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                          <Pause aria-hidden="true" className="size-4" />
                        </button>
                      </div>
                    </div>

                    <div className="rounded-panel border border-border bg-surface p-4">
                      <div className="flex flex-col">
                        {report.transcript.map((entry, index) => (
                          <div key={entry.id} className={cn('flex flex-col gap-1', index > 0 && 'pt-3')}>
                            <div className="flex items-center gap-2">
                              <span className="rounded-soft bg-ink/10 px-1.5 py-0.5 text-xs font-medium text-ink">{entry.timestamp}</span>
                              <span className={cn('text-sm font-medium', entry.speaker === 'You' ? 'text-accent-text' : 'text-ink')}>{entry.speaker}</span>
                            </div>
                            <p className="text-base leading-7 text-ink">{entry.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </article>
        </div>
      </section>
    </Workspace>
  )
}

function RubricSortIcon({ column, sort }: { readonly column: RubricSortColumn; readonly sort: RubricSort | null }) {
  if (sort?.column !== column) return <ArrowUpDown aria-hidden="true" className="size-3 text-ink-muted" />
  return sort.direction === 'asc' ? (
    <ChevronUp aria-hidden="true" className="size-3 text-accent-text" />
  ) : (
    <ChevronDown aria-hidden="true" className="size-3 text-accent-text" />
  )
}

function RubricTable<TStatus extends string>({
  rows,
  sort,
  onSort,
  toneClasses,
  label,
}: {
  readonly rows: readonly { readonly element: string; readonly status: TStatus; readonly notes: string }[]
  readonly sort: RubricSort | null
  readonly onSort: (column: RubricSortColumn) => void
  readonly toneClasses: Record<string, string>
  readonly label: Record<string, string>
}) {
  function sortAria(column: RubricSortColumn): 'ascending' | 'descending' | 'none' {
    if (sort?.column !== column) return 'none'
    return sort.direction === 'asc' ? 'ascending' : 'descending'
  }

  return (
    <div className="overflow-x-auto rounded-panel border border-border shadow-control">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-subtle text-ink-muted">
            <th className="px-4 py-2.5 text-start font-semibold">Element</th>
            <th className="cursor-pointer select-none px-4 py-2.5 text-start font-semibold hover:bg-surface-subtle" aria-sort={sortAria('status')} onClick={() => onSort('status')}>
              <span className="inline-flex items-center gap-1">
                Status
                <RubricSortIcon column="status" sort={sort} />
              </span>
            </th>
            <th className="cursor-pointer select-none px-4 py-2.5 text-start font-semibold hover:bg-surface-subtle" aria-sort={sortAria('notes')} onClick={() => onSort('notes')}>
              <span className="inline-flex items-center gap-1">
                Notes
                <RubricSortIcon column="notes" sort={sort} />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.element} className="border-b border-border transition-colors hover:bg-surface-subtle last:border-0">
              <td className="px-4 py-2.5 font-medium text-ink">{row.element}</td>
              <td className="px-4 py-2.5">
                <Badge className={toneClasses[row.status]}>{label[row.status]}</Badge>
              </td>
              <td className="px-4 py-2.5 text-ink-muted">{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ScorecardSection({ title, items, divider = false }: { readonly title: string; readonly items: readonly string[]; readonly divider?: boolean }) {
  return (
    <section className={cn('flex flex-col gap-3', divider && 'border-t border-border-subtle pt-6')}>
      <h3 className="text-base font-bold text-ink">{title}</h3>
      <ul className="flex flex-col gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-ink-muted">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-muted" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
