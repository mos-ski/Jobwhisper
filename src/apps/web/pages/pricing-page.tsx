import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, ChevronDown } from 'lucide-react'

import { MarketingFooter, MarketingNav } from '@/features/marketing/marketing-chrome'
import './pricing-plans.css'
import { ProOfferWidget } from '@/features/billing/pro-offer-widget'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, cn } from '@/ui'

type PricingTab = 'interview' | 'job-search' | 'done-for-you'

type InterviewPlan = {
  readonly id: string
  readonly name: string
  /** Pill beside the plan name, per design 1130:20394. */
  readonly badge: string
  /** The featured plan wears the badge as a banner across the top instead. */
  readonly featured?: boolean
  readonly tagline: string
  readonly creditsPerMonth: number
  readonly monthlyPrice: number
  readonly annualMonthlyPrice: number
  readonly credits: string
  readonly description: string
  readonly features: readonly string[]
}

/** The two rows of the card's ruled-off table, as [label, value]. */
type PlanTerms = readonly (readonly [string, string])[]

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

const INTERVIEW_PLANS: readonly InterviewPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    badge: 'Great to Start',
    tagline: 'The essentials, on the web',
    creditsPerMonth: 500,
    monthlyPrice: 47,
    annualMonthlyPrice: 38,
    credits: 'About 500 interview credits each month',
    description: 'The interview essentials for occasional preparation and live support on the web.',
    features: ['Interview Prep', 'Interview Copilot on desktop and web', 'Knowledge Base with 3 documents'],
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: 'Most Popular',
    featured: true,
    tagline: 'More time, every surface',
    creditsPerMonth: 1000,
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
    badge: 'Best Value',
    tagline: 'For heavy interview weeks',
    creditsPerMonth: 4000,
    monthlyPrice: 497,
    annualMonthlyPrice: 398,
    credits: 'About 4,000 interview credits each month',
    description: 'High-volume interview and meeting support with more context and priority help.',
    features: ['Everything in Pro', 'Priority support', 'Knowledge Base with 10 documents'],
  },
]

