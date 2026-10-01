import { useEffect, useId, useRef, useState, type DragEvent, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, CircleHelp, ExternalLink, FileText, SearchX, Send, X } from 'lucide-react'

import type { AutoApplyJob } from '@/contracts/auto-apply.draft'
import type { FunnelAnswers, FunnelQuestion as FunnelQuestionData } from '@/contracts/funnel.draft'
import { Button, cn } from '@/ui'
import { FunnelGate } from './funnel-gate'
import { FunnelQuestion, FunnelQuestionFooter } from './funnel-question'
import { FunnelOfflineNotice, FunnelShell, FunnelTitle } from './funnel-shell'
import { FUNNEL_UPLOAD_ACCEPT } from './funnel-upload'

export type FunnelAutoApplyStep = 'upload' | 'quiz' | 'searching' | 'matches' | 'gate'

export type FunnelAutoApplyViewProps = {
  readonly step: FunnelAutoApplyStep
  readonly questions: readonly FunnelQuestionData[]
  /** Which question the quiz step shows; ignored on other steps. */
  readonly questionIndex: number
  readonly answers: FunnelAnswers
  readonly fileName?: string
  readonly uploadError?: string
  readonly online: boolean
  readonly matches: readonly AutoApplyJob[]
  /** The job open in the side panel on the matches step; absent shows the list only. */
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
  /** Fires when the searching run log finishes; the page replaces into the matches. */
  readonly onSearchComplete: () => void
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
    footer = <FunnelQuestionFooter position={questionIndex + 1} total={total} canContinue={online && (answers[question.id] ?? '').trim().length > 0} showContinue={question.kind === 'text' || question.kind === 'range' || question.kind === 'multi'} onBack={props.onBack} onContinue={props.onContinue} continueLabel={question.cta} />
  } else if (step === 'matches' && selectedJob?.status === 'new') {
    footer = <Button size="lg" className="w-full sm:ms-auto sm:w-auto" onClick={() => props.onApply(selectedJob.id)}>Apply to this job</Button>
  } else if (step === 'matches' && matches.length > 0) {
    footer = (
      <>
        <p className="hidden text-sm text-ink-muted sm:block">Free to match. Sign up to apply.</p>
        <Button size="lg" className="w-full sm:ms-auto sm:w-auto" onClick={() => props.onApply('all')}>Apply to all {matches.length}</Button>
      </>
    )
  }

  if (step === 'upload') return <AutoApplyUploadLanding {...props} />
  if (step === 'searching') return <SearchingStep fileName={props.fileName} online={online} onSearchComplete={props.onSearchComplete} />

  return (
    <FunnelShell label={label} stepCount={total + 2} currentStep={currentStep} onClose={onClose} notice={online ? null : <FunnelOfflineNotice />} footer={footer} width={step === 'matches' ? (selectedJob ? 'xwide' : 'wide') : 'narrow'}>
      {step === 'quiz' && question ? (
        <FunnelQuestion
          key={question.id}
          question={question}
          value={answers[question.id] ?? ''}
          onChange={(value) => props.onAnswer(question.id, value)}
          onAutoAdvance={online ? props.onContinue : undefined}
          checksValue={answers[`${question.id}.checks`]}
          onChecksChange={(value) => props.onAnswer(`${question.id}.checks`, value)}
          unitValue={answers[`${question.id}.unit`]}
          onUnitChange={(value) => props.onAnswer(`${question.id}.unit`, value)}
          onSkip={online ? props.onContinue : undefined}
        />
      ) : null}
      {step === 'matches' && matches.length > 0 ? (
        <div className="grid gap-8">
          <MatchHeader matches={matches} answers={answers} />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-6">
            <div className="min-w-0 flex-1">
              <MatchRows {...props} />
            </div>
            {selectedJob ? <JobDetailPanel job={selectedJob} onClose={() => props.onSelectJob(null)} onApply={props.onApply} /> : null}
          </div>
        </div>
      ) : null}
      {step === 'matches' && matches.length === 0 ? <NoMatches onEditAnswer={props.onEditAnswer} /> : null}
      {step === 'gate' ? <Gate {...props} /> : null}
    </FunnelShell>
  )
}

