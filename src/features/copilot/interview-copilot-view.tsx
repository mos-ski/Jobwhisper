import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode, type RefObject } from 'react'
import { ArrowLeft, ArrowUpDown, ChevronDown, ChevronRight, ChevronUp, Code2, FileText, MessageCircle, Pause, PhoneOff, Play, Plus, Send, Settings, Users, Video, VideoOff, X } from 'lucide-react'

import type { ContextDocumentRow } from '@/contracts/documents.draft'
import type { ResumeHistoryRow } from '@/contracts/resume.draft'
import { useCameraStream } from '@/hooks/useCameraStream'
import { useTypewriter } from '@/hooks/useTypewriter'
import { clearDefaultResumePreference, getDefaultResumePreference, setDefaultResumePreference } from '@/lib/resume-preference'
import type {
  CopilotCodingTurn,
  CopilotHistoryRow,
  CopilotLiveSession,
  CopilotMode,
  CopilotPermissionStep,
  CopilotReport,
  CopilotResponseLength,
  CopilotResponseMode,
  CopilotSetup,
  CopilotTalkTime,
  CopilotTranscriptTurn,
} from '@/contracts/copilot.draft'
import { centsToCredits, creditsToCents, formatCreditAmountWithUsd } from '@/lib/credits'
import {
  AddFundsDialog,
  AiSuggestionAction,
  Avatar,
  Badge,
  Button,
  Checkbox,
  cn,
  DataTable,
  Dialog,
  DialogClose,
  DialogPopup,
  DialogTitle,
  DocumentDropAction,
  ExampleResponseCard,
  FormChoiceGroup,
  FormField,
  FormPanel,
  FormPanelFooter,
  FormSelectField,
  FormTextArea,
  LightforthAiIcon,
  ListPickerDialog,
  PermissionSteps,
  ShellBar,
  SourcePicker,
  type SourcePickerOption,
  Tabs,
  TabsContent,
  TabsList,
  UploadedFileDialog,
  TabsTrigger,
} from '@/ui'

const copilotModeMeta: Record<
  CopilotMode,
  {
    readonly label: string
    readonly icon: ReactNode
    readonly panelTitle: string
    readonly badgeVariant: 'accent' | 'positive' | 'info'
    readonly createCta: string
    readonly sessionNoun: string
    readonly completeTitle: string
  }
> = {
  interview: { label: 'Interview', icon: <Users aria-hidden="true" className="size-4" />, panelTitle: 'Configure your interview', badgeVariant: 'accent', createCta: 'Start New Interview', sessionNoun: 'interview', completeTitle: 'Your interview is complete!' },
  coding: { label: 'Coding', icon: <Code2 aria-hidden="true" className="size-4" />, panelTitle: 'Configure your coding exercise', badgeVariant: 'info', createCta: 'Start Coding Exercise', sessionNoun: 'coding session', completeTitle: 'Your coding session is complete!' },
  meeting: { label: 'Meeting', icon: <Video aria-hidden="true" className="size-4" />, panelTitle: 'Set up your meeting', badgeVariant: 'positive', createCta: 'Attend New Meeting', sessionNoun: 'meeting', completeTitle: 'Your meeting is complete!' },
}

export type CopilotUploadViewProps = {
  readonly homeHref: string
  readonly configureHref: string
  readonly historyHref: string
  readonly mode: CopilotMode
  readonly uploadedFileName: string
  readonly savedResumes: readonly ResumeHistoryRow[]
}

export type CopilotConfigureViewProps = {
  readonly homeHref: string
  readonly uploadHref: string
  readonly preferencesHref: string
  readonly setup: CopilotSetup
  readonly knowledgeBaseDocuments: readonly ContextDocumentRow[]
}

export type CopilotPreferencesViewProps = {
  readonly homeHref: string
  readonly configureHref: string
  readonly shareHref: string
  readonly setup: CopilotSetup
}

export type CopilotPermissionViewProps = {
  readonly homeHref: string
  readonly backHref: string
  readonly nextHref: string
  readonly steps: readonly CopilotPermissionStep[]
  readonly previewSrc?: string
  readonly actionLabel: string
  readonly mode: CopilotMode
}

export type CopilotLiveViewProps = {
  readonly completeHref: string
  readonly session: CopilotLiveSession
  readonly isLoading?: boolean
  readonly transcriptBank?: readonly CopilotTranscriptTurn[]
  readonly codingBank?: readonly CopilotCodingTurn[]
}

export type CopilotCompleteViewProps = {
  readonly homeHref: string
  readonly sessionHref: string
  readonly historyHref: string
  readonly reportHref: string
  readonly mode: CopilotMode
  readonly companyName?: string
}

export type CopilotHistoryViewProps = {
  readonly homeHref: string
  readonly createHref: string
  readonly reportHref: string
  readonly rows: readonly CopilotHistoryRow[]
}

export type CopilotReportViewProps = {
  readonly homeHref: string
  readonly historyHref: string
  readonly report: CopilotReport
  readonly mode: CopilotMode
}

function CopilotHeader({
  homeHref,
  current = 'Interviews & Meetings',
  historyHref,
}: {
  readonly homeHref: string
  readonly current?: string
  readonly historyHref?: string
}) {
  return (
    <ShellBar
      homeHref={homeHref}
      current={current}
      parent={historyHref ? { label: 'History', href: historyHref } : undefined}
      closeHref={homeHref}
      closeLabel="Close interview copilot"
    />
  )
}

function Workspace({ children }: { readonly children: ReactNode }) {
  return <main className="min-h-screen bg-canvas text-ink">{children}</main>
}

function PaperShell({ children }: { readonly children: ReactNode }) {
  return <article className="mx-auto min-h-[56rem] w-full max-w-[44rem] bg-surface p-8 shadow-panel">{children}</article>
}

function FooterActions({ backHref, nextHref, nextLabel }: { readonly backHref: string; readonly nextHref: string; readonly nextLabel: string }) {
  return (
    <div className="flex items-center justify-between border-t border-border px-6 py-4">
      <a href={backHref} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back
      </a>
      <a href={nextHref} className="inline-flex min-h-11 min-w-36 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        {nextLabel}
      </a>
    </div>
  )
}

export function CopilotUploadView({ homeHref, configureHref, historyHref, mode, uploadedFileName, savedResumes }: CopilotUploadViewProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [useAsDefault, setUseAsDefault] = useState(() => getDefaultResumePreference() !== null)

  const uploadOption: SourcePickerOption =
    mode === 'interview'
      ? { label: 'Upload a Resume', hint: 'PDF, DOC, DOCX or TXT', onClick: () => setUploadDialogOpen(true) }
      : { label: mode === 'coding' ? 'Upload a Job Description' : 'Upload an Agenda', hint: 'PDF, DOC, DOCX or TXT', href: configureHref }

  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} current={copilotModeMeta[mode].label} />
      <section className="px-4 py-8 lg:py-10">
        <div className="mx-auto max-w-[44rem]">
          <PaperShell>
            <SourcePicker
              title={mode === 'interview' ? 'Upload a resume' : mode === 'coding' ? 'Upload a job description' : 'Upload meeting agenda'}
              options={
                mode === 'interview'
                  ? [uploadOption, { label: 'Use Lightforth Resume', icon: <LightforthAiIcon className="size-5" />, emphasis: 'strong', onClick: () => setPickerOpen(true) }]
                  : [uploadOption]
              }
              historyLink={{ label: 'View copilot history', href: historyHref }}
            />
          </PaperShell>
        </div>
      </section>

      {mode === 'interview' ? (
        <>
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
        </>
      ) : null}
    </Workspace>
  )
}

