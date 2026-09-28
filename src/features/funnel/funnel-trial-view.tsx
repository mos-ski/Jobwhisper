import { useState, type FormEvent } from 'react'
import { ArrowRight, CircleCheck, Lock } from 'lucide-react'

import type { FunnelAnswers, FunnelCardStatus, FunnelQuestion as FunnelQuestionData, FunnelTrialOffer } from '@/contracts/funnel.draft'
import type { Session } from '@/contracts/identity'
import { ProOfferPanel } from '@/features/billing/pro-offer-widget'
import { Button, FormField } from '@/ui'
import { FunnelGate } from './funnel-gate'
import { FunnelQuestion, FunnelQuestionFooter } from './funnel-question'
import { FunnelOfflineNotice, FunnelShell, FunnelTitle } from './funnel-shell'

export type FunnelTrialStep = 'quiz' | 'reward' | 'account' | 'card' | 'done'

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
  reward: 'Your reward',
  account: 'Your account',
  card: 'Start your week',
  done: 'All set',
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`))
}

function stepFor(step: FunnelTrialStep, questionIndex: number, total: number): number {
  if (step === 'quiz') return questionIndex + 1
  if (step === 'reward') return total + 1
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
      footer={step === 'quiz' && question ? <FunnelQuestionFooter position={questionIndex} total={questions.length} canContinue={online && (answers[question.id] ?? '').trim().length > 0} showContinue={question.kind === 'text' || question.kind === 'range'} onBack={props.onBack} onContinue={props.onContinue} /> : undefined}
    >
      {step === 'quiz' && question ? (
        <FunnelQuestion
          key={question.id}
          question={question}
          value={answers[question.id] ?? ''}
          onChange={(value) => props.onAnswer(question.id, value)}
          onAutoAdvance={online ? props.onContinue : undefined}
        />
      ) : null}
      {step === 'reward' ? <RewardStep {...props} /> : null}
      {step === 'account' ? <AccountStep {...props} /> : null}
      {step === 'card' ? <CardStep {...props} /> : null}
      {step === 'done' ? <DoneStep {...props} /> : null}
    </FunnelShell>
  )
}

function RewardStep({ offer, questions, answers, resumeName, onClaim, onClose }: FunnelTrialViewProps) {
  const recap = questions.filter((item) => (answers[item.id] ?? '').trim()).slice(0, 4)
  return (
    <div className="grid gap-8">
      <FunnelTitle eyebrow="Your setup is ready">You’ve unlocked {offer.planName} for one week.</FunnelTitle>

      {recap.length > 0 || resumeName ? (
        <dl aria-label="Your setup" className="flex flex-wrap justify-center gap-2">
          {resumeName ? <RecapChip term="Resume" detail={resumeName} /> : null}
          {recap.map((item) => <RecapChip key={item.id} term={item.tab} detail={answers[item.id] ?? ''} />)}
        </dl>
      ) : null}

      <ProOfferPanel onClaim={onClaim} />

      <div className="grid justify-items-center">
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
      title={`Create your account for your week of ${offer.planName}.`}
      body={`Your answers are saved to it, so ${offer.planName} opens set up for you. Next you add a card: $${offer.introUsd} today for the week.`}
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
  const chargeDate = formatDate(offer.firstChargeOn)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (complete && online) onSubmitCard()
  }

  return (
    <div className="grid gap-10">
      <FunnelTitle eyebrow={`$${offer.introUsd} today`}>Start your week of {offer.planName}.</FunnelTitle>

      <section aria-labelledby="funnel-trial-terms" className="mx-auto grid w-full max-w-md gap-5">
        <h2 id="funnel-trial-terms" className="sr-only">Trial terms</h2>
        <dl className="divide-y divide-border rounded-2xl border border-border">
          <div className="flex items-baseline justify-between gap-4 px-5 py-4">
            <dt className="text-base font-semibold text-ink">Today</dt>
            <dd className="font-gowun text-3xl font-bold leading-none text-ink">${offer.introUsd}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 px-5 py-4">
            <dt className="text-sm text-ink-muted">From {chargeDate}</dt>
            <dd className="text-base font-semibold text-ink">${offer.monthlyUsd}/month</dd>
          </div>
        </dl>
        <ul className="grid gap-2 text-sm leading-6 text-ink">
          <li className="flex gap-2"><CircleCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-positive" />{offer.planName} for {offer.trialDays} days for ${offer.introUsd}, until {chargeDate}.</li>
          <li className="flex gap-2"><CircleCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-positive" />Then {offer.planName} at ${offer.monthlyUsd} a month, until you cancel.</li>
          <li className="flex gap-2"><CircleCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-positive" />We’ll email you {offer.reminderDaysBefore} days before the first charge. Cancel before {chargeDate} and you pay nothing more.</li>
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
        <Button type="submit" size="lg" className="min-h-12 text-base" disabled={!complete || !online}>
          Start my week for ${offer.introUsd}
        </Button>
        <p className="flex items-start justify-center gap-2 text-center text-sm leading-6 text-ink-muted">
          <Lock aria-hidden="true" className="mt-1 size-4 shrink-0" />
          <span>Card details go straight to our payment processor. By starting you agree to the <a href="/terms" className="font-medium text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Terms</a>.</span>
        </p>
      </form>
    </div>
  )
}

function DoneStep({ offer, onStart }: FunnelTrialViewProps) {
  const until = formatDate(offer.firstChargeOn)
  return (
    <div className="grid gap-10">
      <FunnelTitle eyebrow="You’re in">Your week of {offer.planName} has started.</FunnelTitle>
      <section aria-label={`What ${offer.planName} includes`} className="mx-auto w-full max-w-md rounded-panel border border-border bg-surface p-6 shadow-panel">
        <p className="text-sm font-semibold text-accent-text">{offer.planName} until {until}</p>
        <ul className="mt-4 grid gap-3 text-sm leading-6 text-ink">
          {offer.includes.map((line) => (
            <li key={line} className="flex gap-2"><CircleCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-positive" />{line}</li>
          ))}
        </ul>
      </section>
      <div className="grid justify-items-center gap-4 text-center">
        <p className="max-w-md text-base leading-7 text-ink-muted">We’ll email you {offer.reminderDaysBefore} days before the week ends. Cancel from Billing any time before {until} and you pay nothing more.</p>
        <Button size="lg" onClick={onStart} className={cta}>
          Start with your setup
          <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  )
}
