import type { ReactNode } from 'react'
import { ArrowLeft, Building2, CircleCheck, MapPin, SearchX } from 'lucide-react'

import type { FunnelAnswers, FunnelJobMatch, FunnelQuestion as FunnelQuestionData } from '@/contracts/funnel.draft'
import { Button } from '@/ui'
import { FunnelGate } from './funnel-gate'
import { FunnelQuestion, FunnelQuestionFooter } from './funnel-question'
import { FunnelOfflineNotice, FunnelShell, FunnelTitle } from './funnel-shell'
import { FunnelUpload } from './funnel-upload'

export type FunnelAutoApplyStep = 'upload' | 'quiz' | 'matches' | 'gate'

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

  const label = step === 'upload' ? 'Resume' : step === 'quiz' ? question?.tab ?? '' : step === 'matches' ? 'Your matches' : 'Apply'
  const currentStep = step === 'upload' ? 1 : step === 'quiz' ? questionIndex + 2 : step === 'matches' ? total + 1 : total + 2

  let footer: ReactNode
  if (step === 'upload') {
    footer = <FunnelQuestionFooter position={0} total={total} canContinue={online && Boolean(props.fileName)} showContinue={false} onBack={props.onBack} onContinue={props.onContinue} />
  } else if (step === 'quiz' && question) {
    footer = <FunnelQuestionFooter position={questionIndex + 1} total={total} canContinue={online && (answers[question.id] ?? '').trim().length > 0} showContinue={question.kind === 'text' || question.kind === 'range'} onBack={props.onBack} onContinue={props.onContinue} />
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
    <FunnelShell label={label} stepCount={total + 2} currentStep={currentStep} onClose={onClose} notice={online ? null : <FunnelOfflineNotice />} footer={footer} width={step === 'matches' ? 'wide' : 'narrow'}>
      {step === 'upload' ? (
        <div className="grid gap-10">
          <div className="grid gap-4">
            <FunnelTitle eyebrow={`Question 1 of ${total}`}>See the jobs we’d apply to for you.</FunnelTitle>
            <p className="text-center text-base leading-7 text-ink-muted">Start with your resume, then nine quick questions. Free to match. Sign up to apply.</p>
          </div>
          <FunnelUpload fileName={props.fileName} error={props.uploadError} onFile={props.onFile} />
        </div>
      ) : null}
      {step === 'quiz' && question ? (
        <FunnelQuestion
          key={question.id}
          question={question}
          eyebrow={`Question ${questionIndex + 2} of ${total}`}
          value={answers[question.id] ?? ''}
          onChange={(value) => props.onAnswer(question.id, value)}
          onAutoAdvance={online ? props.onContinue : undefined}
        />
      ) : null}
      {step === 'matches' && selectedJob ? <JobDetail job={selectedJob} onSelectJob={props.onSelectJob} /> : null}
      {step === 'matches' && !selectedJob && matches.length > 0 ? <MatchList {...props} /> : null}
      {step === 'matches' && !selectedJob && matches.length === 0 ? <NoMatches onEditAnswer={props.onEditAnswer} /> : null}
      {step === 'gate' ? <Gate {...props} /> : null}
    </FunnelShell>
  )
}

