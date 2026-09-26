import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

import { MarketingFooter, MarketingNav } from '@/features/marketing/marketing-chrome'
import { PlanAmount, PlanCard, PlanCarousel, type PlanTerms } from '@/features/pricing/plan-card'
import { ProOfferWidget } from '@/features/billing/pro-offer-widget'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, cn } from '@/ui'

type PricingTab = 'subscription' | 'pay-as-you-go' | 'done-for-you'

type SubscriptionPlan = {
  readonly id: string
  readonly name: string
  /** Pill beside the plan name, per design 1130:20394. */
  readonly badge: string
  /** The featured plan wears the badge as a banner across the top instead. */
  readonly featured?: boolean
  readonly tagline: string
  /** Starter is the one weekly plan; Pro and Premium bill monthly. */
  readonly cadence: 'week' | 'month'
  /** Per cadence — so per week on Starter, per month on the other two. */
  readonly price: number
  /** The monthly equivalent when paid annually. The weekly plan has none: annual billing
   *  does not apply to it, and its card says so rather than silently not moving. */
  readonly annualPrice?: number
  readonly description: string
  readonly features: readonly string[]
}

type CreditProduct = {
  readonly id: string
  readonly name: string
  readonly tagline: string
  /** Split from the rate so the figure can carry the card's 32px price style. */
  readonly amount: string
  readonly unit: string
  readonly terms: PlanTerms
  readonly description: string
  readonly features: readonly string[]
}

type ManagedPackage = {
  readonly id: string
  readonly name: string
  readonly tagline: string
  readonly price: number
  readonly terms: PlanTerms
  readonly description: string
  readonly features: readonly string[]
}

type FaqItem = {
  readonly question: string
  readonly answer: string
}

type SupportingContent = {
  readonly guideTitle: string
  readonly guideDescription: string
  readonly guideItems: readonly { readonly label: string; readonly value: string }[]
  readonly faqTitle: string
  readonly faqDescription: string
  readonly faqItems: readonly FaqItem[]
  readonly closingTitle: string
  readonly closingDescription: string
  readonly primaryAction: string
  readonly primaryPath: string
}

// One set of plans, all unlimited: the credit allowance that used to separate them is gone,
// so what a plan unlocks is the only thing that varies. Starter bills weekly on purpose —
// it is sized for the week someone actually has interviews, not for a year of readiness.
const PLANS: readonly SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    badge: 'Great to Start',
    tagline: 'The interview, by the week',
    cadence: 'week',
    price: 47,
    description: 'Unlimited Interview Prep and Interview Copilot, on every platform, for the week you are interviewing.',
    features: [
      'Interview Prep and Interview Copilot',
      'Unlimited interview sessions',
      'One model — OpenAI',
      'Web, desktop and mobile',
      'Call recording for every session',
      'Knowledge Base with 3 documents',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: 'Most Popular',
    featured: true,
    tagline: 'The whole job search',
    cadence: 'month',
    price: 99,
    annualPrice: 79,
    description: 'Every interview tool unlimited, plus Resume Builder and 500 jobs applied for you each month.',
    features: [
      'Everything in Starter',
      'Multi-agent models — OpenAI, Claude, Grok, Kimi and Qwen',
      'Meeting Copilot and Coding Copilot',
      'Resume Builder',
      'Auto Apply — 500 jobs a month',
      'Knowledge Base with 5 documents',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    badge: 'Best Value',
    tagline: 'Apply without a ceiling',
    cadence: 'month',
    price: 497,
    annualPrice: 398,
    description: 'Everything in Pro, with the job cap taken off Auto Apply.',
    features: [
      'Everything in Pro',
      'Unlimited Auto Apply',
      'Priority support',
      'Knowledge Base with 10 documents',
    ],
  },
]

