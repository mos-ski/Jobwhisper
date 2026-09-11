import { useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, ChevronDown } from 'lucide-react'

import { Button, JobwhisperIcon, Tabs, TabsContent, TabsList, TabsTrigger, cn } from '@/ui'

type PricingTab = 'interview' | 'job-search' | 'done-for-you'

type InterviewPlan = {
  readonly id: string
  readonly name: string
  readonly monthlyPrice: number
  readonly annualMonthlyPrice: number
  readonly credits: string
  readonly description: string
  readonly features: readonly string[]
}

type CreditProduct = {
  readonly id: string
  readonly name: string
  readonly price: string
  readonly charge: string
  readonly description: string
  readonly features: readonly string[]
}

type ManagedPackage = {
  readonly id: string
  readonly name: string
  readonly price: number
  readonly description: string
  readonly features: readonly string[]
}

type FaqItem = {
  readonly question: string
  readonly answer: string
}

const INTERVIEW_PLANS: readonly InterviewPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 47,
    annualMonthlyPrice: 38,
    credits: 'About 500 interview credits each month',
    description: 'The interview essentials for occasional preparation and live support on the web.',
    features: ['Interview Prep', 'Interview Copilot on the web', 'Knowledge Base with 3 documents'],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 99,
    annualMonthlyPrice: 79,
    credits: 'About 1,000 interview credits each month',
    description: 'More interview time, plus desktop, coding, and meeting support.',
    features: [
      'Everything in Starter',
      'Web and desktop apps',
      'Coding Copilot',
      'Meeting Copilot',
      'Knowledge Base with 5 documents',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 197,
    annualMonthlyPrice: 158,
    credits: 'About 4,000 interview credits each month',
    description: 'High-volume interview and meeting support with more context and priority help.',
    features: ['Everything in Pro', 'Priority support', 'Knowledge Base with 10 documents'],
  },
]

const CREDIT_PRODUCTS: readonly CreditProduct[] = [
  {
    id: 'resume',
    name: 'Resume Builder',
    price: '$0.10 per AI prompt',
    charge: 'Buy from $5. Credits stay valid for 12 months.',
    description: 'Tailor a resume to a role, refine individual sections, and download the finished version.',
    features: ['One credit per AI prompt', 'ATS scoring is free', 'Unlimited downloads', 'No subscription required'],
  },
  {
    id: 'auto-apply',
    name: 'Auto Apply',
    price: '$1 per successful application',
    charge: 'Buy from $10. Credits stay valid for 12 months.',
    description: 'Choose suitable jobs and let Jobwhisper prepare and submit each application for you.',
    features: [
      'Charged only after an application succeeds',
      'Includes job matching and resume tailoring',
      'Track every application status',
      'No subscription required',
    ],
  },
]

const MANAGED_PACKAGES: readonly ManagedPackage[] = [
  {
    id: 'ten-interviews',
    name: '10 interviews',
    price: 497,
    description: 'A dedicated success manager runs your search until you receive 10 interview invitations.',
    features: [
      'Job scouting and match review',
      'Resume tailoring for each role',
      'Applications submitted for you',
      'Full Jobwhisper access during fulfillment',
    ],
  },
  {
    id: 'twenty-interviews',
    name: '20 interviews',
    price: 997,
    description: 'The same managed service for a longer search, continuing until 20 invitations are delivered.',
    features: [
      'Job scouting and match review',
      'Resume tailoring for each role',
      'Applications submitted for you',
      'Full Jobwhisper access during fulfillment',
      'Priority scheduling',
    ],
  },
]

