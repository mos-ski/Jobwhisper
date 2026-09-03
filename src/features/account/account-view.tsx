import { AlertTriangle, Apple, Check, ChevronDown, Copy, ExternalLink, EyeOff, Gift, Monitor, Moon, Play, Sun, Upload } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

import type { BillingPlanCard, BillingStandalonePurchase, CreditHistoryRow, CreditUsageRow, DownloadItem, ReferralRow, SettingsProfile, TutorialItem } from '@/contracts/account.draft'
import { AddCreditsDialog } from '@/features/billing/add-credits-dialog'
import { AppShell } from '@/features/dashboard/app-nav'
import { centsToCredits, creditsToCents, formatCredits } from '@/lib/credits'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Button,
  cn,
  DataTable,
  Dialog,
  DialogDescription,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
  SelectField,
  ShellBar,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ui'

// Referral bonus amount is still an open item in PRICING.md §7 — 1,000 credits is a
// placeholder pending a real number, shared here so the billing widget and the Referral
// settings page can't drift apart the way "3 credits" vs. a new figure would.
const REFERRAL_BONUS_CREDITS = 1000
const REFERRAL_LINK = 'https://app.jobwhisper.ai/auth/signup?code=Adedamolaiosmk'

// Matches the example date in the Figma spec (node 770:7288) — standalone credits don't yet
// track a real per-purchase expiry date anywhere in the app.
const FIND_JOBS_CREDITS_VALID_LABEL = 'Oct 12, 2026'

const TOPUP_MINIMUM_DOLLARS = 10
// Matches lib/credits.ts's CENTS_PER_CREDIT so a top-up lands on the same credit scale
// already shown by the wallet card above (formatCredits), not PRICING.md §3's per-feature
// dollar rate, which that shared display helper doesn't use yet. See PRICING.md §6 item 2.
const TOPUP_CENTS_PER_CREDIT = 40
// $0.40/credit (TOPUP_CENTS_PER_CREDIT) only divides evenly into whole credits at multiples
// of $0.40 — $25 would be 62.5 credits, so presets stick to $10/$20/$50.
const TOPUP_PRESET_DOLLARS = [10, 20, 50]
// Auto Apply's per-application rate ($1/credit) means every whole dollar is already a whole
// credit — no divisibility constraint like the wallet's $0.40/credit shim above.
const AUTO_APPLY_CENTS_PER_CREDIT = 100
const AUTO_APPLY_MINIMUM_DOLLARS = 10
const AUTO_APPLY_PRESET_DOLLARS = [25, 50, 100]
// Resume Builder's $0.10/credit rate — any whole-dollar amount divides evenly.
const RESUME_BUILDER_CENTS_PER_CREDIT = 10
const RESUME_BUILDER_MINIMUM_DOLLARS = 5
const RESUME_BUILDER_PRESET_DOLLARS = [10, 25, 50]


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
  readonly standalonePurchases: readonly BillingStandalonePurchase[]
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
  return <AppShell>{children}</AppShell>
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
            By downloading a Jobwhisper application, you agree that our Terms of Service apply to your use of that application. If you have entered a different agreement with Jobwhisper that covers our applications, that agreement will apply instead.
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