const CREDIT_PRODUCTS: readonly CreditProduct[] = [
  {
    id: 'interview',
    name: 'Interview',
    tagline: 'Pay for the minutes you use',
    amount: '$0.10',
    unit: 'per interview minute',
    terms: [['Minimum purchase', '$10'], ['Credits valid for', '30 days']],
    description: 'Live support while the interview runs, and realistic practice before it.',
    features: [
      'One credit per minute of a session',
      'Works for Interview Prep and Interview Copilot',
      'Web and desktop',
      'No subscription required',
    ],
  },
  {
    id: 'resume',
    name: 'Resume Builder',
    tagline: 'Pay for the prompts you use',
    amount: '$0.10',
    unit: 'per AI prompt',
    terms: [['Minimum purchase', '$5'], ['Credits valid for', '30 days']],
    description: 'Tailor a resume to a role, refine individual sections, and download the finished version.',
    features: ['One credit per AI prompt', 'ATS scoring is free', 'Unlimited downloads', 'No subscription required'],
  },
  {
    id: 'auto-apply',
    name: 'Auto Apply',
    tagline: 'Pay only when one lands',
    amount: '$1',
    unit: 'per successful application',
    terms: [['Minimum purchase', '$10'], ['Credits valid for', '30 days']],
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
    name: '5 interviews guaranteed',
    tagline: 'A managed search, start to offer',
    price: 497,
    terms: [['Interviews guaranteed', '5'], ['Payment', 'One time']],
    description: 'A dedicated success manager runs your search until you receive 5 interview invitations.',
    features: [
      'Job scouting and match review',
      'Resume tailoring for each role',
      'Applications submitted for you',
      'Full Jobwhisper access during fulfillment',
    ],
  },
  {
    id: 'twenty-interviews',
    name: '20 interviews guaranteed',
    tagline: 'The same service, run longer',
    price: 1990,
    terms: [['Interviews guaranteed', '20'], ['Payment', 'One time']],
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

// One merged set now that the page sells one thing: the plans, with Done For You and
// pay-as-you-go as sections under them rather than tabs with their own guide and FAQ.
const SUPPORTING_CONTENT: SupportingContent = {
  guideTitle: 'How billing works',
  guideDescription: 'One price per plan, no credit balance to watch, and two ways to buy without one.',
  guideItems: [
    { label: 'Starter', value: 'Renews every week until you cancel' },
    { label: 'Pro and Premium', value: 'Monthly, or annually for 20% less a month' },
    { label: 'Usage', value: 'Unlimited interviews on every plan — no credits to track' },
    { label: 'Without a plan', value: 'Interview minutes, resume prompts and applications, bought as you go' },
  ],
  faqTitle: 'Pricing questions',
  faqDescription: 'Plans, cadences, what unlimited covers, and the two ways to buy without one.',
  faqItems: [
    {
      question: 'What does unlimited mean on these plans?',
      answer:
        'No monthly allowance and no credit balance: use Interview Prep and every Copilot as many times as you like, for as long as your plan runs. Auto Apply is the one thing metered by volume: 500 jobs a month on Pro, uncapped on Premium.',
    },
    {
      question: 'How does the Starter plan bill?',
      answer:
        'Starter renews every week until you cancel. It is sized for the week you are actually interviewing rather than a whole month of readiness, so annual billing does not apply to it — switching the toggle leaves its price where it is.',
    },
    {
      question: 'How do Pro and Premium bill?',
      answer: 'Monthly by default, or annually at about 20% less a month. Both renew until you cancel.',
    },
    {
      question: 'Can I buy interview minutes without a plan?',
      answer:
        'Yes. Interview credits are $0.10 a minute, from $10, and they cover both Interview Prep and a live Interview Copilot session. A plan includes both unlimited instead.',
    },
    {
      question: 'Which platforms can I use?',
      answer: 'All of them, on every plan — web, desktop and mobile. No platform is held back for a higher tier.',
    },
    {
      question: 'Which plan includes Interview Prep?',
      answer: 'All three, unlimited, alongside Interview Copilot. Practice and the live call are the same plan.',
    },
    {
      question: 'Is call recording included?',
      answer: 'Yes, on every plan. Every session can be recorded, whichever plan you are on.',
    },
    {
      question: 'Which plans include Coding Copilot and Meeting Copilot?',
      answer: 'Both are included with Pro and Premium.',
    },
    {
      question: 'Which plan includes Auto Apply and Resume Builder?',
      answer:
        'Pro and Premium. Resume Builder is unlimited on both. Auto Apply covers 500 jobs a month on Pro and is uncapped on Premium. Without a plan you can buy either as you go.',
    },
    {
      question: 'What happens after 500 Auto Apply jobs on Pro?',
      answer:
        'The month resets and the next 500 begin. If you are consistently applying past that, Premium takes the cap off.',
    },
    {
      question: 'Which AI models can I use?',
      answer:
        'Starter runs on OpenAI. Pro and Premium pick between OpenAI, Claude, Grok, Kimi and Qwen, choosing the one that suits the question in front of you.',
    },
    {
      question: 'What does Premium add over Pro?',
      answer:
        'Auto Apply without a job cap — that is the real difference — plus priority support and a Knowledge Base that holds ten documents instead of five.',
    },
    {
      question: 'Can I change plan later?',
      answer:
        'Yes. Upgrades take effect immediately with a prorated charge. Downgrades take effect at the end of the current week or month.',
    },
    {
      question: 'Can I cancel?',
      answer: 'Yes. Cancelling stops the next renewal and your plan runs to the end of the week or month you have paid for.',
    },
    {
      question: 'How many Knowledge Base documents can I add?',
      answer: 'Starter holds 3 documents, Pro holds 5, and Premium holds 10.',
    },
    {
      question: 'Do I need a plan to use Resume Builder or Auto Apply?',
      answer:
        'No. Both can be bought as you go — Resume Builder from $5, Auto Apply from $10 — as can interview minutes, with no subscription.',
    },
    {
      question: 'When does pay-as-you-go Auto Apply charge me?',
      answer: 'Only after an application is successfully submitted. A failed submission is not charged.',
    },
    {
      question: 'How long do prepaid credits last?',
      answer: 'Resume Builder and Auto Apply credits remain valid for 30 days from the purchase date.',
    },
    {
      question: 'What is Done For You?',
      answer:
        'A managed search. A success manager scouts roles, tailors your resume, and applies on your behalf until the guaranteed number of interviews is delivered.',
    },
    {
      question: 'How long does Done For You run?',
      answer:
        'Until the guarantee is met. Your Jobwhisper access continues for as long as fulfillment takes rather than expiring on a fixed date.',
    },
    {
      question: 'Can I use Jobwhisper during a live interview?',
      answer: 'Yes. That is what Interview Copilot is for, on web and desktop, on every plan.',
    },
    {
      question: 'Should I add my resume before a session?',
      answer:
        'Adding your resume gives Jobwhisper context about your real experience, so suggestions and practice questions are relevant to you.',
    },
    {
      question: 'Can I review a live Copilot conversation afterward?',
      answer: 'Yes. Jobwhisper keeps the session transcript so you can revisit the questions and the conversation.',
    },
  ],
  closingTitle: 'Choose the plan that fits your search',
  closingDescription: 'Create an account, pick a plan, and use every tool it covers without counting anything.',
  primaryAction: 'View plans',
  primaryPath: '/v3/auth/choose-plan',
}


function useAnimatedNumber(target: number) {
  const [displayValue, setDisplayValue] = useState(target)
  const previousTargetRef = useRef(target)

  useEffect(() => {
    const startValue = previousTargetRef.current
    previousTargetRef.current = target
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || startValue === target) {
      setDisplayValue(target)
      return
    }

    const startTime = performance.now()
    let frame = 0
    const finish = window.setTimeout(() => setDisplayValue(target), 450)
    const update = (now: number) => {
      const progress = Math.min((now - startTime) / 420, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(startValue + (target - startValue) * eased))
      if (progress < 1) frame = window.requestAnimationFrame(update)
    }

    frame = window.requestAnimationFrame(update)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(finish)
    }
  }, [target])

  return displayValue
}

