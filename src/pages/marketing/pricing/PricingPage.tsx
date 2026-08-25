import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PLANS, annualMonthlyEquivalent, type BillingCycle, type PlanId } from '@/pages/desktopCopilot/plans'
import { MarketingLayout } from '../MarketingLayout'

const OFFER_SECONDS = 10 * 60
const FIRST_TIME_OFFER_PRICE = 10

const PLAN_BULLETS: Record<PlanId, string[]> = {
  starter: ['Resume Builder', 'Resume downloads', '15 credits / month'],
  pro: ['Everything in Starter', 'Auto-Apply (Scout, Filter, Tailor & Driver agents)', 'AI Interview Prep', 'Interview & Coding Copilot', '50 credits / month'],
  premium: ['Everything in Pro', 'Meeting Copilot', 'Automate job applications with a daily quota', 'Priority response speed', '100 credits / month'],
}

const PLAN_SUMMARIES: Record<PlanId, string> = {
  starter: 'For light resume work.',
  pro: 'For active job seekers applying and interviewing every week.',
  premium: 'For high-volume searches and heavier interview seasons.',
}

type FeatureValue = boolean | string

const FEATURE_GROUPS: { label: string; rows: [string, FeatureValue, FeatureValue, FeatureValue][] }[] = [
  {
    label: 'Core access',
    rows: [
      ['Monthly credits', '15', '50', '100'],
      ['Resume Builder', true, true, true],
      ['Resume downloads', true, true, true],
    ],
  },
  {
    label: 'Job search automation',
    rows: [
      ['Auto-Apply', false, true, true],
      ['AI Interview Prep', false, true, true],
      ['Interview Copilot', false, true, true],
      ['Coding Copilot', false, true, true],
    ],
  },
  {
    label: 'Advanced support',
    rows: [
      ['Meeting Copilot', false, false, true],
      ['Automate job applications', false, false, true],
      ['Priority response speed', false, false, true],
      ['Best for', 'Light use', 'Active search', 'Heavy search'],
    ],
  },
]

const FEATURE_VALUE_INDEX: Record<PlanId, 1 | 2 | 3> = {
  starter: 1,
  pro: 2,
  premium: 3,
}

function FeatureMark({ value }: { value: FeatureValue }) {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-emerald-500" aria-label="Included" />
  if (value === false) return <X className="mx-auto h-5 w-5 text-slate-300" aria-label="Not included" />
  return <span className="text-sm font-semibold text-slate-700">{value}</span>
}

function formatOfferTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export default function PricingPage() {
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual')
  const [selectedMobilePlan, setSelectedMobilePlan] = useState<PlanId>('pro')
  const carouselRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Partial<Record<PlanId, HTMLElement>>>({})
  const [offerSecondsLeft, setOfferSecondsLeft] = useState(OFFER_SECONDS)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [offerDismissed, setOfferDismissed] = useState(false)
  const [offerApplied, setOfferApplied] = useState(false)
  const isAnnual = billingCycle === 'annual'
  const offerExpired = offerSecondsLeft === 0
  const priceFor = (monthlyPrice: number) => (isAnnual ? annualMonthlyEquivalent(monthlyPrice) : monthlyPrice)
  const selectedPlan = PLANS.find((plan) => plan.id === selectedMobilePlan) ?? PLANS[1]
  const proPlan = PLANS.find((plan) => plan.id === 'pro') ?? PLANS[1]
  const proOfferActive = offerApplied && !offerExpired
  const claimOffer = () => {
    if (offerExpired) return
    setOfferApplied(true)
    setShowOfferModal(false)
    setOfferDismissed(true)
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  useEffect(() => {
    const countdown = window.setInterval(() => {
      setOfferSecondsLeft((seconds) => Math.max(0, seconds - 1))
    }, 1000)

    return () => window.clearInterval(countdown)
  }, [])

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
    if (!isMobile) return
    const container = carouselRef.current
    const card = cardRefs.current.pro
    if (!container || !card) return
    container.scrollLeft = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2
  }, [])

  useEffect(() => {
    const container = carouselRef.current
    if (!container) return
    function handleScroll() {
      const containerCenter = container!.scrollLeft + container!.clientWidth / 2
      let closestId: PlanId = PLANS[0].id
      let closestDistance = Infinity
      for (const plan of PLANS) {
        const card = cardRefs.current[plan.id]
        if (!card) continue
        const cardCenter = card.offsetLeft + card.clientWidth / 2
        const distance = Math.abs(cardCenter - containerCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closestId = plan.id
        }
      }
      setSelectedMobilePlan(closestId)
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const modalDelay = window.setTimeout(() => {
      if (!offerDismissed) setShowOfferModal(true)
    }, 120000)

    return () => window.clearTimeout(modalDelay)
  }, [offerDismissed])

  return (
    <MarketingLayout>
      <section className="border-b border-slate-800 bg-slate-950 pt-16 text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <div className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
            <p className="sr-only">
              First-time sign-up offer: subscribe to Pro today and get it for just ${FIRST_TIME_OFFER_PRICE} instead of ${proPlan.monthlyPrice}/month. Offer available on Pro only, for first-time sign-ups only.
            </p>
            <div aria-hidden="true" className={cn('flex w-max items-center gap-16 whitespace-nowrap text-sm font-semibold', offerExpired ? '' : 'animate-marquee')}>
              {[0, 1].map((copyIndex) => (
                <span key={copyIndex} className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">First-time offer</span>
                  Subscribe to Pro today and get it for just <span className="text-sky-300">${FIRST_TIME_OFFER_PRICE}</span> instead of ${proPlan.monthlyPrice}/month. Pro plan only, for first-time sign-ups only.
                </span>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <span className="rounded-full border border-sky-300/40 bg-white/10 px-3 py-1 text-sm font-bold text-sky-100">
              Ends in {formatOfferTime(offerSecondsLeft)}
            </span>
            <button
              type="button"
              onClick={claimOffer}
              disabled={offerExpired}
              className="inline-flex h-9 items-center rounded-full bg-white px-4 text-sm font-bold text-slate-950 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {offerExpired ? 'Offer ended' : proOfferActive ? 'Offer Applied' : 'Take the Offer'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#f6fbff] pt-16 pb-14">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0494fc]">Pricing</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-6xl">
            Compare Lightforth plans
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Choose the level of resume, application, interview, and live Copilot support you need.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => setBillingCycle((c) => (c === 'monthly' ? 'annual' : 'monthly'))}
              className="inline-flex h-11 items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm"
            >
              <span className={cn('relative flex h-5 w-9 items-center rounded-full px-0.5 transition-colors', isAnnual ? 'bg-primary' : 'bg-slate-300')}>
                <span className={cn('h-4 w-4 rounded-full bg-white shadow transition-transform', isAnnual ? 'translate-x-4' : 'translate-x-0')} />
              </span>
              {isAnnual ? 'Yearly billing' : 'Monthly billing'}
              <span className="text-emerald-600">20% yearly discount</span>
            </button>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div
            ref={carouselRef}
            className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:snap-none lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                ref={(el) => {
                  if (el) cardRefs.current[plan.id] = el
                  else delete cardRefs.current[plan.id]
                }}
                className={cn(
                  'flex w-[82%] shrink-0 snap-center flex-col rounded-xl border bg-white p-7 shadow-sm lg:w-auto lg:shrink lg:min-h-full',
                  plan.id === 'pro' ? 'border-[#0494fc] shadow-blue-100' : 'border-slate-200',
                )}
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{plan.label}</h3>
                  {plan.id === 'pro' && <span className="rounded-full bg-[#0494fc] px-3 py-1 text-xs font-bold text-white">Popular</span>}
                </div>
                {plan.id === 'pro' && proOfferActive ? (
                  <>
                    <p className="mt-5 flex items-baseline gap-2">
                      <span className="text-lg font-semibold text-slate-400 line-through">${priceFor(plan.monthlyPrice)}</span>
                      <span className="text-4xl font-black text-[#0494fc]">${FIRST_TIME_OFFER_PRICE}</span>
                    </p>
                    <p className="mt-1 text-sm font-medium text-emerald-600">First-time offer applied — then ${priceFor(plan.monthlyPrice)}/mo</p>
                  </>
                ) : (
                  <>
                    <p className="mt-5 text-4xl font-black text-slate-900">
                      ${priceFor(plan.monthlyPrice)} <span className="text-sm font-semibold text-slate-500">/mo</span>
                    </p>
                    {isAnnual && <p className="mt-1 text-sm font-medium text-slate-500">${priceFor(plan.monthlyPrice) * 12}/year billed yearly</p>}
                    {plan.id === 'pro' && !offerExpired ? (
                      <button
                        type="button"
                        onClick={() => setOfferApplied(true)}
                        className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0494fc]/10 px-3 py-1 text-xs font-bold text-[#0494fc] transition hover:bg-[#0494fc]/20"
                      >
                        First-time offer: Apply for ${FIRST_TIME_OFFER_PRICE}
                      </button>
                    ) : null}
                  </>
                )}
                <p className="mt-4 min-h-[48px] text-sm leading-6 text-slate-600">{PLAN_SUMMARIES[plan.id]}</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  {PLAN_BULLETS[plan.id].map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm italic text-slate-500">{plan.bestForNote}</p>
                <Button size="lg" variant={plan.id === 'pro' ? 'default' : 'outline'} className="mt-6" onClick={() => navigate(`/checkout/${plan.id}`)}>
                  {plan.id === 'pro' && proOfferActive ? `Subscribe for $${FIRST_TIME_OFFER_PRICE}` : `Get ${plan.label}`}
                </Button>
              </article>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2 lg:hidden">
            {PLANS.map((plan) => (
              <span
                key={plan.id}
                className={cn('h-1.5 rounded-full transition-all', plan.id === selectedMobilePlan ? 'w-5 bg-[#0494fc]' : 'w-1.5 bg-slate-300')}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="hidden md:block sticky top-16 z-30 overflow-x-auto rounded-t-xl border border-slate-200 bg-slate-950 shadow-[0_14px_30px_rgba(15,23,42,0.16)]">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[1.35fr_repeat(3,1fr)] text-white">
                <div className="px-6 py-4">
                  <p className="text-sm font-bold">Feature access</p>
                  <p className="mt-1 text-xs font-medium text-slate-300">Compare plan access</p>
                </div>
                {PLANS.map((plan) => (
                  <div key={plan.id} className={cn('px-4 py-4 text-center', plan.id === 'pro' && 'bg-[#0494fc]')}>
                    <p className="text-sm font-bold">{plan.label}</p>
                    <p className="mt-1 text-2xl font-black leading-none">
                      ${priceFor(plan.monthlyPrice)}
                      <span className="ml-1 text-xs font-semibold text-white/75">/mo</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden overflow-x-auto rounded-b-xl border-x border-b border-slate-200 bg-white md:block">
            <div className="min-w-[760px]">
              {FEATURE_GROUPS.map((group) => (
                <div key={group.label}>
                  <div className="border-b border-slate-100 bg-blue-50 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#0494fc]">
                    {group.label}
                  </div>
                  {group.rows.map(([feature, starter, pro, premium]) => (
                    <div key={feature} className="grid grid-cols-[1.35fr_repeat(3,1fr)] border-b border-slate-100 last:border-b-0">
                      <div className="px-6 py-4 text-sm font-semibold text-slate-700">{feature}</div>
                      <div className="flex items-center justify-center px-4 py-4 text-center"><FeatureMark value={starter} /></div>
                      <div className="flex items-center justify-center bg-blue-50/50 px-4 py-4 text-center"><FeatureMark value={pro} /></div>
                      <div className="flex items-center justify-center px-4 py-4 text-center"><FeatureMark value={premium} /></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <div className="sticky top-16 z-30 rounded-xl border border-slate-200 bg-slate-950 p-3 shadow-[0_14px_30px_rgba(15,23,42,0.16)]">
              <div className="mb-3 px-1 text-white">
                <p className="text-sm font-bold">Feature access</p>
                <p className="mt-1 text-xs font-medium text-slate-300">Choose a plan to compare</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {PLANS.map((plan) => {
                  const active = plan.id === selectedMobilePlan
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedMobilePlan(plan.id)}
                      className={cn(
                        'min-w-0 rounded-lg px-2 py-3 text-center text-white transition',
                        active ? 'bg-[#0494fc]' : 'bg-white/10 hover:bg-white/15',
                      )}
                    >
                      <span className="block truncate text-xs font-bold">{plan.label}</span>
                      <span className="mt-1 block text-xl font-black leading-none">
                        ${priceFor(plan.monthlyPrice)}
                        <span className="ml-0.5 text-[10px] font-semibold text-white/75">/mo</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0494fc]">{selectedPlan.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">{PLAN_SUMMARIES[selectedPlan.id]}</p>
              </div>
              {FEATURE_GROUPS.map((group) => (
                <div key={group.label}>
                  <div className="border-b border-slate-100 bg-blue-50 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#0494fc]">
                    {group.label}
                  </div>
                  {group.rows.map((row) => {
                    const [feature] = row
                    const value = row[FEATURE_VALUE_INDEX[selectedMobilePlan]]
                    return (
                      <div key={feature} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0">
                        <span className="min-w-0 text-sm font-semibold text-slate-700">{feature}</span>
                        <FeatureMark value={value} />
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-center">
            <p className="text-sm font-semibold leading-6 text-slate-700">
              Credits are simple: <span className="text-slate-950">1 credit = 1 completed action.</span> Start for free with 5 credits to try Lightforth.
            </p>
          </div>
        </div>
      </section>

      {showOfferModal && offerSecondsLeft > 0 ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="pro-offer-title">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => {
                setShowOfferModal(false)
                setOfferDismissed(true)
              }}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close offer"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0494fc]">First-time sign-up offer</p>
            <h2 id="pro-offer-title" className="mt-3 text-3xl font-black leading-tight text-slate-950">
              Get Pro for just ${FIRST_TIME_OFFER_PRICE} if you start today.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Subscribe to Pro now and pay ${FIRST_TIME_OFFER_PRICE} instead of ${proPlan.monthlyPrice}/month. Available on the Pro plan only, for first-time sign-ups. The offer window closes when the countdown ends.
            </p>
            <div className="mt-5 rounded-xl bg-slate-950 px-5 py-4 text-center text-white">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-300">Offer ends in</p>
              <p className="mt-1 text-4xl font-black tabular-nums">{formatOfferTime(offerSecondsLeft)}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="flex-1 rounded-full" onClick={claimOffer}>
                Take the Offer
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => {
                  setShowOfferModal(false)
                  setOfferDismissed(true)
                }}
              >
                Not now
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            {[
              { q: 'What happens when I run out of credits?', a: 'You can upgrade to a higher plan anytime or purchase additional credits as needed. Your credits renew monthly.' },
              { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel anytime. Your subscription will remain active until the end of your billing period.' },
              { q: 'Do you have a free plan?', a: 'No. Non-subscribers receive 5 credits per month to test or use limited product actions.' },
              { q: 'Do unused credits roll over?', a: 'No, credits reset each month based on your plan. We recommend using them within your billing cycle to maximize value.' },
            ].map((item) => (
              <div key={item.q} className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-bold text-slate-900">{item.q}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