const billingFaqs: readonly { readonly question: string; readonly answer: string }[] = [
  { question: 'How does usage-based pricing work?', answer: 'Each feature is metered by what it actually costs to run, per message for Resume Builder, per successful application for Auto-Apply, per minute for live Interview Prep and Copilot sessions. See the rate table above for exact pricing. Jobwhisper only charges for successful actions, so a failed Auto-Apply submission never costs anything.' },
  { question: 'Does unused balance roll over to next month?', answer: 'Your plan’s monthly included usage resets on your renewal date and does not carry forward. Any balance you’ve added yourself through a top-up is different, that stays on your account until you spend it.' },
  { question: 'What’s the difference between monthly and annual billing?', answer: 'Annual billing charges you once a year at a 20% discount off the monthly rate. Monthly billing charges the full rate every month. You can switch between them at any time using the toggle above the plan cards.' },
  { question: 'Can I change plans at any time?', answer: 'Yes. Upgrades take effect immediately and unlock the new plan’s features right away. Downgrades take effect at the start of your next billing cycle, so you keep your current plan’s benefits until then.' },
  { question: 'How do I cancel my subscription?', answer: 'Use the Cancel Subscription button above. You’ll keep full access until your current billing period ends, after which your account moves to the Free plan. You can renew at any time before then.' },
  { question: 'What happens to my data if I cancel?', answer: 'Your saved resumes, cover letters, application history, and interview reports stay in your account. You just lose access to paid features like Auto-Apply and Copilot sessions until you resubscribe.' },
  { question: 'Is the first-time offer available more than once?', answer: 'No. The $40 first-time Pro offer is available once per account, shown when you sign up. After your first month, your plan renews at the regular $99/month price.' },
  { question: 'What payment methods do you accept?', answer: 'We accept all major debit and credit cards. Payments are processed securely and your card details are never stored on Jobwhisper’s servers.' },
  { question: 'Do you offer refunds?', answer: 'We don’t offer refunds for partial billing periods, but you can cancel at any time to stop future charges, you’ll keep access through the end of the period you already paid for.' },
  { question: 'Can I add more balance without upgrading my plan?', answer: 'Yes. Use Buy credits on any balance above to top up mid-cycle ($5–$10 minimum depending on the feature), it stays on your account until you spend it, on top of what your plan already includes.' },
  { question: 'Do Resume Builder and Auto Apply require a subscription?', answer: 'No. Both are sold separately from Starter, Pro, and Premium, buy credits once in the Pay-as-you-go section below and spend them at your own pace. They work the same whether or not you have an active plan.' },
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

type CreditBalanceCardProps = {
  readonly title: string
  readonly rateLabel: string
  readonly balanceCredits: number
  /** Total ever purchased — the denominator for "N% left". Grows alongside balanceCredits on each purchase, so a fresh balance always reads 100% left. */
  readonly totalCredits: number
  readonly centsPerCredit: number
  readonly minimumDollars: number
  readonly presetDollars: readonly number[]
  readonly onPurchase: (credits: number) => void
  readonly reloadHint: string
}

function CreditBalanceCard({ title, rateLabel, balanceCredits, totalCredits, centsPerCredit, minimumDollars, presetDollars, onPurchase, reloadHint }: CreditBalanceCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const percentLeft = totalCredits > 0 ? Math.max(0, Math.min(100, Math.round((balanceCredits / totalCredits) * 100))) : 100
  const featureName = title.replace(/ Credits$/, '')

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-bold text-ink">{title}</h3>
        <p className="text-sm text-ink-muted">{rateLabel}</p>
      </div>
      <div className="mt-3 border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">{balanceCredits} credits</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-2 max-w-64 flex-1 overflow-hidden rounded-pill bg-surface-subtle">
                <div className={cn('h-full rounded-pill', percentLeft > 20 ? 'bg-accent' : 'bg-danger')} style={{ inlineSize: `${percentLeft}%` }} />
              </div>
              <span className="shrink-0 text-sm text-ink">{percentLeft}% left</span>
            </div>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="shrink-0">Buy credits</Button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 sm:p-5">
          <p className="text-sm font-semibold text-ink">Buy credits for someone else</p>
          <Button variant="secondary" size="sm" disabled>
            Gift credits
          </Button>
        </div>
      </div>
      <AddCreditsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Add credits"
        description={featureName}
        centsPerCredit={centsPerCredit}
        minimumDollars={minimumDollars}
        presetDollars={presetDollars}
        currentBalanceCredits={balanceCredits}
        autoReloadHint={reloadHint}
        onPurchase={onPurchase}
      />
    </section>
  )
}


