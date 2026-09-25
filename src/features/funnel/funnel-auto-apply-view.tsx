import type { ReactNode } from 'react'
import { ArrowLeft, Building2, CircleCheck, MapPin, SearchX } from 'lucide-react'

import type { FunnelAnswers, FunnelJobMatch, FunnelQuestion as FunnelQuestionData } from '@/contracts/funnel.draft'
import { Button } from '@/ui'
import { FunnelGate } from './funnel-gate'
import { FunnelQuestion, FunnelQuestionFooter } from './funnel-question'
import { FunnelOfflineNotice, FunnelShell, FunnelTitle } from './funnel-shell'
import { FunnelUpload } from './funnel-upload'
import { FunnelWorking } from './funnel-working'

export type FunnelAutoApplyStep = 'upload' | 'quiz' | 'working' | 'matches' | 'gate'

export type FunnelAutoApplyViewProps = {
  readonly step: FunnelAutoApplyStep
  readonly questions: readonly FunnelQuestionData[]
  /** Which question the quiz step shows; ignored on other steps. */
  readonly questionIndex: number
  readonly answers: FunnelAnswers
  readonly fileName?: string
  readonly uploadError?: string
  readonly online: boolean
  readonly matches: readonly FunnelJobMatch[]
  /** The job open in detail on the matches step; absent shows the list. */
  readonly selectedJobId?: string
  /** What the gate is standing in front of: `'all'` or one job id. */
  readonly applyTarget?: string
  readonly onFile: (file: File) => void
  readonly onAnswer: (questionId: string, value: string) => void
  readonly onBack: () => void
  readonly onContinue: () => void
  readonly onClose: () => void
  readonly onSelectJob: (jobId: string | null) => void
  /** Called with a job id, or `'all'`. */
  readonly onApply: (target: string) => void
  readonly onEditAnswer: (questionId: string) => void
  readonly onCreateAccount: (email: string) => void
  readonly onGoogleSignUp: () => void
}

const WORKING_CHECKS = ['Scout is searching job boards for your role', 'Filter is ranking roles against your answers', 'Tailor is lining up your resume for each one'] as const

const WIDEN_SUGGESTIONS = [
  { questionId: 'location', label: 'Widen the location' },
  { questionId: 'workMode', label: 'Allow any work mode' },
  { questionId: 'salary', label: 'Lower the salary floor' },
] as const

export function FunnelAutoApplyView(props: FunnelAutoApplyViewProps) {
  const { step, questions, questionIndex, answers, online, matches, selectedJobId, onClose } = props
  const question = questions[Math.min(Math.max(questionIndex, 0), questions.length - 1)]
  // The resume upload is question one, so the count reads the way the visitor experiences it.
  const total = questions.length + 1
  const selectedJob = selectedJobId ? matches.find((job) => job.id === selectedJobId) : undefined

  const label = step === 'upload' ? 'Resume' : step === 'quiz' ? question?.tab ?? '' : step === 'working' ? 'Matching' : step === 'matches' ? 'Your matches' : 'Apply'
  const progress = step === 'upload' ? 1 / (total + 2) : step === 'quiz' ? (questionIndex + 2) / (total + 2) : step === 'working' || step === 'matches' ? (total + 1) / (total + 2) : 1

  let footer: ReactNode
  if (step === 'upload') {
    footer = <FunnelQuestionFooter position={0} total={total} canContinue={online && Boolean(props.fileName)} onBack={props.onBack} onContinue={props.onContinue} />
  } else if (step === 'quiz' && question) {
    footer = <FunnelQuestionFooter position={questionIndex + 1} total={total} canContinue={online && (answers[question.id] ?? '').trim().length > 0} onBack={props.onBack} onContinue={props.onContinue} />
  } else if (step === 'matches' && selectedJob) {
    footer = <Button size="lg" className="w-full sm:ms-auto sm:w-auto" onClick={() => props.onApply(selectedJob.id)}>Apply to this job</Button>
  } else if (step === 'matches' && matches.length > 0) {
    footer = (
      <>
        <p className="hidden text-sm text-ink-muted sm:block">Free to match. Sign up to apply.</p>
        <Button size="lg" className="w-full sm:ms-auto sm:w-auto" onClick={() => props.onApply('all')}>Apply to all {matches.length}</Button>
      </>
    )
  }

  return (
    <FunnelShell label={label} progress={progress} onClose={onClose} notice={online ? null : <FunnelOfflineNotice />} footer={footer}>
      {step === 'upload' ? (
        <div className="grid gap-8">
          <div className="grid gap-3">
            <FunnelTitle>See the jobs we’d apply to for you.</FunnelTitle>
            <p className="text-base leading-7 text-ink-muted">Start with your resume, then nine quick questions. Free to match. Sign up to apply.</p>
          </div>
          <FunnelUpload fileName={props.fileName} error={props.uploadError} onFile={props.onFile} />
        </div>
      ) : null}
      {step === 'quiz' && question ? <FunnelQuestion question={question} value={answers[question.id] ?? ''} onChange={(value) => props.onAnswer(question.id, value)} /> : null}
      {step === 'working' ? <FunnelWorking title="Your agents are looking." checks={WORKING_CHECKS} /> : null}
      {step === 'matches' && selectedJob ? <JobDetail job={selectedJob} onSelectJob={props.onSelectJob} /> : null}
      {step === 'matches' && !selectedJob && matches.length > 0 ? <MatchList {...props} /> : null}
      {step === 'matches' && !selectedJob && matches.length === 0 ? <NoMatches onEditAnswer={props.onEditAnswer} /> : null}
      {step === 'gate' ? <Gate {...props} /> : null}
    </FunnelShell>
  )
}