const CREDIT_PRODUCTS: readonly CreditProduct[] = [
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

const SUPPORTING_CONTENT: Readonly<Record<PricingTab, SupportingContent>> = {
  interview: {
    guideTitle: 'How interview credits work',
    guideDescription: 'Your subscription includes time for preparation and live interview support.',
    guideItems: [
      { label: 'Live sessions', value: '1 interview credit = 1 minute' },
      { label: 'Credit refresh', value: 'Included credits refresh each billing cycle' },
      { label: 'Where to use them', value: 'Interview Prep and eligible live copilots' },
      { label: 'Billing model', value: 'Monthly or annual subscription' },
    ],
    faqTitle: 'Interview plan questions',
    faqDescription: 'Details about subscriptions, minutes, and plan changes.',
    faqItems: [
      {
        question: 'How are interview plans billed?',
        answer:
          'Interview plans are recurring monthly or annual subscriptions. Your included credits refresh with each billing cycle.',
      },
      {
        question: 'How are interview credits measured?',
        answer: 'One interview credit covers one minute of an eligible live interview or meeting session.',
      },
      {
        question: 'What is included with an interview plan?',
        answer:
          'Every plan includes Interview Prep and live web support. Higher tiers add desktop, coding, meeting, and larger Knowledge Base allowances.',
      },
      {
        question: 'Can I change my interview plan?',
        answer:
          'Yes. Upgrades take effect immediately with a prorated charge. Downgrades take effect at the end of the current billing cycle.',
      },
      {
        question: 'What is the difference between monthly and annual billing?',
        answer: 'Monthly billing renews each month. Annual billing is paid once a year and shows a lower monthly equivalent.',
      },
      {
        question: 'Which plans include Interview Copilot?',
        answer: 'Starter, Pro, and Premium all include access to Interview Copilot on desktop and web.',
      },
      {
        question: 'Which plans include the desktop app?',
        answer: 'Desktop app access is included with Pro and Premium.',
      },
      {
        question: 'Which plans include Coding Copilot?',
        answer: 'Coding Copilot is included with Pro and Premium.',
      },
      {
        question: 'Which plans include Meeting Copilot?',
        answer: 'Meeting Copilot is included with Pro and Premium.',
      },
      {
        question: 'How many Knowledge Base documents can I add?',
        answer: 'Starter includes 3 documents, Pro includes 5, and Premium includes 10.',
      },
      {
        question: 'Can I use a plan for interview practice?',
        answer: 'Yes. Interview Prep simulates an interview, records your responses, and produces a performance report.',
      },
      {
        question: 'Can I use Jobwhisper during a live interview?',
        answer: 'Yes. Eligible plans include live Copilot access on the web, with desktop access available on Pro and Premium.',
      },
      {
        question: 'Should I add my resume before a session?',
        answer: 'Adding your resume gives Jobwhisper context about your real experience so practice questions and suggestions are more relevant.',
      },
      {
        question: 'Can I add a job description?',
        answer: 'Yes. A job description helps tailor the interview context to the specific role and company.',
      },
      {
        question: 'Can I choose how Copilot responds?',
        answer: 'Yes. You can choose Default, Headlines, or Coaching response preferences before a live Copilot session.',
      },
      {
        question: 'Can I control the response length?',
        answer: 'Yes. Copilot supports short, medium, and long response preferences.',
      },
      {
        question: 'Does the web Copilot need interview audio?',
        answer: 'Yes. The web Copilot needs access to the interview audio so it can hear and understand each question.',
      },
      {
        question: 'When should I set up a live session?',
        answer: 'Set up and test your interview context and audio before the call so you are ready when the conversation begins.',
      },
      {
        question: 'Can I review a practice session afterward?',
        answer: 'Yes. Interview Prep produces a report so you can review your performance and identify areas to improve.',
      },
      {
        question: 'Can I review a live Copilot conversation?',
        answer: 'Yes. Jobwhisper keeps the session transcript so you can revisit the questions and conversation afterward.',
      },
    ],
    closingTitle: 'Choose the interview support you need',
    closingDescription: 'Create an account, select a plan, and use your minutes across eligible interview tools.',
    primaryAction: 'View interview plans',
    primaryPath: '/v3/auth/choose-plan',
  },
  'job-search': {
    guideTitle: 'How job-search credits work',
    guideDescription: 'Resume Builder and Auto Apply use separate prepaid balances with no subscription.',
    guideItems: [
      { label: 'Resume Builder', value: '$0.10 for each AI prompt' },
      { label: 'Auto Apply', value: '$1 for each successful application' },
      { label: 'Credit validity', value: 'Credits remain valid for 30 days' },
      { label: 'Included at no charge', value: 'ATS scoring and AI suggestions' },
    ],
    faqTitle: 'Job-search credit questions',
    faqDescription: 'Details about prepaid balances, charges, and validity.',
    faqItems: [
      {
        question: 'Do I need a subscription?',
        answer: 'No. Resume Builder and Auto Apply use prepaid credits that you can buy and use as needed.',
      },
      {
        question: 'When does Auto Apply charge me?',
        answer: 'One application credit is charged only after Jobwhisper successfully submits an application.',
      },
      {
        question: 'How long do prepaid credits last?',
        answer: 'Resume Builder and Auto Apply credits remain valid for 30 days from the purchase date.',
      },
      {
        question: 'Can credits move between products?',
        answer:
          'Resume Builder and Auto Apply keep separate balances because each product measures completed work differently.',
      },
      {
        question: 'What counts as a Resume Builder charge?',
        answer: 'A resume credit is used when you send an AI prompt to create or revise resume content.',
      },
      {
        question: 'Is ATS scoring charged?',
        answer: 'No. Checking your ATS score is included at no charge.',
      },
      {
        question: 'Are resume downloads charged?',
        answer: 'No. You can download the resume you created without an additional prompt charge.',
      },
      {
        question: 'What is the minimum Resume Builder purchase?',
        answer: 'Resume Builder prepaid credit purchases start at $5.',
      },
      {
        question: 'What is the minimum Auto Apply purchase?',
        answer: 'Auto Apply prepaid credit purchases start at $10.',
      },
      {
        question: 'Am I charged when an application fails?',
        answer: 'No. Auto Apply is charged only after an application is successfully submitted.',
      },
      {
        question: 'What is included in an Auto Apply application?',
        answer: 'Auto Apply includes job matching, resume tailoring when needed, and submission of the application.',
      },
      {
        question: 'Do I choose which jobs to apply to?',
        answer: 'Yes. Review matched jobs in the Jobs tab and click Apply on the opportunities you want to pursue.',
      },
      {
        question: 'Will Auto Apply tailor my resume?',
        answer: 'Auto Apply checks your resume against the job and can prepare a more relevant version before submission.',
      },
      {
        question: 'Can I track an application after I start it?',
        answer: 'Yes. The Applied tab shows each application and its current status.',
      },
      {
        question: 'What does Needs Review mean?',
        answer: 'It means Jobwhisper needs information or a decision from you before it can continue confidently.',
      },
      {
        question: 'What does Failed mean?',
        answer: 'It means the application could not be completed. Open its details to review the available activity and next steps.',
      },
      {
        question: 'Can I see which resume was submitted?',
        answer: 'Yes. Application details show the resume used for the submission.',
      },
      {
        question: 'Can I review the original job listing?',
        answer: 'Yes. Saved application details include the job link and role information for later reference.',
      },
      {
        question: 'How does Jobwhisper find suitable jobs?',
        answer: 'Scout finds roles from supported sources, and Filter scores them against the preferences in your Auto Apply profile.',
      },
      {
        question: 'Can I update my job preferences?',
        answer: 'Yes. Update the roles, locations, salary, job type, and work arrangement used to match opportunities.',
      },
    ],
    closingTitle: 'Ready to add job-search credits?',
    closingDescription: 'Buy the balance you need for resume prompts or successful applications—without a subscription.',
    primaryAction: 'Buy credits',
    primaryPath: '/v3/billing',
  },
  'done-for-you': {
    guideTitle: 'How Done For You works',
    guideDescription: 'A success manager runs the search until your package target is reached.',
    guideItems: [
      { label: 'Your target', value: 'Choose 5 or 20 interview invitations' },
      { label: 'Job search', value: 'We scout and review matched roles' },
      { label: 'Applications', value: 'We tailor and submit each application' },
      { label: 'Jobwhisper access', value: 'Full access during package fulfillment' },
    ],
    faqTitle: 'Done For You questions',
    faqDescription: 'Details about fulfillment, the interview target, and what your manager handles.',
    faqItems: [
      {
        question: 'How does the interview guarantee work?',
        answer:
          'Your success manager keeps working until the number of interview invitations included in your package has been delivered.',
      },
      {
        question: 'What does my success manager handle?',
        answer: 'They scout matched roles, tailor your resume for each role, and submit the applications on your behalf.',
      },
      {
        question: 'Do I receive Jobwhisper access?',
        answer: 'Yes. Your package includes full Jobwhisper access while the managed search is being fulfilled.',
      },
      {
        question: 'Is this a recurring subscription?',
        answer: 'No. Done For You is a one-time package tied to the interview target you select.',
      },
      {
        question: 'What is the difference between the two packages?',
        answer: 'One package targets 5 interview invitations and the other targets 20. The 20-interview package also includes priority scheduling.',
      },
      {
        question: 'What counts toward my package target?',
        answer: 'The target is based on interview invitations delivered through the managed search.',
      },
      {
        question: 'Does the service include job scouting?',
        answer: 'Yes. Your success manager searches for roles that match your background and job preferences.',
      },
      {
        question: 'Does the service include job matching?',
        answer: 'Yes. Roles are reviewed against the preferences and career information you provide.',
      },
      {
        question: 'Will my resume be tailored for each role?',
        answer: 'Yes. The managed service includes tailoring your resume to the matched opportunities being pursued.',
      },
      {
        question: 'Who submits the applications?',
        answer: 'Your success manager handles the application work on your behalf.',
      },
      {
        question: 'What information do I need to provide?',
        answer: 'Provide an accurate resume, contact information, job preferences, work authorization details, and the application answers needed for your search.',
      },
      {
        question: 'Can I set preferred roles and locations?',
        answer: 'Yes. Your role, location, salary, employment type, and work-arrangement preferences guide the managed search.',
      },
      {
        question: 'Can I update my preferences during fulfillment?',
        answer: 'Contact your success manager when your search requirements change so the active search can use accurate information.',
      },
      {
        question: 'Will I be contacted by a real person?',
        answer: 'Yes. Done For You connects you with a real success manager who coordinates the managed search.',
      },
      {
        question: 'Can I track the applications being handled?',
        answer: 'Yes. Jobwhisper keeps the application details and statuses available while your manager runs the search.',
      },
      {
        question: 'What happens if an application needs more information?',
        answer: 'Your manager can contact you for missing or updated information instead of guessing on your behalf.',
      },
      {
        question: 'Does the package include interview preparation?',
        answer: 'The package includes full Jobwhisper access during fulfillment, so you can use the available preparation tools when interviews arrive.',
      },
      {
        question: 'What should I focus on while the search is managed?',
        answer: 'Keep your information current, respond when your manager needs input, and prepare for the interviews the search generates.',
      },
      {
        question: 'Can I continue applying to jobs myself?',
        answer: 'Yes. The managed service handles its search while you remain free to pursue other opportunities yourself.',
      },
      {
        question: 'How do I choose the right interview target?',
        answer: 'Choose based on how broad and long you expect your search to be. Contact support if you want help comparing the 5- and 20-interview packages.',
      },
    ],
    closingTitle: 'Want a success manager to run your search?',
    closingDescription: 'Choose an interview target and let a real person handle the search, tailoring, and applications.',
    primaryAction: 'Choose a package',
    primaryPath: '/v3/billing/done-for-you',
  },
}

function isPricingTab(value: string | null): value is PricingTab {
  return value === 'interview' || value === 'job-search' || value === 'done-for-you'
}

function PageShell({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
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
  return <span className="font-gowun text-[32px] font-bold leading-none text-ink">${displayValue}</span>
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


function InterviewPlans({ annual }: { readonly annual: boolean }) {
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
      <PlanCarousel count={INTERVIEW_PLANS.length}>
        {INTERVIEW_PLANS.map((plan) => {
          const price = annual ? plan.annualMonthlyPrice : plan.monthlyPrice
          return (
            <article key={plan.id} className="pricing-plan" data-featured={plan.featured ? 'true' : undefined} data-plan={plan.id} onMouseEnter={plan.id === 'pro' ? triggerProOffer : undefined}>
              {plan.featured ? <p className="pricing-plan-banner">{plan.badge}</p> : null}
              <div className="pricing-plan-body">
                <div className="pricing-plan-head">
                  <h3>{plan.name}</h3>
                  {plan.featured ? null : <span className="pricing-plan-badge">{plan.badge}</span>}
                </div>
                <p className="pricing-plan-tagline">{plan.tagline}</p>
                <p className="pricing-plan-price"><AnimatedPrice value={price} /><span className="pricing-plan-cadence">/month</span></p>
                <button type="button" className="pricing-plan-cta" onClick={() => navigate(`/v3/auth/create-account?plan=${plan.id}`)}>
                  Unlock {plan.name}
                </button>
                <dl className="pricing-plan-credits">
                  <div><dt>Monthly credits</dt><dd>{plan.creditsPerMonth.toLocaleString('en-US')}</dd></div>
                  <div className="pricing-plan-credits-total"><dt>1 credit</dt><dd>1 interview minute</dd></div>
                </dl>
                <ul className="pricing-plan-features">
                  {plan.features.map((feature) => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}
                </ul>
              </div>
            </article>
          )
        })}
      </PlanCarousel>
      {showProOffer ? <ProOfferWidget onDismiss={() => setShowProOffer(false)} onClaim={() => navigate('/v3/auth/choose-plan?plan=pro&offer=welcome-60')} /> : null}
    </section>
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
      {PRICING_MODELS.map((model) => <li key={model.name}><img src={model.logo} alt="" width={28} height={28} />{model.name}</li>)}
    </ul>
  </section>
}

/** The card row. On phones it is a snap carousel, opening on the featured card if there is
 *  one, with dashes underneath — a snap scroller draws no scrollbar, so nothing else says
 *  the row continues. On wider screens it is just the grid and the dashes are hidden. */
function PlanCarousel({ count, children }: { readonly count: number; readonly children: ReactNode }) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [activeCard, setActiveCard] = useState(0)

  // scrollLeft rather than scrollIntoView: the latter would drag the whole page down to
  // the carousel on load.
  useEffect(() => {
    const grid = gridRef.current
    const featured = grid?.querySelector<HTMLElement>('[data-featured]')
    if (!grid || !featured) return
    setActiveCard([...grid.children].indexOf(featured))
    grid.scrollLeft += featured.getBoundingClientRect().left - grid.getBoundingClientRect().left
      - (grid.clientWidth - featured.clientWidth) / 2
  }, [])

  const handleScroll = () => {
    const grid = gridRef.current
    if (!grid) return
    const middle = grid.scrollLeft + grid.clientWidth / 2
    const cards = [...grid.children] as HTMLElement[]
    const distance = (card: HTMLElement) => Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle)
    let nearest = 0
    cards.forEach((card, index) => { if (distance(card) < distance(cards[nearest])) nearest = index })
    setActiveCard(nearest)
  }

  return (
    <>
      <div className="pricing-plan-grid" data-cards={count} ref={gridRef} onScroll={handleScroll}>{children}</div>
      <div className="pricing-plan-dots" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => <span key={index} data-active={index === activeCard ? 'true' : undefined} />)}
      </div>
    </>
  )
}