function AnimatedPrice({ value }: { readonly value: number }) {
  const displayValue = useAnimatedNumber(value)
  return <PlanAmount>${displayValue}</PlanAmount>
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

function isPricingTab(value: string | null): value is PricingTab {
  return value === 'subscription' || value === 'pay-as-you-go' || value === 'done-for-you'
}

function PageShell({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}


function PanelHeader({
  title,
  titleId,
  description,
  action,
}: {
  readonly title: string
  readonly titleId?: string
  readonly description?: string
  readonly action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
      <div className="min-w-0">
        <h2 id={titleId} className="font-gowun text-xl font-bold text-ink">{title}</h2>
        {description ? <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

function SubscriptionPlans({ annual }: { readonly annual: boolean }) {
  const [showProOffer, setShowProOffer] = useState(false)
  const proOfferTriggeredRef = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => setShowProOffer(true), 60_000)
    return () => window.clearTimeout(timer)
  }, [])

  const triggerProOffer = () => {
    if (proOfferTriggeredRef.current) return
    proOfferTriggeredRef.current = true
    setShowProOffer(true)
  }

  // No panel chrome here: per 1130:20394 the cards sit straight on the page, so a
  // bordered box around them would read as a card inside a card.
  return (
    <section className="pricing-plans">
      <PlanCarousel count={PLANS.length}>
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            name={plan.name}
            badge={plan.featured ? undefined : plan.badge}
            banner={plan.featured ? plan.badge : undefined}
            tagline={plan.tagline}
            amount={<AnimatedPrice value={annual && plan.annualPrice ? plan.annualPrice : plan.price} />}
            unit={`/${plan.cadence}`}
            // Under annual every card carries a line: the monthly ones say what a year
            // costs, the weekly one says why the switch left it alone. Three notes or none,
            // which is also what keeps the CTAs on one line whichever way the switch is set.
            priceNote={annual ? (plan.annualPrice ? `$${(plan.annualPrice * 12).toLocaleString('en-US')} billed yearly` : 'Annual billing does not apply to weekly plans') : undefined}
            features={plan.features}
            ctaLabel={`Unlock ${plan.name}`}
            onCta={() => navigate(`/v3/auth/create-account?plan=${plan.id}`)}
            ctaVariant={plan.featured ? 'primary' : 'ghost'}
            plan={plan.id}
            onMouseEnter={plan.id === 'pro' ? triggerProOffer : undefined}
          />
        ))}
      </PlanCarousel>
      {showProOffer ? <ProOfferWidget onDismiss={() => setShowProOffer(false)} onClaim={() => navigate('/v3/auth/choose-plan?plan=pro&offer=welcome-60')} /> : null}
    </section>
  )
}