const CREDIT_GUIDE = [
  { label: 'Interview sessions', value: '1 interview credit = 1 minute' },
  { label: 'Resume Builder', value: '1 resume credit = 1 AI prompt' },
  { label: 'Auto Apply', value: '1 application credit = 1 successful application' },
  { label: 'Included at no charge', value: 'ATS scoring and AI suggestions' },
] as const

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: 'How are interview plans billed?',
    answer:
      'Interview plans are recurring monthly or annual subscriptions. Your included interview credits refresh with each billing cycle, and one credit covers one minute of a live session.',
  },
  {
    question: 'Can I change my interview plan?',
    answer:
      'Yes. Upgrades take effect immediately with a prorated charge. Downgrades take effect at the end of the current billing cycle.',
  },
  {
    question: 'Do I need a subscription for Resume Builder or Auto Apply?',
    answer:
      'No. Both use separate prepaid balances. Resume Builder charges per AI prompt, while Auto Apply charges after each successful application.',
  },
  {
    question: 'How long do prepaid credits last?',
    answer: 'Resume Builder and Auto Apply credits remain valid for 12 months from the purchase date.',
  },
  {
    question: 'How does the Done For You guarantee work?',
    answer:
      'Your success manager keeps working until the number of interview invitations included in your package has been delivered.',
  },
  {
    question: 'Can credits move between products?',
    answer:
      'Interview subscription credits can be used across eligible interview copilots. Resume Builder and Auto Apply keep separate prepaid balances because their usage is measured differently.',
  },
]

function isPricingTab(value: string | null): value is PricingTab {
  return value === 'interview' || value === 'job-search' || value === 'done-for-you'
}

function PageShell({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}

function PricingHeader() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-shell border-b border-border bg-surface">
      <PageShell className="flex min-h-16 items-center justify-between gap-4">
        <a
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-soft text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <JobwhisperIcon className="size-6" />
          <span className="text-lg font-semibold">Jobwhisper</span>
        </a>
        <nav aria-label="Pricing page" className="hidden items-center gap-6 text-sm font-medium text-ink-muted md:flex">
          <a className="rounded-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" href="/">
            Home
          </a>
          <a className="rounded-soft text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" href="/pricing" aria-current="page">
            Pricing
          </a>
          <a className="rounded-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" href="#pricing-faq">
            FAQ
          </a>
        </nav>
        <Button size="sm" onClick={() => navigate('/v3/auth/choose-plan')}>
          Get started
        </Button>
      </PageShell>
    </header>
  )
}