/** The card the interview plans use, filled by any of the three tabs. */
function PlanCard({
  name, tagline, amount, unit, terms, features, ctaLabel, onCta,
}: {
  readonly name: string
  readonly tagline: string
  readonly amount: ReactNode
  readonly unit: string
  readonly terms: PlanTerms
  readonly features: readonly string[]
  readonly ctaLabel: string
  readonly onCta: () => void
}) {
  return (
    <article className="pricing-plan">
      <div className="pricing-plan-body">
        <div className="pricing-plan-head"><h3>{name}</h3></div>
        <p className="pricing-plan-tagline">{tagline}</p>
        <p className="pricing-plan-price">{amount}<span className="pricing-plan-cadence">{unit}</span></p>
        <button type="button" className="pricing-plan-cta" onClick={onCta}>{ctaLabel}</button>
        <dl className="pricing-plan-credits">
          {terms.map(([label, value], index) => (
            <div key={label} className={index === terms.length - 1 ? 'pricing-plan-credits-total' : undefined}>
              <dt>{label}</dt><dd>{value}</dd>
            </div>
          ))}
        </dl>
        <ul className="pricing-plan-features">
          {features.map((feature) => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}
        </ul>
      </div>
    </article>
  )
}

function JobSearchCredits() {
  const navigate = useNavigate()

  return (
    <section className="pricing-plans">
      <PlanCarousel count={CREDIT_PRODUCTS.length}>
        {CREDIT_PRODUCTS.map((product) => (
          <PlanCard
            key={product.id}
            name={product.name}
            tagline={product.tagline}
            amount={<span className="font-gowun text-[32px] font-bold leading-none text-ink">{product.amount}</span>}
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
      <PlanCarousel count={MANAGED_PACKAGES.length}>
        {MANAGED_PACKAGES.map((managedPackage) => (
          <PlanCard
            key={managedPackage.id}
            name={managedPackage.name}
            tagline={managedPackage.tagline}
            amount={<span className="font-gowun text-[32px] font-bold leading-none text-ink">${managedPackage.price.toLocaleString('en-US')}</span>}
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
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const activeTab: PricingTab = isPricingTab(requestedTab) ? requestedTab : 'interview'
  const supportingContent = SUPPORTING_CONTENT[activeTab]
  const [annual, setAnnual] = useState(true)

  const handleTabChange = (value: string) => {
    if (!isPricingTab(value)) return
    const nextParams = new URLSearchParams(searchParams)
    if (value === 'interview') nextParams.delete('tab')
    else nextParams.set('tab', value)
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <div className="min-h-screen bg-canvas font-rethink text-ink">
      <div className="flex justify-center px-4 pt-4 sm:pt-9"><MarketingNav /></div>
      <main>
        <PageShell className="pb-8 pt-10 sm:pt-14">
          <h1 className="max-w-3xl font-gowun text-4xl font-bold leading-tight text-ink sm:text-5xl">
            Pricing that follows how you use Jobwhisper
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">
            Subscribe for interview support, buy credits for applications and resumes, or have a success manager run the search for you.
          </p>
        </PageShell>

        <PageShell className="pb-6">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            {/* The rule moves to the wrapper so it runs under the toggle too, rather than
                stopping where the tabs do. */}
            <div className="mb-6 flex flex-col-reverse gap-3 border-b border-border sm:flex-row sm:items-end sm:gap-4">
              <TabsList className="pricing-tabs min-w-0 flex-1 gap-7 border-b-0" aria-label="Pricing models">
                <TabsTrigger value="interview" className="min-h-11 pb-3 text-sm sm:text-base">Interview plans</TabsTrigger>
                <TabsTrigger value="job-search" className="min-h-11 pb-3 text-sm sm:text-base">Job-search credits</TabsTrigger>
                <TabsTrigger value="done-for-you" className="min-h-11 pb-3 text-sm sm:text-base">Done for you</TabsTrigger>
              </TabsList>
              {activeTab === 'interview' ? (
                <div className="shrink-0 self-end sm:pb-2"><BillingToggle annual={annual} onChange={() => setAnnual((value) => !value)} /></div>
              ) : null}
            </div>
            <TabsContent value="interview" className="mt-0 animate-ease-in-bottom motion-reduce:animate-none"><InterviewPlans annual={annual} /></TabsContent>
            <TabsContent value="job-search" className="mt-0 animate-ease-in-bottom motion-reduce:animate-none"><JobSearchCredits /></TabsContent>
            <TabsContent value="done-for-you" className="mt-0 animate-ease-in-bottom motion-reduce:animate-none"><DoneForYou /></TabsContent>
          </Tabs>
        </PageShell>

        <PoweredByModels />
        <PageShell className="pb-6">
          <CreditGuide content={supportingContent} />
        </PageShell>
        <PricingFaq content={supportingContent} />
        <ClosingPanel content={supportingContent} />
      </main>
      <MarketingFooter />
    </div>
  )
}
