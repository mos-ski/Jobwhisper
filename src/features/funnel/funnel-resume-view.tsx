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

export function FunnelResumeView(props: FunnelResumeViewProps) {
  const { step, online, onClose } = props
  const position = step === 'done' ? STEP_ORDER.length : STEP_ORDER.indexOf(step) + 1

  return (
    <FunnelShell
      label={STEP_LABELS[step]}
      progress={position / STEP_ORDER.length}
      onClose={onClose}
      notice={online ? null : <FunnelOfflineNotice />}
      footer={step === 'upload' ? <UploadFooter {...props} /> : undefined}
    >
      {step === 'upload' ? <UploadStep {...props} /> : null}
      {step === 'working' ? <FunnelWorking title="Reading it the way a hiring system does." checks={WORKING_CHECKS} /> : null}
      {step === 'score' ? <ScoreStep {...props} /> : null}
      {step === 'compare' ? <CompareStep {...props} /> : null}
      {step === 'gate' ? (
        <FunnelGate
          title="Create a free account to download it."
          body={`Your tailored resume is saved, scoring ${props.rewrite.scoreAfter}. Your account keeps it, and you can keep editing it in Resume Builder.`}
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
    <div className="grid gap-8">
      <div className="grid gap-3">
        <FunnelTitle>See your resume the way a hiring system does.</FunnelTitle>
        <p className="text-base leading-7 text-ink-muted">Free to score. Create an account to download.</p>
      </div>
      <FunnelUpload fileName={fileName} error={uploadError} onFile={onFile} />
      <div className="grid gap-2">
        <label htmlFor={jobId} className="text-sm font-medium text-ink">Job description <span className="font-normal text-ink-muted">(optional, sharpens the score)</span></label>
        <textarea
          id={jobId}
          rows={5}
          value={jobDescription}
          onChange={(event) => onJobDescriptionChange(event.target.value)}
          placeholder="Paste the posting you are applying to"
          className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-base leading-7 text-ink shadow-control outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus"
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

function ScoreStep({ report, rewrite, onShowRewrite }: FunnelResumeViewProps) {
  return (
    <div className="grid gap-8">
      <FunnelTitle>Your ATS score</FunnelTitle>
      <section aria-label="Score" className="grid gap-4 rounded-panel border border-border bg-surface p-6">
        <p className="flex items-baseline gap-2">
          <span className="font-gowun text-6xl font-bold leading-none text-ink">{report.score}</span>
          <span className="text-lg text-ink-muted">out of 100</span>
        </p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-subtle" aria-hidden="true">
          <div className="h-full rounded-full bg-warning" style={{ width: `${report.score}%` }} />
        </div>
        <p className="text-base font-semibold text-ink">{report.verdict}</p>
      </section>

      <section aria-labelledby="funnel-resume-issues" className="grid gap-4">
        <h2 id="funnel-resume-issues" className="text-lg font-semibold text-ink">What is holding it back</h2>
        <ul className="grid gap-3">
          {report.issues.map((issue) => (
            <li key={issue.id} className="grid gap-2 rounded-lg border border-border bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="font-semibold text-ink">{issue.label}</span>
                <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold', SEVERITY_STYLES[issue.severity])}>{SEVERITY_LABELS[issue.severity]}</span>
              </div>
              <span className="text-sm leading-6 text-ink-muted">{issue.fix}</span>
            </li>
          ))}
        </ul>
      </section>

      <Button size="lg" onClick={onShowRewrite} className="w-full sm:w-auto sm:justify-self-start">
        See it fixed, scoring {rewrite.scoreAfter}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
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
    <div className="grid gap-6">
      <div className="grid gap-3">
        <FunnelTitle>Drag to see what changes.</FunnelTitle>
        <p className="flex items-baseline gap-2 text-ink">
          <span className="text-sm text-ink-muted">ATS score</span>
          <span className="font-gowun text-4xl font-bold leading-none tabular-nums">{score}</span>
          <span className="text-sm text-ink-muted">from {rewrite.scoreBefore}</span>
        </p>
      </div>

      <div className="relative grid overflow-hidden rounded-panel border border-border has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus">
        <div className="col-start-1 row-start-1">
          <ResumePage document={rewrite.before} tag="Your resume" />
        </div>
        <div aria-hidden="true" className="col-start-1 row-start-1" style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}>
          <ResumePage document={rewrite.after} tag="Jobwhisper version" />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-accent" style={{ left: `${reveal}%` }}>
          <span className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-on-accent shadow-panel"><MoveHorizontal className="size-5" /></span>
        </div>
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
      <p className="text-sm text-ink-muted">Drag across the page, or focus it and use the arrow keys.</p>

      <Button size="lg" onClick={onDownload} className="w-full sm:w-auto sm:justify-self-start">
        <Download aria-hidden="true" className="size-4" />
        Download my resume
      </Button>
    </div>
  )
}

function ResumePage({ document, tag }: { readonly document: FunnelResumeDocument; readonly tag: string }) {
  return (
    <article className="bg-paper px-5 py-6 text-paper-ink sm:px-10 sm:py-10">
      <p className="mb-4 inline-block rounded-full bg-surface-subtle px-2.5 py-0.5 text-xs font-semibold text-ink">{tag}</p>
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

function DoneStep({ rewrite, onOpenEditor }: FunnelResumeViewProps) {
  return (
    <div className="grid gap-8">
      <FunnelTitle>Your resume is downloading.</FunnelTitle>
      <div className="flex items-start gap-4 rounded-panel border border-border bg-surface p-6">
        <FileCheck aria-hidden="true" className="mt-1 size-6 shrink-0 text-positive" />
        <p className="text-base leading-7 text-ink">
          The Jobwhisper version scores {rewrite.scoreAfter}, up from {rewrite.scoreBefore}. It is saved to your account, so you can tailor it to the next job in a minute.
        </p>
      </div>
      <Button size="lg" onClick={onOpenEditor} className="w-full sm:w-auto sm:justify-self-start">
        Keep editing in Resume Builder
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
    </div>
  )
}
