import { useState, type FormEvent } from 'react'
import { ArrowRight, CircleCheck, LoaderCircle, Lock, WifiOff } from 'lucide-react'

import type { FunnelAnswers, FunnelCardStatus, FunnelQuestion as FunnelQuestionData, FunnelTrialOffer } from '@/contracts/funnel.draft'
import type { Session } from '@/contracts/identity'
import { Button, FormDividerLabel, FormField, GoogleAuthButton } from '@/ui'
import { FunnelQuestion } from './funnel-question'
import { FunnelShell } from './funnel-shell'

export type FunnelCreditsStep = 'quiz' | 'working' | 'reward' | 'account' | 'card' | 'done'

export type FunnelCreditsViewProps = {
  readonly step: FunnelCreditsStep
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

const STEP_LABELS: Record<Exclude<FunnelCreditsStep, 'quiz'>, string> = {
  working: 'Setting up',
  reward: 'Your reward',
  account: 'Your account',
  card: 'Claim credits',
  done: 'All set',
}

const WORKING_CHECKS = ['Reading your answers', 'Matching your goal to a plan', 'Setting up your workspace'] as const

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`))
}

function progressFor(step: FunnelCreditsStep, questionIndex: number, total: number): number {
  const steps = total + 3
  if (step === 'quiz') return (questionIndex + 1) / steps
  if (step === 'working' || step === 'reward') return (total + 1) / steps
  if (step === 'account' || step === 'card') return (total + 2) / steps
  return 1
}

const heading = 'font-gowun text-3xl font-bold leading-tight text-ink sm:text-4xl'

export function FunnelCreditsView(props: FunnelCreditsViewProps) {
  const { step, questions, questionIndex, answers, online, onClose } = props
  const question = questions[Math.min(Math.max(questionIndex, 0), questions.length - 1)]
  const label = step === 'quiz' ? question?.tab ?? '' : STEP_LABELS[step]

  const notice = online ? null : (
    <p role="status" className="flex shrink-0 items-center justify-center gap-2 bg-warning-surface px-4 py-2 text-center text-sm text-ink">
      <WifiOff aria-hidden="true" className="size-4 shrink-0" />
      You are offline. Your answers stay on this page, and you can carry on when you are back online.
    </p>
  )

  return (
    <FunnelShell
      label={label}
      progress={progressFor(step, questionIndex, questions.length)}
      onClose={onClose}
      notice={notice}
      footer={step === 'quiz' && question ? <QuizFooter {...props} question={question} /> : undefined}
    >
      {step === 'quiz' && question ? <FunnelQuestion question={question} value={answers[question.id] ?? ''} onChange={(value) => props.onAnswer(question.id, value)} /> : null}
      {step === 'working' ? <WorkingStep /> : null}
      {step === 'reward' ? <RewardStep {...props} /> : null}
      {step === 'account' ? <AccountStep {...props} /> : null}
      {step === 'card' ? <CardStep {...props} /> : null}
      {step === 'done' ? <DoneStep {...props} /> : null}
    </FunnelShell>
  )
}

function QuizFooter({ question, questions, questionIndex, answers, online, onBack, onContinue }: FunnelCreditsViewProps & { readonly question: FunnelQuestionData }) {
  const answered = (answers[question.id] ?? '').trim().length > 0
  const last = questionIndex >= questions.length - 1
  return (
    <>
      <Button variant="secondary" size="lg" onClick={onBack}>Back</Button>
      <span className="ms-auto text-sm text-ink-muted">{questionIndex + 1} of {questions.length}</span>
      <Button size="lg" onClick={onContinue} disabled={!answered || !online}>{last ? 'Finish' : 'Continue'}</Button>
    </>
  )
}

function WorkingStep() {
  return (
    <div role="status" className="grid gap-8">
      <h1 className={heading}>Putting your setup together.</h1>
      <ul className="grid gap-4">
        {WORKING_CHECKS.map((check) => (
          <li key={check} className="flex items-center gap-3 text-lg text-ink">
            <LoaderCircle aria-hidden="true" className="size-5 shrink-0 animate-spin text-accent-text motion-reduce:animate-none" />
            {check}
          </li>
        ))}
      </ul>
    </div>
  )
}

function CreditsBalance({ offer }: { readonly offer: FunnelTrialOffer }) {
  return (
    <div className="rounded-panel bg-accent p-6 text-on-accent sm:p-8">
      <p className="text-sm font-medium">Credits waiting for you</p>
      <p className="mt-2 font-gowun text-5xl font-bold leading-none sm:text-6xl">{offer.credits.toLocaleString('en-US')}</p>
      <p className="mt-3 text-sm leading-6">{offer.creditsWorth}</p>
    </div>
  )
}

function RewardStep({ offer, questions, answers, resumeName, onClaim, onClose }: FunnelCreditsViewProps) {
  const recap = questions.filter((item) => (answers[item.id] ?? '').trim()).slice(0, 4)
  return (
    <div className="grid gap-8">
      <h1 className={heading}>You’ve unlocked {offer.credits} credits.</h1>
      <CreditsBalance offer={offer} />

      {recap.length > 0 || resumeName ? (
        <dl className="grid gap-3 rounded-panel border border-border bg-surface p-5">
          {resumeName ? <RecapRow term="Resume" detail={resumeName} /> : null}
          {recap.map((item) => <RecapRow key={item.id} term={item.tab} detail={answers[item.id] ?? ''} />)}
        </dl>
      ) : null}

      <div className="grid gap-3">
        <Button size="lg" onClick={onClaim} className="w-full sm:w-auto sm:justify-self-start">
          Claim my {offer.credits} credits
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
        <p className="text-sm leading-6 text-ink-muted">
          $0 today. Add a card to start a {offer.trialDays}-day {offer.planName} trial and the credits are yours to keep.
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

function AccountStep({ online, offer, onCreateAccount, onGoogleSignUp }: FunnelCreditsViewProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    if (!EMAIL_PATTERN.test(value)) {
      setError('Enter an email address in the form name@example.com.')
      return
    }
    setError(undefined)
    onCreateAccount(value)
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <h1 className={heading}>Create your account to hold your credits.</h1>
        <p className="text-base leading-7 text-ink-muted">Your {offer.credits} credits and your answers are saved to it. Next, you add a card, and nothing is charged today.</p>
      </div>
      <form noValidate onSubmit={submit} className="grid gap-5 rounded-panel border border-border bg-surface p-6 shadow-panel">
        <GoogleAuthButton onClick={onGoogleSignUp} disabled={!online}>Continue with Google</GoogleAuthButton>
        <FormDividerLabel>or</FormDividerLabel>
        <FormField id="funnel-credits-email" label="Email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} error={error} />
        <Button type="submit" size="lg" disabled={!online}>Continue</Button>
      </form>
    </div>
  )
}

function CardStep({ offer, online, cardStatus, cardError, onSubmitCard }: FunnelCreditsViewProps) {
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
      <h1 className={heading}>Claim your {offer.credits} credits.</h1>

      <section aria-labelledby="funnel-credits-terms" className="grid gap-4 rounded-panel border border-border bg-surface p-6">
        <p id="funnel-credits-terms" className="font-gowun text-4xl font-bold leading-none text-ink">$0 today</p>
        <ul className="grid gap-3 text-base leading-7 text-ink">
          <li className="flex gap-3"><CircleCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-positive" />Free for {offer.trialDays} days, until {chargeDate}.</li>
          <li className="flex gap-3"><CircleCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-positive" />Then {offer.planName} at ${offer.firstMonthUsd} for your first month, then ${offer.monthlyUsd} a month.</li>
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
          Start free trial and claim {offer.credits} credits
        </Button>
        <p className="flex items-start gap-2 text-sm leading-6 text-ink-muted">
          <Lock aria-hidden="true" className="mt-1 size-4 shrink-0" />
          Card details go straight to our payment processor. By starting the trial you agree to the <a href="/terms" className="font-medium text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Terms</a>.
        </p>
      </form>
    </div>
  )
}

function DoneStep({ offer, onStart }: FunnelCreditsViewProps) {
  return (
    <div className="grid gap-8">
      <h1 className={heading}>{offer.credits} credits are yours.</h1>
      <CreditsBalance offer={offer} />
      <p className="text-base leading-7 text-ink-muted">Your {offer.planName} trial runs until {formatDate(offer.firstChargeOn)}. We’ll remind you before it ends.</p>
      <Button size="lg" onClick={onStart} className="w-full sm:w-auto sm:justify-self-start">
        Start with your setup
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
    </div>
  )
}