const COPILOT_AI_SUGGESTION =
  ' Ask the interviewer how success is measured in the first 90 days, and be ready to walk through one metric you personally moved.'

export function CopilotConfigureView({ homeHref, uploadHref, preferencesHref, setup, knowledgeBaseDocuments }: CopilotConfigureViewProps) {
  const mode = setup.mode
  const [additionalContext, setAdditionalContext] = useState(setup.additionalContext)
  const [selectedDocIds, setSelectedDocIds] = useState<ReadonlySet<string>>(new Set())
  const [pickerOpen, setPickerOpen] = useState(false)
  const [draftDocIds, setDraftDocIds] = useState<ReadonlySet<string>>(new Set())
  const selectedDocuments = knowledgeBaseDocuments.filter((doc) => selectedDocIds.has(doc.id))
  const { type, isTyping } = useTypewriter()

  function handleAiSuggestion() {
    const base = additionalContext
    type(COPILOT_AI_SUGGESTION, (partial) => setAdditionalContext(base + partial))
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
      <CopilotHeader homeHref={homeHref} current={copilotModeMeta[mode].label} />
      <section className="px-4 py-9">
        <FormPanel
          title={copilotModeMeta[mode].panelTitle}
          step={mode === 'coding' ? undefined : '1/3'}
          uploadedFile={
            mode !== 'coding'
              ? {
                  fileName: setup.uploadedFileName,
                  changeHref: uploadHref,
                  onChangeClick: () => clearDefaultResumePreference(),
                }
              : undefined
          }
          footer={<FormPanelFooter backHref={uploadHref} nextHref={preferencesHref} />}
        >
          {mode === 'interview' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <FormSelectField
                id="copilot-interview-type"
                label="Interview type"
                defaultValue={setup.interviewType.toLowerCase()}
                options={[
                  { label: 'Introductory', value: 'introductory' },
                  { label: 'Behavioral', value: 'behavioral' },
                  { label: 'Product case', value: 'product case' },
                ]}
              />
              <FormSelectField
                id="copilot-difficulty"
                label="Difficulty"
                defaultValue={setup.difficulty.toLowerCase()}
                options={[
                  { label: 'Easy', value: 'easy' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Hard', value: 'hard' },
                ]}
              />
              <FormField id="copilot-target-role" label="Target Role" placeholder="e.g. Senior Software Engineer" />
              <FormField id="copilot-company" label="Company Name" placeholder="e.g. Google, Meta" />
            </div>
          ) : mode === 'coding' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <FormSelectField
                id="copilot-coding-language"
                label="Language"
                defaultValue={setup.codingLanguage ?? 'javascript'}
                options={[
                  { label: 'JavaScript / TypeScript', value: 'javascript' },
                  { label: 'Python', value: 'python' },
                  { label: 'Java', value: 'java' },
                  { label: 'PHP', value: 'php' },
                  { label: 'Go', value: 'go' },
                  { label: 'C++', value: 'c++' },
                  { label: 'C#', value: 'csharp' },
                  { label: 'Ruby', value: 'ruby' },
                  { label: 'Swift', value: 'swift' },
                  { label: 'Rust', value: 'rust' },
                ]}
                className="sm:col-span-full"
              />
              <FormField id="copilot-target-role-coding" label="Target Role" placeholder="e.g. Full Stack Developer" />
              <FormField id="copilot-company-coding" label="Company Name" placeholder="e.g. Stripe, Netflix" />
            </div>
          ) : (
            <div className="grid gap-3">
              <FormField id="copilot-meeting-title" label="Meeting title" placeholder="e.g. Q3 Planning Review" />
              <FormField id="copilot-meeting-company" label="Client / Team" placeholder="e.g. Product Team" />
            </div>
          )}
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
            id="copilot-additional-context"
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
          <p className="mt-1 text-sm text-ink-muted">Select the documents you want Copilot to use as context for this session.</p>
          <div className="mt-4 rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-accent transition-colors">
            <input
              type="file"
              id="doc-upload"
              className="sr-only"
              accept=".pdf,.doc,.docx,.txt"
              onChange={() => {}}
            />
            <label htmlFor="doc-upload" className="cursor-pointer">
              <Plus aria-hidden="true" className="mx-auto size-6 text-ink-muted" />
              <p className="mt-2 text-sm font-medium text-ink">Upload a new document</p>
              <p className="mt-1 text-xs text-ink-muted">PDF, DOC, DOCX or TXT</p>
            </label>
          </div>
          <div className="mt-4 grid max-h-60 gap-1 overflow-y-auto">
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

const RESPONSE_MODE_EXAMPLES: Record<CopilotResponseMode, { readonly helperText: string; readonly example: ReactNode }> = {
  default: {
    helperText: 'Best for candidates who want a direct, no-frills answer',
    example: (
      <>
        "I redesigned a <strong>vehicle maintenance app</strong> that had low engagement. Led a team to identify pain points,
        improved UI, and introduced a personalized dashboard. <strong>Engagement increased by 30% in 3 months</strong>, and
        customer satisfaction improved significantly."
      </>
    ),
  },
  headlines: {
    helperText: 'Best for candidates who want the key points, not a full script',
    example: (
      <>
        • <strong>Situation:</strong> vehicle maintenance app, low engagement
        <br />• <strong>Action:</strong> led team, identified pain points, redesigned UI
        <br />• <strong>Result:</strong> <strong>+30% engagement in 3 months</strong>
      </>
    ),
  },
  coaching: {
    helperText: 'Best for candidates who want guidance on how to answer, not the answer itself',
    example: (
      <>
        Lead with the outcome — mention the <strong>30% engagement lift</strong> first, then walk back through what you
        changed. Keep the redesign details brief; the interviewer is listening for impact, not implementation.
      </>
    ),
  },
}

export function CopilotPreferencesView({ homeHref, configureHref, shareHref, setup }: CopilotPreferencesViewProps) {
  const [responseMode, setResponseMode] = useState(setup.responseMode)
  const [responseLength, setResponseLength] = useState(setup.responseLength)
  const activeExample = RESPONSE_MODE_EXAMPLES[responseMode]

  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} current={copilotModeMeta[setup.mode].label} />
      <section className="px-4 py-9">
        <FormPanel
          title="Set Preference"
          step="2/3"
          footer={<FormPanelFooter backHref={configureHref} nextHref={shareHref} />}
        >
            <FormChoiceGroup<CopilotResponseMode>
              label="Select Response Type"
              name="copilot-response-type"
              options={[
                { label: 'Default', value: 'default' },
                { label: 'Headlines', value: 'headlines' },
                { label: 'Coaching', value: 'coaching' },
              ]}
              selected={responseMode}
              onSelectedChange={setResponseMode}
            />
            <ExampleResponseCard helperText={activeExample.helperText}>{activeExample.example}</ExampleResponseCard>
            <FormChoiceGroup<CopilotResponseLength>
              label="Select Response Length"
              name="copilot-response-length"
              options={[
                { label: 'Short', value: 'short' },
                { label: 'Medium', value: 'medium' },
                { label: 'Long', value: 'long' },
              ]}
              selected={responseLength}
              onSelectedChange={setResponseLength}
            />
        </FormPanel>
      </section>
    </Workspace>
  )
}

