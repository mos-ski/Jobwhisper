import { AlertTriangle, Apple, Check, ChevronDown, Copy, ExternalLink, EyeOff, Monitor, Moon, Play, Sun, Upload } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'

import type { BillingPlanCard, CreditHistoryRow, CreditUsageRow, DownloadItem, ReferralRow, SettingsProfile, TutorialItem } from '@/contracts/account.draft'
import { formatCredits } from '@/lib/credits'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Button,
  cn,
  CreditCard,
  DataTable,
  Dialog,
  DialogDescription,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
  SelectField,
  ShellBar,
  Switch,
} from '@/ui'

const PRO_OFFER_SECONDS = 10 * 60
const PRO_OFFER_PRICE = 10

function formatOfferTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export type DownloadsViewProps = {
  readonly homeHref: string
  readonly downloads: readonly DownloadItem[]
}

export type TutorialsViewProps = {
  readonly homeHref: string
  readonly tutorials: readonly TutorialItem[]
}

export type BillingWallet = {
  readonly remainingCents: number
  readonly totalCents: number
  readonly resetDateLabel: string
}

export type BillingViewProps = {
  readonly homeHref: string
  readonly plans: readonly BillingPlanCard[]
  readonly usageRows: readonly CreditUsageRow[]
  readonly wallet: BillingWallet
}

export type CreditHistoryViewProps = {
  readonly homeHref: string
  readonly billingHref: string
  readonly rows: readonly CreditHistoryRow[]
}

export type SettingsTab = 'profile' | 'security' | 'referral'

export type SettingsViewProps = {
  readonly homeHref: string
  readonly activeTab: SettingsTab
  readonly profile: SettingsProfile
  readonly referrals: readonly ReferralRow[]
}

function AppWorkspace({ children }: { readonly children: ReactNode }) {
  return <main className="min-h-screen bg-canvas text-ink">{children}</main>
}

function ContentShell({ children }: { readonly children: ReactNode }) {
  return <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">{children}</section>
}

function TitledPanel({ title, action, children }: { readonly title: string; readonly action?: ReactNode; readonly children: ReactNode }) {
  return (
    <article className="w-full min-w-0 bg-surface shadow-panel">
      <div className="flex min-h-[5rem] flex-wrap items-center justify-between gap-3 border-b border-border px-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-medium leading-5 text-ink sm:text-xl">{title}</h1>
        {action}
      </div>
      <div className="p-4 sm:p-6 lg:p-8">{children}</div>
    </article>
  )
}

function DownloadIcon({ id }: { readonly id: DownloadItem['id'] }) {
  if (id === 'windows') {
    return <Monitor aria-hidden="true" className="size-5" />
  }

  return <Apple aria-hidden="true" className="size-5" />
}

export function DownloadsView({ homeHref, downloads }: DownloadsViewProps) {
  return (
    <AppWorkspace>
      <ShellBar homeHref={homeHref} current="Download Apps" closeHref={homeHref} closeLabel="Close downloads" />
      <ContentShell>
        <TitledPanel title="Download Apps">
          <div className="grid gap-4 sm:grid-cols-3">
            {downloads.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="group flex min-w-0 flex-col gap-3 rounded-panel border border-border p-3 text-ink transition-colors duration-normal ease-default hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <span className="block h-[171px] w-full overflow-hidden rounded-soft bg-accent-subtle">
                  <img src={item.imageSrc} alt="" className="size-full object-cover" />
                </span>
                <span className="flex w-full flex-col gap-3">
                  <span className="text-base font-medium leading-6">{item.title}</span>
                  <span className="flex items-center gap-2 whitespace-nowrap text-base leading-none text-ink-muted">
                    <DownloadIcon id={item.id} />
                    <span>{item.platform}</span>
                    <span className="size-1 rounded-pill bg-current opacity-60" aria-hidden="true" />
                    <span>{item.extension}</span>
                  </span>
                  <span className="inline-flex min-h-9 w-full items-center justify-center rounded-soft bg-accent px-3 text-sm font-semibold leading-6 text-on-accent transition-colors duration-normal group-hover:bg-accent-hover">
                    {item.cta}
                  </span>
                  <span className="min-h-5 text-sm leading-5 text-ink-muted">{item.support}</span>
                </span>
              </a>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-xs leading-5 text-ink-muted">
            By downloading a Lightforth application, you agree that our Terms of Service apply to your use of that application. If you have entered a different agreement with Lightforth that covers our applications, that agreement will apply instead.
          </p>
        </TitledPanel>
      </ContentShell>
    </AppWorkspace>
  )
}

const tutorialToneClasses: Record<TutorialItem['tone'], string> = {
  accent: 'from-accent to-accent-hover',
  positive: 'from-positive to-positive/70',
  'accent-secondary': 'from-accent-secondary to-accent-secondary/70',
  danger: 'from-danger to-danger-hover',
}

function TutorialCard({ item }: { readonly item: TutorialItem }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="group relative flex h-[17.5rem] flex-col justify-end overflow-hidden rounded-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      <span className={cn('absolute inset-0 bg-gradient-to-br', tutorialToneClasses[item.tone])} aria-hidden="true" />
      <span className="absolute inset-0 bg-gradient-to-t from-live-scrim via-transparent to-transparent" aria-hidden="true" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="grid size-16 place-items-center rounded-pill bg-surface/95 shadow-lg transition-transform duration-normal group-hover:scale-105">
          {item.kind === 'external' ? <ExternalLink aria-hidden="true" className="size-5 text-ink" /> : <Play aria-hidden="true" className="size-5 text-ink" />}
        </span>
      </span>
      <span className="relative p-5 text-base font-semibold text-on-accent">{item.title}</span>
    </a>
  )
}

