import { useState, type FormEvent } from 'react'
import { ArrowRight, CircleCheck, Lock } from 'lucide-react'

import type { FunnelAnswers, FunnelCardStatus, FunnelQuestion as FunnelQuestionData, FunnelTrialOffer } from '@/contracts/funnel.draft'
import type { Session } from '@/contracts/identity'
import { Button, FormField } from '@/ui'
import { FunnelGate } from './funnel-gate'
import { FunnelQuestion, FunnelQuestionFooter } from './funnel-question'
import { FunnelOfflineNotice, FunnelShell, FunnelTitle } from './funnel-shell'
import { FunnelWorking } from './funnel-working'

export type FunnelTrialStep = 'quiz' | 'working' | 'reward' | 'account' | 'card' | 'done'

export type FunnelTrialViewProps = {
  readonly step: FunnelTrialStep
  readonly questions: readonly FunnelQuestionData[]
  /** Which question the quiz step shows; ignored on other steps. */
  readonly questionIndex: number
  readonly answers: FunnelAnswers
  readonly offer: FunnelTrialOffer
  readonly session: Session
  readonly online: boolean
  readonly cardStatus: FunnelCardStatus
  readonly cardError?: string
  /** The resume file handed over from the landing page, read back in the recap. */
  readonly resumeName?: string
  readonly onAnswer: (questionId: string, value: string) => void
  readonly onBack: () => void
  readonly onContinue: () => void
  readonly onClose: () => void
  readonly onClaim: () => void
  readonly onCreateAccount: (email: string) => void
  readonly onGoogleSignUp: () => void
  readonly onSubmitCard: () => void
  readonly onStart: () => void
}

const STEP_LABELS: Record<Exclude<FunnelTrialStep, 'quiz'>, string> = {
  working: 'Setting up',
  reward: 'Your reward',
  account: 'Your account',
  card: 'Start your week',
  done: 'All set',
}

