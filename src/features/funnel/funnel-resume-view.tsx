import { useId, useState } from 'react'
import { ArrowRight, ArrowUp, Download, FileCheck, Paperclip } from 'lucide-react'

import type { AtsIssueSeverity, AtsReport, ResumeRewrite } from '@/contracts/funnel.draft'
import { ResumeCompare } from '@/features/resume/resume-compare'
import { ClassicResume } from '@/features/resume/resume-templates'
import { Button, cn } from '@/ui'
import { FunnelGate } from './funnel-gate'
import { FunnelOfflineNotice, FunnelShell, FunnelTitle } from './funnel-shell'

export type FunnelResumeStep = 'upload' | 'score' | 'compare' | 'gate' | 'done'

export type ResumeFunnelActivity = {
  readonly id: string
  readonly name: string
  readonly countryFlag: string
  readonly score: number
  readonly timeLabel: string
  /** Portrait URL; initials show when absent. */
  readonly avatar?: string
}

export type FunnelResumeViewProps = {
  readonly step: FunnelResumeStep
  readonly fileName?: string
  readonly uploadError?: string
  readonly jobDescription: string
  readonly online: boolean
  readonly report: AtsReport
  readonly rewrite: ResumeRewrite
  readonly liveActivity?: ResumeFunnelActivity
  readonly onFile: (file: File) => void
  readonly onAnalyze: () => void
  readonly onJobDescriptionChange: (value: string) => void
  readonly onBack: () => void
  readonly onClose: () => void
  readonly onShowRewrite: () => void
  readonly onDownload: () => void
  readonly onCreateAccount: (email: string) => void
  readonly onGoogleSignUp: () => void
  readonly onOpenEditor: () => void
}

const STEP_ORDER: readonly FunnelResumeStep[] = ['upload', 'score', 'compare', 'gate']

const STEP_LABELS: Record<FunnelResumeStep, string> = {
  upload: 'Your resume',
  score: 'ATS score',
  compare: 'Before and after',
  gate: 'Download',
  done: 'Downloaded',
}

const SEVERITY_LABELS: Record<AtsIssueSeverity, string> = {
  high: 'High impact',
  medium: 'Medium impact',
  low: 'Low impact',
}

const SEVERITY_STYLES: Record<AtsIssueSeverity, string> = {
  high: 'bg-danger-surface text-ink',
  medium: 'bg-warning-surface text-ink',
  low: 'bg-surface-subtle text-ink',
}

const cta = 'min-h-12 w-full px-7 text-base sm:w-auto'

export function FunnelResumeView(props: FunnelResumeViewProps) {
  const { step, online, onClose, rewrite } = props
  const position = step === 'done' ? STEP_ORDER.length : STEP_ORDER.indexOf(step) + 1

  if (step === 'upload') return <UploadStep {...props} />

  return (
    <FunnelShell
      label={STEP_LABELS[step]}
      stepCount={STEP_ORDER.length}
      currentStep={position}
      onClose={onClose}
      notice={online ? null : <FunnelOfflineNotice />}
      width={step === 'compare' || step === 'score' ? 'wide' : 'narrow'}
    >
      {step === 'score' ? <ScoreStep {...props} /> : null}
      {step === 'compare' ? <CompareStep {...props} /> : null}
      {step === 'gate' ? (
        <FunnelGate
          title="Create a free account to download it."
          body="Your tailored resume is saved. Your account keeps it, and you can tailor it to the next job in Resume Builder."
          preview={<SavedResume rewrite={rewrite} />}
          online={online}
          emailFieldId="funnel-resume-email"
          onCreateAccount={props.onCreateAccount}
          onGoogleSignUp={props.onGoogleSignUp}
        />
      ) : null}
      {step === 'done' ? <DoneStep {...props} /> : null}
    </FunnelShell>
  )
}