/** A titled lead-in for the sections that used to be tabs. */
function SectionIntro({ title, description }: { readonly title: string; readonly description: string }) {
  return (
    <div className="pb-5">
      <h2 className="font-gowun text-2xl font-bold text-ink">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">{description}</p>
    </div>
  )
}

/** Figma 1130:20587 — the models the copilot picks between, with their own marks. */
const PRICING_MODELS = [
  { name: 'Claude', logo: '/figma-landing/models/claude.svg' },
  { name: 'Gemini', logo: '/figma-landing/models/gemini.svg' },
  { name: 'GPT', logo: '/figma-landing/models/gpt.svg' },
  { name: 'Grok', logo: '/figma-landing/models/grok.svg' },
  { name: 'ElevenLabs', logo: '/figma-landing/models/elevenlabs.svg' },
] as const

function PoweredByModels() {
  return <section className="pricing-models" aria-labelledby="pricing-models-title">
    <h2 id="pricing-models-title">Powered by Leading AI Models</h2>
    <p className="pricing-models-subtitle">
      <span className="pricing-models-rule" aria-hidden="true" />
      <span className="pricing-models-spark" aria-hidden="true">&#10022;</span>
      Smart model selection for your scenario
      <span className="pricing-models-spark" aria-hidden="true">&#10022;</span>
      <span className="pricing-models-rule" aria-hidden="true" />
    </p>
    <ul className="pricing-models-list">
      {PRICING_MODELS.map((model) => <li key={model.name}><span className="pricing-models-mark" style={{ '--model-mark': `url(${model.logo})` } as CSSProperties} aria-hidden="true" />{model.name}</li>)}
    </ul>
  </section>
}