const WORKING_CHECKS = ['Reading your answers', 'Matching your goal to a plan', 'Setting up your workspace'] as const

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`))
}

function progressFor(step: FunnelTrialStep, questionIndex: number, total: number): number {
  const steps = total + 3
  if (step === 'quiz') return (questionIndex + 1) / steps
  if (step === 'working' || step === 'reward') return (total + 1) / steps
  if (step === 'account' || step === 'card') return (total + 2) / steps
  return 1
}

export function FunnelTrialView(props: FunnelTrialViewProps) {
  const { step, questions, questionIndex, answers, online, onClose } = props
  const question = questions[Math.min(Math.max(questionIndex, 0), questions.length - 1)]
  const label = step === 'quiz' ? question?.tab ?? '' : STEP_LABELS[step]

  const notice = online ? null : <FunnelOfflineNotice />

  return (
    <FunnelShell
      label={label}
      progress={progressFor(step, questionIndex, questions.length)}
      onClose={onClose}
      notice={notice}
      footer={step === 'quiz' && question ? <FunnelQuestionFooter position={questionIndex} total={questions.length} canContinue={online && (answers[question.id] ?? '').trim().length > 0} onBack={props.onBack} onContinue={props.onContinue} /> : undefined}
    >
      {step === 'quiz' && question ? <FunnelQuestion question={question} value={answers[question.id] ?? ''} onChange={(value) => props.onAnswer(question.id, value)} /> : null}
      {step === 'working' ? <FunnelWorking title="Putting your setup together." checks={WORKING_CHECKS} /> : null}
      {step === 'reward' ? <RewardStep {...props} /> : null}
      {step === 'account' ? <AccountStep {...props} /> : null}
      {step === 'card' ? <CardStep {...props} /> : null}
      {step === 'done' ? <DoneStep {...props} /> : null}
    </FunnelShell>
  )
}

function PlanPass({ offer, caption }: { readonly offer: FunnelTrialOffer; readonly caption: string }) {
  return (
    <div className="rounded-panel bg-accent p-6 text-on-accent sm:p-8">
      <p className="text-sm font-medium">{caption}</p>
      <p className="mt-2 font-gowun text-4xl font-bold leading-tight sm:text-5xl">{offer.trialDays} days of {offer.planName}</p>
      <ul className="mt-5 grid gap-2 text-sm leading-6">
        {offer.includes.map((line) => (
          <li key={line} className="flex gap-2"><CircleCheck aria-hidden="true" className="mt-1 size-4 shrink-0" />{line}</li>
        ))}
      </ul>
    </div>
  )
}

function RewardStep({ offer, questions, answers, resumeName, onClaim, onClose }: FunnelTrialViewProps) {
  const recap = questions.filter((item) => (answers[item.id] ?? '').trim()).slice(0, 4)
  return (
    <div className="grid gap-8">
      <FunnelTitle>You’ve unlocked a free week of {offer.planName}.</FunnelTitle>
      <PlanPass offer={offer} caption="Free for you, starting today" />

      {recap.length > 0 || resumeName ? (
        <dl className="grid gap-3 rounded-panel border border-border bg-surface p-5">
          {resumeName ? <RecapRow term="Resume" detail={resumeName} /> : null}
          {recap.map((item) => <RecapRow key={item.id} term={item.tab} detail={answers[item.id] ?? ''} />)}
        </dl>
      ) : null}

      <div className="grid gap-3">
        <Button size="lg" onClick={onClaim} className="w-full sm:w-auto sm:justify-self-start">
          Claim my free week
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
        <p className="text-sm leading-6 text-ink-muted">
          $0 today. Add a card to start it, then ${offer.monthlyUsd} a month after {offer.trialDays} days unless you cancel.
        </p>
        <button type="button" onClick={onClose} className="min-h-11 justify-self-start text-sm font-medium text-ink-muted underline underline-offset-4 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          Not now
        </button>
      </div>
    </div>
  )
}

function RecapRow({ term, detail }: { readonly term: string; readonly detail: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <dt className="text-sm text-ink-muted">{term}</dt>
      <dd className="min-w-0 break-words text-end font-medium text-ink">{detail}</dd>
    </div>
  )
}

function AccountStep({ online, offer, onCreateAccount, onGoogleSignUp }: FunnelTrialViewProps) {
  return (
    <FunnelGate
      title="Create your account for your free week."
      body={`Your answers are saved to it, so ${offer.planName} opens set up for you. Next you add a card, and nothing is charged today.`}
      online={online}
      emailFieldId="funnel-trial-email"
      onCreateAccount={onCreateAccount}
      onGoogleSignUp={onGoogleSignUp}
    />
  )
}

function CardStep({ offer, online, cardStatus, cardError, onSubmitCard }: FunnelTrialViewProps) {
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  const digits = number.replace(/\D/g, '')
  const complete = name.trim().length > 0 && digits.length >= 13 && digits.length <= 19 && /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.trim()) && /^\d{3,4}$/.test(cvc.trim())
  const processing = cardStatus === 'processing'
  const chargeDate = formatDate(offer.firstChargeOn)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (complete && online && !processing) onSubmitCard()
  }

  return (
    <div className="grid gap-8">
      <FunnelTitle>Start your free week of {offer.planName}.</FunnelTitle>

      <section aria-labelledby="funnel-trial-terms" className="grid gap-4 rounded-panel border border-border bg-surface p-6">
        <p id="funnel-trial-terms" className="font-gowun text-4xl font-bold leading-none text-ink">$0 today</p>
        <ul className="grid gap-3 text-base leading-7 text-ink">
          <li className="flex gap-3"><CircleCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-positive" />Free for {offer.trialDays} days, until {chargeDate}.</li>
          <li className="flex gap-3"><CircleCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-positive" />Then {offer.planName} at ${offer.monthlyUsd} a month, until you cancel.</li>
          <li className="flex gap-3"><CircleCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-positive" />We’ll email you {offer.reminderDaysBefore} days before the first charge. Cancel before {chargeDate} and you pay nothing.</li>
        </ul>
      </section>

      <form noValidate onSubmit={submit} className="grid gap-5 rounded-panel border border-border bg-surface p-6 shadow-panel">
        {cardStatus === 'declined' ? (
          <p role="alert" className="rounded-lg bg-danger-surface px-4 py-3 text-sm leading-6 text-ink">
            {cardError ?? 'This card was declined. Check the details or try another card.'}
          </p>
        ) : null}
        <FormField id="funnel-card-name" label="Name on card" autoComplete="cc-name" value={name} onChange={(event) => setName(event.target.value)} />
        <FormField id="funnel-card-number" label="Card number" autoComplete="cc-number" inputMode="numeric" value={number} onChange={(event) => setNumber(event.target.value)} />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="funnel-card-expiry" label="Expiry (MM/YY)" autoComplete="cc-exp" inputMode="numeric" placeholder="MM/YY" value={expiry} onChange={(event) => setExpiry(event.target.value)} />
          <FormField id="funnel-card-cvc" label="Security code" autoComplete="cc-csc" inputMode="numeric" value={cvc} onChange={(event) => setCvc(event.target.value)} />
        </div>
        <Button type="submit" size="lg" loading={processing} disabled={!complete || !online || processing}>
          Start my free week
        </Button>
        <p className="flex items-start gap-2 text-sm leading-6 text-ink-muted">
          <Lock aria-hidden="true" className="mt-1 size-4 shrink-0" />
          Card details go straight to our payment processor. By starting the trial you agree to the <a href="/terms" className="font-medium text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Terms</a>.
        </p>
      </form>
    </div>
  )
}

function DoneStep({ offer, onStart }: FunnelTrialViewProps) {
  return (
    <div className="grid gap-8">
      <FunnelTitle>Your free week of {offer.planName} has started.</FunnelTitle>
      <PlanPass offer={offer} caption={`Free until ${formatDate(offer.firstChargeOn)}`} />
      <p className="text-base leading-7 text-ink-muted">We’ll email you {offer.reminderDaysBefore} days before it ends. Cancel from Billing any time before {formatDate(offer.firstChargeOn)} and you pay nothing.</p>
      <Button size="lg" onClick={onStart} className="w-full sm:w-auto sm:justify-self-start">
        Start with your setup
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
    </div>
  )
}