function UploadStep({ fileName, uploadError, jobDescription, online, liveActivity, onFile, onAnalyze, onJobDescriptionChange, onBack }: FunnelResumeViewProps) {
  const jobId = useId()
  const fileId = useId()
  const errorId = useId()
  return (
    <main
      data-slot="resume-funnel-landing"
      data-theme="light"
      className="flex min-h-dvh flex-col items-center bg-[linear-gradient(to_bottom,var(--lf-landing-paper)_75%,var(--lf-landing-bg)_121%)] px-6 pb-20 pt-[68px] text-landing-ink"
    >
      <a
        href="/"
        onClick={(event) => {
          event.preventDefault()
          onBack()
        }}
        aria-label="Jobwhisper home"
        className="flex h-[54px] items-center justify-center rounded-[22px] bg-surface-inverse px-6 py-1.5 shadow-popover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <img src="/funnel/resume/jobwhisper-logo.svg" alt="Jobwhisper" width="122" height="24" />
      </a>

      {!online ? <div className="mt-4 w-full max-w-3xl"><FunnelOfflineNotice /></div> : null}

      <div className="flex w-full max-w-[820px] flex-1 flex-col items-center justify-center gap-7 py-14 text-center">
        <h1 className="max-w-[802px] text-balance font-gowun text-[clamp(2.625rem,6.25vw,4rem)] font-bold leading-[1.0625] tracking-[-3.01px]">
          Let’s analyze your resume to see why you haven’t landed your dream role.
        </h1>
        <p className="max-w-[642px] text-[clamp(1rem,2.05vw,1.3125rem)] leading-[1.42] text-landing-muted">
          Attach a resume, get a free ATS check and we will re-write your resume for free. Add a job description to make it effective.
        </p>

        <div
          data-slot="funnel-resume-composer"
          className="w-full max-w-[456px] rounded-[28px] border border-landing-border bg-surface p-6 text-start shadow-float"
        >
          <label htmlFor={jobId} className="sr-only">Paste a job description</label>
          <textarea
            id={jobId}
            rows={2}
            value={jobDescription}
            onChange={(event) => onJobDescriptionChange(event.target.value)}
            placeholder="Paste a job description...."
            className="min-h-12 w-full resize-none rounded-2xl bg-transparent text-base leading-6 tracking-[-0.0195em] text-landing-ink outline-none placeholder:text-landing-muted focus-visible:ring-2 focus-visible:ring-focus"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <label
              htmlFor={fileId}
              className={cn(
                'flex min-h-11 cursor-pointer items-center gap-2 rounded-full has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus',
                fileName ? 'min-w-0 flex-1' : 'w-11 justify-center',
              )}
            >
              <Paperclip aria-hidden="true" className="size-[18px] shrink-0 text-landing-ink" />
              {fileName ? <span className="min-w-0 truncate text-sm text-landing-muted">{fileName}</span> : null}
              <input
                id={fileId}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                aria-label="Your resume"
                aria-describedby={uploadError ? errorId : undefined}
                aria-invalid={uploadError ? true : undefined}
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) onFile(file)
                  event.target.value = ''
                }}
                className="sr-only"
              />
            </label>
            <button
              type="button"
              aria-label="Analyze for free"
              disabled={!fileName || !online}
              onClick={onAnalyze}
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed"
            >
              <span
                data-state={fileName && online ? 'ready' : 'waiting'}
                className={cn(
                  'flex size-8 items-center justify-center rounded-full text-surface transition-colors',
                  fileName && online ? 'bg-surface-inverse' : 'bg-landing-control',
                )}
              >
                <ArrowUp aria-hidden="true" className="size-[18px]" />
              </span>
            </button>
          </div>
        </div>
        {uploadError ? (
          <p id={errorId} role="alert" className="mt-3 w-full max-w-[456px] text-start text-sm text-danger">{uploadError}</p>
        ) : null}
      </div>
      <ResumeTrustFooter />
      {liveActivity ? <ResumeActivityToast activity={liveActivity} /> : null}
    </main>
  )
}

type ResumeTrustStory = {
  readonly metric: string
  readonly label: string
  readonly quote: string
  readonly name: string
  readonly role: string
  readonly image?: string
}

const RESUME_TRUST_STORIES: readonly ResumeTrustStory[] = [
  {
    metric: '3×',
    label: 'More interviews',
    quote: '“I went from two callbacks a month to six after the rewrite.”',
    name: 'Priya N',
    role: 'Product Manager, hired at Klarna',
    image: '/figma-landing/social-proof-1.jpg',
  },
  {
    metric: '94/100',
    label: 'ATS score',
    quote: '“Nine years of work finally fit one page — and passed the screener.”',
    name: 'Marcus L',
    role: 'Data Analyst, hired at Deloitte',
    image: '/funnel/resume/testimonials/dom.jpeg',
  },
  {
    metric: '11 days',
    label: 'Time to offer',
    quote: '“From tailored application to signed offer in eleven days.”',
    name: 'Elena R',
    role: 'UX Researcher, hired at Atlassian',
    image: '/v3-assets/interview-voice-caitlyn.png',
  },
]

