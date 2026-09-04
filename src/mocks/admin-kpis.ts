import type { AdminRevenueKpis } from '@/contracts/admin-kpis.draft'

export const adminRevenueKpis: AdminRevenueKpis = {
  targetCents: 2_000_000,
  plans: [
    { label: 'Ace Your Interview', howItWorks: 'Recurring subscription — Starter/Pro/Premium', priceLabel: '$47 / $99 / $197 per month' },
    { label: 'Find Your Job', howItWorks: 'Prepaid pay-as-you-go credits, DIY', priceLabel: '$10 min → $1/successful application · $5 min → $0.10/prompt' },
    { label: 'Done For You', howItWorks: 'Flat committed package, a success manager applies for the client', priceLabel: '$497 (50 jobs) / $997 (100 jobs)' },
  ],
  pathToTarget: [
    { id: 'dfy', label: 'Done For You', volumeLabel: '5 large + 3 small packages', revenueCents: 647_600 },
    { id: 'ayi', label: 'Ace Your Interview', volumeLabel: '90 Starter + 45 Pro + 15 Premium (60/30/10 mix)', revenueCents: 1_164_000 },
    { id: 'fyj', label: 'Find Your Job', volumeLabel: 'Auto Apply (3,000 credits, $3,000) + Resume Builder (800 credits, $80)', revenueCents: 308_000 },
    { id: 'topups', label: 'Mid-session top-ups', volumeLabel: '15 subscribers, $10 average', revenueCents: 15_000 },
  ],
  pathToTargetNote: 'Ace Your Interview is the largest line, not Done For You — the subscription base is what actually clears the self-sustaining line here, comfortably past target even weighted toward the lower-priced Starter tier.',
  doneForYouPackages: [
    { label: 'Large (100 jobs)', priceCents: 99_700, sales: 5, revenueCents: 498_500 },
    { label: 'Small (50 jobs)', priceCents: 49_700, sales: 3, revenueCents: 149_100 },
  ],
  doneForYouNote: 'The floor to plan around: at least 5 large-package sales a month.',
  aceYourInterviewTiers: [
    { label: 'Starter', priceCents: 4_700, mixPercent: 60, subscribers: 90, revenueCents: 423_000 },
    { label: 'Pro', priceCents: 9_900, mixPercent: 30, subscribers: 45, revenueCents: 445_500 },
    { label: 'Premium', priceCents: 19_700, mixPercent: 10, subscribers: 15, revenueCents: 295_500 },
  ],
  aceYourInterviewNote: 'Starter carries the volume, but Pro and Premium together still drive over 60% of subscription revenue from 40% of subscribers — the upgrade path from Starter is worth prioritizing.',
  findYourJobSources: [
    { label: 'Auto Apply credit purchases', volumeLabel: '150 purchases, $20 average — 3,000 credits at $1 each, well over a 200 successful-applications floor', revenueCents: 300_000 },
    { label: 'Resume Builder credit purchases', volumeLabel: '10 purchases, $8 average — 800 credits (prompts) at $0.10 each', revenueCents: 8_000 },
    { label: 'Mid-session top-ups — Interview Prep/Copilot, $10 minimum (≈60 extra min)', volumeLabel: '15 subscribers', revenueCents: 15_000 },
  ],
  findYourJobNote: "Auto Apply carries this table — people take job-hunting seriously enough to want to run it themselves rather than pay someone else, and it's likely to outgrow the estimate here faster than any other line. Resume Builder stays a small add-on, not a product to lean on. Top-ups are the cheapest revenue to capture regardless — subscribers who run out of credits mid-session and pay on the spot to finish, no acquisition cost since they're already paying customers.",
  pricingNote: "Every metered feature in Ace Your Interview and Find Your Job runs on one flat rate: 1 credit per minute or prompt, $0.10 per credit. Find Your Job's Auto Apply and Done For You bill per successful application instead of per attempt — $1 self-serve, $10 done-for-you.",
  upsells: [
    { label: 'Materials + small Done For You', where: 'At checkout, on the VSL landing page', offer: 'Marketplace items ($9–$29) and the $497 package, as selectable cart add-ons' },
    { label: 'Large Done For You', where: 'After checkout, nurture campaign', offer: 'The $997 package, offered to everyone who came through the VSL funnel — not only $497 buyers' },
  ],
  acquisitionNotes: [
    { title: 'Funnel', body: 'A free tier (50 min/mo) brings people in, hits its usage ceiling, and converts to a paid plan — or a subscriber arrives directly via a $40-first-month offer that renews at $99/mo Pro. Every subscriber can refer others for 1,000 free credits, feeding new signups back into the same funnel at close to zero acquisition cost.' },
    { title: 'Target CAC', body: "Payback inside the first month means CAC under $99 (Pro's price) per paid conversion; a 3-month payback allows up to roughly $250–300, factoring in the $40 first-month discount. Only Done For You's own CAC can approach its $497–$997 price — that ceiling doesn't apply to the base subscription." },
    { title: 'Ad budget', body: 'Size monthly spend as a multiple of realized CAC × target new-subscriber volume, not a fixed number — scale up only while paid channels stay under the payback ceiling above, and lean on referral (near-zero CAC) to fill the rest. No live ad-spend or conversion data exists yet to set a real number; this is the framework to apply once that data starts coming in.' },
  ],
  vslForecast: {
    monthlySignups: 50,
    firstMonthPriceCents: 4_000,
    renewalPriceCents: 9_900,
    renewalRatePercent: 20,
  },
}