function MatchList({ matches, answers, onSelectJob }: FunnelAutoApplyViewProps) {
  const summary = [answers.role, answers.location, answers.workMode].filter(Boolean).join(' · ')
  const average = Math.round(matches.reduce((sum, job) => sum + job.matchScore, 0) / matches.length)
  const best = matches.reduce((top, job) => (job.matchScore > top.matchScore ? job : top))
  return (
    <div className="grid gap-8">
      <FunnelTitle eyebrow="Your matches">{matches.length} jobs we’d apply to for you.</FunnelTitle>

      <dl className="grid grid-cols-3 divide-x divide-ink-muted rounded-3xl bg-surface-inverse py-5 text-center text-surface rtl:divide-x-reverse">
        <div className="grid gap-1 px-2">
          <dt className="order-2 text-xs text-accent-muted sm:text-sm">Roles found</dt>
          <dd className="order-1 font-gowun text-3xl font-bold leading-none sm:text-4xl">{matches.length}</dd>
        </div>
        <div className="grid gap-1 px-2">
          <dt className="order-2 text-xs text-accent-muted sm:text-sm">Average match</dt>
          <dd className="order-1 font-gowun text-3xl font-bold leading-none sm:text-4xl">{average}%</dd>
        </div>
        <div className="grid gap-1 px-2">
          <dt className="order-2 text-xs text-accent-muted sm:text-sm">Best match</dt>
          <dd className="order-1 font-gowun text-3xl font-bold leading-none sm:text-4xl">{best.matchScore}%</dd>
        </div>
      </dl>
      {summary ? <p className="-mt-4 text-center text-sm text-ink-muted">For {summary}</p> : null}

      <ul aria-label="Matched jobs" className="divide-y divide-border rounded-2xl border border-border">
        {matches.map((job) => (
          <li key={job.id}>
            <button
              type="button"
              onClick={() => onSelectJob(job.id)}
              aria-label={`${job.title} at ${job.company}, ${job.matchScore}% match. View job`}
              className="grid w-full gap-3 px-5 py-4 text-start first:rounded-t-2xl last:rounded-b-2xl hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus sm:grid-cols-[minmax(0,1fr)_9rem] sm:items-center"
            >
              <span className="grid min-w-0 gap-1">
                <span className="line-clamp-2 font-semibold text-ink">{job.title}</span>
                <span className="text-sm text-ink-muted">{job.company} · {job.location} · {job.workMode}</span>
                <span className="text-sm text-ink">{job.salaryRange} <span className="text-ink-muted">· {job.postedLabel}</span></span>
              </span>
              <span className="grid gap-1.5">
                <span className="text-sm font-semibold text-accent-text sm:text-end">{job.matchScore}% match</span>
                <span aria-hidden="true" className="h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle">
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${job.matchScore}%` }} />
                </span>
              </span>
            </button>
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
        <FunnelTitle align="start">{job.title}</FunnelTitle>
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
    <div className="grid justify-items-center gap-8">
      <SearchX aria-hidden="true" className="size-12 text-ink-muted" />
      <div className="grid gap-4">
        <FunnelTitle>No roles match every answer yet.</FunnelTitle>
        <p className="text-center text-base leading-7 text-ink-muted">Loosen one of these and your agents search again.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {WIDEN_SUGGESTIONS.map((suggestion) => (
          <Button key={suggestion.questionId} variant="secondary" size="lg" onClick={() => onEditAnswer(suggestion.questionId)}>{suggestion.label}</Button>
        ))}
      </div>
    </div>
  )
}

function Gate({ applyTarget, matches, online, onCreateAccount, onGoogleSignUp }: FunnelAutoApplyViewProps) {
  const job = applyTarget && applyTarget !== 'all' ? matches.find((item) => item.id === applyTarget) : undefined
  const waiting = job ? [job] : matches
  const what = job ? `${job.title} at ${job.company}` : `all ${matches.length} matches`
  return (
    <FunnelGate
      title="Sign up and your agent applies for you."
      body={`Your answers and resume are saved. Your agent applies to ${what} as soon as you are in, and you approve each application before it goes.`}
      preview={
        <ul aria-label="Waiting to apply" className="mx-auto grid w-full max-w-md gap-2">
          {waiting.slice(0, 3).map((item) => (
            <li key={item.id} className="flex items-center gap-3 rounded-2xl bg-surface-subtle px-4 py-3">
              <span className="grid min-w-0 flex-1">
                <span className="truncate text-sm font-semibold text-ink">{item.title}</span>
                <span className="truncate text-xs text-ink-muted">{item.company} · {item.location}</span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-accent-text">{item.matchScore}%</span>
            </li>
          ))}
          {waiting.length > 3 ? <li className="text-center text-sm text-ink-muted">and {waiting.length - 3} more</li> : null}
        </ul>
      }
      online={online}
      emailFieldId="funnel-auto-apply-email"
      onCreateAccount={onCreateAccount}
      onGoogleSignUp={onGoogleSignUp}
    />
  )
}
