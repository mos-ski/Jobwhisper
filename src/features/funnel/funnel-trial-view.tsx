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

function stepFor(step: FunnelTrialStep, questionIndex: number, total: number): number {
  if (step === 'quiz') return questionIndex + 1
  if (step === 'working' || step === 'reward') return total + 1
  if (step === 'account' || step === 'card') return total + 2
  return total + 3
}

const cta = 'min-h-12 w-full px-7 text-base sm:w-auto'

export function FunnelTrialView(props: FunnelTrialViewProps) {
  const { step, questions, questionIndex, answers, online, onClose } = props
  const question = questions[Math.min(Math.max(questionIndex, 0), questions.length - 1)]
  const label = step === 'quiz' ? question?.tab ?? '' : STEP_LABELS[step]

  return (
    <FunnelShell
      label={label}
      stepCount={questions.length + 3}
      currentStep={stepFor(step, questionIndex, questions.length)}
      onClose={onClose}
      notice={online ? null : <FunnelOfflineNotice />}
      footer={step === 'quiz' && question ? <FunnelQuestionFooter position={questionIndex} total={questions.length} canContinue={online && (answers[question.id] ?? '').trim().length > 0} onBack={props.onBack} onContinue={props.onContinue} /> : undefined}
    >
      {step === 'quiz' && question ? (
        <FunnelQuestion
          key={question.id}
          question={question}
          eyebrow={`Question ${questionIndex + 1} of ${questions.length}`}
          value={answers[question.id] ?? ''}
          onChange={(value) => props.onAnswer(question.id, value)}
          onAutoAdvance={online ? props.onContinue : undefined}
        />
      ) : null}
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
    <div data-slot="plan-pass" className="relative overflow-hidden rounded-3xl bg-surface-inverse text-surface shadow-panel">
      <div className="px-6 pb-7 pt-6 sm:px-10 sm:pt-8">
        <p className="text-sm font-semibold text-accent-muted">{caption}</p>
        <p className="mt-3 font-gowun text-5xl font-bold leading-none sm:text-6xl">{offer.trialDays} days of {offer.planName}</p>
      </div>
      {/* The notches and dashed rule make the card read as a pass you tear off, not another panel. */}
      <div aria-hidden="true" className="relative">
        <span className="absolute -start-3 top-0 size-6 -translate-y-1/2 rounded-full bg-surface" />
        <span className="absolute -end-3 top-0 size-6 -translate-y-1/2 rounded-full bg-surface" />
        <div className="mx-6 border-t-2 border-dashed border-ink-muted sm:mx-10" />
      </div>
      <ul className="grid gap-3 px-6 pb-7 pt-6 text-sm leading-6 sm:grid-cols-2 sm:px-10 sm:pb-8">
        {offer.includes.map((line) => (
          <li key={line} className="flex gap-2"><CircleCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-accent-muted" />{line}</li>
        ))}
      </ul>
    </div>
  )
}

function RewardStep({ offer, questions, answers, resumeName, onClaim, onClose }: FunnelTrialViewProps) {
  const recap = questions.filter((item) => (answers[item.id] ?? '').trim()).slice(0, 4)
  return (
    <div className="grid gap-10">
      <FunnelTitle eyebrow="Your setup is ready">You’ve unlocked a free week of {offer.planName}.</FunnelTitle>
      <PlanPass offer={offer} caption="Starts today, free" />

      {recap.length > 0 || resumeName ? (
        <dl aria-label="Your setup" className="flex flex-wrap justify-center gap-2">
          {resumeName ? <RecapChip term="Resume" detail={resumeName} /> : null}
          {recap.map((item) => <RecapChip key={item.id} term={item.tab} detail={answers[item.id] ?? ''} />)}
        </dl>
      ) : null}

      <div className="grid justify-items-center gap-3 text-center">
        <Button size="lg" onClick={onClaim} className={cta}>
          Claim my free week
          <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Button>
        <p className="max-w-sm text-sm leading-6 text-ink-muted">
          $0 today. Add a card to start it, then ${offer.monthlyUsd} a month after {offer.trialDays} days unless you cancel.
        </p>
        <button type="button" onClick={onClose} className="min-h-11 rounded-md px-2 text-sm font-medium text-ink-muted underline underline-offset-4 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          Not now
        </button>
      </div>
    </div>
  )
}