function PayAsYouGo() {
  const navigate = useNavigate()

  return (
    <section className="pricing-plans">
      <SectionIntro
        title="Pay as you go"
        description="Interview minutes, Resume Builder prompts and Auto Apply submissions, bought on their own with no subscription. All three are included unlimited on a plan."
      />
      <PlanCarousel count={CREDIT_PRODUCTS.length}>
        {CREDIT_PRODUCTS.map((product) => (
          <PlanCard
            key={product.id}
            name={product.name}
            tagline={product.tagline}
            amount={<PlanAmount>{product.amount}</PlanAmount>}
            unit={product.unit}
            terms={product.terms}
            features={product.features}
            ctaLabel="Buy credits"
            onCta={() => navigate('/v3/billing')}
          />
        ))}
      </PlanCarousel>
    </section>
  )
}

function DoneForYou() {
  const navigate = useNavigate()

  return (
    <section className="pricing-plans">
      <SectionIntro
        title="Or have it done for you"
        description="A success manager runs the search on your behalf until the guaranteed number of interviews lands. Sold once, not as a subscription."
      />
      <PlanCarousel count={MANAGED_PACKAGES.length}>
        {MANAGED_PACKAGES.map((managedPackage) => (
          <PlanCard
            key={managedPackage.id}
            name={managedPackage.name}
            tagline={managedPackage.tagline}
            amount={<PlanAmount>${managedPackage.price.toLocaleString('en-US')}</PlanAmount>}
            unit="one time"
            terms={managedPackage.terms}
            features={managedPackage.features}
            ctaLabel="Sign up"
            onCta={() => navigate('/v3/billing/done-for-you')}
          />
        ))}
      </PlanCarousel>
    </section>
  )
}