export function TutorialsView({ homeHref, tutorials }: TutorialsViewProps) {
  return (
    <AppWorkspace>
      <ShellBar homeHref={homeHref} current="Tutorials" closeHref={homeHref} closeLabel="Close tutorials" />
      <ContentShell>
        <TitledPanel title="Tutorials">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {tutorials.map((item) => (
              <TutorialCard key={item.id} item={item} />
            ))}
          </div>
        </TitledPanel>
      </ContentShell>
    </AppWorkspace>
  )
}

function PlanCard({
  plan,
  annual,
  currentIndex,
  index,
  cardRef,
  offerAvailable = false,
  offerApplied = false,
  onApplyOffer,
}: {
  readonly plan: BillingPlanCard
  readonly annual: boolean
  readonly currentIndex: number
  readonly index: number
  readonly cardRef?: (el: HTMLElement | null) => void
  readonly offerAvailable?: boolean
  readonly offerApplied?: boolean
  readonly onApplyOffer?: () => void
}) {
  const price = annual ? plan.annualPrice : plan.price
  const cadence = annual ? plan.annualCadence : plan.cadence
  const isCurrent = plan.current === true
  const actionLabel = isCurrent ? 'Current Plan' : index < currentIndex ? 'Downgrade' : 'Upgrade'
  const offerActive = offerAvailable && offerApplied

  return (
    <article
      ref={cardRef}
      className={cn(
        'flex w-[82%] shrink-0 snap-center flex-col rounded-panel border p-6 md:w-auto md:min-h-[29rem] md:shrink',
        isCurrent ? 'border-positive bg-positive-surface/40' : 'border-border bg-surface',
      )}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-bold">{plan.name}</h3>
        {isCurrent ? <span className="rounded-pill border border-positive bg-positive-surface px-2.5 py-0.5 text-xs font-semibold text-positive">Current</span> : null}
      </div>
      {offerActive ? (
        <>
          <p className="mt-6 flex items-baseline gap-2">
            <span className="text-base font-semibold text-ink-muted line-through">{price}</span>
            <span className="text-2xl font-black text-accent">${PRO_OFFER_PRICE}</span>
          </p>
          <p className="mt-1 text-sm font-medium text-positive">First-time offer applied — then {price} {cadence}</p>
        </>
      ) : (
        <p className="mt-6 text-2xl font-black">
          {price} <span className="text-sm font-medium text-ink-muted">{cadence}</span>
        </p>
      )}
      {offerAvailable && !offerApplied ? (
        <button
          type="button"
          onClick={onApplyOffer}
          className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-pill bg-accent-subtle px-3 py-1 text-xs font-bold text-accent-text transition-colors hover:bg-accent-muted"
        >
          First-time offer: Apply for ${PRO_OFFER_PRICE}
        </button>
      ) : null}
      <p className="mt-6 font-bold">{plan.credits}</p>
      <p className="mt-4 min-h-14 text-sm leading-6 text-ink-muted">{plan.description}</p>
      {offerActive ? (
        <a
          href="/v3/billing"
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-soft bg-accent px-4 py-2.5 text-sm font-medium text-on-accent hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          Subscribe for ${PRO_OFFER_PRICE}
        </a>
      ) : isCurrent ? (
        <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-soft border border-input px-4 py-2.5 text-sm font-medium text-ink-muted opacity-60">
          Current Plan
        </span>
      ) : (
        <a
          href="/v3/billing"
          className={cn(
            'mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-soft px-4 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
            index > currentIndex ? 'bg-accent text-on-accent hover:bg-accent-hover' : 'border border-input text-ink hover:bg-surface-subtle',
          )}
        >
          {actionLabel}
        </a>
      )}
      <ul className="mt-6 grid gap-3 border-b border-border pb-6 text-sm text-ink-muted">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <Check aria-hidden="true" className="size-4 text-ink-muted" />
            {feature}
          </li>
        ))}
      </ul>
      <p className="mt-auto pt-5 text-sm font-medium italic text-accent-text">{plan.note}</p>
    </article>
  )
}