function PanelHeader({ title, description, action }: { readonly title: string; readonly description?: string; readonly action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
      <div className="min-w-0">
        <h2 className="font-gowun text-xl font-bold text-ink">{title}</h2>
        {description ? <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

function BillingToggle({ annual, onChange }: { readonly annual: boolean; readonly onChange: () => void }) {
  return (
    <div className="inline-flex min-h-11 items-center gap-3 rounded-lg border border-border bg-surface-subtle px-3">
      <span className={cn('text-sm font-medium', annual ? 'text-ink-muted' : 'text-ink')}>Monthly</span>
      <button
        type="button"
        role="switch"
        aria-label="Toggle annual billing"
        aria-checked={annual}
        onClick={onChange}
        className={cn(
          'relative flex h-6 w-10 shrink-0 items-center rounded-pill p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
          annual ? 'bg-accent' : 'bg-muted',
        )}
      >
        <span className={cn('block size-5 rounded-pill bg-surface shadow-control transition-transform', annual ? 'translate-x-4' : 'translate-x-0')} />
      </button>
      <span className={cn('text-sm font-medium', annual ? 'text-ink' : 'text-ink-muted')}>Annual, save 20%</span>
    </div>
  )
}

function FeatureList({ items }: { readonly items: readonly string[] }) {
  return (
    <ul className="grid gap-3 border-t border-border pt-5 text-sm leading-6 text-ink-muted">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-positive" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function InterviewPlans() {
  const [annual, setAnnual] = useState(true)
  const navigate = useNavigate()

  return (
    <section className="overflow-hidden rounded-panel border border-border bg-surface shadow-panel">
      <PanelHeader
        title="Interview plans"
        description="Recurring access for Interview Prep and live copilots. Included credits are measured in minutes."
        action={<BillingToggle annual={annual} onChange={() => setAnnual((value) => !value)} />}
      />
      <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
        {INTERVIEW_PLANS.map((plan) => {
          const price = annual ? plan.annualMonthlyPrice : plan.monthlyPrice
          return (
            <article key={plan.id} className="flex min-w-0 flex-col p-5 sm:p-7">
              <h3 className="font-gowun text-xl font-bold text-ink">{plan.name}</h3>
              <div className="mt-5 flex items-end gap-2">
                <span className="font-gowun text-4xl font-bold leading-none text-ink">${price}</span>
                <span className="pb-1 text-sm text-ink-muted">per month</span>
              </div>
              <p className="mt-2 min-h-5 text-xs text-ink-muted">
                {annual ? `$${price * 12} billed once a year` : 'Billed monthly'}
              </p>
              <p className="mt-5 text-sm font-semibold leading-6 text-ink">{plan.credits}</p>
              <p className="mt-2 min-h-20 text-sm leading-6 text-ink-muted">{plan.description}</p>
              <Button variant="secondary" className="my-5 w-full" onClick={() => navigate('/v3/auth/choose-plan')}>
                Get started
              </Button>
              <FeatureList items={plan.features} />
            </article>
          )
        })}
      </div>
    </section>
  )
}

function JobSearchCredits() {
  const navigate = useNavigate()

  return (
    <section className="overflow-hidden rounded-panel border border-border bg-surface shadow-panel">
      <PanelHeader
        title="Job-search credits"
        description="Prepaid usage for tailoring resumes and submitting applications. Buy credits once and use them without a subscription."
      />
      <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
        {CREDIT_PRODUCTS.map((product) => (
          <article key={product.id} className="flex min-w-0 flex-col p-5 sm:p-7">
            <h3 className="font-gowun text-xl font-bold text-ink">{product.name}</h3>
            <p className="mt-5 font-gowun text-3xl font-bold leading-tight text-ink">{product.price}</p>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{product.charge}</p>
            <p className="mt-5 min-h-16 text-sm leading-6 text-ink-muted">{product.description}</p>
            <Button variant="secondary" className="my-5 w-full" onClick={() => navigate('/v3/billing')}>
              Buy credits
            </Button>
            <FeatureList items={product.features} />
          </article>
        ))}
      </div>
    </section>
  )
}

function DoneForYou() {
  const navigate = useNavigate()

  return (
    <section className="overflow-hidden rounded-panel border border-border bg-surface shadow-panel">
      <PanelHeader
        title="Done for you"
        description="A one-time managed service. A success manager handles the search, tailoring, and applications until your interview target is reached."
      />
      <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
        {MANAGED_PACKAGES.map((managedPackage) => (
          <article key={managedPackage.id} className="flex min-w-0 flex-col p-5 sm:p-7">
            <h3 className="font-gowun text-xl font-bold text-ink">{managedPackage.name}</h3>
            <div className="mt-5 flex items-end gap-2">
              <span className="font-gowun text-4xl font-bold leading-none text-ink">${managedPackage.price}</span>
              <span className="pb-1 text-sm text-ink-muted">one time</span>
            </div>
            <p className="mt-5 min-h-16 text-sm leading-6 text-ink-muted">{managedPackage.description}</p>
            <Button variant="secondary" className="my-5 w-full" onClick={() => navigate('/v3/billing/done-for-you')}>
              Sign up
            </Button>
            <FeatureList items={managedPackage.features} />
          </article>
        ))}
      </div>
    </section>
  )
}

function CreditGuide() {
  return (
    <section className="overflow-hidden rounded-panel border border-border bg-surface shadow-panel">
      <PanelHeader
        title="How credits work"
        description="Each Jobwhisper product uses a unit that matches the work it completes."
      />
      <dl className="grid sm:grid-cols-2">
        {CREDIT_GUIDE.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              'border-border px-5 py-5 sm:px-7',
              index > 0 ? 'border-t' : undefined,
              index === 1 ? 'sm:border-t-0 sm:border-s' : undefined,
              index === 2 ? 'sm:border-t' : undefined,
              index === 3 ? 'sm:border-s' : undefined,
            )}
          >
            <dt className="text-sm font-semibold text-ink">{item.label}</dt>
            <dd className="mt-1 text-sm leading-6 text-ink-muted">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function PricingFaq() {
  return (
    <section id="pricing-faq" className="border-t border-border py-14 sm:py-20">
      <PageShell className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14">
        <div>
          <h2 className="font-gowun text-3xl font-bold leading-tight text-ink">Questions about pricing</h2>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            The short answers to billing, credits, and managed-service questions.
          </p>
        </div>
        <div className="border-y border-border">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group border-b border-border last:border-b-0">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                {item.question}
                <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-ink-muted transition-transform group-open:rotate-180" />
              </summary>
              <p className="max-w-2xl pb-5 text-sm leading-6 text-ink-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </PageShell>
    </section>
  )
}

function ClosingPanel() {
  const navigate = useNavigate()

  return (
    <section className="pb-16 sm:pb-20">
      <PageShell>
        <div className="flex flex-col gap-6 rounded-panel border border-border bg-surface px-5 py-7 shadow-panel sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <h2 className="font-gowun text-2xl font-bold text-ink">Ready to choose how you use Jobwhisper?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
              Create an account to select a plan, buy credits, or speak with the team about Done For You.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href="mailto:support@jobwhisper.org"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-input bg-surface px-5 py-2.5 text-base font-semibold text-ink shadow-control hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              Contact support
            </a>
            <Button size="lg" onClick={() => navigate('/v3/auth/choose-plan')}>
              Get started
            </Button>
          </div>
        </div>
      </PageShell>
    </section>
  )
}

export function PricingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const activeTab: PricingTab = isPricingTab(requestedTab) ? requestedTab : 'interview'

  const handleTabChange = (value: string) => {
    if (!isPricingTab(value)) return
    const nextParams = new URLSearchParams(searchParams)
    if (value === 'interview') nextParams.delete('tab')
    else nextParams.set('tab', value)
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <div className="min-h-screen bg-canvas font-rethink text-ink">
      <PricingHeader />
      <main>
        <PageShell className="pb-10 pt-12 sm:pb-12 sm:pt-16">
          <h1 className="max-w-3xl font-gowun text-4xl font-bold leading-tight text-ink sm:text-5xl">
            Pricing that follows how you use Jobwhisper
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">
            Subscribe for interview support, buy credits for applications and resumes, or have a success manager run the search for you.
          </p>
        </PageShell>

        <PageShell className="pb-10 sm:pb-14">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-6 gap-7" aria-label="Pricing models">
              <TabsTrigger value="interview" className="min-h-11 pb-3 text-sm sm:text-base">Interview plans</TabsTrigger>
              <TabsTrigger value="job-search" className="min-h-11 pb-3 text-sm sm:text-base">Job-search credits</TabsTrigger>
              <TabsTrigger value="done-for-you" className="min-h-11 pb-3 text-sm sm:text-base">Done for you</TabsTrigger>
            </TabsList>
            <TabsContent value="interview" className="mt-0"><InterviewPlans /></TabsContent>
            <TabsContent value="job-search" className="mt-0"><JobSearchCredits /></TabsContent>
            <TabsContent value="done-for-you" className="mt-0"><DoneForYou /></TabsContent>
          </Tabs>
        </PageShell>

        <PageShell className="pb-14 sm:pb-20">
          <CreditGuide />
        </PageShell>
        <PricingFaq />
        <ClosingPanel />
      </main>
    </div>
  )
}
