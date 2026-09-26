import { useId, useState } from 'react'
import { ArrowRight, Download, FileCheck, MoveHorizontal } from 'lucide-react'

import type { AtsIssueSeverity, AtsReport, FunnelResumeDocument, ResumeRewrite } from '@/contracts/funnel.draft'
import { Button, cn } from '@/ui'
import { FunnelGate } from './funnel-gate'
import { FunnelOfflineNotice, FunnelShell, FunnelTitle } from './funnel-shell'
import { FunnelUpload } from './funnel-upload'
import { FunnelWorking } from './funnel-working'

export type FunnelResumeStep = 'upload' | 'working' | 'score' | 'compare' | 'gate' | 'done'

export type FunnelResumeViewProps = {
  readonly step: FunnelResumeStep
  readonly fileName?: string
  readonly uploadError?: string
  readonly jobDescription: string
  readonly online: boolean
  readonly report: AtsReport
  readonly rewrite: ResumeRewrite
  readonly onFile: (file: File) => void
  readonly onJobDescriptionChange: (value: string) => void
  readonly onScore: () => void
  readonly onBack: () => void
  readonly onClose: () => void
  readonly onShowRewrite: () => void
  readonly onDownload: () => void
  readonly onCreateAccount: (email: string) => void
  readonly onGoogleSignUp: () => void
  readonly onOpenEditor: () => void
}

const STEP_ORDER: readonly FunnelResumeStep[] = ['upload', 'working', 'score', 'compare', 'gate']

const STEP_LABELS: Record<FunnelResumeStep, string> = {
  upload: 'Your resume',
  working: 'Scoring',
  score: 'ATS score',
  compare: 'Before and after',
  gate: 'Download',
  done: 'Downloaded',
}

const WORKING_CHECKS = ['Reading your sections', 'Checking keywords against the job', 'Checking the layout a parser sees'] as const

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

  return (
    <FunnelShell
      label={STEP_LABELS[step]}
      stepCount={STEP_ORDER.length}
      currentStep={position}
      onClose={onClose}
      notice={online ? null : <FunnelOfflineNotice />}
      footer={step === 'upload' ? <UploadFooter {...props} /> : undefined}
      width={step === 'compare' || step === 'score' ? 'wide' : 'narrow'}
    >
      {step === 'upload' ? <UploadStep {...props} /> : null}
      {step === 'working' ? <FunnelWorking title="Reading it the way a hiring system does." checks={WORKING_CHECKS} /> : null}
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

function UploadStep({ fileName, uploadError, jobDescription, onFile, onJobDescriptionChange }: FunnelResumeViewProps) {
  const jobId = useId()
  return (
    <div className="grid gap-10">
      <div className="grid gap-4">
        <FunnelTitle eyebrow="Free ATS check">See your resume the way a hiring system does.</FunnelTitle>
        <p className="text-center text-base leading-7 text-ink-muted">Free to score. Create an account to download.</p>
      </div>
      <FunnelUpload fileName={fileName} error={uploadError} onFile={onFile} />
      <div className="grid gap-2">
        <label htmlFor={jobId} className="text-sm font-medium text-ink">Job description <span className="font-normal text-ink-muted">(optional, sharpens the score)</span></label>
        <textarea
          id={jobId}
          rows={4}
          value={jobDescription}
          onChange={(event) => onJobDescriptionChange(event.target.value)}
          placeholder="Paste the posting you are applying to"
          className="w-full rounded-2xl border border-input bg-surface px-4 py-3 text-base leading-7 text-ink shadow-control outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus"
        />
      </div>
    </div>
  )
}

function UploadFooter({ fileName, online, onBack, onScore }: FunnelResumeViewProps) {
  return (
    <>
      <Button variant="secondary" size="lg" onClick={onBack}>Back</Button>
      <Button size="lg" className="ms-auto" onClick={onScore} disabled={!fileName || !online}>Score my resume</Button>
    </>
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

        <div className="relative grid overflow-hidden rounded-xl shadow-panel has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus">
          <div className="col-start-1 row-start-1">
            <ResumePage document={rewrite.before} />
          </div>
          <div aria-hidden="true" className="col-start-1 row-start-1" style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}>
            <ResumePage document={rewrite.after} />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-accent" style={{ left: `${reveal}%` }}>
            <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-on-accent shadow-panel"><MoveHorizontal className="size-5" /></span>
          </div>
          <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-on-accent">Jobwhisper version</span>
          <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 rounded-full bg-surface-inverse px-2.5 py-0.5 text-xs font-semibold text-surface">Your resume</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={reveal}
            onChange={(event) => setReveal(Number(event.target.value))}
            aria-label="Show the Jobwhisper version"
            aria-valuetext={valueText}
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
        <p className="text-center text-sm text-accent-muted">Drag across the page, or focus it and use the arrow keys.</p>
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

function ResumePage({ document }: { readonly document: FunnelResumeDocument }) {
  return (
    <article className="bg-paper px-5 pb-6 pt-14 text-paper-ink sm:px-10 sm:pb-10">
      <h2 className="font-gowun text-2xl font-bold leading-tight">{document.name}</h2>
      <p className="mt-1 text-sm font-semibold">{document.headline}</p>
      <p className="text-xs text-paper-muted">{document.contact}</p>
      <p className="mt-4 text-sm leading-6">{document.summary}</p>
      <h3 className="mt-5 border-b border-border pb-1 text-xs font-bold uppercase tracking-wide text-paper-muted">Experience</h3>
      {document.roles.map((role) => (
        <section key={`${role.company}-${role.title}`} className="mt-3">
          <p className="flex flex-wrap justify-between gap-x-3 text-sm font-semibold">
            <span>{role.title}, {role.company}</span>
            <span className="font-normal text-paper-muted">{role.dates}</span>
          </p>
          <ul className="mt-1 list-disc ps-5 text-sm leading-6">
            {role.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
          </ul>
        </section>
      ))}
      <h3 className="mt-5 border-b border-border pb-1 text-xs font-bold uppercase tracking-wide text-paper-muted">Skills</h3>
      <p className="mt-2 text-sm leading-6">{document.skills.join(' · ')}</p>
    </article>
  )
}

function SavedResume({ rewrite }: { readonly rewrite: ResumeRewrite }) {
  return (
    <div className="mx-auto flex w-full max-w-md items-center gap-4 rounded-2xl bg-surface-subtle px-5 py-4">
      <FileCheck aria-hidden="true" className="size-7 shrink-0 text-positive" />
      <div className="grid min-w-0 flex-1">
        <span className="truncate font-semibold text-ink">{rewrite.after.name}, {rewrite.after.headline}</span>
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