const cancellationReasons: readonly { readonly label: string; readonly value: string }[] = [
  { label: 'Select a reason', value: '' },
  { label: 'Too expensive', value: 'too-expensive' },
  { label: 'Not using it enough', value: 'not-using' },
  { label: 'Missing features I need', value: 'missing-features' },
  { label: 'Switching to another tool', value: 'competitor' },
  { label: 'Other', value: 'other' },
]

function CancelSubscriptionDialog({ renewalLabel }: { readonly renewalLabel: string }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'warning' | 'reason' | 'confirmed'>('warning')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          setStep('warning')
          setReason('')
          setNotes('')
        }
      }}
    >
      <DialogTrigger
        render={
          <Button variant="danger" className="border border-danger bg-surface text-danger hover:bg-danger-surface">
            Cancel Subscription
          </Button>
        }
      />
      <DialogPopup aria-label="Cancel subscription">
        {step === 'confirmed' ? (
          <>
            <DialogTitle className="text-danger">Subscription scheduled to cancel</DialogTitle>
            <DialogDescription>
              You&apos;ll keep full access until {renewalLabel}. After that you&apos;ll move to the Free plan. You can renew anytime before then.
            </DialogDescription>
            <Button className="mt-6 w-full" onClick={() => setOpen(false)}>Done</Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <AlertTriangle aria-hidden="true" className="size-6 shrink-0 text-danger" />
              <DialogTitle className="text-danger">Cancel Subscription</DialogTitle>
            </div>
            {step === 'warning' ? (
              <>
                <DialogDescription className="text-ink">
                  If you cancel, you&apos;ll lose access to the following after your plan expires on {renewalLabel}:
                </DialogDescription>
                <ul className="mt-4 grid gap-2 text-sm text-ink-muted">
                  {['Saved job applications', 'Resume & Cover Letter history', 'AI-generated interview insights', 'Personalized job recommendations', 'Auto-Apply progress'].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-pill bg-ink-muted" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button variant="secondary" onClick={() => setStep('reason')}>Continue to Cancel</Button>
                  <Button onClick={() => setOpen(false)}>Keep My Plan</Button>
                </div>
              </>
            ) : (
              <>
                <DialogDescription className="text-ink">
                  Your subscription will remain active until {renewalLabel}, even if you cancel now. Your membership will continue to be accessible until then. If you change your mind, you can easily renew your subscription at any time.
                </DialogDescription>
                <div className="mt-5 grid gap-4">
                  <SelectField
                    id="cancel-reason"
                    label="Cancellation Reason"
                    options={cancellationReasons}
                    value={reason}
                    onValueChange={setReason}
                  />
                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-ink">Additional Information</span>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={4}
                      placeholder="Tell us more (optional)"
                      className="min-h-24 w-full resize-y rounded-lg border border-input bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus"
                    />
                  </label>
                </div>
                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button variant="danger" disabled={!reason} onClick={() => setStep('confirmed')}>Confirm Cancellation</Button>
                  <Button onClick={() => setOpen(false)}>Stay Subscribed</Button>
                </div>
              </>
            )}
          </>
        )}
      </DialogPopup>
    </Dialog>
  )
}

function AnnualToggle({ annual, onToggle }: { readonly annual: boolean; readonly onToggle: () => void }) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold text-ink">
      <Switch checked={annual} onCheckedChange={onToggle} aria-label="Toggle annual billing" />
      Annual
      <span className="rounded-pill border border-positive bg-positive-surface px-2 py-0.5 text-xs font-medium text-positive">(save 20%)</span>
    </div>
  )
}

const billingFaqs: readonly { readonly question: string; readonly answer: string }[] = [
  { question: 'How does usage-based pricing work?', answer: 'Each feature is metered by what it actually costs to run — per message for Resume Builder, per successful application for Auto-Apply, per minute for live Interview Prep and Copilot sessions. See the rate table above for exact pricing. Lightforth only charges for successful actions, so a failed Auto-Apply submission never costs anything.' },
  { question: 'Does unused balance roll over to next month?', answer: 'Your plan’s monthly included usage resets on your renewal date and does not carry forward. Any balance you’ve added yourself through a top-up is different — that stays on your account until you spend it.' },
  { question: 'What’s the difference between monthly and annual billing?', answer: 'Annual billing charges you once a year at a 20% discount off the monthly rate. Monthly billing charges the full rate every month. You can switch between them at any time using the toggle above the plan cards.' },
  { question: 'Can I change plans at any time?', answer: 'Yes. Upgrades take effect immediately and unlock the new plan’s features right away. Downgrades take effect at the start of your next billing cycle, so you keep your current plan’s benefits until then.' },
  { question: 'How do I cancel my subscription?', answer: 'Use the Cancel Subscription button above. You’ll keep full access until your current billing period ends, after which your account moves to the Free plan. You can renew at any time before then.' },
  { question: 'What happens to my data if I cancel?', answer: 'Your saved resumes, cover letters, application history, and interview reports stay in your account. You just lose access to paid features like Auto-Apply and Copilot sessions until you resubscribe.' },
  { question: 'Is the first-time offer available more than once?', answer: 'No. The $10 first-time Pro offer is available once per account, only before the countdown on this page expires. After it’s redeemed or the timer runs out, your plan renews at the regular price.' },
  { question: 'What payment methods do you accept?', answer: 'We accept all major debit and credit cards. Payments are processed securely and your card details are never stored on Lightforth’s servers.' },
  { question: 'Do you offer refunds?', answer: 'We don’t offer refunds for partial billing periods, but you can cancel at any time to stop future charges — you’ll keep access through the end of the period you already paid for.' },
  { question: 'Can I add more balance without upgrading my plan?', answer: 'Yes. Use the Add Funds link above to earn bonus balance through referrals, or add a one-time top-up from the usage details page — it stays on your account until you spend it.' },
]