function BillingReferralPrompt({ referralsHref }: { readonly referralsHref: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (typeof navigator === 'undefined') return
    navigator.clipboard.writeText(REFERRAL_LINK).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section className="animate-slide-in-right fixed bottom-4 end-4 z-shell w-fit max-w-[calc(100vw-2rem)] rounded-panel bg-accent-subtle p-3 shadow-panel" aria-label="Refer a friend">
      <div className="flex items-center gap-3">
        <span className="grid size-16 shrink-0 place-items-center rounded-soft bg-surface text-accent">
          <Gift aria-hidden="true" className="size-7" />
        </span>
        <div className="grid gap-2 pe-1">
          <p className="text-sm font-medium text-accent">Earn {REFERRAL_BONUS_CREDITS.toLocaleString()} credits when your referral subscribes.</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-pill bg-accent px-3 text-xs font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <Copy aria-hidden="true" className="size-4" />
              {copied ? 'Copied!' : 'Copy referral link'}
            </button>
            <a
              href={referralsHref}
              className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-pill bg-accent px-3 text-xs font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <Gift aria-hidden="true" className="size-4" />
              View referrals
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function BillingView({ homeHref, plans, standalonePurchases, usageRows, wallet }: BillingViewProps) {
  const currentPlan = plans.find((plan) => plan.current) ?? plans[0]
  const [remainingCents, setRemainingCents] = useState(wallet.remainingCents)
  const [totalCents, setTotalCents] = useState(wallet.totalCents)
  const [autoApplyBalance, setAutoApplyBalance] = useState(0)
  const [autoApplyTotalCredits, setAutoApplyTotalCredits] = useState(0)
  const [resumeBuilderBalance, setResumeBuilderBalance] = useState(0)
  const [resumeBuilderTotalCredits, setResumeBuilderTotalCredits] = useState(0)

  const autoApplyPurchase = standalonePurchases.find((purchase) => purchase.id === 'auto-apply')
  const resumeBuilderPurchase = standalonePurchases.find((purchase) => purchase.id === 'resume-builder')
  const copilotBalanceCredits = Math.round(centsToCredits(remainingCents))
  const copilotTotalCredits = Math.round(centsToCredits(totalCents))
  const findJobsTotalCredits = autoApplyBalance + resumeBuilderBalance

  return (
    <AppWorkspace>
      <ShellBar homeHref={homeHref} current="Billing & subscription" closeHref={homeHref} closeLabel="Close billing" />
      <ContentShell>
        <div className="grid gap-6">
          <div>
            <h1 className="text-2xl font-semibold leading-tight text-ink">Usage &amp; Billing</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Manage your plan, credit balances, and payment method. For anything else, visit{' '}
              <a href="/v3/settings" className="text-accent-text underline underline-offset-4 hover:text-accent">Settings</a>.
            </p>
          </div>

          <BillingReferralPrompt referralsHref="/v3/settings?tab=referral" />

          <TitledPanel title="Your Plan">
            <div className="grid gap-[12px]">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Ace Your Interview</p>
                <div
                  style={{ animationFillMode: 'backwards' }}
                  className="flex animate-ease-in-bottom items-start gap-[24px] border border-border bg-surface p-[18px] transition-shadow duration-normal ease-default hover:shadow-control"
                >
                  <img src="/v3-assets/figma/plan-row-interview.svg" alt="" className="h-[48.867px] w-[56.121px] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[14.4px] font-semibold leading-[21.6px] text-ink">{currentPlan?.name.charAt(0)}{currentPlan?.name.slice(1).toLowerCase()} plan</p>
                      <span className="rounded-pill bg-accent-subtle px-[9px] py-[1.8px] text-[10.8px] font-medium text-accent-text">Active</span>
                    </div>
                    <p className="mt-[3.6px] text-[11.7px] leading-[17.55px] text-ink-muted">{currentPlan?.price} per month &middot; Renews {wallet.resetDateLabel}</p>
                  </div>
                  <a
                    href="/v3/billing/plans"
                    className="inline-flex min-h-[36px] shrink-0 items-center justify-center rounded-[7.2px] border border-input px-[14.4px] text-[11.7px] font-semibold text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    View plans
                  </a>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Find Jobs Yourself</p>
                <div
                  style={{ animationDelay: '60ms', animationFillMode: 'backwards' }}
                  className="flex animate-ease-in-bottom items-start gap-[24px] border border-border bg-surface p-[18px] transition-shadow duration-normal ease-default hover:shadow-control"
                >
                  <img src="/v3-assets/figma/plan-row-jobs.svg" alt="" className="h-[48.867px] w-[56.121px] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[14.4px] font-semibold leading-[21.6px] text-ink">Prepaid credits</p>
                      {findJobsTotalCredits > 0 ? <span className="rounded-pill bg-accent-subtle px-[9px] py-[1.8px] text-[10.8px] font-medium text-accent-text">Active</span> : null}
                    </div>
                    <p className="mt-[3.6px] text-[11.7px] leading-[17.55px] text-ink-muted">
                      {findJobsTotalCredits > 0 ? `${findJobsTotalCredits} Total Credits · Valid till ${FIND_JOBS_CREDITS_VALID_LABEL}` : 'Auto Apply + Resume Builder, no subscription required'}
                    </p>
                  </div>
                  <a
                    href="/v3/billing/credits"
                    className="inline-flex min-h-[36px] shrink-0 items-center justify-center rounded-[7.2px] border border-input px-[14.4px] text-[11.7px] font-semibold text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    Buy credits
                  </a>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Done For You</p>
                <div
                  style={{ animationDelay: '120ms', animationFillMode: 'backwards' }}
                  className="flex animate-ease-in-bottom items-start gap-[24px] border border-border bg-surface p-[18px] transition-shadow duration-normal ease-default hover:shadow-control"
                >
                  <img src="/v3-assets/figma/plan-row-dfy.svg" alt="" className="h-[48.867px] w-[56.121px] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14.4px] font-semibold leading-[21.6px] text-ink">Real Human Job Application</p>
                    <p className="mt-[3.6px] text-[11.7px] leading-[17.55px] text-ink-muted">A real success manager applies to matched jobs on your behalf</p>
                  </div>
                  <a
                    href="/v3/billing/done-for-you"
                    className="inline-flex min-h-[36px] shrink-0 items-center justify-center rounded-[7.2px] border border-input px-[14.4px] text-[11.7px] font-semibold text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    Sign up
                  </a>
                </div>
              </div>
            </div>
          </TitledPanel>

          <div id="add-ons">
          <TitledPanel
            title="Credits &amp; Balances"
            action={
              <Tooltip>
                <TooltipTrigger
                  render={
                    <a href="/v3/billing/usage" className="text-sm font-semibold text-accent-text underline underline-offset-4 hover:text-accent">
                      View usage details
                    </a>
                  }
                />
                <TooltipContent>See a breakdown of how your credits were used</TooltipContent>
              </Tooltip>
            }
          >
            <div className="grid gap-6">
              <CreditBalanceCard
                title="Interview Copilot Credits"
                rateLabel="$0.10 / credit / min"
                balanceCredits={copilotBalanceCredits}
                totalCredits={copilotTotalCredits}
                centsPerCredit={TOPUP_CENTS_PER_CREDIT}
                minimumDollars={TOPUP_MINIMUM_DOLLARS}
                presetDollars={TOPUP_PRESET_DOLLARS}
                reloadHint="Buy more automatically if you run out mid-session."
                onPurchase={(credits) => {
                  const addedCents = creditsToCents(credits)
                  setRemainingCents((prev) => prev + addedCents)
                  setTotalCents((prev) => prev + addedCents)
                }}
              />
              {autoApplyPurchase ? (
                <CreditBalanceCard
                  title="Auto Apply Credits"
                  rateLabel={autoApplyPurchase.rateLabel}
                  balanceCredits={autoApplyBalance}
                  totalCredits={autoApplyTotalCredits}
                  centsPerCredit={autoApplyPurchase.centsPerCredit}
                  minimumDollars={autoApplyPurchase.minimumDollars}
                  presetDollars={autoApplyPurchase.presetDollars}
                  reloadHint="Buy more automatically when your balance runs low."
                  onPurchase={(credits) => {
                    setAutoApplyBalance((prev) => prev + credits)
                    setAutoApplyTotalCredits((prev) => prev + credits)
                  }}
                />
              ) : null}
              {resumeBuilderPurchase ? (
                <CreditBalanceCard
                  title="Resume Builder Credits"
                  rateLabel={resumeBuilderPurchase.rateLabel}
                  balanceCredits={resumeBuilderBalance}
                  totalCredits={resumeBuilderTotalCredits}
                  centsPerCredit={resumeBuilderPurchase.centsPerCredit}
                  minimumDollars={resumeBuilderPurchase.minimumDollars}
                  presetDollars={resumeBuilderPurchase.presetDollars}
                  reloadHint="Buy more automatically when your balance runs low."
                  onPurchase={(credits) => {
                    setResumeBuilderBalance((prev) => prev + credits)
                    setResumeBuilderTotalCredits((prev) => prev + credits)
                  }}
                />
              ) : null}
            </div>
          </TitledPanel>
          </div>

          <TitledPanel title="Payment Method">
            <div className="flex flex-wrap items-center justify-between gap-4 border border-border p-4 sm:p-5">
              <div className="flex items-center gap-[10.8px]">
                <span className="grid w-[43.195px] shrink-0 place-items-center rounded-[5.4px] bg-surface-subtle py-2">
                  <img src="/v3-assets/figma/mastercard.svg" alt="Mastercard" className="size-8" />
                </span>
                <div>
                  <p className="text-[11.7px] font-semibold leading-[17.55px] text-ink">Mastercard &middot;&middot;&middot;&middot; 4242</p>
                  <p className="text-[11.7px] leading-[17.55px] text-ink-muted">Expires 08/29</p>
                </div>
              </div>
              <Button variant="secondary">Manage card</Button>
            </div>
          </TitledPanel>


          <CreditUsageTable rows={usageRows} />

          <TitledPanel title="Cancel Plan">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-ink-muted">Cancel anytime. You&apos;ll keep full access until your current billing period ends.</p>
              <CancelSubscriptionDialog renewalLabel="September 9th, 2026" />
            </div>
          </TitledPanel>

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

const THEME_STORAGE_KEY = 'jobwhisper-theme'

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
        <p className="text-sm text-ink-muted">Choose how Jobwhisper looks on this device.</p>
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
              <p className="text-sm text-ink-muted">Permanently delete your Jobwhisper account.</p>
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
          <h2 className="text-3xl font-bold leading-tight text-ink">Earn {REFERRAL_BONUS_CREDITS.toLocaleString()} credits in free balance</h2>
          <p className="mt-2 text-sm text-ink-muted">You get {REFERRAL_BONUS_CREDITS.toLocaleString()} credits added to your balance when your referral signs up and subscribes.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[REFERRAL_LINK, 'Adedamolaiosmk'].map((value, index) => (
              <div key={value} className="min-w-0 rounded-soft border border-accent bg-surface px-3 py-2">
                <p className="text-xs text-ink-muted">{index === 0 ? 'Referral Link' : 'Referral Code'}</p>
                <div className="mt-1 flex items-center gap-3">
                  <p className="truncate text-sm font-semibold text-accent-text">{value}</p>
                  <button type="button" aria-label="Copy" className="shrink-0 text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-soft">
                    <Copy aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <ul className="mt-6 grid gap-2 text-sm text-ink">
            <li>• Invite a friend using your link</li>
            <li>• They sign up, you earn {REFERRAL_BONUS_CREDITS.toLocaleString()} credits in free balance</li>
            <li>• Refer 5 friends, unlock {(REFERRAL_BONUS_CREDITS * 5).toLocaleString()} credits in balance plus bonus tools</li>
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