export function CopilotPermissionView({ homeHref, backHref, nextHref, steps, previewSrc, actionLabel, mode }: CopilotPermissionViewProps) {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 1279px)').matches)
  const { stream: videoStream, request: requestVideo } = useCameraStream()
  const { request: requestAudio } = useCameraStream()
  const [grantedIds, setGrantedIds] = useState<ReadonlySet<string>>(new Set())
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [errorId, setErrorId] = useState<string | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1279px)')
    const handler = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (isMobile && previewSrc) {
      void requestVideo({ video: true }).then((granted) => {
        if (granted) setGrantedIds((prev) => new Set(prev).add('video'))
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, previewSrc])

  async function handleRequestPermission(stepId: string) {
    setErrorId(null)
    setPendingId(stepId)
    const granted = stepId === 'video' ? await requestVideo({ video: true }) : await requestAudio({ audio: true })
    setPendingId(null)
    if (granted) {
      setGrantedIds((prev) => new Set(prev).add(stepId))
    } else {
      setErrorId(stepId)
    }
  }

  const permissionSteps = steps
    .map((step) => {
      if (isMobile && step.id === 'screen') {
        return { ...step, id: 'video', title: 'Turn on your video', description: 'Required - shows your camera during the call', actionLabel: 'Turn on Video' }
      }
      if (isMobile && step.id === 'microphone') {
        return { ...step, title: 'Connect your audio', description: 'Required - connects to your call audio', actionLabel: 'Connect Audio' }
      }
      return step
    })
    .map((step, index, mapped) => {
      if (!isMobile || step.status !== 'disabled') return step
      const previous = mapped[index - 1]
      return previous && grantedIds.has(previous.id) ? { ...step, status: 'available' as const } : step
    })

  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} current={copilotModeMeta[mode].label} />
      <section className="px-4 py-9">
        <FormPanel
          title={previewSrc ? "You're all set" : isMobile ? 'Turn on video & audio' : 'Share your screen'}
          step="3/3"
          footer={previewSrc ? undefined : <FormPanelFooter backHref={backHref} nextHref={nextHref} />}
        >
          <PermissionSteps
            steps={permissionSteps}
            actionHref={nextHref}
            previewSrc={previewSrc ?? undefined}
            startHref={previewSrc ? nextHref : undefined}
            startLabel={actionLabel}
            onRequestPermission={isMobile ? handleRequestPermission : undefined}
            pendingStepId={pendingId}
            grantedStepIds={grantedIds}
            errorStepId={errorId}
            videoStepId="video"
            videoStream={videoStream}
          />
          {previewSrc ? (
            <p className="mt-4 text-xs leading-5 text-ink-muted">
              Lightforth listens to your shared screen and audio only while the session is live, and keeps a transcript so you
              can review it afterward. Nothing is recorded once you end the session. You'll only be charged for the time
              you're in session.
            </p>
          ) : null}
        </FormPanel>
      </section>
    </Workspace>
  )
}

function DraggableAvatar({ name, videoEnabled }: { readonly name: string; readonly videoEnabled: boolean }) {
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
      aria-label={`${name} camera preview, drag to reposition`}
      onPointerDown={handlePointerDown}
      onClick={(event) => {
        if (draggedRef.current) event.preventDefault()
      }}
      className="fixed z-20 size-24 cursor-grab touch-none overflow-hidden rounded-full shadow-xl ring-2 ring-white/40 transition-shadow active:cursor-grabbing active:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
      style={pos ? { left: pos.x, top: pos.y } : { top: '5.5rem', right: '1rem' }}
    >
      {stream ? (
        <video ref={videoRef} autoPlay muted playsInline className="size-full scale-x-[-1] object-cover" />
      ) : (
        <Avatar name={name} size="xl" className="size-full text-2xl" />
      )}
    </button>
  )
}

type AiAssistantMessage = { readonly id: string; readonly role: 'user' | 'assistant'; readonly text: string }

function CopilotAiAssistantPanel({
  prompts,
  messages,
  setMessages,
  draft,
  setDraft,
  onSend,
  scrollRef,
  className,
}: {
  readonly prompts: readonly string[]
  readonly messages: readonly AiAssistantMessage[]
  readonly setMessages: (updater: (prev: readonly AiAssistantMessage[]) => readonly AiAssistantMessage[]) => void
  readonly draft: string
  readonly setDraft: (value: string) => void
  readonly onSend: () => void
  readonly scrollRef: RefObject<HTMLDivElement>
  readonly className?: string
}) {
  return (
    <div className={cn('grid min-h-0 grid-rows-[1fr_auto]', className)}>
      <div ref={scrollRef} className="flex min-h-0 flex-col gap-2.5 overflow-y-auto px-4 py-3">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col justify-end gap-1.5">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  const userMsg: AiAssistantMessage = { id: `aam-${Date.now()}`, role: 'user', text: prompt }
                  setMessages((prev) => [...prev, userMsg])
                  const aiMsg: AiAssistantMessage = { id: `aam-${Date.now()}-ai`, role: 'assistant', text: copilotResponseFor(prompt) }
                  setMessages((prev) => [...prev, aiMsg])
                }}
                className="inline-flex min-h-[27px] items-center gap-1 rounded-[3px] border border-[var(--lf-live-control-border)] px-2.5 py-1 text-start text-[10px] font-medium leading-[15px] text-brand-bar-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <ChevronRight aria-hidden="true" className="size-2.5" />
                <span className="truncate">{prompt}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed',
                  msg.role === 'user'
                    ? 'ms-auto rounded-ee-sm bg-[var(--lf-live-control-border)] text-brand-bar-text'
                    : 'rounded-ss-sm bg-[var(--lf-live-message)] text-brand-bar-text'
                )}
              >
                {msg.text}
              </div>
            ))}
          </>
        )}
      </div>
      <label className="border-t border-[var(--lf-live-border)] p-3">
        <span className="sr-only">Ask AI anything</span>
        <span className="flex min-h-11 items-center gap-2 rounded-lg border border-[var(--lf-live-border)] bg-[var(--lf-live-header)] px-3 py-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                onSend()
              }
            }}
            className="min-w-0 flex-1 bg-transparent text-sm text-brand-bar-text outline-none placeholder:text-ink-muted"
            placeholder="Ask AI anything..."
          />
          <button type="button" onClick={onSend} aria-label="Send question">
            <Send aria-hidden="true" className="size-4 text-ink-muted" />
          </button>
        </span>
      </label>
    </div>
  )
}