function MatchList({ matches, answers, onSelectJob }: FunnelAutoApplyViewProps) {
  const summary = [answers.role, answers.location, answers.workMode].filter(Boolean).join(' · ')
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <FunnelTitle>{matches.length} jobs we’d apply to for you.</FunnelTitle>
        {summary ? <p className="text-base text-ink-muted">{summary}</p> : null}
      </div>
      <ul aria-label="Matched jobs" className="grid gap-3">
        {matches.map((job) => (
          <li key={job.id} className="grid gap-3 rounded-panel border border-border bg-surface p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <div className="grid min-w-0 gap-1">
              <p className="line-clamp-2 font-semibold text-ink">{job.title}</p>
              <p className="text-sm text-ink-muted">{job.company} · {job.location} · {job.workMode}</p>
              <p className="text-sm text-ink">{job.salaryRange} <span className="text-ink-muted">· {job.postedLabel}</span></p>
            </div>
            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
              <span className="rounded-full bg-accent-subtle px-3 py-1 text-sm font-semibold text-accent-text">{job.matchScore}% match</span>
              <Button variant="secondary" size="md" className="min-h-11" onClick={() => onSelectJob(job.id)} aria-label={`View ${job.title} at ${job.company}`}>View job</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function JobDetail({ job, onSelectJob }: { readonly job: FunnelJobMatch; readonly onSelectJob: (jobId: string | null) => void }) {
  return (
    <div className="grid gap-6">
      <button type="button" onClick={() => onSelectJob(null)} className="inline-flex min-h-11 items-center gap-2 justify-self-start rounded-md text-sm font-medium text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
        All matches
      </button>
      <div className="grid gap-3">
        <FunnelTitle>{job.title}</FunnelTitle>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
          <span className="inline-flex items-center gap-1.5"><Building2 aria-hidden="true" className="size-4" />{job.company}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin aria-hidden="true" className="size-4" />{job.location} · {job.workMode}</span>
        </p>
        <p className="text-base text-ink">{job.salaryRange} <span className="text-ink-muted">· {job.postedLabel}</span></p>
      </div>
      <p className="text-base leading-7 text-ink">{job.summary}</p>
      <section aria-labelledby="funnel-job-reasons" className="grid gap-3 rounded-panel border border-border bg-surface p-5">
        <h2 id="funnel-job-reasons" className="flex items-center justify-between gap-3 text-lg font-semibold text-ink">
          Why it matched
          <span className="rounded-full bg-accent-subtle px-3 py-1 text-sm font-semibold text-accent-text">{job.matchScore}% match</span>
        </h2>
        <ul className="grid gap-2">
          {job.reasons.map((reason) => (
            <li key={reason} className="flex gap-2 text-sm leading-6 text-ink"><CircleCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-positive" />{reason}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function NoMatches({ onEditAnswer }: { readonly onEditAnswer: (questionId: string) => void }) {
  return (
    <div className="grid gap-6">
      <SearchX aria-hidden="true" className="size-10 text-ink-muted" />
      <div className="grid gap-3">
        <FunnelTitle>No roles match every answer yet.</FunnelTitle>
        <p className="text-base leading-7 text-ink-muted">Loosen one of these and your agents search again.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {WIDEN_SUGGESTIONS.map((suggestion) => (
          <Button key={suggestion.questionId} variant="secondary" size="lg" onClick={() => onEditAnswer(suggestion.questionId)}>{suggestion.label}</Button>
        ))}
      </div>
    </div>
  )
}

function Gate({ applyTarget, matches, online, onCreateAccount, onGoogleSignUp }: FunnelAutoApplyViewProps) {
  const job = applyTarget && applyTarget !== 'all' ? matches.find((item) => item.id === applyTarget) : undefined
  const what = job ? `${job.title} at ${job.company}` : `all ${matches.length} matches`
  return (
    <FunnelGate
      title="Sign up and your agent applies for you."
      body={`Your answers and resume are saved. Your agent applies to ${what} as soon as you are in, and you approve each application before it goes.`}
      online={online}
      emailFieldId="funnel-auto-apply-email"
      onCreateAccount={onCreateAccount}
      onGoogleSignUp={onGoogleSignUp}
    />
  )
}