function RecapChip({ term, detail }: { readonly term: string; readonly detail: string }) {
  return (
    <div className="flex min-w-0 max-w-full items-baseline gap-1.5 rounded-full bg-surface-subtle px-4 py-2 text-sm">
      <dt className="shrink-0 text-ink-muted">{term}</dt>
      <dd className="min-w-0 truncate font-medium text-ink">{detail}</dd>
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
    <div className="grid gap-10">
      <FunnelTitle eyebrow="Nothing is charged today">Start your free week of {offer.planName}.</FunnelTitle>

      <section aria-labelledby="funnel-trial-terms" className="mx-auto grid w-full max-w-md gap-5">
        <h2 id="funnel-trial-terms" className="sr-only">Trial terms</h2>
        <dl className="divide-y divide-border rounded-2xl border border-border">
          <div className="flex items-baseline justify-between gap-4 px-5 py-4">
            <dt className="text-base font-semibold text-ink">Today</dt>
            <dd className="font-gowun text-3xl font-bold leading-none text-ink">$0 today</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 px-5 py-4">
            <dt className="text-sm text-ink-muted">From {chargeDate}</dt>
            <dd className="text-base font-semibold text-ink">${offer.monthlyUsd}/month</dd>
          </div>
        </dl>
        <ul className="grid gap-2 text-sm leading-6 text-ink">
          <li className="flex gap-2"><CircleCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-positive" />Free for {offer.trialDays} days, until {chargeDate}.</li>
          <li className="flex gap-2"><CircleCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-positive" />Then {offer.planName} at ${offer.monthlyUsd} a month, until you cancel.</li>
          <li className="flex gap-2"><CircleCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-positive" />We’ll email you {offer.reminderDaysBefore} days before the first charge. Cancel before {chargeDate} and you pay nothing.</li>
        </ul>
      </section>

      <form noValidate onSubmit={submit} className="mx-auto grid w-full max-w-md gap-5">
        {cardStatus === 'declined' ? (
          <p role="alert" className="rounded-2xl bg-danger-surface px-4 py-3 text-sm leading-6 text-ink">
            {cardError ?? 'This card was declined. Check the details or try another card.'}
          </p>
        ) : null}
        <FormField id="funnel-card-name" label="Name on card" autoComplete="cc-name" value={name} onChange={(event) => setName(event.target.value)} />
        <FormField id="funnel-card-number" label="Card number" autoComplete="cc-number" inputMode="numeric" value={number} onChange={(event) => setNumber(event.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <FormField id="funnel-card-expiry" label="Expiry (MM/YY)" autoComplete="cc-exp" inputMode="numeric" placeholder="MM/YY" value={expiry} onChange={(event) => setExpiry(event.target.value)} />
          <FormField id="funnel-card-cvc" label="Security code" autoComplete="cc-csc" inputMode="numeric" value={cvc} onChange={(event) => setCvc(event.target.value)} />
        </div>
        <Button type="submit" size="lg" className="min-h-12 text-base" loading={processing} disabled={!complete || !online || processing}>
          Start my free week
        </Button>
        <p className="flex items-start justify-center gap-2 text-center text-sm leading-6 text-ink-muted">
          <Lock aria-hidden="true" className="mt-1 size-4 shrink-0" />
          <span>Card details go straight to our payment processor. By starting the trial you agree to the <a href="/terms" className="font-medium text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Terms</a>.</span>
        </p>
      </form>
    </div>
  )
}

function DoneStep({ offer, onStart }: FunnelTrialViewProps) {
  return (
    <div className="grid gap-10">
      <FunnelTitle eyebrow="You’re in">Your free week of {offer.planName} has started.</FunnelTitle>
      <PlanPass offer={offer} caption={`Free until ${formatDate(offer.firstChargeOn)}`} />
      <div className="grid justify-items-center gap-4 text-center">
        <p className="max-w-md text-base leading-7 text-ink-muted">We’ll email you {offer.reminderDaysBefore} days before it ends. Cancel from Billing any time before {formatDate(offer.firstChargeOn)} and you pay nothing.</p>
        <Button size="lg" onClick={onStart} className={cta}>
          Start with your setup
          <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  )
}