function ResumeTrustFooter() {
  return (
    <section aria-label="Trusted by 3,478 job seekers" className="w-full max-w-4xl px-6 py-9 sm:px-6">
      <p className="text-center text-[10px] font-semibold uppercase tracking-[1px] text-landing-muted">Trusted by 3,478 job seekers</p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {RESUME_TRUST_STORIES.map((story) => (
          <article key={story.name} className="flex min-h-[147px] flex-col gap-2.5 rounded-soft border border-landing-border bg-surface p-4">
            <div className="flex h-4 items-baseline gap-2 whitespace-nowrap font-medium">
              <span className="text-[15px] leading-4 text-accent-text">{story.metric}</span>
              <span className="text-[10px] uppercase tracking-[0.6px] text-landing-muted">{story.label}</span>
            </div>
            <p className="min-h-0 flex-1 text-[13px] leading-[1.5] text-landing-muted">{story.quote}</p>
            <div className="flex items-center gap-2.5 border-t border-landing-border pt-2.5">
              {story.image ? <img src={story.image} alt="" className="size-7 shrink-0 rounded-full object-cover" /> : <span aria-hidden="true" className="size-7 shrink-0 rounded-full border border-landing-border" />}
              <div className="min-w-0">
                <p className="truncate text-xs font-medium leading-3 text-landing-ink">{story.name}</p>
                <p className="truncate pt-1 text-[10.5px] leading-[1.05] text-landing-muted">{story.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ResumeActivityToast({ activity }: { readonly activity: ResumeFunnelActivity }) {
  const initials = activity.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

  return (
    <aside
      key={activity.id}
      aria-label="Recent ATS activity"
      className="fixed bottom-4 start-4 z-20 flex w-[calc(100%-2rem)] max-w-[292px] items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-3 text-start shadow-popover sm:bottom-6 sm:start-6"
    >
      {activity.avatar ? (
        <img src={activity.avatar} alt="" aria-hidden="true" className="size-10 shrink-0 rounded-full object-cover" />
      ) : (
        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-sm font-bold text-accent-text">
          {initials}
        </span>
      )}
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="truncate text-sm font-semibold text-ink">{activity.name} <span aria-hidden="true">{activity.countryFlag}</span></span>
        <span className="text-sm text-ink-muted">Scored {activity.score} in ATS</span>
      </span>
      <span className="self-end whitespace-nowrap text-xs text-ink-muted">{activity.timeLabel}</span>
    </aside>
  )
}

const RING_RADIUS = 52
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

function ringTone(score: number): string {
  if (score < 60) return 'stroke-danger'
  if (score < 80) return 'stroke-warning'
  return 'stroke-positive'
}

function ScoreRing({ score }: { readonly score: number }) {
  const clamped = Math.min(Math.max(score, 0), 100)
  return (
    <div className="relative mx-auto size-52 sm:size-60">
      <svg viewBox="0 0 120 120" aria-hidden="true" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={RING_RADIUS} fill="none" strokeWidth="10" className="stroke-surface-subtle" />
        <circle
          cx="60"
          cy="60"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={RING_LENGTH}
          strokeDashoffset={RING_LENGTH * (1 - clamped / 100)}
          className={ringTone(clamped)}
        />
      </svg>
      <p className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-gowun text-6xl font-bold leading-none text-ink sm:text-7xl">{score}</span>
        <span className="mt-1 text-sm text-ink-muted">out of 100</span>
      </p>
    </div>
  )
}

function ScoreStep({ report, rewrite, onShowRewrite }: FunnelResumeViewProps) {
  return (
    <div className="grid gap-12">
      <div className="grid gap-6">
        <FunnelTitle eyebrow="Your ATS score">{report.verdict}.</FunnelTitle>
        <ScoreRing score={report.score} />
      </div>

      <section aria-labelledby="funnel-resume-issues" className="mx-auto grid w-full max-w-2xl gap-4">
        <h2 id="funnel-resume-issues" className="text-center text-lg font-semibold text-ink">What is holding it back</h2>
        <ol className="divide-y divide-border rounded-2xl border border-border">
          {report.issues.map((issue, index) => (
            <li key={issue.id} className="flex gap-4 px-5 py-4">
              <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-sm font-semibold text-ink">{index + 1}</span>
              <div className="grid min-w-0 flex-1 gap-1">
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                  <span className="font-semibold text-ink">{issue.label}</span>
                  <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold', SEVERITY_STYLES[issue.severity])}>{SEVERITY_LABELS[issue.severity]}</span>
                </div>
                <span className="text-sm leading-6 text-ink-muted">{issue.fix}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid justify-items-center">
        <Button size="lg" onClick={onShowRewrite} className={cta}>
          See it fixed, scoring {rewrite.scoreAfter}
          <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  )
}

function CompareStep({ rewrite, onDownload }: FunnelResumeViewProps) {
  const [reveal, setReveal] = useState(50)
  const score = Math.round(rewrite.scoreBefore + ((rewrite.scoreAfter - rewrite.scoreBefore) * reveal) / 100)
  const valueText = reveal >= 100
    ? `Jobwhisper version fully shown, ATS score ${score}`
    : reveal <= 0
      ? `Your original fully shown, ATS score ${score}`
      : `${reveal}% of the Jobwhisper version shown, ATS score ${score}`

  return (
    <div className="grid gap-8">
      <FunnelTitle eyebrow="Before and after">Drag to see what changes.</FunnelTitle>

      <div className="grid gap-5 rounded-3xl bg-surface-inverse p-3 text-surface sm:p-8">
        <p className="flex items-baseline justify-center gap-3">
          <span className="text-sm">ATS score</span>
          <span className="font-gowun text-5xl font-bold leading-none tabular-nums">{score}</span>
          <span className="text-sm text-accent-muted">from {rewrite.scoreBefore}</span>
        </p>

        <ResumeCompare
          before={<ClassicResume document={rewrite.document} showImproved={false} highlightChanges={false} showPageBreaks={false} />}
          after={<ClassicResume document={rewrite.document} showImproved highlightChanges showPageBreaks={false} />}
          beforeLabel="Your resume"
          afterLabel="Jobwhisper version"
          sliderLabel="Show the Jobwhisper version"
          describe={() => valueText}
          reveal={reveal}
          onRevealChange={setReveal}
        />
        <p className="text-center text-sm text-accent-muted">Drag across the page, or focus it and use the arrow keys. Changed lines are highlighted.</p>
        <div className="sr-only">
          <h2>What the Jobwhisper version changes</h2>
          <p>Summary, before: {rewrite.document.summary}</p>
          <p>Summary, after: {rewrite.document.improvedSummary}</p>
          <ul>
            {rewrite.document.improvedFirstRoleBullets.map((bullet, index) => (
              <li key={bullet}>{rewrite.document.roles[0]?.bullets[index] ?? ''} becomes: {bullet}</li>
            ))}
          </ul>
          <p>Skills, after: {rewrite.document.improvedSkills.join(', ')}</p>
        </div>
      </div>

      <div className="grid justify-items-center">
        <Button size="lg" onClick={onDownload} className={cta}>
          <Download aria-hidden="true" className="size-4" />
          Download my resume
        </Button>
      </div>
    </div>
  )
}

function SavedResume({ rewrite }: { readonly rewrite: ResumeRewrite }) {
  return (
    <div className="mx-auto flex w-full max-w-md items-center gap-4 rounded-2xl bg-surface-subtle px-5 py-4">
      <FileCheck aria-hidden="true" className="size-7 shrink-0 text-positive" />
      <div className="grid min-w-0 flex-1">
        <span className="truncate font-semibold text-ink">{rewrite.document.roles[0]?.title ?? 'Your resume'} resume</span>
        <span className="text-sm text-ink-muted">Tailored and saved</span>
      </div>
      <span className="shrink-0 rounded-full bg-positive-surface px-3 py-1 text-sm font-semibold text-positive">ATS {rewrite.scoreAfter}</span>
    </div>
  )
}

function DoneStep({ rewrite, onOpenEditor }: FunnelResumeViewProps) {
  return (
    <div className="grid gap-10">
      <FunnelTitle eyebrow="Download started">Your resume is downloading.</FunnelTitle>
      <SavedResume rewrite={rewrite} />
      <div className="grid justify-items-center gap-4 text-center">
        <p className="max-w-md text-base leading-7 text-ink-muted">
          The Jobwhisper version scores {rewrite.scoreAfter}, up from {rewrite.scoreBefore}. It is saved to your account, so you can tailor it to the next job in a minute.
        </p>
        <Button size="lg" onClick={onOpenEditor} className={cta}>
          Keep editing in Resume Builder
          <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  )
}