function CopilotLiveSettingsModal({
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
  responseMode,
  setResponseMode,
  sessionTitle,
  mode,
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
  readonly responseMode: 'auto' | 'manual'
  readonly setResponseMode: (mode: 'auto' | 'manual') => void
  readonly sessionTitle: string
  readonly mode: CopilotMode
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
        <div className="mt-4 flex max-h-[65vh] flex-col gap-4 overflow-y-auto sm:max-h-[26rem] sm:flex-row sm:gap-0">
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
                    <p className="mt-0.5 text-xs text-slate-400">Follows the latest answer; scroll up to pause</p>
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
                <div>
                  <p className="text-sm font-semibold">Response</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex rounded-lg border border-white/20">
                      <button
                        type="button"
                        onClick={() => setResponseMode('auto')}
                        className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-colors', responseMode === 'auto' ? 'bg-[#3b82f6] text-white' : 'text-slate-400 hover:text-white')}
                      >
                        Auto
                      </button>
                      <button
                        type="button"
                        onClick={() => setResponseMode('manual')}
                        className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-colors', responseMode === 'manual' ? 'bg-[#3b82f6] text-white' : 'text-slate-400 hover:text-white')}
                      >
                        Manual
                      </button>
                    </div>
                    <span className="text-xs text-slate-400">{responseMode === 'auto' ? 'Answers automatically' : 'Press Space to answer'}</span>
                  </div>
                </div>
                {responseMode === 'manual' ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Response key</p>
                      <p className="mt-0.5 text-xs text-slate-400">Press this key to get an answer</p>
                    </div>
                    <span className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium">Space</span>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Role</span>
                  <span className="text-sm font-semibold">{sessionTitle}</span>
                </div>
                {mode === 'interview' ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Resume</span>
                    <span className="text-sm font-semibold">Lightforth Resume</span>
                  </div>
                ) : null}
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

function CopilotLiveLoadingBar({ className }: { readonly className?: string }) {
  return <span aria-hidden="true" className={cn('block animate-pulse rounded-lg bg-[var(--lf-live-message)] motion-reduce:animate-none', className)} />
}

function LiveSignal({ label }: { readonly label: string }) {
  return (
    <span className="inline-flex items-end gap-1 text-positive" aria-label={label}>
      <span aria-hidden="true" className="h-1.5 w-1 rounded-soft bg-positive" />
      <span aria-hidden="true" className="h-2 w-1 rounded-soft bg-positive" />
      <span aria-hidden="true" className="h-3 w-1 rounded-soft bg-positive" />
      <span aria-hidden="true" className="h-4 w-1 rounded-soft bg-positive" />
    </span>
  )
}

function CopilotLiveLoadingView() {
  return (
    <main className="min-h-screen bg-[var(--lf-live-workspace)] text-brand-bar-text">
      <div role="status" aria-label="Loading copilot session" className="sr-only">
        Loading copilot session
      </div>
      <header className="flex min-h-[57px] items-center justify-between border-b border-[var(--lf-live-divider)] bg-[var(--lf-live-header)] px-5 py-3">
        <CopilotLiveLoadingBar className="h-5 w-56 max-w-[50vw]" />
        <div className="flex items-center gap-4">
          <CopilotLiveLoadingBar className="h-5 w-14" />
          <CopilotLiveLoadingBar className="h-9 w-28" />
        </div>
      </header>
      <div className="flex min-h-10 items-center justify-between border-b border-[var(--lf-live-divider)] bg-[var(--lf-live-strip)] px-5">
        <CopilotLiveLoadingBar className="h-5 w-36" />
        <CopilotLiveLoadingBar className="h-5 w-24" />
      </div>
      <section className="grid gap-3 overflow-hidden p-3 xl:h-[calc(100vh-6.0625rem)] xl:grid-cols-[minmax(0,1fr)_6px_28.5rem]">
        <article className="min-h-[38rem] overflow-hidden rounded-panel border border-[var(--lf-live-border)] bg-[var(--lf-live-panel)]">
          <div className="flex min-h-[57px] items-center border-b border-[var(--lf-live-border)] px-4 py-3">
            <CopilotLiveLoadingBar className="h-5 w-32" />
          </div>
          <div className="grid min-h-[32rem] place-items-center p-5 xl:h-[calc(100vh-12.4375rem)]">
            <CopilotLiveLoadingBar className="h-16 w-64" />
          </div>
        </article>
        <div className="hidden h-full bg-[var(--lf-live-divider)] xl:block" />
        <aside className="grid min-h-[42rem] gap-3 xl:min-h-0 xl:grid-rows-[auto_6px_minmax(0,1fr)]">
          <section className="overflow-hidden rounded-panel bg-[var(--lf-live-panel)]">
            <CopilotLiveLoadingBar className="h-[24rem] w-full rounded-none" />
          </section>
          <div className="hidden h-1.5 bg-[var(--lf-live-divider)] xl:block" />
          <section className="grid min-h-0 grid-rows-[auto_1fr_auto] rounded-panel border border-[var(--lf-live-border)] bg-[var(--lf-live-panel)]">
            <div className="border-b border-[var(--lf-live-border)] px-4 py-3">
              <CopilotLiveLoadingBar className="h-5 w-28" />
            </div>
            <div className="mt-auto grid gap-1.5 p-4">
              {Array.from({ length: 4 }, (_, index) => (
                <CopilotLiveLoadingBar key={index} className="h-7 w-full rounded-sm" />
              ))}
            </div>
            <div className="border-t border-[var(--lf-live-border)] p-3">
              <CopilotLiveLoadingBar className="h-11 w-full" />
            </div>
          </section>
        </aside>
      </section>
    </main>
  )
}

const copilotRubricToneClasses: Record<string, string> = {
  strong: 'bg-positive-surface text-positive',
  partial: 'bg-warning-surface text-warning',
  'needs-work': 'bg-danger-surface text-danger',
}

const copilotRubricLabel: Record<string, string> = {
  strong: 'Strong',
  partial: 'Partial',
  'needs-work': 'Needs work',
}

function CopilotScorecardSection({ title, items, divider = false }: { readonly title: string; readonly items: readonly string[]; readonly divider?: boolean }) {
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

type RubricSortColumn = 'status' | 'notes'
type RubricSort = { readonly column: RubricSortColumn; readonly direction: 'asc' | 'desc' }

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

const COPILOT_REPORT_LABELS: Record<
  CopilotMode,
  { readonly detailsTab: string; readonly suggestedHeading: string; readonly recordingTab: string; readonly recordingHeading: string }
> = {
  interview: { detailsTab: 'Interview Details', suggestedHeading: 'Suggested Questions for Future Sessions', recordingTab: 'Call details', recordingHeading: 'Call Recording' },
  coding: { detailsTab: 'Code Review', suggestedHeading: 'Practice Suggestions', recordingTab: 'Recording', recordingHeading: 'Session Recording' },
  meeting: { detailsTab: 'Meeting Notes', suggestedHeading: 'Suggested Follow-ups', recordingTab: 'Call details', recordingHeading: 'Call Recording' },
}

function CopilotTalkTimeCard({ talkTime }: { readonly talkTime: CopilotTalkTime }) {
  return (
    <div className="rounded-panel border border-border p-6 shadow-control">
      <h3 className="text-lg font-bold leading-7">Talk Time</h3>
      <div className="mt-4 flex h-3 overflow-hidden rounded-pill bg-surface-subtle">
        <div className="bg-accent" style={{ inlineSize: `${talkTime.userPercent}%` }} />
        <div className="bg-border" style={{ inlineSize: `${talkTime.otherPercent}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs font-medium text-ink-muted">
        <span>You — {talkTime.userPercent}%</span>
        <span>{talkTime.otherLabel} — {talkTime.otherPercent}%</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink-muted">{talkTime.tip}</p>
    </div>
  )
}

export function CopilotReportView({ homeHref, historyHref, report, mode }: CopilotReportViewProps) {
  const [rubricSort, setRubricSort] = useState<RubricSort | null>(null)
  const reportLabels = COPILOT_REPORT_LABELS[mode]
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
      <CopilotHeader homeHref={homeHref} current={copilotModeMeta[mode].label} historyHref={historyHref} />
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
                  <TabsTrigger value="details">{reportLabels.detailsTab}</TabsTrigger>
                  <TabsTrigger value="call">{reportLabels.recordingTab}</TabsTrigger>
                </TabsList>

                <TabsContent value="summary">
                  <div className="flex flex-col gap-6 pb-8">
                    <div className="flex flex-col items-start gap-6 rounded-panel border border-border p-6 shadow-control sm:flex-row sm:items-center">
                      <div className="grid size-28 shrink-0 place-items-center rounded-full border-8 border-positive/30 bg-positive-surface text-4xl font-black text-positive">
                        {report.score}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold leading-8">Summary</h2>
                        <p className="mt-2 text-base leading-7 text-ink-muted">{report.summary}</p>
                      </div>
                    </div>

                    <CopilotTalkTimeCard talkTime={report.talkTime} />

                    <CopilotScorecardSection title="What Went Well" items={report.whatWentWell} />
                    <CopilotScorecardSection title="What Needs Work" items={report.whatNeedsWork} divider />
                    <CopilotScorecardSection title="Knowledge Gaps" items={report.knowledgeGaps} divider />
                    <CopilotScorecardSection title={reportLabels.suggestedHeading} items={report.suggestedQuestions} divider />
                  </div>
                </TabsContent>

                <TabsContent value="details">
                  <div className="pb-8">
                    <RubricTable rows={sortedRubric} sort={rubricSort} onSort={toggleRubricSort} toneClasses={copilotRubricToneClasses} label={copilotRubricLabel} />
                  </div>
                </TabsContent>

                <TabsContent value="call">
                  <div className="flex flex-col gap-6 pb-8">
                    <div className="rounded-panel border border-border p-6 shadow-control lg:p-8">
                      <h3 className="text-lg font-bold leading-7">{reportLabels.recordingHeading}</h3>
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
                              <span className={cn('text-sm font-medium', entry.isUser ? 'text-accent-text' : 'text-ink')}>{entry.speaker}</span>
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

const COPILOT_PROMPT_RESPONSES: Record<string, string> = {
  'Summarize the discussion so far':
    "So far the interviewer has asked about your background and your approach to a recent design decision. You've covered the vehicle maintenance app redesign, citing the 30% engagement lift.",
  'How well am I doing so far?':
    "You're doing well — your answers are specific and metric-driven. Consider slowing down slightly on the first sentence of each answer so the interviewer can follow the setup before the result.",
  'Suggest follow-up questions':
    'Try asking: "What does success look like for this role in the first 90 days?" or "How does the design team collaborate with engineering here?"',
  'What was discussed in the last two minutes?':
    'The conversation covered your experience leading cross-functional design reviews and how you handle conflicting stakeholder feedback.',
}

function copilotResponseFor(prompt: string): string {
  return (
    COPILOT_PROMPT_RESPONSES[prompt] ??
    `Lightforth is analyzing "${prompt}" against the live transcript and will surface a response shortly.`
  )
}

const SPEAKER_ACCENTS = ['text-accent', 'text-positive', 'text-warning', 'text-danger'] as const
const SPEAKER_DOT_ACCENTS = ['bg-accent', 'bg-positive', 'bg-warning', 'bg-danger'] as const

function speakerAccentIndex(speaker: string): number {
  let hash = 0
  for (let i = 0; i < speaker.length; i++) hash = (hash * 31 + speaker.charCodeAt(i)) >>> 0
  return hash % SPEAKER_ACCENTS.length
}

function TranscriptBubble({
  speaker,
  text,
  kind,
  fontSize,
  multiSpeaker = false,
}: {
  readonly speaker: string
  readonly text: string
  readonly kind: 'speaker' | 'ai'
  readonly fontSize: number
  readonly multiSpeaker?: boolean
}) {
  const accentIndex = multiSpeaker && kind === 'speaker' ? speakerAccentIndex(speaker) : null
  return (
    <div className={cn('rounded-lg p-3', kind === 'ai' ? 'bg-accent-subtle/60' : 'bg-[var(--lf-live-message)]')}>
      <p className={cn('mb-1.5 flex items-center gap-1.5 truncate text-[11px] font-bold uppercase tracking-wide', accentIndex === null ? 'text-ink-muted' : SPEAKER_ACCENTS[accentIndex])}>
        {accentIndex !== null ? <span aria-hidden="true" className={cn('size-1.5 shrink-0 rounded-full', SPEAKER_DOT_ACCENTS[accentIndex])} /> : null}
        {speaker}
      </p>
      <p className="whitespace-pre-wrap break-words text-brand-bar-text" style={{ fontSize: `${fontSize}px` }}>{text}</p>
    </div>
  )
}

function questionTextFor(turn: CopilotTranscriptTurn): string {
  if (!turn.interjection) return turn.question
  const target = Math.round(turn.question.length * 0.55)
  const idx = turn.question.lastIndexOf(' ', target)
  return turn.question.slice(0, idx > 0 ? idx : target)
}

type ConversationalStatus = 'listening' | 'processing' | 'answering'

const conversationalStatusLabel: Record<ConversationalStatus, string> = {
  listening: 'Listening...',
  processing: 'Processing...',
  answering: 'Answering...',
}

function CopilotTranscriptPanel({
  bank,
  responseMode,
  fontSize,
  onActivityChange,
  manualHint = 'Press Space to start the simulation…',
  multiSpeaker = false,
  paused = false,
}: {
  readonly bank: readonly CopilotTranscriptTurn[]
  readonly responseMode: 'auto' | 'manual'
  readonly fontSize: number
  readonly onActivityChange: (label: string) => void
  readonly manualHint?: string
  readonly multiSpeaker?: boolean
  readonly paused?: boolean
}) {
  const [started, setStarted] = useState(false)
  const [status, setStatus] = useState<ConversationalStatus>('listening')
  const [turnIndex, setTurnIndex] = useState(0)
  const [qDisplayed, setQDisplayed] = useState('')
  const [interjectionDisplayed, setInterjectionDisplayed] = useState('')
  const [aDisplayed, setADisplayed] = useState('')
  const [history, setHistory] = useState<CopilotTranscriptTurn[]>([])
  const panelRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef(status)
  const turnIndexRef = useRef(turnIndex)
  const startedRef = useRef(started)
  const pausedRef = useRef(paused)

  useEffect(() => {
    statusRef.current = status
  }, [status])
  useEffect(() => {
    turnIndexRef.current = turnIndex
  }, [turnIndex])
  useEffect(() => {
    startedRef.current = started
  }, [started])
  useEffect(() => {
    pausedRef.current = paused
  }, [paused])
  useEffect(() => {
    onActivityChange(started ? conversationalStatusLabel[status] : 'Idle...')
  }, [status, started, onActivityChange])

  const advance = () => {
    if (pausedRef.current) return
    if (!startedRef.current) {
      setStarted(true)
      return
    }
    const cur = statusRef.current
    const turn = bank[turnIndexRef.current]
    if (cur === 'listening') setStatus('processing')
    else if (cur === 'processing') setStatus('answering')
    else {
      setHistory((h) => [...h, turn])
      setTurnIndex((i) => (i + 1) % bank.length)
      setStatus('listening')
    }
  }

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || responseMode === 'auto') return
      event.preventDefault()
      advance()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMode, bank])

  useEffect(() => {
    if (responseMode !== 'auto' || paused) return
    const delay = status === 'listening' ? 1800 : status === 'processing' ? 1200 : 1800
    const id = setTimeout(advance, delay)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMode, status, turnIndex, paused])

  useEffect(() => {
    if (!started || status !== 'listening') return
    setQDisplayed('')
    setADisplayed('')
    setInterjectionDisplayed('')
    const turn = bank[turnIndex]
    const text = questionTextFor(turn)
    let i = 0
    let interjectionInterval: ReturnType<typeof setInterval> | undefined
    const qInterval = setInterval(() => {
      i++
      setQDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(qInterval)
        if (turn.interjection) {
          let j = 0
          const interjectionText = turn.interjection.text
          interjectionInterval = setInterval(() => {
            j++
            setInterjectionDisplayed(interjectionText.slice(0, j))
            if (j >= interjectionText.length) clearInterval(interjectionInterval)
          }, 22)
        }
      }
    }, 22)
    return () => {
      clearInterval(qInterval)
      if (interjectionInterval) clearInterval(interjectionInterval)
    }
  }, [started, status, turnIndex, bank])

  useEffect(() => {
    if (status !== 'answering') return
    setADisplayed('')
    const text = bank[turnIndex].answer
    let i = 0
    const id = setInterval(() => {
      i += 4
      setADisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 12)
    return () => clearInterval(id)
  }, [status, turnIndex, bank])

  useEffect(() => {
    const el = panelRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [qDisplayed, aDisplayed, interjectionDisplayed, history.length])

  const currentTurn = bank[turnIndex]
  const questionComplete = qDisplayed.length >= questionTextFor(currentTurn).length

  return (
    <div ref={panelRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
      {history.map((turn, index) => (
        <div key={index} className="space-y-3">
          <TranscriptBubble speaker={turn.speaker} text={`${questionTextFor(turn)}${turn.interjection ? '…' : ''}`} kind="speaker" fontSize={fontSize} multiSpeaker={multiSpeaker} />
          {turn.interjection ? (
            <div className="ms-4 flex items-start gap-1.5 border-s-2 border-[var(--lf-live-control-border)] ps-3">
              <ChevronRight aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-ink-muted" />
              <p className="text-xs leading-relaxed text-ink-muted">
                <span className={cn('font-semibold', multiSpeaker ? SPEAKER_ACCENTS[speakerAccentIndex(turn.interjection.speaker)] : 'text-brand-bar-text')}>
                  {turn.interjection.speaker}
                </span>{' '}
                {turn.interjection.text}
              </p>
            </div>
          ) : null}
          <TranscriptBubble speaker="Lightforth AI" text={turn.answer} kind="ai" fontSize={fontSize} />
        </div>
      ))}

      {started ? (
        <div className="space-y-3">
          {qDisplayed ? (
            <TranscriptBubble
              speaker={currentTurn.speaker}
              text={`${qDisplayed}${questionComplete && currentTurn.interjection ? '…' : !questionComplete ? '|' : ''}`}
              kind="speaker"
              fontSize={fontSize}
              multiSpeaker={multiSpeaker}
            />
          ) : null}
          {interjectionDisplayed && currentTurn.interjection ? (
            <div className="ms-4 flex items-start gap-1.5 border-s-2 border-[var(--lf-live-control-border)] ps-3">
              <ChevronRight aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-ink-muted" />
              <p className="text-xs leading-relaxed text-ink-muted">
                <span className={cn('font-semibold', multiSpeaker ? SPEAKER_ACCENTS[speakerAccentIndex(currentTurn.interjection.speaker)] : 'text-brand-bar-text')}>
                  {currentTurn.interjection.speaker}
                </span>{' '}
                {interjectionDisplayed}
                {status === 'listening' && interjectionDisplayed.length < currentTurn.interjection.text.length ? (
                  <span className="animate-pulse">|</span>
                ) : null}
              </p>
            </div>
          ) : null}
          {status === 'processing' ? (
            <div className="flex items-center gap-1.5 py-1" role="status" aria-label="Processing">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2 animate-bounce rounded-pill bg-ink-muted motion-reduce:animate-none" style={{ animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
          ) : null}
          {status === 'answering' && aDisplayed ? (
            <TranscriptBubble
              speaker="Lightforth AI"
              text={`${aDisplayed}${aDisplayed.length < currentTurn.answer.length ? '|' : ''}`}
              kind="ai"
              fontSize={fontSize}
            />
          ) : null}
        </div>
      ) : (
        <p className="text-sm italic text-ink-muted">
          {responseMode === 'auto' ? 'Auto Respond is on — listening automatically…' : manualHint}
        </p>
      )}
    </div>
  )
}

type CodingStatus = 'idle' | 'capturing' | 'analyzing' | 'answered'

const codingStatusLabel: Record<CodingStatus, string> = {
  idle: 'Watching your screen...',
  capturing: 'Capturing screen...',
  analyzing: 'Analyzing...',
  answered: 'Answer ready',
}

function CopilotCodingPanel({
  bank,
  responseMode,
  fontSize,
  onActivityChange,
  manualHint = 'Press Space to capture your first question…',
  paused = false,
}: {
  readonly bank: readonly CopilotCodingTurn[]
  readonly responseMode: 'auto' | 'manual'
  readonly fontSize: number
  readonly onActivityChange: (label: string) => void
  readonly manualHint?: string
  readonly paused?: boolean
}) {
  const [status, setStatus] = useState<CodingStatus>('idle')
  const [index, setIndex] = useState(0)
  const [history, setHistory] = useState<CopilotCodingTurn[]>([])
  const [copied, setCopied] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef(status)
  const indexRef = useRef(index)
  const pausedRef = useRef(paused)

  useEffect(() => {
    statusRef.current = status
  }, [status])
  useEffect(() => {
    indexRef.current = index
  }, [index])
  useEffect(() => {
    pausedRef.current = paused
  }, [paused])
  useEffect(() => {
    onActivityChange(codingStatusLabel[status])
  }, [status, onActivityChange])

  const capture = () => {
    if (pausedRef.current) return
    if (statusRef.current === 'idle') setStatus('capturing')
    else if (statusRef.current === 'answered') {
      setHistory((h) => [...h, bank[indexRef.current]])
      setIndex((i) => (i + 1) % bank.length)
      setStatus('idle')
    }
  }

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const isSpace = event.code === 'Space'
      const isCtrlEnter = event.code === 'Enter' && (event.ctrlKey || event.metaKey)
      if (!isSpace && !isCtrlEnter) return
      event.preventDefault()
      capture()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank])

  useEffect(() => {
    if (status !== 'capturing') return
    const id = setTimeout(() => setStatus('analyzing'), 600)
    return () => clearTimeout(id)
  }, [status])

  useEffect(() => {
    if (status !== 'analyzing') return
    const id = setTimeout(() => setStatus('answered'), 900)
    return () => clearTimeout(id)
  }, [status])

  useEffect(() => {
    if (responseMode !== 'auto' || (paused && status === 'idle')) return
    const delay = status === 'capturing' ? 600 : status === 'analyzing' ? 900 : 2200
    const id = setTimeout(capture, delay)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMode, status, index, paused])

  useEffect(() => {
    const el = panelRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [status, history.length])

  const current = bank[index]

  return (
    <div ref={panelRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
      {history.map((item, i) => (
        <div key={i} className="space-y-2 border-b border-[var(--lf-live-divider)] pb-4 last:border-0">
          <p className="text-sm text-brand-bar-text">{item.question}</p>
          <pre className="overflow-x-auto rounded-lg bg-[var(--lf-live-message)] p-3 text-xs text-positive" style={{ fontSize: `${fontSize}px` }}>
            <code>{item.answer}</code>
          </pre>
        </div>
      ))}

      {status === 'analyzing' ? (
        <div className="flex items-center gap-1.5 py-1" role="status" aria-label="Analyzing">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2 animate-bounce rounded-pill bg-ink-muted motion-reduce:animate-none" style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      ) : null}

      {status === 'answered' ? (
        <div className="space-y-2">
          <p className="text-sm text-brand-bar-text">{current.question}</p>
          <div className="relative">
            <pre className="overflow-x-auto rounded-lg bg-[var(--lf-live-message)] p-3 text-xs text-positive" style={{ fontSize: `${fontSize}px` }}>
              <code>{current.answer}</code>
            </pre>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                void navigator.clipboard?.writeText(current.answer)
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              }}
              className="absolute end-2 top-2 rounded-soft bg-[var(--lf-live-control-border)] px-2 py-1 text-[10px] font-semibold text-brand-bar-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      ) : null}

      {status === 'idle' && history.length === 0 ? (
        <p className="text-sm italic text-ink-muted">
          {responseMode === 'auto' ? 'Auto Respond is on — Copilot will capture automatically. Press Space to capture sooner.' : manualHint}
        </p>
      ) : null}
    </div>
  )
}

const COPILOT_RATE_CENTS_PER_MIN = 80
const COPILOT_START_BALANCE_CENTS = 60
const QUICK_TOPUP_CREDITS = [25, 50, 100]

export function CopilotLiveView({ completeHref, session, isLoading = false, transcriptBank = [], codingBank = [] }: CopilotLiveViewProps) {
  const [assistantMessages, setAssistantMessages] = useState<readonly AiAssistantMessage[]>([])
  const [draft, setDraft] = useState('')
  const assistantScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = assistantScrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [assistantMessages])
  const [showSettings, setShowSettings] = useState(false)
  const [settingsTab, setSettingsTab] = useState<'live' | 'session'>('live')
  const [autoScroll, setAutoScroll] = useState(true)
  const [scrollSpeed, setScrollSpeed] = useState(3)
  const [fontSize, setFontSize] = useState(14)
  const [responseMode, setResponseMode] = useState<'auto' | 'manual'>('manual')
  const [activityLabel, setActivityLabel] = useState(session.activityLabel)
  const [showChat, setShowChat] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 1279px)').matches)
  const [balanceCents, setBalanceCents] = useState(COPILOT_START_BALANCE_CENTS)
  const [sessionPaused, setSessionPaused] = useState(false)
  const [topUpOpen, setTopUpOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1279px)')
    const handler = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (isLoading || sessionPaused) return
    const id = window.setInterval(() => {
      const perTickCents = COPILOT_RATE_CENTS_PER_MIN / 60
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
  }, [isLoading, sessionPaused])

  const lowBalance = balanceCents > 0 && balanceCents <= COPILOT_START_BALANCE_CENTS * 0.2

  function handleAddFunds(amountCredits: number) {
    setBalanceCents((prev) => prev + creditsToCents(amountCredits))
    setSessionPaused(false)
  }

  if (isLoading) {
    return <CopilotLiveLoadingView />
  }

  function handleSend() {
    const trimmed = draft.trim()
    if (!trimmed) return
    const userMsg: AiAssistantMessage = { id: `aam-${Date.now()}`, role: 'user', text: trimmed }
    setAssistantMessages((prev) => [...prev, userMsg])
    setDraft('')
    const aiMsg: AiAssistantMessage = { id: `aam-${Date.now()}-ai`, role: 'assistant', text: copilotResponseFor(trimmed) }
    setAssistantMessages((prev) => [...prev, aiMsg])
  }

  function handleManualAdvance() {
    if (responseMode !== 'manual') return
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ', bubbles: true, cancelable: true }))
  }

  if (isMobile) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div
          className="fixed inset-0 z-0 flex flex-col bg-gradient-to-b from-[#0b1220] to-black pt-[6.5rem] pb-[7.5rem]"
          onClick={handleManualAdvance}
        >
          <div className="min-h-0 flex-1 overflow-y-auto">
            {session.mode === 'coding' ? (
              <CopilotCodingPanel bank={codingBank} responseMode={responseMode} fontSize={fontSize} onActivityChange={setActivityLabel} manualHint="Tap anywhere to capture your first question…" paused={sessionPaused} />
            ) : (
              <CopilotTranscriptPanel bank={transcriptBank} responseMode={responseMode} fontSize={fontSize} onActivityChange={setActivityLabel} manualHint="Tap anywhere to start the simulation…" multiSpeaker={session.mode === 'meeting'} paused={sessionPaused} />
            )}
          </div>
          {responseMode === 'manual' ? (
            <p className="pointer-events-none px-5 pb-1 text-center text-xs text-white/40">Tap anywhere to continue</p>
          ) : null}
        </div>

        <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-3 bg-gradient-to-b from-black/70 to-transparent px-4 pb-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <a href={completeHref} aria-label="Back from live copilot" className="grid size-9 shrink-0 place-items-center rounded-full bg-black/30 text-white backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
            <ArrowLeft aria-hidden="true" className="size-4" />
          </a>
          <div className="min-w-0 text-center">
            <p className="truncate text-sm font-semibold leading-5">{session.title}</p>
            <p className="text-xs leading-4 text-white/70">{session.timer} · {activityLabel}</p>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-black/30 backdrop-blur-sm" aria-hidden="true">
            <LiveSignal label={session.signalLabel} />
          </span>
        </div>

        {session.mode === 'interview' ? <DraggableAvatar name="You" videoEnabled={videoEnabled} /> : null}

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

        <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-center gap-4 bg-gradient-to-t from-black/80 to-transparent px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-10">
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
            onClick={() => setShowChat(true)}
            aria-label="Open chat"
            className="grid size-14 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <MessageCircle aria-hidden="true" className="size-5" />
          </button>
          {session.mode === 'interview' ? (
            <button
              type="button"
              onClick={() => setVideoEnabled((prev) => !prev)}
              aria-label={videoEnabled ? 'Turn off video' : 'Turn on video'}
              aria-pressed={!videoEnabled}
              className={cn(
                'grid size-14 place-items-center rounded-full backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
                !videoEnabled ? 'bg-danger/90 text-on-danger hover:bg-danger' : 'bg-white/15 text-white hover:bg-white/25',
              )}
            >
              {videoEnabled ? <Video aria-hidden="true" className="size-5" /> : <VideoOff aria-hidden="true" className="size-5" />}
            </button>
          ) : null}
          <a
            href={completeHref}
            aria-label="End session"
            className="grid size-14 place-items-center rounded-full bg-danger text-on-danger shadow-lg transition-colors hover:bg-danger/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <PhoneOff aria-hidden="true" className="size-5" />
          </a>
        </div>

        <div
          className={cn('fixed inset-0 z-30 bg-black/60 transition-opacity duration-normal ease-default', showChat ? 'opacity-100' : 'pointer-events-none opacity-0')}
          onClick={() => setShowChat(false)}
          aria-hidden="true"
        />
        <div
          className={cn(
            'fixed inset-x-0 bottom-0 z-40 flex max-h-[75vh] flex-col rounded-t-panel border-t border-[var(--lf-live-border)] bg-[var(--lf-live-panel)] text-brand-bar-text shadow-2xl transition-transform duration-normal ease-default',
            showChat ? 'translate-y-0' : 'translate-y-full',
          )}
          aria-hidden={!showChat}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-[var(--lf-live-border)] px-5 py-4">
            <h2 className="text-base font-semibold">Ask AI</h2>
            <button type="button" onClick={() => setShowChat(false)} aria-label="Close chat" className="grid size-8 place-items-center rounded-soft text-ink-muted hover:text-brand-bar-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
          <CopilotAiAssistantPanel
            prompts={session.prompts}
            messages={assistantMessages}
            setMessages={setAssistantMessages}
            draft={draft}
            setDraft={setDraft}
            onSend={handleSend}
            scrollRef={assistantScrollRef}
            className="min-h-0 flex-1"
          />
        </div>

        <CopilotLiveSettingsModal
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
          responseMode={responseMode}
          setResponseMode={setResponseMode}
          sessionTitle={session.title}
          mode={session.mode}
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
    <main className="min-h-screen bg-[var(--lf-live-workspace)] text-brand-bar-text">
      <header className="flex min-h-[57px] flex-wrap items-center justify-between gap-3 border-b border-[var(--lf-live-divider)] bg-[var(--lf-live-header)] px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <a href={completeHref} aria-label="Back from live copilot" className="grid size-7 shrink-0 place-items-center rounded-soft text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <ArrowLeft aria-hidden="true" className="size-4" />
          </a>
          <h1 className="truncate text-sm font-medium leading-5">{session.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium leading-5 text-ink-muted">{session.timer}</span>
          <a href={completeHref} className="inline-flex min-h-9 items-center rounded-lg bg-danger px-4 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">End Session</a>
        </div>
      </header>
      <div className="flex min-h-10 items-center justify-between border-b border-[var(--lf-live-divider)] bg-[var(--lf-live-strip)] px-5">
        <div className="flex items-center gap-4">
          <LiveSignal label={session.signalLabel} />
          <span className="text-sm font-medium leading-5 text-positive">{session.signalLabel}</span>
          <span className="text-sm italic leading-5 text-ink-muted">{activityLabel}</span>
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
      <section className="grid gap-3 overflow-hidden p-3 xl:h-[calc(100vh-6.0625rem)] xl:grid-cols-[minmax(0,1fr)_6px_28.5rem]">
        <article className="min-h-[38rem] overflow-hidden rounded-panel border border-[var(--lf-live-border)] bg-[var(--lf-live-panel)]">
          <div className="flex min-h-[57px] items-center justify-between border-b border-[var(--lf-live-border)] px-4 py-3">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold leading-5">
              Live Response
              <span className="size-2 rounded-pill bg-danger" />
            </h2>
          </div>
          <div className="flex min-h-[32rem] flex-col xl:h-[calc(100vh-12.4375rem)]">
            {session.mode === 'coding' ? (
              <CopilotCodingPanel bank={codingBank} responseMode={responseMode} fontSize={fontSize} onActivityChange={setActivityLabel} paused={sessionPaused} />
            ) : (
              <CopilotTranscriptPanel bank={transcriptBank} responseMode={responseMode} fontSize={fontSize} onActivityChange={setActivityLabel} multiSpeaker={session.mode === 'meeting'} paused={sessionPaused} />
            )}
          </div>
        </article>
        <div className="hidden h-full bg-[var(--lf-live-divider)] xl:block" />
        <aside className="grid min-h-[42rem] gap-3 xl:min-h-0 xl:grid-rows-[auto_6px_minmax(0,1fr)]">
          {session.mode !== 'coding' ? (
            <>
              <section className="overflow-hidden rounded-panel bg-[var(--lf-live-panel)]">
                <h2 className="bg-[var(--lf-live-panel-header)] px-5 py-[13px] text-[18.67px] font-medium leading-[37px]">
                  {session.mode === 'meeting' ? 'Your Meeting' : 'Your Interview'}
                </h2>
                <img src={session.screenPreviewSrc} alt="" className="h-[22.666rem] w-full rounded-b-lg object-cover" />
              </section>
              <div className="hidden h-1.5 bg-[var(--lf-live-divider)] xl:block" />
            </>
          ) : null}
          <section className="grid min-h-0 grid-rows-[auto_1fr] rounded-panel border border-[var(--lf-live-border)] bg-[var(--lf-live-panel)]">
            <div className="flex min-h-[57px] items-center justify-between border-b border-[var(--lf-live-border)] px-4 py-3">
              <h2 className="text-sm font-medium leading-5">AI Assistant</h2>
              <button type="button" aria-label="Close AI assistant" className="grid size-8 place-items-center rounded-soft text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            <CopilotAiAssistantPanel
              prompts={session.prompts}
              messages={assistantMessages}
              setMessages={setAssistantMessages}
              draft={draft}
              setDraft={setDraft}
              onSend={handleSend}
              scrollRef={assistantScrollRef}
              className="min-h-0"
            />
          </section>
        </aside>
      </section>

      <CopilotLiveSettingsModal
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
        responseMode={responseMode}
        setResponseMode={setResponseMode}
        sessionTitle={session.title}
        mode={session.mode}
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

export function CopilotCompleteView({ homeHref, sessionHref, historyHref, reportHref, mode, companyName }: CopilotCompleteViewProps) {
  const meta = copilotModeMeta[mode]
  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} current={meta.label} historyHref={historyHref} />
      <section className="px-4 py-9">
        <form className="mx-auto w-full max-w-lg border border-border bg-surface shadow-control">
          <div className="grid gap-5 p-8">
            <h1 className="text-3xl font-semibold">{meta.completeTitle}</h1>
            <p className="text-base leading-6 text-ink-muted">
              Thank you for completing your AI {meta.sessionNoun}{companyName ? ` with ${companyName}` : ''}.
            </p>
            <p className="text-base leading-6 text-ink-muted">Your responses have been recorded and will be evaluated by our Lightforth AI.</p>
          </div>
          <FooterActions backHref={sessionHref} nextHref={reportHref} nextLabel="See Report" />
        </form>
      </section>
    </Workspace>
  )
}

export function CopilotHistoryView({ homeHref, createHref, reportHref, rows }: CopilotHistoryViewProps) {
  const [activeMode, setActiveMode] = useState<CopilotMode>('interview')
  const filteredRows = rows.filter((row) => row.mode === activeMode)

  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} current="History" />
      <section className="px-4 py-8 lg:px-12 xl:px-24">
        <div className="mx-auto max-w-7xl bg-surface shadow-panel">
          <div className="flex min-h-[5rem] items-center justify-between gap-4 border-b border-border px-8">
            <h1 className="text-xl font-medium leading-5 text-ink">Past Copilot Sessions</h1>
            <a
              href={`${createHref}?mode=${activeMode}`}
              className="inline-flex min-h-10 items-center justify-center gap-3 rounded-lg bg-accent px-4 py-2 text-base font-semibold leading-6 text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <Plus aria-hidden="true" className="size-5 shrink-0" />
              {copilotModeMeta[activeMode].createCta}
            </a>
          </div>
          <div className="p-8">
            <nav aria-label="Copilot session types" className="flex gap-6 border-b border-border text-sm font-medium">
              {(Object.keys(copilotModeMeta) as CopilotMode[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveMode(id)}
                  aria-current={activeMode === id ? 'page' : undefined}
                  className={cn(
                    'min-h-11 border-b-2 px-1 pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                    activeMode === id ? 'border-accent text-accent' : 'border-transparent text-ink-muted hover:text-ink',
                  )}
                >
                  {copilotModeMeta[id].label}
                </button>
              ))}
            </nav>
            <DataTable
              searchLabel="Search copilot history"
              selectable={false}
              bare
              className="mt-6"
              rows={filteredRows}
              itemLabel={(row) => row.title}
              onRowClick={(row) => { window.location.href = `${reportHref}?id=${row.id}` }}
              columns={[
                  { key: 'title', label: 'Title', className: 'w-[16rem]', render: (row) => <span className="font-medium">{row.title}</span> },
                  { key: 'where', label: 'Where', className: 'w-[8rem]', render: (row) => row.where },
                  { key: 'company', label: 'Company', className: 'w-[10rem]', render: (row) => row.company },
                  { key: 'duration', label: 'Duration', className: 'w-[7rem]', render: (row) => row.duration },
                  { key: 'date-time', label: 'Date & Time', className: 'w-[12rem]', render: (row) => row.dateTime },
              ]}
            />
          </div>
        </div>
      </section>
    </Workspace>
  )
}