function CreditGuide({ content }: { readonly content: SupportingContent }) {
  return (
    <section className="overflow-hidden rounded-sm border border-border bg-surface shadow-panel">
      <PanelHeader
        title={content.guideTitle}
        description={content.guideDescription}
      />
      <dl className="grid sm:grid-cols-2">
        {content.guideItems.map((item, index) => (
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

function PricingFaq({ content }: { readonly content: SupportingContent }) {
  const questionGroups = [content.faqItems.slice(0, 10), content.faqItems.slice(10)]

  return (
    <section id="pricing-faq" className="pb-6">
      <PageShell>
        <div
          role="region"
          aria-labelledby="pricing-faq-title"
          className="overflow-hidden rounded-sm border border-border bg-surface shadow-panel"
        >
          <PanelHeader title={content.faqTitle} titleId="pricing-faq-title" description={content.faqDescription} />
          <div className="grid lg:grid-cols-2">
            {questionGroups.map((group, groupIndex) => (
              <div
                key={groupIndex === 0 ? 'first-question-group' : 'second-question-group'}
                className={cn('px-5 sm:px-7', groupIndex === 1 ? 'border-t border-border lg:border-s lg:border-t-0' : undefined)}
              >
                {group.map((item) => (
                  <details key={item.question} className="group border-b border-border last:border-b-0">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                      {item.question}
                      <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-ink-muted transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="max-w-2xl pb-5 text-sm leading-6 text-ink-muted">{item.answer}</p>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </div>
      </PageShell>
    </section>
  )
}

function ClosingPanel({ content }: { readonly content: SupportingContent }) {
  const navigate = useNavigate()

  return (
    <section className="pb-16 sm:pb-20">
      <PageShell>
        <div className="flex flex-col gap-6 rounded-sm border border-border bg-surface px-5 py-7 shadow-panel sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <h2 className="font-gowun text-2xl font-bold text-ink">{content.closingTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">{content.closingDescription}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href="mailto:support@jobwhisper.org"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-input bg-surface px-5 py-2.5 text-base font-semibold text-ink shadow-control hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              Contact support
            </a>
            <Button size="lg" onClick={() => navigate(content.primaryPath)}>
              {content.primaryAction}
            </Button>
          </div>
        </div>
      </PageShell>
    </section>
  )
}

export function PricingPage() {
  const [annual, setAnnual] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const activeTab: PricingTab = isPricingTab(requestedTab) ? requestedTab : 'subscription'

  const handleTabChange = (value: string) => {
    if (!isPricingTab(value)) return
    const nextParams = new URLSearchParams(searchParams)
    if (value === 'subscription') nextParams.delete('tab')
    else nextParams.set('tab', value)
    setSearchParams(nextParams, { replace: true })
  }

  return (
    // Pinned to the light palette. The public pages are a light composition — the landing
    // page paints itself with the scheme-independent landing tokens — but this one is built
    // from the semantic tokens, so it was the only marketing page that turned dark when the
    // reader's system asked for dark, nav pill and all. data-theme is the same hook the
    // theme switch uses, so the subtree gets the light values and color-scheme with it.
    <div data-theme="light" className="min-h-screen bg-canvas font-rethink text-ink">
      <div className="flex justify-center px-4 pt-4 sm:pt-9"><MarketingNav /></div>
      <main>
        <PageShell className="pb-8 pt-10 sm:pt-14">
          <h1 className="max-w-3xl font-gowun text-4xl font-bold leading-tight text-ink sm:text-5xl">
            Three ways to buy Jobwhisper
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">
            Subscribe for unlimited use, pay only for the minutes and applications you need, or have a
            success manager run the search for you.
          </p>
        </PageShell>

        {/* Three tabs, one per way of buying. The guide and questions below cover all three,
            so they do not change with the tab — everything a visitor might ask about pricing
            is answered in one place rather than three overlapping sets. */}
        <PageShell className="pb-6">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            {/* The rule runs under the toggle too, rather than stopping where the tabs do. */}
            <div className="mb-6 flex flex-col-reverse gap-3 border-b border-border sm:flex-row sm:items-end sm:gap-4">
              <TabsList className="pricing-tabs min-w-0 flex-1 gap-7 border-b-0" aria-label="Ways to buy">
                <TabsTrigger value="subscription" className="min-h-11 pb-3 text-sm sm:text-base">Subscription plans</TabsTrigger>
                <TabsTrigger value="pay-as-you-go" className="min-h-11 pb-3 text-sm sm:text-base">Pay as you go</TabsTrigger>
                <TabsTrigger value="done-for-you" className="min-h-11 pb-3 text-sm sm:text-base">Done for you</TabsTrigger>
              </TabsList>
              {activeTab === 'subscription' ? (
                <div className="shrink-0 self-end sm:pb-2"><BillingToggle annual={annual} onChange={() => setAnnual((value) => !value)} /></div>
              ) : null}
            </div>
            <TabsContent value="subscription" className="mt-0 animate-ease-in-bottom motion-reduce:animate-none"><SubscriptionPlans annual={annual} /></TabsContent>
            <TabsContent value="pay-as-you-go" className="mt-0 animate-ease-in-bottom motion-reduce:animate-none"><PayAsYouGo /></TabsContent>
            <TabsContent value="done-for-you" className="mt-0 animate-ease-in-bottom motion-reduce:animate-none"><DoneForYou /></TabsContent>
          </Tabs>
        </PageShell>

        <PoweredByModels />

        <PageShell className="pb-6">
          <CreditGuide content={SUPPORTING_CONTENT} />
        </PageShell>
        <PricingFaq content={SUPPORTING_CONTENT} />
        <ClosingPanel content={SUPPORTING_CONTENT} />
      </main>
      <MarketingFooter />
    </div>
  )
}