function BillingFaqSection() {
  return (
    <TitledPanel title="Frequently Asked Questions">
      <Accordion className="border-t border-border">
        {billingFaqs.map((faq, index) => (
          <AccordionItem key={faq.question} value={String(index)}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionPanel>{faq.answer}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </TitledPanel>
  )
}

function CreditUsageTable({ rows }: { readonly rows: readonly CreditUsageRow[] }) {
  return (
    <TitledPanel title="How usage works">
      <div className="relative">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full min-w-[28rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-subtle text-ink-muted">
                <th className="px-3 py-2.5 text-start font-semibold sm:px-4">Feature</th>
                <th className="hidden px-3 py-2.5 text-start font-semibold sm:table-cell sm:px-4">What triggers it</th>
                <th className="px-3 py-2.5 text-start font-semibold sm:px-4">Rate</th>
              </tr>
            </thead>
            <tbody className="text-ink">
              {rows.map((row) => (
                <tr key={row.feature} className="border-b border-border">
                  <td className="px-3 py-2.5 font-medium leading-5 sm:px-4">{row.feature}</td>
                  <td className="hidden px-3 py-2.5 leading-5 text-ink-muted sm:table-cell sm:px-4">{row.trigger}</td>
                  <td className="px-3 py-2.5 leading-5 sm:px-4">
                    <span
                      className={cn(
                        'rounded-pill px-2.5 py-0.5 text-xs font-bold leading-4',
                        row.free ? 'bg-positive-surface text-positive' : 'bg-surface-subtle text-ink',
                      )}
                    >
                      {row.deducted}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pointer-events-none absolute inset-y-0 end-0 w-8 bg-gradient-to-l from-surface to-transparent sm:hidden" />
      </div>
    </TitledPanel>
  )
}

export function BillingView({ homeHref, plans, usageRows, wallet }: BillingViewProps) {
  const [annual, setAnnual] = useState(true)
  const currentPlan = plans.find((plan) => plan.current) ?? plans[0]
  const currentIndex = currentPlan ? plans.indexOf(currentPlan) : 0
  const carouselRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Partial<Record<string, HTMLElement>>>({})
  const recommendedPlanId = (plans.find((plan) => plan.popular) ?? plans[0])?.id
  const [activePlanId, setActivePlanId] = useState<string | undefined>(recommendedPlanId)
  const [proOfferSecondsLeft, setProOfferSecondsLeft] = useState(PRO_OFFER_SECONDS)
  const [proOfferApplied, setProOfferApplied] = useState(false)
  const proOfferExpired = proOfferSecondsLeft === 0

  useEffect(() => {
    const countdown = window.setInterval(() => {
      setProOfferSecondsLeft((seconds) => Math.max(0, seconds - 1))
    }, 1000)
    return () => window.clearInterval(countdown)
  }, [])

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
    if (!isMobile) return
    const container = carouselRef.current
    const card = recommendedPlanId ? cardRefs.current[recommendedPlanId] : undefined
    if (!container || !card) return
    container.scrollLeft = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2
  }, [recommendedPlanId])

  useEffect(() => {
    const container = carouselRef.current
    if (!container) return
    function handleScroll() {
      const containerCenter = container!.scrollLeft + container!.clientWidth / 2
      let closestId: string | undefined
      let closestDistance = Infinity
      for (const plan of plans) {
        const card = cardRefs.current[plan.id]
        if (!card) continue
        const cardCenter = card.offsetLeft + card.clientWidth / 2
        const distance = Math.abs(cardCenter - containerCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closestId = plan.id
        }
      }
      if (closestId) setActivePlanId(closestId)
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [plans])

  return (
    <AppWorkspace>
      <ShellBar homeHref={homeHref} current="Billing & subscription" closeHref={homeHref} closeLabel="Close billing" />
      <ContentShell>
        <div className="grid gap-6">
          <TitledPanel title="Billing & Subscription">
            <div className="grid gap-5 md:grid-cols-2">
              <section className="rounded-panel border border-border p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-ink-muted">You&apos;re on</span>
                  <span className="font-semibold text-ink">{currentPlan?.name.charAt(0)}{currentPlan?.name.slice(1).toLowerCase()} plan</span>
                  <span className="rounded-pill bg-accent-subtle px-2.5 py-0.5 text-xs font-medium text-accent-text">Monthly</span>
                </div>
                <p className="mt-2 text-sm text-ink-muted">Renews {wallet.resetDateLabel}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                  <CancelSubscriptionDialog renewalLabel="September 9th, 2026" />
                  <p className="text-end">
                    <span className="text-3xl font-black text-ink sm:text-4xl">{currentPlan?.price}</span>{' '}
                    <span className="text-sm text-ink-muted">per month</span>
                  </p>
                </div>
              </section>
              <CreditCard
                remainingCents={wallet.remainingCents}
                totalCents={wallet.totalCents}
                formatAmount={formatCredits}
                resetDate={wallet.resetDateLabel}
                bonusHref="/v3/settings?tab=referral"
                detailsHref="/v3/billing/usage"
                className="shadow-none"
              />
            </div>
          </TitledPanel>

          <TitledPanel title="Billing & Subscription" action={<AnnualToggle annual={annual} onToggle={() => setAnnual((prev) => !prev)} />}>
            {!proOfferExpired ? (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-panel border border-accent-muted bg-accent-subtle px-4 py-3 sm:px-5">
                <p className="text-sm font-medium text-accent-text">
                  <span className="font-bold uppercase tracking-wide">First-time offer</span> — get Pro for just ${PRO_OFFER_PRICE} today.
                </p>
                <span className="rounded-pill bg-surface px-3 py-1 text-xs font-bold text-accent-text shadow-control">
                  Ends in {formatOfferTime(proOfferSecondsLeft)}
                </span>
              </div>
            ) : null}
            <div
              ref={carouselRef}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:snap-none md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-3"
            >
              {plans.map((plan, index) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  annual={annual}
                  currentIndex={currentIndex}
                  index={index}
                  cardRef={(el) => {
                    if (el) cardRefs.current[plan.id] = el
                    else delete cardRefs.current[plan.id]
                  }}
                  offerAvailable={plan.id === 'pro' && !proOfferExpired}
                  offerApplied={proOfferApplied}
                  onApplyOffer={() => setProOfferApplied(true)}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-center gap-2 md:hidden">
              {plans.map((plan) => (
                <span
                  key={plan.id}
                  className={cn('h-1.5 rounded-full transition-all', plan.id === activePlanId ? 'w-5 bg-accent' : 'w-1.5 bg-border')}
                />
              ))}
            </div>
          </TitledPanel>

          <CreditUsageTable rows={usageRows} />

          <BillingFaqSection />
        </div>
      </ContentShell>
    </AppWorkspace>
  )
}

const usageFeatureColors: Record<string, string> = {
  'Resume Builder': 'bg-[#1a56db]',
  'Interview Prep': 'bg-[#3b82f6]',
  'Interview Copilot': 'bg-[#60a5fa]',
  'Auto Apply': 'bg-[#93c5fd]',
}

const usageFeatureTextColors: Record<string, string> = {
  'Resume Builder': 'text-[#1a56db]',
  'Interview Prep': 'text-[#3b82f6]',
  'Interview Copilot': 'text-[#60a5fa]',
  'Auto Apply': 'text-[#93c5fd]',
}

function UsageChart({ rows }: { readonly rows: readonly CreditHistoryRow[] }) {
  const chartFeatures = Object.keys(usageFeatureColors)
  const usageRows = rows.filter((row) => row.amount < 0 && chartFeatures.includes(row.feature))

  const [dayRange, setDayRange] = useState(30)
  const [featureFilter, setFeatureFilter] = useState<string | null>(null)
  const [hoveredDay, setHoveredDay] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<'feature' | 'range' | null>(null)

  const filteredRows = featureFilter ? usageRows.filter((r) => r.feature === featureFilter) : usageRows
  const totalUsed = filteredRows.reduce((sum, row) => sum + Math.abs(row.amount), 0)

  const days = new Map<string, Record<string, number>>()
  for (const row of filteredRows) {
    const day = row.dateTime.split(',').slice(0, 2).join(',').split(',')[0].trim()
    const bucket = days.get(day) ?? {}
    bucket[row.feature] = (bucket[row.feature] ?? 0) + Math.abs(row.amount)
    days.set(day, bucket)
  }
  const dayEntries = [...days.entries()].reverse().slice(0, dayRange)
  const maxTotal = Math.max(1, ...dayEntries.map(([, bucket]) => Object.values(bucket).reduce((s, v) => s + v, 0)))

  return (
    <TitledPanel title="Usage Details">
      <p className="text-2xl font-black sm:text-3xl">
        {formatCredits(totalUsed)} <span className="text-sm font-medium text-ink-muted sm:text-base">used in last {dayRange} days</span>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <div className="relative">
          <button type="button" onClick={() => setOpenDropdown(openDropdown === 'feature' ? null : 'feature')} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-input bg-surface px-3 text-sm font-medium text-ink shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            {featureFilter ?? 'All features'}
            <ChevronDown aria-hidden="true" className={cn('size-4 text-ink-muted transition-transform', openDropdown === 'feature' && 'rotate-180')} />
          </button>
          {openDropdown === 'feature' ? (
            <div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-lg border border-border bg-surface py-1 shadow-popover">
              <button type="button" onClick={() => { setFeatureFilter(null); setOpenDropdown(null) }} className={cn('block w-full px-3 py-2 text-left text-sm hover:bg-surface-subtle focus-visible:outline-none', !featureFilter && 'font-semibold text-accent')}>
                All features
              </button>
              {chartFeatures.map((feature) => (
                <button key={feature} type="button" onClick={() => { setFeatureFilter(feature); setOpenDropdown(null) }} className={cn('block w-full px-3 py-2 text-left text-sm hover:bg-surface-subtle focus-visible:outline-none', featureFilter === feature && 'font-semibold text-accent')}>
                  {feature}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="relative">
          <button type="button" onClick={() => setOpenDropdown(openDropdown === 'range' ? null : 'range')} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-input bg-surface px-3 text-sm font-medium text-ink shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            Last {dayRange} days
            <ChevronDown aria-hidden="true" className={cn('size-4 text-ink-muted transition-transform', openDropdown === 'range' && 'rotate-180')} />
          </button>
          {openDropdown === 'range' ? (
            <div className="absolute left-0 top-full z-20 mt-1 w-40 rounded-lg border border-border bg-surface py-1 shadow-popover">
              {[7, 14, 30].map((d) => (
                <button key={d} type="button" onClick={() => { setDayRange(d); setOpenDropdown(null) }} className={cn('block w-full px-3 py-2 text-left text-sm hover:bg-surface-subtle focus-visible:outline-none', dayRange === d && 'font-semibold text-accent')}>
                  Last {d} days
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {dayEntries.length === 0 ? (
        <p className="mt-8 text-sm text-ink-muted">No usage in this period yet.</p>
      ) : (
        <div className="mt-8 flex h-48 w-full items-end justify-between gap-1 overflow-x-auto px-1 pb-1">
          {dayEntries.map(([day, bucket]) => {
            const total = Object.values(bucket).reduce((s, v) => s + v, 0)
            const usedFeatures = chartFeatures.filter((f) => bucket[f])
            const isHovered = hoveredDay === day
            return (
              <div
                key={day}
                className="group relative flex shrink-0 flex-col items-center gap-2 px-0.5 pt-2"
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                onClick={() => setHoveredDay(hoveredDay === day ? null : day)}
              >
                <div className={cn('relative flex w-7 flex-col-reverse overflow-hidden bg-surface-subtle transition-opacity', isHovered ? 'opacity-100' : 'opacity-80 group-hover:opacity-100')} style={{ blockSize: '160px' }}>
                  {usedFeatures.map((feature) => (
                    <div
                      key={feature}
                      className={cn(usageFeatureColors[feature], 'w-full transition-all')}
                      style={{ blockSize: `${Math.max(2, (bucket[feature] / maxTotal) * 160)}px` }}
                    />
                  ))}
                </div>
                <span className="whitespace-nowrap text-[9px] text-ink-muted">{day}</span>
                {isHovered ? (
                  <div className="pointer-events-none absolute bottom-full start-1/2 z-tooltip mb-2 w-max -translate-x-1/2 rounded-lg border border-border bg-surface p-3 text-start shadow-popover">
                    <p className="text-sm font-semibold text-ink">{day}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{formatCredits(total)} spent</p>
                    <div className="mt-1.5 grid gap-0.5 border-t border-border pt-1.5">
                      {usedFeatures.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <span className={cn('size-2 rounded-full', usageFeatureColors[feature])} />
                          <span className="text-xs text-ink-muted">{feature}</span>
                          <span className="ml-auto text-xs font-semibold text-ink">{formatCredits(bucket[feature])}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
        {chartFeatures.map((feature) => (
          <span key={feature} className="inline-flex items-center gap-2 text-sm text-ink-muted">
            <span aria-hidden="true" className={cn('size-2.5 rounded-pill', usageFeatureColors[feature])} />
            {feature}
          </span>
        ))}
      </div>
    </TitledPanel>
  )
}

export function CreditHistoryView({ homeHref, billingHref, rows }: CreditHistoryViewProps) {
  return (
    <AppWorkspace>
      <ShellBar
        homeHref={homeHref}
        parent={{ label: 'Billing & Subscription', href: billingHref }}
        current="Usage details"
        closeHref={billingHref}
        closeLabel="Back to billing"
      />
      <ContentShell>
        <div className="grid gap-6">
          <UsageChart rows={rows} />
          <DataTable
            title="Usage History"
            rows={rows}
            itemLabel={(row) => row.feature}
            selectable={false}
            minTableWidthClassName="min-w-[54rem]"
            columns={[
              { key: 'feature', label: 'Feature', className: 'w-[14rem]', render: (row) => <span className="font-semibold">{row.feature}</span> },
              { key: 'description', label: 'Description', className: 'w-[22rem]', render: (row) => row.description },
              { key: 'dateTime', label: 'Date & Time', className: 'w-[12rem]', render: (row) => row.dateTime },
              {
                key: 'amount',
                label: 'Amount',
                className: 'w-[7rem] text-end',
                render: (row) => (
                  <span className={cn('font-semibold', row.amount > 0 ? 'text-positive' : row.amount < 0 ? 'text-ink' : 'text-ink-muted')}>
                    {row.amount > 0 ? `+${formatCredits(row.amount)}` : formatCredits(row.amount)}
                  </span>
                ),
              },
              { key: 'balanceAfter', label: 'Balance', className: 'w-[7rem] text-end', render: (row) => formatCredits(row.balanceAfter) },
            ]}
          />
        </div>
      </ContentShell>
    </AppWorkspace>
  )
}

function SettingsField({ label, value, wide, disabled }: { readonly label: string; readonly value: string; readonly wide?: boolean; readonly disabled?: boolean }) {
  return (
    <label className={cn('grid gap-1.5', wide ? 'md:col-span-2' : undefined)}>
      <span className="text-sm font-medium">{label}</span>
      <input className="min-h-10 rounded-lg border border-input bg-surface px-3 text-sm font-medium text-ink shadow-control outline-none focus:border-focus focus:ring-2 focus:ring-focus disabled:bg-surface-subtle disabled:text-ink-muted" value={value} disabled={disabled} readOnly />
    </label>
  )
}

function SettingsTabs({ activeTab }: { readonly activeTab: SettingsTab }) {
  const tabs: readonly { label: string; value: SettingsTab; href: string }[] = [
    { label: 'Profile', value: 'profile', href: '/v3/settings' },
    { label: 'Security', value: 'security', href: '/v3/settings?tab=security' },
    { label: 'Referral', value: 'referral', href: '/v3/settings?tab=referral' },
  ]

  return (
    <nav aria-label="Settings tabs" className="flex gap-6 overflow-x-auto border-b border-border">
      {tabs.map((tab) => (
        <a key={tab.value} href={tab.href} aria-current={activeTab === tab.value ? 'page' : undefined} className={cn('shrink-0 border-b-2 px-1 pb-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', activeTab === tab.value ? 'border-accent text-accent' : 'border-transparent text-ink-muted')}>
          {tab.label}
        </a>
      ))}
    </nav>
  )
}

function ProfileSettings({ profile, activeTab }: { readonly profile: SettingsProfile; readonly activeTab: SettingsTab }) {
  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`

  return (
    <TitledPanel title="Profile">
      <div className="px-0 pb-6">
        <SettingsTabs activeTab={activeTab} />
      </div>
      <div className="flex items-center gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-pill bg-surface-subtle text-sm font-bold text-ink">{initials}</div>
        <Button variant="secondary">
          <Upload aria-hidden="true" className="size-4" />
          Upload Photo
        </Button>
      </div>
      <p className="mt-2 text-xs text-ink-muted">JPG, PNG, GIF or WebP. Max 5MB.</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <SettingsField label="First Name" value={profile.firstName} />
        <SettingsField label="Last Name" value={profile.lastName} />
        <SettingsField label="Email" value={profile.email} disabled />
        <SettingsField label="Phone Number" value={profile.phone} />
        <SettingsField label="Country" value={profile.country} wide disabled />
        <SettingsField label="City" value={profile.city} />
        <SettingsField label="Postal Code" value={profile.postalCode} />
      </div>
      <div className="mt-8 flex justify-end">
        <Button>Update</Button>
      </div>
    </TitledPanel>
  )
}

type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'lightforth-theme'

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  return stored === 'dark' ? 'dark' : 'light'
}

function AppearanceSettings() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const options: readonly { readonly value: Theme; readonly label: string; readonly icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
  ]

  return (
    <article className="w-full bg-surface shadow-panel">
      <div className="flex min-h-[5rem] items-center border-b border-border px-8">
        <h1 className="text-xl font-medium leading-5 text-ink">Appearance</h1>
      </div>
      <div className="p-8">
        <p className="text-sm text-ink-muted">Choose how Lightforth looks on this device.</p>
        <div className="mt-6 inline-flex gap-2 rounded-lg border border-border bg-surface-subtle p-1">
          {options.map((option) => {
            const Icon = option.icon
            const active = theme === option.value
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => setTheme(option.value)}
                className={cn(
                  'inline-flex min-h-9 items-center gap-2 rounded-md px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                  active ? 'bg-surface text-ink shadow-control' : 'text-ink-muted',
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
    </article>
  )
}

function SecuritySettings({ activeTab }: { readonly activeTab: SettingsTab }) {
  return (
    <div className="grid gap-6">
      <TitledPanel title="Password">
        <div className="px-0 pb-6">
          <SettingsTabs activeTab={activeTab} />
        </div>
        <div className="grid gap-6">
          {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
            <label key={label} className="grid gap-1.5">
              <span className="text-sm font-medium">{label}</span>
              <span className="flex min-h-10 items-center rounded-lg border border-input bg-surface px-3 text-sm shadow-control">
                <input className="min-w-0 flex-1 bg-transparent outline-none" type="password" value="passwordpassword" readOnly />
                <EyeOff aria-hidden="true" className="size-4 text-ink-muted" />
              </span>
            </label>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <Button>Update</Button>
        </div>
      </TitledPanel>
      <TitledPanel title="Account settings">
        <div className="grid gap-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold">Two-step verification</h2>
              <p className="text-sm text-ink-muted">We recommend 2FA for better security.</p>
            </div>
            <span className="h-6 w-11 shrink-0 rounded-pill bg-surface-subtle p-1">
              <span className="block size-4 rounded-pill bg-surface shadow-control" />
            </span>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold">Delete Account</h2>
              <p className="text-sm text-ink-muted">Permanently delete your Lightforth account.</p>
            </div>
            <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-danger bg-surface px-4 py-2.5 text-base font-semibold text-danger shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              Delete Account
            </button>
          </div>
        </div>
      </TitledPanel>
    </div>
  )
}

function ReferralSettings({ referrals, activeTab }: { readonly referrals: readonly ReferralRow[]; readonly activeTab: SettingsTab }) {
  return (
    <div className="grid gap-6">
      <TitledPanel title="Referral">
        <div className="px-0 pb-6">
          <SettingsTabs activeTab={activeTab} />
        </div>
        <div className="rounded-panel bg-accent-subtle p-8">
          <h2 className="text-3xl font-bold leading-tight text-ink">Earn 3 credits in free balance</h2>
          <p className="mt-2 text-sm text-ink-muted">You get 3 credits added to your balance when your referral signs up and subscribes.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {['https://app.lightforth.ai/auth/signup?code=Adedamolaiosmk', 'Adedamolaiosmk'].map((value, index) => (
              <div key={value} className="min-w-0 rounded-soft border border-accent bg-surface px-3 py-2">
                <p className="text-xs text-ink-muted">{index === 0 ? 'Referral Link' : 'Referral Code'}</p>
                <div className="mt-1 flex items-center gap-3">
                  <p className="truncate bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-sm font-semibold text-transparent">{value}</p>
                  <button type="button" aria-label="Copy" className="shrink-0 text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-soft">
                    <Copy aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <ul className="mt-6 grid gap-2 text-sm text-ink">
            <li>• Invite a friend using your link</li>
            <li>• They sign up → you earn 3 credits in free balance</li>
            <li>• Refer 5 friends → unlock 15 credits in balance + bonus tools</li>
          </ul>
        </div>
      </TitledPanel>
      <DataTable
        title="Previous Referrals"
        searchLabel="Search referrals"
        rows={referrals}
        itemLabel={(row) => row.name}
        selectable={false}
        columns={[
          { key: 'id', label: 'S/N', className: 'w-[6rem]', render: (row) => row.id },
          { key: 'name', label: 'Name', className: 'w-[14rem]', render: (row) => <span className="font-semibold">{row.name}</span> },
          { key: 'email', label: 'Email', className: 'w-[20rem]', render: (row) => row.email },
          { key: 'date', label: 'Date & Time', className: 'w-[14rem]', render: (row) => row.dateTime },
          {
            key: 'status',
            label: 'Status',
            className: 'w-[11rem]',
            render: (row) => (
              <span
                className={cn(
                  'rounded-pill px-3 py-1 text-xs font-semibold',
                  row.status === 'Subscribed' ? 'bg-positive-surface text-positive' : 'bg-surface-subtle text-ink-muted',
                )}
              >
                {row.status}
              </span>
            ),
          },
        ]}
      />
    </div>
  )
}

export function SettingsView({ homeHref, activeTab, profile, referrals }: SettingsViewProps) {
  return (
    <AppWorkspace>
      <ShellBar homeHref={homeHref} current="Settings" closeHref={homeHref} closeLabel="Close settings" />
      <ContentShell>
        <div className="grid gap-6">
          {activeTab === 'profile' ? (
            <>
              <ProfileSettings profile={profile} activeTab={activeTab} />
              <AppearanceSettings />
            </>
          ) : null}
          {activeTab === 'security' ? <SecuritySettings activeTab={activeTab} /> : null}
          {activeTab === 'referral' ? <ReferralSettings referrals={referrals} activeTab={activeTab} /> : null}
        </div>
      </ContentShell>
    </AppWorkspace>
  )
}