type SearchStep = {
  /** The line once the run reaches it; a completed line takes a check. */
  readonly label: string
  /** How long this line stays current before it completes — the slow passes get their real weight. */
  readonly ms: number
}

/** The search in the order it actually runs; 9.2s + 800ms hold, so the run reads as work, not a spinner. */
const SEARCH_STEPS: readonly SearchStep[] = [
  { label: 'reading your answers…', ms: 900 },
  { label: '', ms: 1100 },
  { label: 'searching 12,480 open remote roles…', ms: 1500 },
  { label: 'scoring salary against your range…', ms: 1000 },
  { label: 'checking work style and location…', ms: 900 },
  { label: 'ranking your experience and education…', ms: 1000 },
  { label: 'weighing your must-have benefits…', ms: 1200 },
  { label: 'shortlisting your best matches…', ms: 1600 },
]
const SEARCH_TOTAL_MS = SEARCH_STEPS.reduce((sum, step) => sum + step.ms, 0)
const SEARCH_HOLD_MS = 800

const SEARCH_STATS: readonly { readonly value: string; readonly label: string }[] = [
  { value: '12,480', label: 'open roles' },
  { value: '1,930', label: 'companies hiring today' },
  { value: '3,478', label: 'job seekers matched' },
]

function SearchingStep({ fileName, online, onSearchComplete }: Pick<FunnelAutoApplyViewProps, 'fileName' | 'online' | 'onSearchComplete'>) {
  const steps = SEARCH_STEPS.map((step, index) => (index === 1 ? { ...step, label: `reading ${fileName ?? 'your profile'}…` } : step))
  const [done, setDone] = useState(0)
  const completeRef = useRef(onSearchComplete)
  useEffect(() => {
    completeRef.current = onSearchComplete
  })
  useEffect(() => {
    // Offline freezes the run at its first line; the notice says why and nothing auto-advances.
    if (!online) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDone(SEARCH_STEPS.length)
      const hold = setTimeout(() => completeRef.current(), SEARCH_TOTAL_MS + SEARCH_HOLD_MS)
      return () => clearTimeout(hold)
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    let elapsed = 0
    SEARCH_STEPS.forEach((step, index) => {
      elapsed += step.ms
      timers.push(setTimeout(() => setDone(index + 1), elapsed))
    })
    timers.push(setTimeout(() => completeRef.current(), elapsed + SEARCH_HOLD_MS))
    return () => timers.forEach(clearTimeout)
    // One run per visit; the log advances on its own clock, not on renders.
  }, [])

  return (
    <main data-slot="auto-apply-funnel-searching" data-theme="light" className="flex min-h-dvh flex-col items-center bg-surface px-6 pb-16 pt-[68px] text-ink">
      <a href="/" aria-label="Jobwhisper home" className="flex h-[54px] items-center justify-center rounded-[22px] bg-surface-inverse px-6 py-1.5 shadow-popover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        <img src="/funnel/auto-apply/logo.svg" alt="Jobwhisper" width="122" height="24" />
      </a>

      {!online ? <div className="mt-4 w-full max-w-3xl"><FunnelOfflineNotice /></div> : null}

      <div data-slot="funnel-auto-apply-searching" className="flex w-full max-w-[560px] flex-1 flex-col items-center justify-center gap-6 py-14 text-center">
        <h1 className="text-balance text-base font-semibold text-ink sm:text-lg">Finding the best remote &amp; flexible jobs for you…</h1>
        <ol aria-live="polite" className="grid w-full gap-2 font-mono text-sm text-start sm:text-base">
          {steps.map((step, index) =>
            index > done ? null : (
              <li
                key={index}
                className={cn('flex animate-fade-in-up items-start gap-2 leading-6 motion-reduce:animate-none', index < done ? 'text-ink-muted' : 'text-ink')}
              >
                <span aria-hidden="true" className="shrink-0">{index < done ? '✓' : '>'}</span>
                <span className="min-w-0 break-words">{step.label}</span>
                <span className="sr-only">{index < done ? '(done)' : '(in progress)'}</span>
              </li>
            ),
          )}
        </ol>
        <dl className="grid w-full grid-cols-3 gap-2 border-t border-border pt-6 text-center sm:gap-4">
          {SEARCH_STATS.map((stat) => (
            <div key={stat.label} className="grid gap-1">
              <dd className="font-gowun text-2xl font-bold leading-none text-ink tabular-nums sm:text-3xl">{stat.value}</dd>
              <dt className="text-xs leading-4 text-ink-muted sm:text-sm">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </main>
  )
}

function AutoApplyUploadLanding({ fileName, uploadError, online, onFile, onContinue }: FunnelAutoApplyViewProps) {
  const inputId = useId()
  const errorId = useId()
  const [dragging, setDragging] = useState(false)
  const [benefitPage, setBenefitPage] = useState(0)

  function receiveFile(file: File) {
    onFile(file)
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) receiveFile(file)
  }

  return (
    <main data-slot="auto-apply-funnel-upload" data-theme="light" className="min-h-dvh bg-surface text-ink">
      <section data-slot="auto-apply-upload-hero" className="min-h-dvh bg-accent-subtle px-4 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto flex min-h-[calc(100dvh-6rem)] w-full max-w-[1114px] flex-col items-center sm:min-h-[calc(100dvh-8rem)]">
          <a href="/" aria-label="Jobwhisper home" className="flex h-[54px] items-center rounded-[22px] bg-surface-inverse px-6 shadow-announcement focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><img src="/funnel/auto-apply/logo.svg" alt="Jobwhisper" width="122" height="24" /></a>
          <div data-slot="auto-apply-upload-content" className="flex w-full flex-1 flex-col items-center justify-center gap-10 py-8">
          <header className="grid justify-items-center gap-1 text-center">
            <p className="text-xl font-bold leading-7 text-ink sm:text-2xl">Apply to jobs in 1-click.</p>
            <h1 id="auto-apply-upload-title" className="font-gowun text-[clamp(2.75rem,5vw,4rem)] font-bold leading-none tracking-[-3.01px] text-landing-ink"><span className="block">Find your next role.</span><span className="block">Land the Job. Or Don’t Pay!</span></h1>
          </header>
          <div className="grid justify-items-center gap-1 text-center">
            <h2 className="text-lg font-semibold sm:text-xl">Browse handpicked jobs from the best companies</h2>
            <p className="flex items-center gap-2 text-sm sm:text-lg"><img src="/funnel/auto-apply/people.png" alt="" width="100" height="31" />Trusted by 2M+ job seekers</p>
          </div>
          <div className="w-full overflow-hidden rounded-xl border border-border bg-surface">
            <label htmlFor={inputId} data-dragging={dragging || undefined} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={handleDrop} className="flex min-h-[340px] cursor-pointer flex-col items-center justify-center gap-3.5 rounded-[10px] border border-dashed border-input p-6 text-center data-[dragging]:border-accent data-[dragging]:bg-accent-subtle has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus">
              <span className="grid size-12 place-items-center rounded-xl border border-border bg-surface shadow-control"><img src="/funnel/auto-apply/upload.svg" alt="" width="22" height="22" /></span>
              <span className="grid gap-1"><strong className="text-[15px] font-medium">{fileName ?? 'Drop a resume here, or browse files'}</strong><span className="text-[13px] text-ink-muted">{fileName ? 'Resume uploaded' : 'PDF · up to 2 MB'}</span></span>
              {fileName ? <span className="text-[13px] font-semibold text-accent-text underline underline-offset-4">Change resume</span> : <span className="rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-on-accent">Import resume</span>}
              <input id={inputId} type="file" accept={FUNNEL_UPLOAD_ACCEPT} aria-label="Your resume" aria-describedby={uploadError ? errorId : undefined} aria-invalid={uploadError ? true : undefined} onChange={(event) => { const file = event.target.files?.[0]; if (file) receiveFile(file); event.target.value = '' }} className="sr-only" />
            </label>
          </div>
          {uploadError ? <p id={errorId} role="alert" className="-mt-8 text-sm text-danger">{uploadError}</p> : null}
          <button type="button" disabled={!online || !fileName} onClick={onContinue} className="min-h-12 w-full max-w-[415px] rounded bg-accent px-4 py-2 text-xl font-bold leading-[30px] text-on-accent disabled:cursor-not-allowed disabled:bg-disabled-surface disabled:text-disabled-text">Start Your Remote Job Search Now!</button>
          </div>
        </div>
      </section>
      <section aria-labelledby="auto-apply-benefits" className="px-5 py-16 sm:px-8">
        <h2 id="auto-apply-benefits" className="text-center font-gowun text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none tracking-[-3.01px] text-landing-ink">The <span className="relative inline-block">#1 Site<img className="absolute -bottom-1 start-0" src="/funnel/auto-apply/footer-underline.png" alt="" width="173" height="8" /></span> for Remote jobs</h2>
        <div className="relative mx-auto mt-12 w-full max-w-[1290px] px-0 sm:px-16">
          <div className="grid gap-9 md:grid-cols-3" aria-live="polite">
            {AUTO_APPLY_BENEFITS.slice(benefitPage * 3, benefitPage * 3 + 3).map((benefit) => <BenefitCard key={benefit.title} {...benefit} />)}
          </div>
          <button type="button" aria-label="Previous benefits" onClick={() => setBenefitPage((page) => (page === 0 ? 1 : page - 1))} className="mt-6 inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:absolute sm:start-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"><ChevronLeft aria-hidden="true" className="size-5 rtl:rotate-180" /></button>
          <button type="button" aria-label="Next benefits" onClick={() => setBenefitPage((page) => (page === 1 ? 0 : page + 1))} className="mt-6 inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:absolute sm:end-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"><ChevronRight aria-hidden="true" className="size-5 rtl:rotate-180" /></button>
        </div>
      </section>
    </main>
  )
}

type AutoApplyBenefit = { readonly icon: string; readonly title: string; readonly body: string; readonly quote: string; readonly emphasis: string; readonly person: string; readonly company: string; readonly avatar: string }

const AUTO_APPLY_BENEFITS: readonly AutoApplyBenefit[] = [
  { icon: 'footer-quality.svg', title: 'Higher Quality Listings', body: 'Only legitimate jobs. No ads, scams, or junk to sift through. Our team verifies every role and writes clear company descriptions, so you always know who is hiring.', quote: 'After losing time to a job scam, I needed a search I could trust. Jobwhisper showed me verified roles with the details I needed before applying.', emphasis: 'I finally felt safe moving forward.', person: 'Vickie R.', company: 'Hired at Quick Med Claims', avatar: 'avatar-2.png' },
  { icon: 'footer-tools.svg', title: 'Personalized Tools', body: 'Save and apply to relevant jobs, track activity with clear checklists, and get alerts whenever a new role matches the experience and priorities in your profile.', quote: 'Jobwhisper gave me one place to compare roles, remember every follow-up, and stay focused without rebuilding my search across different tabs.', emphasis: 'My applications finally felt organized.', person: 'Daniel S.', company: 'Hired at Lyft', avatar: 'avatar-3.png' },
  { icon: 'footer-time.svg', title: 'Save Time', body: 'Move straight from matched job listings to complete applications. Spend less time repeating searches and more time preparing for the opportunities that fit.', quote: 'I stopped spending evenings checking the same job boards. Jobwhisper surfaced strong remote roles and helped me act while the opportunities were still fresh.', emphasis: 'That speed changed my search.', person: 'Stephanie H.', company: 'Hired at Belay', avatar: 'avatar-4.png' },
  { icon: 'footer-quality.svg', title: 'Better Matches', body: 'Compare every opening with your experience, location, preferred work style, and salary before you spend time applying.', quote: 'The search stopped feeling random.', emphasis: 'The roles finally made sense for my experience.', person: 'Amara O.', company: 'Hired at Remote' , avatar: 'avatar-2.png' },
  { icon: 'footer-tools.svg', title: 'One Search Workspace', body: 'Keep promising roles, application notes, next steps, and status updates together instead of rebuilding your shortlist every day.', quote: 'I could see exactly what needed my attention.', emphasis: 'Nothing disappeared into another tab.', person: 'Kwame M.', company: 'Hired at Deel', avatar: 'avatar-3.png' },
  { icon: 'footer-time.svg', title: 'Privacy & Support', body: 'Your resume and job-search details stay protected. Support is available whenever an application needs a closer look.', quote: 'I always knew what Jobwhisper was doing.', emphasis: 'I stayed in control of every application.', person: 'Sophie M.', company: 'Hired at Notion', avatar: 'avatar-4.png' },
]

function BenefitCard({ icon, title, body, quote, emphasis, person, company, avatar }: AutoApplyBenefit) {
  return <article className="flex min-h-[520px] flex-col rounded-lg bg-surface px-7 pb-7 pt-10 shadow-lg"><img src={`/funnel/auto-apply/${icon}`} alt="" width="74" height="71" /><h3 className="mt-5 text-[28px] font-semibold leading-10">{title}</h3><p data-slot="auto-apply-benefit-body" className="mt-3 min-h-28 text-base font-medium leading-6 text-ink-muted">{body}</p><div data-slot="auto-apply-benefit-testimonial" className="mt-8 border-t border-border pt-7"><blockquote className="min-h-24 text-sm leading-5">“{quote} <strong className="font-semibold text-accent-text">{emphasis}</strong>”</blockquote><div className="mt-4 flex items-center gap-2"><img src={`/funnel/auto-apply/${avatar}`} alt="" width="32" height="32" className="rounded-full" /><p className="grid text-sm leading-4 text-ink-muted"><span>{person}</span><strong className="font-semibold text-ink">{company}</strong></p></div></div></article>
}

function MatchHeader({ matches, answers }: Pick<FunnelAutoApplyViewProps, 'matches' | 'answers'>) {
  const summary = [answers.role, answers.location, answers.workMode].filter(Boolean).join(' · ')
  const average = Math.round(matches.reduce((sum, job) => sum + job.matchPercent, 0) / matches.length)
  const best = matches.reduce((top, job) => (job.matchPercent > top.matchPercent ? job : top))
  return (
    <div className="grid gap-8">
      <FunnelTitle eyebrow="Your matches">{matches.length} jobs we’d apply to for you.</FunnelTitle>

      <dl className="mx-auto flex w-full max-w-2xl items-stretch justify-center divide-x divide-border text-center rtl:divide-x-reverse">
        <div className="grid flex-1 gap-1 px-4">
          <dt className="order-2 text-sm text-ink-muted">Roles found</dt>
          <dd className="order-1 font-gowun text-3xl font-bold leading-none text-ink sm:text-4xl">{matches.length}</dd>
        </div>
        <div className="grid flex-1 gap-1 px-4">
          <dt className="order-2 text-sm text-ink-muted">Average match</dt>
          <dd className="order-1 font-gowun text-3xl font-bold leading-none text-ink sm:text-4xl">{average}%</dd>
        </div>
        <div className="grid flex-1 gap-1 px-4">
          <dt className="order-2 text-sm text-ink-muted">Best match</dt>
          <dd className="order-1 font-gowun text-3xl font-bold leading-none text-ink sm:text-4xl">{best.matchPercent}%</dd>
        </div>
      </dl>
      {summary ? <p className="-mt-4 text-center text-sm text-ink-muted">For {summary}</p> : null}
    </div>
  )
}

function MatchRows({ matches, onSelectJob, onApply, selectedJobId }: FunnelAutoApplyViewProps) {
  return (
    <ul aria-label="Matched jobs" className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
        {matches.map((job) => (
          <li key={job.id} className={cn('flex items-start gap-3 px-4 py-3 transition-colors duration-fast', job.id === selectedJobId ? 'bg-accent-subtle' : 'hover:bg-surface-subtle')}>
            <button
              type="button"
              onClick={() => onSelectJob(job.id)}
              aria-label={`View ${job.title} at ${job.company}, ${JOB_STATUS_LABELS[job.status]}`}
              aria-current={job.id === selectedJobId ? 'true' : undefined}
              className="flex min-w-0 flex-1 items-start gap-4 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <span
                className={cn(
                  'grid size-9 shrink-0 place-items-center rounded-lg text-xs font-bold',
                  job.company.toLowerCase().includes('stripe') ? 'bg-accent-subtle text-accent-text' : 'bg-danger-surface text-danger',
                )}
              >
                {job.company.slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-gowun font-semibold text-ink">{job.title}</span>
                  <span className="rounded bg-positive-surface px-2 py-0.5 text-[10px] font-bold text-positive">{job.matchPercent}% MATCH</span>
                  {job.status === 'new' ? <MatchStatusBadge status="new" className="rounded-full px-2 py-0.5 text-xs" /> : null}
                </span>
                <span className="mt-1 block text-xs text-ink-muted">
                  {job.company} - {job.location} - {job.type}
                </span>
                <span className="mt-1 block text-xs text-ink-muted">
                  Found {job.dateLabel} - {job.source}
                </span>
              </span>
            </button>
            {job.status === 'new' ? (
              <button
                type="button"
                onClick={() => onApply(job.id)}
                aria-label={`Apply to ${job.title} at ${job.company}`}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                Apply
              </button>
            ) : (
              <MatchStatusBadge status={job.status} />
            )}
          </li>
        ))}
    </ul>
  )
}

const JOB_STATUS_LABELS: Record<AutoApplyJob['status'], string> = {
  applied: 'Applied',
  new: 'New',
  queued: 'Queued',
  applying: 'Applying',
  'posting-closed': 'Posting closed',
}

const JOB_STATUS_CLASSES: Record<AutoApplyJob['status'], string> = {
  applied: 'bg-accent-subtle text-accent-text',
  new: 'bg-warning-surface text-warning',
  queued: 'bg-accent-subtle text-accent-text',
  applying: 'bg-accent-subtle text-accent-text',
  'posting-closed': 'bg-surface-subtle text-ink-muted',
}

function MatchStatusBadge({ status, className }: { readonly status: AutoApplyJob['status']; readonly className?: string }) {
  return <span className={cn('shrink-0 rounded-lg px-4 py-2 text-sm font-medium', JOB_STATUS_CLASSES[status], className)}>{JOB_STATUS_LABELS[status]}</span>
}

function matchLabel(percent: number): string {
  if (percent >= 90) return 'Excellent Match'
  if (percent >= 75) return 'Great Match'
  if (percent >= 60) return 'Good Match'
  return 'Fair Match'
}

/** Matches the slide-out keyframe so the panel is gone exactly when the motion ends. */
const PANEL_EXIT_MS = 200

function JobDetailPanel({ job, onClose, onApply }: { readonly job: AutoApplyJob; readonly onClose: () => void; readonly onApply: (target: string) => void }) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const [closing, setClosing] = useState(false)

  // Closing plays the slide-out before unmounting; reduced motion leaves straight away.
  function requestClose() {
    if (closing) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      onClose()
      return
    }
    setClosing(true)
  }

  useEffect(() => {
    if (!closing) return
    const timer = window.setTimeout(() => onClose(), PANEL_EXIT_MS)
    return () => window.clearTimeout(timer)
  }, [closing, onClose])

  useEffect(() => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeRef.current?.focus()
    return () => openerRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      // Capture phase, so the shell reads this as "close the panel", not "leave the funnel".
      event.preventDefault()
      requestClose()
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- requestClose only reads closing/onClose
  }, [closing, onClose])

  return (
    <>
      <div
        data-closing={closing || undefined}
        onClick={requestClose}
        aria-hidden="true"
        className={cn('fixed inset-0 z-40 bg-overlay lg:hidden motion-reduce:animate-none', closing ? 'animate-fade-out' : 'animate-fade-in')}
      />
      <aside
        data-slot="funnel-job-panel"
        data-closing={closing || undefined}
        aria-labelledby={titleId}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-xl border border-border bg-surface shadow-panel lg:static lg:z-auto lg:h-full lg:w-[26rem] lg:max-h-none lg:shrink-0 lg:rounded-none lg:border-0 lg:border-s lg:shadow-none motion-reduce:animate-none',
          closing ? 'animate-slide-out-bottom lg:animate-slide-out-right lg:rtl:animate-slide-out-left' : 'animate-slide-in-bottom lg:animate-slide-in-right lg:rtl:animate-slide-in-left',
        )}
      >
        <div className="flex shrink-0 items-center justify-between px-6 pt-4 pb-1 lg:hidden">
          <div className="mx-auto h-1 w-10 rounded-full bg-muted" aria-hidden="true" />
        </div>
        <div className="flex shrink-0 items-start justify-between gap-3 px-6 pt-3 pb-4">
          <div className="min-w-0">
            <h2 id={titleId} className="font-gowun text-xl font-bold leading-tight text-ink">{job.title}</h2>
            <p className="mt-1 text-sm text-ink-muted">{job.company} · {job.location}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={requestClose}
            aria-label="Close job details"
            className="grid size-10 shrink-0 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <MatchStatusBadge status={job.status} className="rounded-full px-3 py-1 text-xs" />
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-ink">{job.salaryLabel}</span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-ink">{job.postedDateLabel}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-subtle px-3 py-1 text-xs font-medium text-ink-muted">
              <CircleHelp aria-hidden="true" className="size-3.5" />
              Still open? Not checked
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Posted</p>
              <p className="mt-1 text-sm text-ink">{job.postedDateLabel}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Found</p>
              <p className="mt-1 text-sm text-ink">{job.dateLabel}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-5">
            <section className="grid gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Job Listing</h3>
              <a href={job.listingUrl} target="_blank" rel="noopener noreferrer" className="flex min-w-0 items-center gap-2 text-sm text-accent underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">{job.listingUrl}</span>
              </a>
            </section>

            <section className="grid gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Resume We&rsquo;ll Submit</h3>
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2 text-sm text-ink">
                  <FileText aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
                  <span className="truncate">{job.resumeFileName}</span>
                </span>
                <span className="shrink-0 rounded-full bg-positive-surface px-2.5 py-0.5 text-xs font-bold text-positive">ATS {job.matchPercent}</span>
              </div>
            </section>

            <section className="grid gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Get Tailored Resume</h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex min-w-0 items-center gap-2">
                  <FileText aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
                  <span className="text-sm font-bold text-accent-text underline decoration-solid underline-offset-4">Get a resume for this role</span>
                </span>
                <span className="text-ink-muted" aria-hidden="true">·</span>
                <span className="text-sm text-ink-muted">1 Credit</span>
              </div>
            </section>

            <section className="rounded-lg bg-positive-surface p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wide text-positive">{matchLabel(job.matchPercent)}</h3>
                <p className="text-2xl font-bold text-positive">{job.matchPercent}%</p>
              </div>
              {job.matchBreakdown.length > 0 ? (
                <ul className="mt-3 grid gap-1.5 border-t border-border pt-3">
                  {job.matchBreakdown.map((factor) => (
                    <li key={factor.label} className="flex items-center justify-between gap-3 text-sm text-ink">
                      <span>{factor.label}</span>
                      <span className="shrink-0 font-semibold text-positive">+{factor.points}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-accent-subtle px-2 py-1 text-xs font-medium text-accent-text">{tag}</span>
              ))}
            </div>

            <section className="grid gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">About the role</h3>
              <p className="text-sm leading-6 text-pretty text-ink-muted">{job.description}</p>
            </section>
          </div>

          <div className="mt-6 grid gap-2 border-t border-border pt-5">
            {job.status === 'new' ? (
              <>
                <button type="button" onClick={() => onApply(job.id)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <Send aria-hidden="true" className="size-4" />
                  Apply Now
                </button>
                <a href={job.listingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <ExternalLink aria-hidden="true" className="size-4" />
                  Apply Manually
                </a>
                <button type="button" onClick={requestClose} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  Close
                </button>
              </>
            ) : (
              <>
                <a href={job.listingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <ExternalLink aria-hidden="true" className="size-4" />
                  View Listing
                </a>
                <button type="button" onClick={requestClose} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  Close
                </button>
              </>
            )}
          </div>
        </div>
        {job.status === 'new' ? (
          <div className="shrink-0 border-t border-border px-6 py-4 lg:hidden">
            <Button size="lg" className="w-full" onClick={() => onApply(job.id)}>Apply to this job</Button>
          </div>
        ) : null}
      </aside>
    </>
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
              <span className="shrink-0 text-sm font-semibold text-accent-text">{item.matchPercent}%</span>
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
