# Sales Copilot Plans + Context Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the Sales Copilot landing page into two plans (self-serve Individual at $99.90/mo, sales-led Enterprise via "Book a Call"), and replace free-text "Context" inputs in the desktop Copilot simulator with a select-type document picker sourced from the right document library per account type.

**Architecture:** Part 1 threads a new `planTier: 'individual' | 'enterprise'` field through the existing mock `SalesOrg`/`AccountType` data model (all client-side, `localStorage`-backed, no real backend) to gate the Team nav item and billing copy, and adds a second checkout page that reuses the existing `CheckoutFlow` component. Part 2 adds one new shared data module, one new resolver function, and one new dark-themed picker component, then wires that component into the three desktop-simulator setup screens (Interview, Meeting, Sales-call) that currently lack (or fake) a context field.

**Tech Stack:** React + TypeScript, React Router, Tailwind CSS, Vitest + @testing-library/react, lucide-react icons. No new dependencies.

## Global Constraints

- Individual plan price: exactly `$99.90` per month, billed monthly (from spec: [2026-07-02-sales-copilot-plans-and-context-picker-design.md](../specs/2026-07-02-sales-copilot-plans-and-context-picker-design.md)).
- Enterprise plan: no price shown anywhere on the landing page; CTA text is exactly "Book a Call"; opens `https://calendly.com/lightforth/enterprise` (placeholder — swap later) in a new tab.
- Individual accounts never see the "Team" nav item and never show a setup fee.
- Sales-call context picker sources org Knowledge Base documents (`enabled: true` only) for `enterprise-admin`/`enterprise-member` accounts; personal Context library for every other account type (`regular`, `sales-individual`, or unknown/no account).
- Interview and Meeting context pickers always use the personal Context library — they have no org concept.
- Desktop-simulator UI (`DesktopCopilotPreview.tsx` and its sibling files under `src/pages/desktopCopilot/`) uses the existing dark tokens (`BG`, `CARD`, `BORDER`, `INPUT_BG`, `INPUT_BD`, `BLUE` from `./desktopCopilot/shared`) — never the light `lf-*` utility classes used by the rest of the app.
- No new npm dependencies. Reuse `lucide-react` icons already imported in each file, or add new named imports from `lucide-react` (already a dependency) as needed.
- Run `npx tsc --noEmit` and `npm run test:run` before considering the plan done — both must be clean.

---

## File Structure

**Part 1 — Plans**
- Modify: `src/pages/sales/mockOrg.ts` — add `planTier` to `SalesOrg`, thread through `demoSeedOrg`, seed individual orgs without fake teammates.
- Modify: `src/pages/desktopCopilot/mockAccounts.ts` — add `'sales-individual'` to `AccountType`.
- Create: `src/pages/marketing/checkout/IndividualCheckoutPage.tsx` — mirrors `EnterpriseCheckoutPage.tsx`, no company field.
- Modify: `src/App.tsx` — register the new checkout route.
- Modify: `src/pages/marketing/EnterpriseCopilotLanding.tsx` — two-plan pricing section, FAQ copy pass, fix dead closing CTA.
- Modify: `src/pages/sales/SalesAdminLayout.tsx` — hide "Team" nav item for individual orgs.
- Modify: `src/pages/sales/Team.tsx` — redirect guard for individual orgs.
- Modify: `src/pages/sales/Overview.tsx` — plan-aware Setup fee card / Team quick-link.
- Modify: `src/pages/sales/Billing.tsx` — plan-aware fee/subscription display.
- Modify: `src/pages/sales/SalesSignIn.tsx` — pass `'enterprise'` to `demoSeedOrg` (this page is explicitly enterprise-admin-only, per its own copy).
- Modify: `src/pages/desktopCopilot/SignInScreen.test.tsx`, `src/pages/DesktopCopilotPreview.test.tsx` — add `planTier: 'enterprise'` to hand-built `SalesOrg` test fixtures.

**Part 2 — Context picker**
- Create: `src/lib/mockContextSources.ts` — shared personal-Context mock data (extracted from `DocumentPickerModal.tsx`).
- Modify: `src/components/shared/DocumentPickerModal.tsx` — consume the shared module instead of its own local copy.
- Create: `src/pages/desktopCopilot/resolveContextDocs.ts` — resolves the right document list for a given email.
- Modify: `src/pages/desktopCopilot/useCases.ts` — add `'context'` to `SetupFieldId`, add it to `sales-call`'s `setupFields`.
- Create: `src/pages/desktopCopilot/ContextPickerField.tsx` — dark-themed select/tick document picker.
- Modify: `src/pages/DesktopCopilotPreview.tsx` — wire `ContextPickerField` into `SetupScreen` (sales-call) and `RegularSetupScreen` (Interview + Meeting tabs); thread `email` prop from `pendingEmail` down to both.

---

### Task 1: `SalesOrg.planTier` + `demoSeedOrg` seeding by plan

**Files:**
- Modify: `src/pages/sales/mockOrg.ts:79-86` (interface), `:96-111` (`normalizeOrg`), `:330-427` (`demoSeedOrg`)
- Modify: `src/pages/desktopCopilot/SignInScreen.test.tsx:81-88,102-109` (line numbers as of commit `733a1f2`; locate by the `orgName: 'Acme Inc'` literals if they've drifted further)
- Modify: `src/pages/DesktopCopilotPreview.test.tsx:274-284` (same caveat — locate by the `orgName: 'Acme Inc'` literal)
- Test: `src/pages/sales/mockOrg.test.ts` (new)

**Interfaces:**
- Produces: `SalesOrg.planTier: 'individual' | 'enterprise'`, `demoSeedOrg(adminEmail: string, adminName: string, orgName: string, planTier: 'individual' | 'enterprise'): SalesOrg`

- [ ] **Step 1: Write the failing test**

Create `src/pages/sales/mockOrg.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { demoSeedOrg } from './mockOrg'

describe('demoSeedOrg', () => {
  beforeEach(() => localStorage.clear())

  it('seeds an enterprise org with the admin plus 4 demo reps', () => {
    const org = demoSeedOrg('admin@acme.com', 'Ada Admin', 'Acme Team', 'enterprise')
    expect(org.planTier).toBe('enterprise')
    expect(org.members).toHaveLength(5)
    expect(org.members[0]).toMatchObject({ name: 'Ada Admin', email: 'admin@acme.com', role: 'admin' })
    expect(org.calls.some(c => c.repName === 'Jordan Lee')).toBe(true)
  })

  it('seeds an individual org with only the admin as a member, and all calls attributed to them', () => {
    const org = demoSeedOrg('solo@example.com', 'Sam Solo', "Sam Solo's workspace", 'individual')
    expect(org.planTier).toBe('individual')
    expect(org.members).toHaveLength(1)
    expect(org.members[0]).toMatchObject({ name: 'Sam Solo', email: 'solo@example.com', role: 'admin' })
    expect(org.calls.length).toBeGreaterThan(0)
    expect(org.calls.every(c => c.repEmail === 'solo@example.com' && c.repName === 'Sam Solo')).toBe(true)
  })

  it('still seeds a populated knowledge base for individual orgs', () => {
    const org = demoSeedOrg('solo@example.com', 'Sam Solo', "Sam Solo's workspace", 'individual')
    expect(org.knowledgeBase.documents.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/sales/mockOrg.test.ts`
Expected: FAIL — `demoSeedOrg` currently takes 3 args and has no `planTier` in its return type, so `org.planTier` is `undefined` and the enterprise/individual assertions fail (or TS fails to compile the 4-arg call).

- [ ] **Step 3: Implement**

In `src/pages/sales/mockOrg.ts`, add `planTier` to the `SalesOrg` interface (`:79-86`):

```ts
export interface SalesOrg {
  orgName: string
  planTier: 'individual' | 'enterprise'
  setupFeePaid: boolean
  knowledgeBase: KnowledgeBaseData
  members: TeamMember[]
  calls: CallRecord[]
  connectedIntegrations: string[]
}
```

Update `normalizeOrg` (`:96-111`) so legacy `localStorage` data (saved before this field existed) self-heals, matching the file's existing normalization pattern:

```ts
function normalizeOrg(org: SalesOrg): SalesOrg {
  const knowledgeCenter = org.knowledgeBase?.knowledgeCenter ?? []
  const hasUncategorized = knowledgeCenter.some(k => k.permanent)
  return {
    ...org,
    planTier: org.planTier ?? 'enterprise',
    calls: org.calls ?? [],
    connectedIntegrations: org.connectedIntegrations ?? [],
    knowledgeBase: {
      documents: org.knowledgeBase?.documents ?? [],
      faqs: org.knowledgeBase?.faqs ?? [],
      text: org.knowledgeBase?.text ?? [],
      links: org.knowledgeBase?.links ?? [],
      knowledgeCenter: hasUncategorized ? knowledgeCenter : [...defaultKnowledgeCenterEntries(), ...knowledgeCenter],
    },
  }
}
```

Replace the whole `demoSeedOrg` function (`:330-427`) with a `planTier`-aware version:

```ts
export function demoSeedOrg(adminEmail: string, adminName: string, orgName: string, planTier: 'individual' | 'enterprise'): SalesOrg {
  const domain = emailDomain(adminEmail)
  const reps = planTier === 'enterprise'
    ? [
        { name: 'Jordan Lee', local: 'jordan', seatPaid: true },
        { name: 'Sam Patel', local: 'sam', seatPaid: true },
        { name: 'Taylor Brooks', local: 'taylor', seatPaid: false },
        { name: 'Morgan Reyes', local: 'morgan', seatPaid: true },
      ]
    : []
  const members: TeamMember[] = [
    { id: crypto.randomUUID(), name: adminName, email: adminEmail, role: 'admin', inviteCode: generateInviteCode(), seatPaid: true },
    ...reps.map(r => ({
      id: crypto.randomUUID(),
      name: r.name,
      email: `${r.local}@${domain}`,
      role: 'member' as const,
      inviteCode: generateInviteCode(),
      seatPaid: r.seatPaid,
    })),
  ]

  const knowledgeBase: KnowledgeBaseData = {
    documents: [
      { id: crypto.randomUUID(), name: 'Sales Playbook 2026.pdf', enabled: true },
      { id: crypto.randomUUID(), name: 'Pricing & Packaging Guide.pdf', enabled: true },
      { id: crypto.randomUUID(), name: 'Competitor Battlecards.pdf', enabled: true },
      { id: crypto.randomUUID(), name: 'Customer Case Studies.pdf', enabled: true },
      { id: crypto.randomUUID(), name: 'Security & Compliance Overview.pdf', enabled: false },
    ],
    faqs: [
      { id: crypto.randomUUID(), question: 'Do you offer a free trial?', answer: 'No. Lightforth does not currently offer a free trial. Non-subscribers receive 5 credits per month, and eligible first-time users can activate Pro for $10 for the first month before it renews at $49/month.', enabled: true },
      { id: crypto.randomUUID(), question: "What's included in the Enterprise plan?", answer: 'Unlimited team seats, a dedicated knowledge base, priority support, and a named onboarding specialist.', enabled: true },
      { id: crypto.randomUUID(), question: 'Can we cancel anytime?', answer: 'Yes, monthly plans can be cancelled anytime with no penalty. Annual plans are billed upfront but cancel effective end of term.', enabled: true },
      { id: crypto.randomUUID(), question: 'Do you integrate with Salesforce?', answer: 'Yes — we have a native two-way Salesforce integration that syncs calls, notes, and deal stages automatically.', enabled: true },
      { id: crypto.randomUUID(), question: 'Is our data secure?', answer: "All data is encrypted at rest and in transit, and we're SOC 2 Type II certified.", enabled: true },
    ],
    knowledgeCenter: [
      ...defaultKnowledgeCenterEntries(),
      { id: crypto.randomUUID(), title: 'Refund Policy', body: "Customers can request a full refund within 30 days of purchase if they're not satisfied. Refunds are processed within 5-7 business days back to the original payment method.", lastUpdated: daysAgo(12), permanent: false, enabled: true },
      { id: crypto.randomUUID(), title: 'Objection Handling', body: "When a prospect says it's too expensive, reframe around ROI — ask what the cost of the status quo is. When they say 'we need to think about it,' propose a specific next step with a deadline rather than leaving it open-ended.", lastUpdated: daysAgo(5), permanent: false, enabled: true },
      { id: crypto.randomUUID(), title: 'Escalation Procedure', body: 'If a deal is stuck after two rounds of objection handling, loop in your manager via Slack with a one-line summary. For any discount above 20%, get manager sign-off before quoting.', lastUpdated: daysAgo(20), permanent: false, enabled: true },
      { id: crypto.randomUUID(), title: 'Onboarding Process', body: 'Once a deal closes, the customer gets a welcome email within 1 business day, a kickoff call within 5 business days, and a dedicated CSM for the first 90 days.', lastUpdated: daysAgo(2), permanent: false, enabled: true },
    ],
    text: [
      { id: crypto.randomUUID(), body: 'Remember to mention the new annual billing discount (20% off) when a prospect asks about pricing flexibility.', enabled: true },
      { id: crypto.randomUUID(), body: "Q3 emphasis: lead with the new analytics dashboard — it's resonating well with mid-market prospects.", enabled: true },
      { id: crypto.randomUUID(), body: 'If a prospect mentions a competitor by name, pull up the relevant battlecard before responding.', enabled: true },
    ],
    links: [
      { id: crypto.randomUUID(), type: 'website', label: 'Pricing page', value: `https://${domain || 'yourcompany.com'}/pricing`, status: 'scraped', enabled: true },
      { id: crypto.randomUUID(), type: 'email', label: 'Sales', value: `sales@${domain || 'yourcompany.com'}`, status: 'saved', enabled: true },
      { id: crypto.randomUUID(), type: 'phone', label: 'Support line', value: '+1 (555) 234-5678', status: 'saved', enabled: true },
      { id: crypto.randomUUID(), type: 'social', label: 'LinkedIn', value: `https://linkedin.com/company/${domain.split('.')[0] || 'yourcompany'}`, status: 'saved', enabled: true },
    ],
  }

  const callAuthorCycle = planTier === 'individual'
    ? [{ name: adminName, email: adminEmail }]
    : [
        { name: 'Jordan Lee', email: `jordan@${domain}` },
        { name: 'Sam Patel', email: `sam@${domain}` },
        { name: 'Morgan Reyes', email: `morgan@${domain}` },
      ]

  const callTemplates = [
    {
      daysAgoN: 1, durationSeconds: 612,
      transcript: [
        { speaker: 'Prospect', text: "Look, I like the product, but the price point is a stretch for us this quarter." },
        { speaker: 'Rep', text: "I hear you on budget — a lot of our customers felt the same before they saw the time saved. What if we started with the core tier and revisited expansion next quarter?" },
        { speaker: 'Prospect', text: "That could work. Can you send over a proposal?" },
        { speaker: 'Rep', text: "Absolutely, I'll have it in your inbox by Thursday." },
      ],
    },
    {
      daysAgoN: 2, durationSeconds: 845,
      transcript: [
        { speaker: 'Prospect', text: "What makes you different from your competitors?" },
        { speaker: 'Rep', text: "We integrate natively with your existing stack — no migration needed. A similar customer cut onboarding time by 60% switching to us." },
      ],
    },
    {
      daysAgoN: 4, durationSeconds: 503,
      transcript: [
        { speaker: 'Prospect', text: "We're already locked into a contract with another vendor until next year." },
        { speaker: 'Rep', text: "Totally understand — a lot of teams start with a pilot on a smaller team so you're ready to switch the moment your contract's up." },
      ],
    },
    {
      daysAgoN: 6, durationSeconds: 721,
      transcript: [
        { speaker: 'Prospect', text: "How long does implementation usually take?" },
        { speaker: 'Rep', text: "Most teams are fully live within two weeks, including data migration and rep onboarding." },
      ],
    },
    {
      daysAgoN: 9, durationSeconds: 398,
      transcript: [
        { speaker: 'Prospect', text: "Can you send over a proposal by end of week?" },
        { speaker: 'Rep', text: "Absolutely, I'll have it in your inbox by Thursday. Should we put 30 minutes on the calendar Friday to walk through it together?" },
      ],
    },
  ]

  const calls: CallRecord[] = callTemplates.map((t, i) => {
    const author = callAuthorCycle[i % callAuthorCycle.length]
    return {
      id: crypto.randomUUID(),
      repEmail: author.email,
      repName: author.name,
      date: daysAgo(t.daysAgoN),
      durationSeconds: t.durationSeconds,
      transcript: t.transcript.map(line => ({ speaker: line.speaker === 'Rep' ? author.name : line.speaker, text: line.text })),
    }
  })

  return {
    orgName,
    planTier,
    setupFeePaid: true,
    knowledgeBase,
    members,
    calls,
    connectedIntegrations: ['salesforce', 'slack'],
  }
}
```

Update the two hand-built `SalesOrg` test fixtures (they're both enterprise-invite scenarios) — add `planTier: 'enterprise',` right after `orgName: 'Acme Inc',` in each:
- `src/pages/desktopCopilot/SignInScreen.test.tsx:82` and `:103`
- `src/pages/DesktopCopilotPreview.test.tsx:275`

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/sales/mockOrg.test.ts`
Expected: PASS (all 3 tests)

Run: `npx tsc --noEmit`
Expected: no errors (confirms the two test-fixture updates compile)

- [ ] **Step 5: Commit**

```bash
git add src/pages/sales/mockOrg.ts src/pages/sales/mockOrg.test.ts src/pages/desktopCopilot/SignInScreen.test.tsx src/pages/DesktopCopilotPreview.test.tsx
git commit -m "feat: add planTier to SalesOrg, seed individual orgs without fake teammates"
```

---

### Task 2: Add `'sales-individual'` account type

**Files:**
- Modify: `src/pages/desktopCopilot/mockAccounts.ts:5`

**Interfaces:**
- Produces: `AccountType` now includes `'sales-individual'`

- [ ] **Step 1: Edit the type**

```ts
export type AccountType = 'regular' | 'exam' | 'sales-individual' | 'enterprise-admin' | 'enterprise-member'
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors (this is a widening change, nothing consumes the type exhaustively yet)

- [ ] **Step 3: Commit**

```bash
git add src/pages/desktopCopilot/mockAccounts.ts
git commit -m "feat: add sales-individual account type"
```

---

### Task 3: Individual checkout page + route

**Files:**
- Create: `src/pages/marketing/checkout/IndividualCheckoutPage.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `CheckoutFlow` from `./CheckoutFlow` (props: `productLabel`, `lineItems`, `totalLabel`, `payButtonLabel`, `accentClassName`, `collectCompany`, `onComplete`, `onCancel` — see `src/pages/marketing/checkout/CheckoutFlow.tsx:50-68`), `setAccount` from `@/pages/desktopCopilot/mockAccounts`, `createOrg`/`demoSeedOrg`/`setActiveAdminEmail` from `@/pages/sales/mockOrg` (Task 1's 4-arg `demoSeedOrg`).
- Produces: route `/copilot/individual/checkout`.

- [ ] **Step 1: Write the file**

```tsx
import { useNavigate } from 'react-router-dom'
import { CheckoutFlow } from './CheckoutFlow'
import { setAccount } from '@/pages/desktopCopilot/mockAccounts'
import { createOrg, demoSeedOrg, setActiveAdminEmail } from '@/pages/sales/mockOrg'

const MONTHLY_PRICE = 99.90

export default function IndividualCheckoutPage() {
  const navigate = useNavigate()

  return (
    <CheckoutFlow
      productLabel="the Individual plan"
      collectCompany={false}
      lineItems={[{ label: 'Individual plan — first month', amount: `$${MONTHLY_PRICE.toFixed(2)}` }]}
      totalLabel={`$${MONTHLY_PRICE.toFixed(2)}`}
      payButtonLabel={`Pay $${MONTHLY_PRICE.toFixed(2)} and continue`}
      accentClassName="bg-teal-500 hover:bg-teal-600"
      onCancel={() => navigate('/copilot/enterprise')}
      onComplete={({ email, fullName }) => {
        setAccount(email, { accountType: 'sales-individual' })
        createOrg(email, demoSeedOrg(email, fullName, `${fullName}'s workspace`, 'individual'))
        setActiveAdminEmail(email)
        navigate('/sales/dashboard')
      }}
    />
  )
}
```

- [ ] **Step 2: Register the route**

In `src/App.tsx`, add the lazy import next to the existing enterprise checkout import (near line 33):

```ts
const IndividualCheckoutPage = lazy(() => import('@/pages/marketing/checkout/IndividualCheckoutPage'))
```

Add the route next to the enterprise checkout route (near line 134):

```tsx
<Route path="/copilot/individual/checkout" element={<Suspense fallback={null}><IndividualCheckoutPage /></Suspense>} />
```

- [ ] **Step 3: Verify it compiles and renders**

Run: `npx tsc --noEmit`
Expected: no errors

Run: `npm run dev` (or reuse an already-running dev server), visit `http://localhost:5173/copilot/individual/checkout`
Expected: sees "Create your account" step without a "Company name" field, "For the Individual plan" subtext

- [ ] **Step 4: Commit**

```bash
git add src/pages/marketing/checkout/IndividualCheckoutPage.tsx src/App.tsx
git commit -m "feat: add Individual plan checkout page and route"
```

---

### Task 4: Two-plan pricing section + FAQ copy pass on the landing page

**Files:**
- Modify: `src/pages/marketing/EnterpriseCopilotLanding.tsx`

**Interfaces:**
- Consumes: `IndividualCheckoutPage` route from Task 3 (`/copilot/individual/checkout`).

- [ ] **Step 1: Add pricing constants**

Add near the top of the file, right after `PRICING_BULLETS` (`:25-30`):

```ts
const INDIVIDUAL_PRICE = 99.90

const INDIVIDUAL_BULLETS = [
  'Everything in Sales Closer AI — live coaching, your own knowledge base, call history',
  'No team required — set up your own playbook and go live solo',
  'Move to Enterprise any time your team grows',
]

const ENTERPRISE_BOOKING_URL = 'https://calendly.com/lightforth/enterprise'
```

- [ ] **Step 2: Replace the FAQ items**

Replace `FAQ_ITEMS` (`:32-53`) — remove the `$5,000` item, reword the call-recordings item so it no longer assumes a team exists:

```ts
const FAQ_ITEMS = [
  {
    q: "How is this different from Gong or Chorus?",
    a: "Call-intelligence tools tell you what went wrong after the call ends. Sales Closer AI answers the objection while the rep is still on the line — coaching happens in the moment that decides the deal, not in a Monday recap.",
  },
  {
    q: 'Do all my reps need to be live at once?',
    a: 'No. Your own seat activates the moment you pay for it, independent of the rest of the team — add and pay for reps one at a time as you onboard them.',
  },
  {
    q: 'What happens to our call recordings and transcripts?',
    a: "They're kept for up to 90 days and reviewable in your Call History. Whoever owns the account — a solo rep on the Individual plan, or the admin on an Enterprise team — has access to everything in the dashboard; granular per-rep permissions are on our roadmap, not available yet.",
  },
  {
    q: "What if there's more than one person on the prospect's side of the call?",
    a: "Sales Closer AI tells the voices on the other end apart, so the answer it surfaces still applies to whoever's actually asking — your rep doesn't lose the thread when a second stakeholder joins partway through.",
  },
]
```

- [ ] **Step 3: Replace the pricing section**

Replace the `<section id="pricing">` block (`:187-215`):

```tsx
{!isWaitlist && (
  <section id="pricing" className="border-t border-slate-100 bg-slate-50/60 py-20">
    <div className="mx-auto max-w-4xl px-6 text-center">
      <h2 className="text-2xl font-bold text-slate-900">Choose your plan</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-lg shadow-slate-900/5">
          <h3 className="text-lg font-black text-slate-900">Individual</h3>
          <p className="mt-5 text-2xl font-black text-slate-900">
            ${INDIVIDUAL_PRICE.toFixed(2)} <span className="text-sm font-medium text-slate-500">/ month</span>
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-600">
            {INDIVIDUAL_BULLETS.map(b => (
              <li key={b} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                {b}
              </li>
            ))}
          </ul>
          <Button size="lg" className="mt-8 w-full bg-teal-500 text-white hover:bg-teal-600" onClick={() => navigate('/copilot/individual/checkout')}>
            Get started
          </Button>
        </article>

        <article className="rounded-2xl border border-teal-200 bg-white p-8 text-left shadow-lg shadow-teal-900/5">
          <h3 className="text-lg font-black text-slate-900">Enterprise</h3>
          <p className="mt-5 text-sm font-semibold text-slate-500">Custom rollout for your whole team</p>
          <ul className="mt-6 space-y-3 text-sm text-slate-600">
            {PRICING_BULLETS.map(b => (
              <li key={b} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                {b}
              </li>
            ))}
          </ul>
          <Button
            size="lg"
            className="mt-8 w-full bg-[#08285c] text-white hover:bg-[#08285c]/90"
            onClick={() => window.open(ENTERPRISE_BOOKING_URL, '_blank', 'noopener,noreferrer')}
          >
            Book a Call
          </Button>
        </article>
      </div>
    </div>
  </section>
)}
```

- [ ] **Step 4: Fix the closing-section CTA**

The closing CTA (`:222-229`) currently navigates straight to the now-removed direct-checkout flow. Change it to scroll to the new two-plan pricing section, matching the hero and features-section CTAs:

```tsx
<section className="border-t border-slate-100 bg-[#08285c] py-16 text-center text-white">
  <div className="mx-auto max-w-2xl px-6">
    <h2 className="text-2xl font-bold">Give your whole team the same playbook.</h2>
    <Button
      size="lg"
      className="mt-6 bg-teal-400 font-bold text-[#08285c] hover:bg-teal-300"
      onClick={() => isWaitlist ? scrollToWaitlist() : document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
    >
      Get started
    </Button>
  </div>
</section>
```

- [ ] **Step 5: Manually verify in the browser**

Run the dev server, visit `/copilot/enterprise`:
- Two plan cards render side by side under "Choose your plan"
- Individual card shows "$99.90 / month" and its "Get started" button navigates to `/copilot/individual/checkout`
- Enterprise card shows no price and its "Book a Call" button opens `https://calendly.com/lightforth/enterprise` in a new tab
- FAQ no longer mentions "$5,000"
- Visit `/copilot/enterprise?waitlist=1` — pricing section and footer are still hidden, no `$` in FAQ (unchanged waitlist behavior)

- [ ] **Step 6: Commit**

```bash
git add src/pages/marketing/EnterpriseCopilotLanding.tsx
git commit -m "feat: split sales landing page pricing into Individual and Enterprise plans"
```

---

### Task 5: Hide "Team" nav item for individual orgs

**Files:**
- Modify: `src/pages/sales/SalesAdminLayout.tsx`
- Test: `src/pages/sales/SalesAdminLayout.test.tsx` (new)

**Interfaces:**
- Consumes: `SalesOrg.planTier` (Task 1).

- [ ] **Step 1: Write the failing test**

Create `src/pages/sales/SalesAdminLayout.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import SalesAdminLayout from './SalesAdminLayout'
import { createOrg, demoSeedOrg, setActiveAdminEmail } from './mockOrg'

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/sales/dashboard']}>
      <Routes>
        <Route path="/sales/dashboard" element={<SalesAdminLayout />}>
          <Route index element={<div>Overview page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('SalesAdminLayout nav', () => {
  beforeEach(() => localStorage.clear())

  it('shows the Team nav item for an enterprise org', () => {
    createOrg('admin@acme.com', demoSeedOrg('admin@acme.com', 'Ada Admin', 'Acme Team', 'enterprise'))
    setActiveAdminEmail('admin@acme.com')
    renderLayout()
    expect(screen.getByText('Team')).toBeInTheDocument()
  })

  it('hides the Team nav item for an individual org', () => {
    createOrg('solo@example.com', demoSeedOrg('solo@example.com', 'Sam Solo', "Sam Solo's workspace", 'individual'))
    setActiveAdminEmail('solo@example.com')
    renderLayout()
    expect(screen.queryByText('Team')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/sales/SalesAdminLayout.test.tsx`
Expected: FAIL on the second test — "Team" is currently always rendered.

- [ ] **Step 3: Implement**

In `src/pages/sales/SalesAdminLayout.tsx`, change the nav rendering (`:46-63`) to filter by `org.planTier`:

```tsx
<nav className="mt-6 flex flex-col gap-1">
  {NAV.filter(item => org.planTier === 'enterprise' || item.label !== 'Team').map(item => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white',
        )
      }
    >
      <item.icon className="h-4 w-4" />
      {item.label}
    </NavLink>
  ))}
</nav>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/sales/SalesAdminLayout.test.tsx`
Expected: PASS (both tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/sales/SalesAdminLayout.tsx src/pages/sales/SalesAdminLayout.test.tsx
git commit -m "feat: hide Team nav item for individual sales accounts"
```

---

### Task 6: Redirect guard on the Team route for individual orgs

**Files:**
- Modify: `src/pages/sales/Team.tsx`
- Test: `src/pages/sales/Team.test.tsx` (new)

**Interfaces:**
- Consumes: `SalesDashboardContext` (`{ adminEmail, org, refresh }`) from `./SalesAdminLayout`.

- [ ] **Step 1: Write the failing test**

Create `src/pages/sales/Team.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Team from './Team'
import { demoSeedOrg } from './mockOrg'
import type { SalesDashboardContext } from './SalesAdminLayout'

function renderWithContext(context: SalesDashboardContext) {
  return render(
    <MemoryRouter initialEntries={['/sales/dashboard/team']}>
      <Routes>
        <Route path="/sales/dashboard" element={<div>Overview page</div>} />
        <Route path="/sales/dashboard/team" element={<Outlet context={context} />}>
          <Route index element={<Team />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Team route guard', () => {
  it('renders normally for an enterprise org', () => {
    const org = demoSeedOrg('admin@acme.com', 'Ada Admin', 'Acme Team', 'enterprise')
    renderWithContext({ adminEmail: 'admin@acme.com', org, refresh: () => {} })
    expect(screen.getByText('Add member')).toBeInTheDocument()
  })

  it('redirects to the dashboard for an individual org', () => {
    const org = demoSeedOrg('solo@example.com', 'Sam Solo', "Sam Solo's workspace", 'individual')
    renderWithContext({ adminEmail: 'solo@example.com', org, refresh: () => {} })
    expect(screen.getByText('Overview page')).toBeInTheDocument()
    expect(screen.queryByText('Add member')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/sales/Team.test.tsx`
Expected: FAIL on the second test — `Team` currently renders unconditionally.

- [ ] **Step 3: Implement**

At the top of `src/pages/sales/Team.tsx`, add the guard:

```tsx
import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Check, Copy, UserPlus } from 'lucide-react'
import { addMember, emailDomain, markMemberSeatPaid } from './mockOrg'
import type { SalesDashboardContext } from './SalesAdminLayout'

const SEAT_PRICE = 79

export default function Team() {
  const { adminEmail, org, refresh } = useOutletContext<SalesDashboardContext>()
  const navigate = useNavigate()

  useEffect(() => {
    if (org.planTier === 'individual') navigate('/sales/dashboard', { replace: true })
  }, [org.planTier, navigate])

  if (org.planTier === 'individual') return null

  const [showAddForm, setShowAddForm] = useState(false)
  // ...rest of the existing component body is unchanged from here down
```

(Only the imports and the top of the function change — everything below the existing `const [showAddForm, setShowAddForm] = useState(false)` line stays exactly as-is.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/sales/Team.test.tsx`
Expected: PASS (both tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/sales/Team.tsx src/pages/sales/Team.test.tsx
git commit -m "feat: redirect individual accounts away from the Team page"
```

---

### Task 7: Plan-aware Overview page

**Files:**
- Modify: `src/pages/sales/Overview.tsx`
- Test: `src/pages/sales/Overview.test.tsx` (new)

**Interfaces:**
- Consumes: `SalesDashboardContext` from `./SalesAdminLayout`.

- [ ] **Step 1: Write the failing test**

Create `src/pages/sales/Overview.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Overview from './Overview'
import { demoSeedOrg } from './mockOrg'
import type { SalesDashboardContext } from './SalesAdminLayout'

function renderWithContext(context: SalesDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<Overview />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Overview plan-aware display', () => {
  it('shows the $5,000 setup fee card and a Team quick-link for enterprise orgs', () => {
    const org = demoSeedOrg('admin@acme.com', 'Ada Admin', 'Acme Team', 'enterprise')
    renderWithContext({ adminEmail: 'admin@acme.com', org, refresh: () => {} })
    expect(screen.getByText('Setup fee')).toBeInTheDocument()
    expect(screen.getByText('Team')).toBeInTheDocument()
  })

  it('shows a Plan card instead of a setup fee, and no Team quick-link, for individual orgs', () => {
    const org = demoSeedOrg('solo@example.com', 'Sam Solo', "Sam Solo's workspace", 'individual')
    renderWithContext({ adminEmail: 'solo@example.com', org, refresh: () => {} })
    expect(screen.queryByText('Setup fee')).not.toBeInTheDocument()
    expect(screen.getByText('Plan')).toBeInTheDocument()
    expect(screen.getByText(/\$99\.90/)).toBeInTheDocument()
    expect(screen.queryByText('Team')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/sales/Overview.test.tsx`
Expected: FAIL on the second test — Overview currently always shows "Setup fee" and a "Team" link.

- [ ] **Step 3: Implement**

In `src/pages/sales/Overview.tsx`, replace the top stats grid (`:65-83`) and the bottom quick-links grid (`:112-132`):

```tsx
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {org.planTier === 'enterprise' ? (
          <div className="lf-panel p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Check className="h-4 w-4 text-emerald-500" /> Setup fee
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900">{org.setupFeePaid ? 'Paid' : 'Unpaid'}</p>
            <p className="mt-1 text-sm text-slate-500">One-time $5,000 setup, already settled.</p>
          </div>
        ) : (
          <div className="lf-panel p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Check className="h-4 w-4 text-emerald-500" /> Plan
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900">Individual</p>
            <p className="mt-1 text-sm text-slate-500">$99.90/mo, no setup fee.</p>
          </div>
        )}

        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Users className="h-4 w-4 text-primary" /> Active seats
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">
            {paidSeats} <span className="text-base font-medium text-slate-500">of {org.members.length} added</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {org.planTier === 'enterprise' ? '$79/mo per active seat — only pay for reps who are live.' : 'Your own seat, included in your $99.90/mo plan.'}
          </p>
        </div>
      </div>
```

```tsx
      <div className={cn('mt-8 grid gap-5', org.planTier === 'enterprise' ? 'sm:grid-cols-2' : 'sm:grid-cols-1')}>
        <Link to="/sales/dashboard/knowledge-base" className="lf-panel flex items-center gap-4 p-6 transition-colors hover:bg-slate-50">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900">Knowledge Base</p>
            <p className="text-sm text-slate-500">{knowledgeItemCount} item{knowledgeItemCount === 1 ? '' : 's'} across documents, FAQs & more</p>
          </div>
        </Link>

        {org.planTier === 'enterprise' && (
          <Link to="/sales/dashboard/team" className="lf-panel flex items-center gap-4 p-6 transition-colors hover:bg-slate-50">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Team</p>
              <p className="text-sm text-slate-500">{org.members.length} member{org.members.length === 1 ? '' : 's'} total</p>
            </div>
          </Link>
        )}
      </div>
```

Add the `cn` import at the top of the file (next to the existing imports):

```ts
import { cn } from '@/lib/utils'
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/sales/Overview.test.tsx`
Expected: PASS (both tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/sales/Overview.tsx src/pages/sales/Overview.test.tsx
git commit -m "feat: make sales Overview page plan-aware"
```

---

### Task 8: Plan-aware Billing page

**Files:**
- Modify: `src/pages/sales/Billing.tsx`
- Test: `src/pages/sales/Billing.test.tsx` (new)

**Interfaces:**
- Consumes: `SalesDashboardContext` from `./SalesAdminLayout`.

- [ ] **Step 1: Write the failing test**

Create `src/pages/sales/Billing.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Billing from './Billing'
import { demoSeedOrg } from './mockOrg'
import type { SalesDashboardContext } from './SalesAdminLayout'

function renderWithContext(context: SalesDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<Billing />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Billing plan-aware display', () => {
  it('shows the $5,000 setup fee and a per-seat breakdown table for enterprise orgs', () => {
    const org = demoSeedOrg('admin@acme.com', 'Ada Admin', 'Acme Team', 'enterprise')
    renderWithContext({ adminEmail: 'admin@acme.com', org, refresh: () => {} })
    expect(screen.getByText('$5,000')).toBeInTheDocument()
    expect(screen.getByText('Per-seat breakdown')).toBeInTheDocument()
  })

  it('shows a flat $99.90/mo and no per-seat breakdown for individual orgs', () => {
    const org = demoSeedOrg('solo@example.com', 'Sam Solo', "Sam Solo's workspace", 'individual')
    renderWithContext({ adminEmail: 'solo@example.com', org, refresh: () => {} })
    expect(screen.queryByText('$5,000')).not.toBeInTheDocument()
    expect(screen.getByText(/\$99\.90/)).toBeInTheDocument()
    expect(screen.queryByText('Per-seat breakdown')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/sales/Billing.test.tsx`
Expected: FAIL on the second test — Billing currently always shows the $5,000 fee and the per-seat table.

- [ ] **Step 3: Implement**

Replace the whole component body in `src/pages/sales/Billing.tsx`:

```tsx
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { Check, CreditCard } from 'lucide-react'
import type { SalesDashboardContext } from './SalesAdminLayout'

const SEAT_PRICE = 79
const SETUP_FEE = 5000
const INDIVIDUAL_PRICE = 99.90

export default function Billing() {
  const { org } = useOutletContext<SalesDashboardContext>()
  const paidSeats = org.members.filter(m => m.seatPaid)
  const monthlyTotal = org.planTier === 'enterprise' ? paidSeats.length * SEAT_PRICE : INDIVIDUAL_PRICE

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
      <p className="mt-1 text-sm text-slate-500">What you've paid, what you're paying monthly, and how it's split per seat.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {org.planTier === 'enterprise' ? (
          <div className="lf-panel p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Check className="h-4 w-4 text-emerald-500" /> Setup fee
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900">{org.setupFeePaid ? `$${SETUP_FEE.toLocaleString()}` : 'Unpaid'}</p>
            <p className="mt-1 text-sm text-slate-500">One-time, already settled.</p>
          </div>
        ) : (
          <div className="lf-panel p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Check className="h-4 w-4 text-emerald-500" /> Plan
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900">Individual</p>
            <p className="mt-1 text-sm text-slate-500">No setup fee, no per-seat billing.</p>
          </div>
        )}

        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <CreditCard className="h-4 w-4 text-primary" /> Monthly subscription
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">
            ${monthlyTotal.toFixed(2)} <span className="text-base font-medium text-slate-500">/ month</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {org.planTier === 'enterprise'
              ? `${paidSeats.length} active seat${paidSeats.length === 1 ? '' : 's'} at $${SEAT_PRICE}/mo each.`
              : 'Flat monthly rate for your Individual plan.'}
          </p>
        </div>
      </div>

      {org.planTier === 'enterprise' && (
        <div className="mt-8 lf-panel">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="lf-section-title">Per-seat breakdown</h2>
          </div>
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <th className="lf-table-th">Member</th>
                <th className="lf-table-th">Email</th>
                <th className="lf-table-th">Status</th>
                <th className="lf-table-th text-right">Monthly cost</th>
              </tr>
            </thead>
            <tbody>
              {org.members.map(member => (
                <tr key={member.id} className="lf-table-row">
                  <td className="lf-table-cell font-medium text-slate-900">{member.name}</td>
                  <td className="lf-table-cell text-slate-600">{member.email}</td>
                  <td className="lf-table-cell">
                    {member.seatPaid ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                        <Check className="h-3 w-3" /> Active
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Not active</span>
                    )}
                  </td>
                  <td className="lf-table-cell text-right text-slate-600">{member.seatPaid ? `$${SEAT_PRICE}/mo` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 lf-panel p-6">
        <h2 className="lf-section-title">Payment method</h2>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-14 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-500">VISA</div>
            <p className="text-sm text-slate-700">•••• •••• •••• 4242</p>
          </div>
          <button
            onClick={() => toast.success('Payment method updated')}
            className="h-9 rounded-lg border border-border px-4 text-sm font-semibold text-slate-600 hover:bg-muted"
          >
            Update payment method
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/sales/Billing.test.tsx`
Expected: PASS (both tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/sales/Billing.tsx src/pages/sales/Billing.test.tsx
git commit -m "feat: make sales Billing page plan-aware"
```

---

### Task 9: Fix `SalesSignIn.tsx`'s `demoSeedOrg` call

**Files:**
- Modify: `src/pages/sales/SalesSignIn.tsx:21`

**Interfaces:**
- Consumes: `demoSeedOrg` (Task 1's 4-arg signature).

- [ ] **Step 1: Update the call**

This screen's own copy says "For Enterprise admins" — it's a returning-admin sign-in, not part of the Individual signup flow, so it always seeds an enterprise org:

```ts
org = demoSeedOrg(email, firstName.trim(), orgName, 'enterprise')
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no errors (this was the last remaining 3-arg call site)

- [ ] **Step 3: Commit**

```bash
git add src/pages/sales/SalesSignIn.tsx
git commit -m "fix: pass enterprise planTier from the enterprise-admin sign-in screen"
```

---

### Task 10: Shared personal-Context mock source module

**Files:**
- Create: `src/lib/mockContextSources.ts`
- Modify: `src/components/shared/DocumentPickerModal.tsx`
- Test: `src/lib/mockContextSources.test.ts` (new)

**Interfaces:**
- Produces: `ContextSource { id: string; name: string; type: string }`, `MOCK_CONTEXT_SOURCES: ContextSource[]`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/mockContextSources.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { MOCK_CONTEXT_SOURCES } from './mockContextSources'

describe('MOCK_CONTEXT_SOURCES', () => {
  it('has at least one entry, each with id/name/type', () => {
    expect(MOCK_CONTEXT_SOURCES.length).toBeGreaterThan(0)
    for (const src of MOCK_CONTEXT_SOURCES) {
      expect(typeof src.id).toBe('string')
      expect(typeof src.name).toBe('string')
      expect(typeof src.type).toBe('string')
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/mockContextSources.test.ts`
Expected: FAIL — module does not exist yet.

- [ ] **Step 3: Implement**

Create `src/lib/mockContextSources.ts`:

```ts
export interface ContextSource {
  id: string
  name: string
  type: string
}

export const MOCK_CONTEXT_SOURCES: ContextSource[] = [
  { id: '1', name: 'Darnell_Smith_Resume.pdf', type: 'PDF' },
  { id: '2', name: 'github.com/darnellsmith', type: 'GitHub' },
  { id: '3', name: 'linkedin.com/in/darnellsmith', type: 'LinkedIn' },
  { id: '4', name: 'Interview Prep Notes', type: 'Note' },
  { id: '5', name: 'Cover_Letter_Template.docx', type: 'DOCX' },
]
```

In `src/components/shared/DocumentPickerModal.tsx`, remove the local `MOCK_CONTEXT_SOURCES` array (`:7-13`) and replace it with an import, keeping icon selection local to this file since the shared module is icon-agnostic:

```ts
import { useState } from 'react'
import { X, Upload, Sparkles, FileText, Layers, File as FileIcon, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_CONTEXT_SOURCES } from '@/lib/mockContextSources'

type DocPickerStep = 'choose' | 'cv' | 'context' | 'other'

function iconForContextType(type: string) {
  if (type === 'GitHub' || type === 'LinkedIn') return Layers
  if (type === 'Note') return FileIcon
  return FileText
}
```

Update the two places that read `.icon` off a source (`:174-175` and any other reference) to call `iconForContextType(src.type)` instead:

```tsx
{MOCK_CONTEXT_SOURCES.map(src => {
  const Icon = iconForContextType(src.type)
  const isChecked = selected.has(src.id)
  return (
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/mockContextSources.test.ts`
Expected: PASS

Run: `npx tsc --noEmit`
Expected: no errors (confirms `DocumentPickerModal.tsx` still compiles against the new import)

- [ ] **Step 5: Manually verify no regression**

Run the dev server, go through Interview Prep's "Add Documents" → "Context Sources" flow — the same 5 mock sources still list and remain selectable.

- [ ] **Step 6: Commit**

```bash
git add src/lib/mockContextSources.ts src/lib/mockContextSources.test.ts src/components/shared/DocumentPickerModal.tsx
git commit -m "refactor: extract shared mock context-source data out of DocumentPickerModal"
```

---

### Task 11: `resolveContextDocs` — pick the right document library per account

**Files:**
- Create: `src/pages/desktopCopilot/resolveContextDocs.ts`
- Test: `src/pages/desktopCopilot/resolveContextDocs.test.ts` (new)

**Interfaces:**
- Consumes: `getAccount` from `./mockAccounts`, `getOrgByAdminEmail`/`findMemberByEmail` from `@/pages/sales/mockOrg`, `MOCK_CONTEXT_SOURCES` from `@/lib/mockContextSources` (Task 10).
- Produces: `ContextDoc { id: string; name: string; type: string }`, `resolveContextDocs(email: string): ContextDoc[]`.

- [ ] **Step 1: Write the failing test**

Create `src/pages/desktopCopilot/resolveContextDocs.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { resolveContextDocs } from './resolveContextDocs'
import { setAccount } from './mockAccounts'
import { createOrg, demoSeedOrg, addMember, markMemberSeatPaid } from '@/pages/sales/mockOrg'
import { MOCK_CONTEXT_SOURCES } from '@/lib/mockContextSources'

describe('resolveContextDocs', () => {
  beforeEach(() => localStorage.clear())

  it('returns the personal Context library for a regular account', () => {
    setAccount('me@example.com', { accountType: 'regular', planId: 'premium' })
    const docs = resolveContextDocs('me@example.com')
    expect(docs.map(d => d.name)).toEqual(MOCK_CONTEXT_SOURCES.map(s => s.name))
  })

  it('returns the personal Context library for a sales-individual account', () => {
    setAccount('solo@example.com', { accountType: 'sales-individual' })
    const docs = resolveContextDocs('solo@example.com')
    expect(docs.map(d => d.name)).toEqual(MOCK_CONTEXT_SOURCES.map(s => s.name))
  })

  it('returns the personal Context library when there is no account on record', () => {
    const docs = resolveContextDocs('nobody@example.com')
    expect(docs.map(d => d.name)).toEqual(MOCK_CONTEXT_SOURCES.map(s => s.name))
  })

  it('returns only enabled org Knowledge Base documents for an enterprise-admin account', () => {
    const org = demoSeedOrg('admin@acme.com', 'Ada Admin', 'Acme Team', 'enterprise')
    createOrg('admin@acme.com', org)
    setAccount('admin@acme.com', { accountType: 'enterprise-admin', orgName: 'Acme Team' })
    const docs = resolveContextDocs('admin@acme.com')
    const enabledNames = org.knowledgeBase.documents.filter(d => d.enabled).map(d => d.name)
    expect(docs.map(d => d.name).sort()).toEqual(enabledNames.sort())
    expect(docs.some(d => d.name === 'Security & Compliance Overview.pdf')).toBe(false) // seeded disabled
  })

  it('returns the org Knowledge Base for an enterprise-member account, looked up via their membership', () => {
    const org = demoSeedOrg('admin@acme.com', 'Ada Admin', 'Acme Team', 'enterprise')
    createOrg('admin@acme.com', org)
    const newMember = addMember('admin@acme.com', { name: 'Rep One', email: 'rep@acme.com' })!
    markMemberSeatPaid('admin@acme.com', newMember.id)
    setAccount('rep@acme.com', { accountType: 'enterprise-member', orgName: 'Acme Team' })
    const docs = resolveContextDocs('rep@acme.com')
    expect(docs.length).toBeGreaterThan(0)
    expect(docs.every(d => org.knowledgeBase.documents.some(kd => kd.name === d.name && kd.enabled))).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/desktopCopilot/resolveContextDocs.test.ts`
Expected: FAIL — module does not exist yet.

- [ ] **Step 3: Implement**

Create `src/pages/desktopCopilot/resolveContextDocs.ts`:

```ts
import { getAccount } from './mockAccounts'
import { getOrgByAdminEmail, findMemberByEmail } from '@/pages/sales/mockOrg'
import { MOCK_CONTEXT_SOURCES } from '@/lib/mockContextSources'

export interface ContextDoc {
  id: string
  name: string
  type: string
}

const PERSONAL_CONTEXT_DOCS: ContextDoc[] = MOCK_CONTEXT_SOURCES.map(s => ({ id: s.id, name: s.name, type: s.type }))

export function resolveContextDocs(email: string): ContextDoc[] {
  const account = email ? getAccount(email) : null

  if (account?.accountType === 'enterprise-admin' || account?.accountType === 'enterprise-member') {
    const org = getOrgByAdminEmail(email) ?? findMemberByEmail(email)?.org ?? null
    if (org) {
      return org.knowledgeBase.documents
        .filter(d => d.enabled)
        .map(d => ({ id: d.id, name: d.name, type: 'Knowledge Base' }))
    }
  }

  return PERSONAL_CONTEXT_DOCS
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/desktopCopilot/resolveContextDocs.test.ts`
Expected: PASS (all 5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/desktopCopilot/resolveContextDocs.ts src/pages/desktopCopilot/resolveContextDocs.test.ts
git commit -m "feat: resolve context documents from org Knowledge Base or personal Context library by account type"
```

---

### Task 12: Add `'context'` as a setup field for Sales Call

**Files:**
- Modify: `src/pages/desktopCopilot/useCases.ts`
- Modify: `src/pages/desktopCopilot/useCases.test.ts`

**Interfaces:**
- Produces: `SetupFieldId` now includes `'context'`; `sales-call`'s `setupFields` includes `'context'`.

- [ ] **Step 1: Write the failing test**

Add to `src/pages/desktopCopilot/useCases.test.ts`:

```ts
it('includes a context field for sales-call, after talk-track', () => {
  const config = getUseCase('sales-call')
  expect(config.setupFields).toContain('context')
  expect(config.setupFields.indexOf('talk-track')).toBeLessThan(config.setupFields.indexOf('context'))
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/desktopCopilot/useCases.test.ts`
Expected: FAIL — `'context'` is not a valid `SetupFieldId` yet, and isn't in `sales-call`'s `setupFields`.

- [ ] **Step 3: Implement**

In `src/pages/desktopCopilot/useCases.ts`, widen `SetupFieldId` (`:5-10`):

```ts
export type SetupFieldId =
  | 'position' | 'resume' | 'job-description'
  | 'customer-name' | 'deal-stage' | 'talk-track' | 'context'
  | 'meeting-title' | 'agenda' | 'screen-share-note'
  | 'subject' | 'language'
  | 'audio-device'
```

Update the `sales-call` use case's `setupFields` (`:43`):

```ts
setupFields: ['customer-name', 'deal-stage', 'talk-track', 'context', 'audio-device'],
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/desktopCopilot/useCases.test.ts`
Expected: PASS (all tests, including the new one)

- [ ] **Step 5: Commit**

```bash
git add src/pages/desktopCopilot/useCases.ts src/pages/desktopCopilot/useCases.test.ts
git commit -m "feat: add context setup field to the sales-call use case"
```

---

### Task 13: `ContextPickerField` component

**Files:**
- Create: `src/pages/desktopCopilot/ContextPickerField.tsx`
- Test: `src/pages/desktopCopilot/ContextPickerField.test.tsx` (new)

**Interfaces:**
- Consumes: `ContextDoc` type from `./resolveContextDocs` (Task 11), dark tokens `CARD`, `BORDER`, `BLUE`, `INPUT_BG`, `INPUT_BD` from `./shared`.
- Produces: `ContextPickerField({ docs, selected, onChange }: { docs: ContextDoc[]; selected: ContextDoc[]; onChange: (docs: ContextDoc[]) => void })`.

- [ ] **Step 1: Write the failing test**

Create `src/pages/desktopCopilot/ContextPickerField.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ContextPickerField } from './ContextPickerField'
import type { ContextDoc } from './resolveContextDocs'

const DOCS: ContextDoc[] = [
  { id: '1', name: 'Sales Playbook 2026.pdf', type: 'Knowledge Base' },
  { id: '2', name: 'Pricing & Packaging Guide.pdf', type: 'Knowledge Base' },
]

describe('ContextPickerField', () => {
  it('shows an "Add context" trigger when nothing is selected', () => {
    render(<ContextPickerField docs={DOCS} selected={[]} onChange={() => {}} />)
    expect(screen.getByText(/Add context from your documents/)).toBeInTheDocument()
  })

  it('opens a checklist of all docs, and calls onChange with the ticked ones on Done', () => {
    const onChange = vi.fn()
    render(<ContextPickerField docs={DOCS} selected={[]} onChange={onChange} />)
    fireEvent.click(screen.getByText(/Add context from your documents/))
    expect(screen.getByText('Sales Playbook 2026.pdf')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Sales Playbook 2026.pdf'))
    fireEvent.click(screen.getByText('Done'))
    expect(onChange).toHaveBeenCalledWith([DOCS[0]])
  })

  it('renders already-selected docs as removable chips, and removing one calls onChange without it', () => {
    const onChange = vi.fn()
    render(<ContextPickerField docs={DOCS} selected={[DOCS[0], DOCS[1]]} onChange={onChange} />)
    expect(screen.getByText('Sales Playbook 2026.pdf')).toBeInTheDocument()
    expect(screen.getByText('Pricing & Packaging Guide.pdf')).toBeInTheDocument()
    fireEvent.click(screen.getAllByLabelText('Remove')[0])
    expect(onChange).toHaveBeenCalledWith([DOCS[1]])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/desktopCopilot/ContextPickerField.test.tsx`
Expected: FAIL — module does not exist yet.

- [ ] **Step 3: Implement**

Create `src/pages/desktopCopilot/ContextPickerField.tsx`:

```tsx
import { useState } from 'react'
import { Plus, X, FileText, Layers, File as FileIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CARD, BORDER, BLUE } from './shared'
import type { ContextDoc } from './resolveContextDocs'

function iconForType(type: string) {
  if (type === 'GitHub' || type === 'LinkedIn') return Layers
  if (type === 'Note') return FileIcon
  return FileText
}

interface ContextPickerFieldProps {
  docs: ContextDoc[]
  selected: ContextDoc[]
  onChange: (docs: ContextDoc[]) => void
}

export function ContextPickerField({ docs, selected, onChange }: ContextPickerFieldProps) {
  const [open, setOpen] = useState(false)

  const removeDoc = (id: string) => onChange(selected.filter(d => d.id !== id))

  return (
    <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
      <p className="mb-2 text-sm font-semibold text-white">Context <span className="font-normal text-white/40">(optional)</span></p>

      {selected.length === 0 ? (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-3 text-xs font-medium text-white/50 hover:border-white/30 hover:text-white/80 transition-colors"
          style={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <Plus className="h-3.5 w-3.5" /> Add context from your documents
        </button>
      ) : (
        <div className="space-y-1.5">
          {selected.map(doc => {
            const Icon = iconForType(doc.type)
            return (
              <div key={doc.id} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}` }}>
                <Icon className="h-3.5 w-3.5 shrink-0 text-white/50" />
                <span className="flex-1 truncate">{doc.name}</span>
                <button aria-label="Remove" onClick={() => removeDoc(doc.id)}>
                  <X className="h-3 w-3 text-white/50 hover:text-white" />
                </button>
              </div>
            )
          })}
          <button onClick={() => setOpen(true)} className="flex items-center gap-1 pt-1 text-xs font-semibold text-blue-400 hover:underline">
            <Plus className="h-3 w-3" /> Add more
          </button>
        </div>
      )}

      {open && (
        <ContextPickerModal
          docs={docs}
          initiallySelectedIds={new Set(selected.map(d => d.id))}
          onClose={() => setOpen(false)}
          onDone={ids => {
            onChange(docs.filter(d => ids.has(d.id)))
            setOpen(false)
          }}
        />
      )}
    </div>
  )
}

function ContextPickerModal({
  docs,
  initiallySelectedIds,
  onClose,
  onDone,
}: {
  docs: ContextDoc[]
  initiallySelectedIds: Set<string>
  onClose: () => void
  onDone: (ids: Set<string>) => void
}) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(initiallySelectedIds)

  const toggle = (id: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl p-6 shadow-2xl" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Select context documents</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-white/50 hover:text-white" /></button>
        </div>

        {docs.length === 0 ? (
          <p className="py-6 text-center text-sm text-white/50">No documents available yet.</p>
        ) : (
          <div className="mb-5 max-h-64 space-y-1.5 overflow-y-auto">
            {docs.map(doc => {
              const Icon = iconForType(doc.type)
              const isChecked = checkedIds.has(doc.id)
              return (
                <button
                  key={doc.id}
                  onClick={() => toggle(doc.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
                  style={{ background: isChecked ? 'rgba(26,122,255,0.15)' : 'transparent', border: `1px solid ${isChecked ? BLUE : BORDER}` }}
                >
                  <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 text-[10px] font-bold', isChecked ? 'border-blue-400 bg-blue-400 text-white' : 'border-white/30')}>
                    {isChecked ? '✓' : ''}
                  </span>
                  <Icon className="h-4 w-4 shrink-0 text-white/50" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{doc.name}</p>
                    <p className="text-[10px] text-white/40">{doc.type}</p>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <button onClick={() => onDone(checkedIds)} className="h-11 w-full rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ background: BLUE }}>
          Done
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/desktopCopilot/ContextPickerField.test.tsx`
Expected: PASS (all 3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/desktopCopilot/ContextPickerField.tsx src/pages/desktopCopilot/ContextPickerField.test.tsx
git commit -m "feat: add dark-themed ContextPickerField component"
```

---

### Task 14: Wire `ContextPickerField` into `SetupScreen` (Sales Call)

**Files:**
- Modify: `src/pages/DesktopCopilotPreview.tsx`
- Modify: `src/pages/DesktopCopilotPreview.test.tsx`

**Interfaces:**
- Consumes: `ContextPickerField` (Task 13), `resolveContextDocs` (Task 11).
- Produces: `SetupScreen` now takes an additional `email?: string` prop.

- [ ] **Step 1: Write the failing test**

Add to `src/pages/DesktopCopilotPreview.test.tsx`, inside the `describe('SetupScreen', ...)` block:

```tsx
it('renders a Context picker for sales-call, sourced from the org Knowledge Base for an enterprise account', () => {
  createOrg('admin@acme.com', {
    orgName: 'Acme Inc',
    planTier: 'enterprise',
    setupFeePaid: true,
    knowledgeBase: { ...emptyKnowledgeBase(), documents: [{ id: 'd1', name: 'Battlecard.pdf', enabled: true }] },
    calls: [],
    connectedIntegrations: [],
    members: [{ id: '1', name: 'Admin', email: 'admin@acme.com', role: 'admin', inviteCode: generateInviteCode(), seatPaid: true }],
  })
  setAccount('admin@acme.com', { accountType: 'enterprise-admin', orgName: 'Acme Inc' })
  render(<SetupScreen useCaseId="sales-call" email="admin@acme.com" onContinue={() => {}} />)
  expect(screen.getByText(/Add context from your documents/)).toBeInTheDocument()
  fireEvent.click(screen.getByText(/Add context from your documents/))
  expect(screen.getByText('Battlecard.pdf')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/DesktopCopilotPreview.test.tsx -t "Context picker"`
Expected: FAIL — `SetupScreen` doesn't accept an `email` prop and doesn't render a context field.

- [ ] **Step 3: Implement**

In `src/pages/DesktopCopilotPreview.tsx`, add the imports (near the top, next to the other local imports at `:5-11`):

```ts
import { ContextPickerField } from './desktopCopilot/ContextPickerField'
import { resolveContextDocs, type ContextDoc } from './desktopCopilot/resolveContextDocs'
```

Update `SetupScreen`'s signature and add `context` state (`:268-286`):

```tsx
export function SetupScreen({ useCaseId, email, onBack, onContinue }: { useCaseId: UseCaseId; email?: string; onBack: () => void; onContinue: (primaryLabel: string) => void }) {
  const config = getUseCase(useCaseId)
  const fields = new Set(config.setupFields)
  const contextDocs = resolveContextDocs(email ?? '')

  const [jobTitle, setJobTitle] = useState('')
  const [selectedResume, setSelectedResume] = useState<string | null>('adewale_damola_PM_resume.pdf')
  const [jobDesc, setJobDesc] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [dealStage, setDealStage] = useState<DealStage>('Discovery')
  const [talkTrack, setTalkTrack] = useState('')
  const [context, setContext] = useState<ContextDoc[]>([])
  const [meetingTitle, setMeetingTitle] = useState('')
  const [agenda, setAgenda] = useState('')
  const [subject, setSubject] = useState('')
  const [language, setLanguage] = useState('')
  const [audioConnected, setAudioConnected] = useState(true)
  const [dontAskAgain, setDontAskAgain] = useState(true)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [showPreference, setShowPreference] = useState(false)
```

(`onBack`'s type annotation is left exactly as it is today — this task only adds `email` to the prop list and doesn't touch `onBack`.)

Add the context field renderer right after the existing `talk-track` block (after `:433`, i.e. right after the closing `)}` of the `fields.has('talk-track')` block):

```tsx
            {fields.has('context') && (
              <ContextPickerField docs={contextDocs} selected={context} onChange={setContext} />
            )}
```

Finally, update the call site in the default export (`:1437-1443`) to pass `email`:

```tsx
      {view === 'setup' && (
        <SetupScreen
          useCaseId={useCase}
          email={pendingEmail}
          onBack={() => setView(returnView)}
          onContinue={label => { setPrimaryLabel(label); setView('live') }}
        />
      )}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/DesktopCopilotPreview.test.tsx`
Expected: PASS (all tests, including the new one and every pre-existing `SetupScreen`/end-to-end test)

- [ ] **Step 5: Commit**

```bash
git add src/pages/DesktopCopilotPreview.tsx src/pages/DesktopCopilotPreview.test.tsx
git commit -m "feat: wire Context picker into the Sales Call setup screen"
```

---

### Task 15: Wire `ContextPickerField` into `RegularSetupScreen` (Interview + Meeting)

**Files:**
- Modify: `src/pages/DesktopCopilotPreview.tsx`
- Modify: `src/pages/DesktopCopilotPreview.test.tsx`

**Interfaces:**
- Consumes: `ContextPickerField` (Task 13), `resolveContextDocs` (Task 11).
- Produces: `RegularSetupScreen` now takes an additional `email?: string` prop.

- [ ] **Step 1: Write the failing test**

Add to `src/pages/DesktopCopilotPreview.test.tsx`, inside the `describe('RegularSetupScreen', ...)` block:

```tsx
it('renders a Context picker on the Interview tab, sourced from the personal Context library', () => {
  render(<RegularSetupScreen onBack={() => {}} onContinue={() => {}} unlockedUseCases={['interview', 'coding', 'meeting']} />)
  expect(screen.getByText(/Add context from your documents/)).toBeInTheDocument()
})

it('replaces the old free-text Context textarea on the Meeting tab with a picker', () => {
  render(<RegularSetupScreen onBack={() => {}} onContinue={() => {}} unlockedUseCases={['interview', 'coding', 'meeting']} />)
  fireEvent.click(screen.getByRole('button', { name: 'Meeting' }))
  expect(screen.queryByPlaceholderText(/Paste any background info/)).not.toBeInTheDocument()
  expect(screen.getByText(/Add context from your documents/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/DesktopCopilotPreview.test.tsx -t "Context picker"`
Expected: FAIL — neither tab renders `ContextPickerField` yet; Meeting still has the old textarea.

- [ ] **Step 3: Implement**

In `RegularSetupScreen` (`:604-621`), add `email` to the props and add `context` state per tab, plus resolve docs once:

```tsx
export function RegularSetupScreen({ email, onBack, onContinue, unlockedUseCases }: { email?: string; onBack: () => void; onContinue: (useCaseId: RegularUseCase, primaryLabel: string) => void; unlockedUseCases: RegularUseCase[] }) {
  const availableTabs = REGULAR_TABS.filter(tab => unlockedUseCases.includes(tab.id))
  const [activeTab, setActiveTab] = useState<RegularUseCase>(availableTabs[0]?.id ?? 'interview')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [interviewContext, setInterviewContext] = useState<ContextDoc[]>([])
  const [language, setLanguage] = useState('')
  const [meetingTitle, setMeetingTitle] = useState('')
  const [agenda, setAgenda] = useState('')
  const [meetingContext, setMeetingContext] = useState<ContextDoc[]>([])
  const [audioConnected, setAudioConnected] = useState(true)
  const [dontAskAgain, setDontAskAgain] = useState(true)
  const [showPreference, setShowPreference] = useState(false)

  const config = getUseCase(activeTab)
  const inputStyle = { background: INPUT_BG, border: `1px solid ${INPUT_BD}`, color: 'white', outline: 'none' } as const
  const contextDocs = resolveContextDocs(email ?? '')
```

Add the picker to the Interview tab, right after the "Job description" block and before `{activeTab === 'coding' && (` (i.e. right after the closing `</div>` at what's currently `:697`, before `:699`):

```tsx
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-white">Context <span className="font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>(optional)</span></label>
                  <ContextPickerField docs={contextDocs} selected={interviewContext} onChange={setInterviewContext} />
                </div>
```

Replace the Meeting tab's free-text Context block (currently `:739-753`, the `<div className="mb-5">` containing the "Context" label, `<textarea placeholder="Paste any background info...">`, and the dead "Upload document" button) with:

```tsx
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-white">Context <span className="font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>(optional)</span></label>
                  <ContextPickerField docs={contextDocs} selected={meetingContext} onChange={setMeetingContext} />
                </div>
```

Note the `ContextPickerField` component already renders its own "Context (optional)" label internally (see Task 13) — having the surrounding `<label>` here too would duplicate it. Drop the wrapping `<label>`/`<div>` text and render `ContextPickerField` directly instead, for both the Interview and Meeting tabs:

```tsx
                <ContextPickerField docs={contextDocs} selected={interviewContext} onChange={setInterviewContext} />
```

```tsx
                <ContextPickerField docs={contextDocs} selected={meetingContext} onChange={setMeetingContext} />
```

(Wrap each in a `<div className="mb-5">...</div>` for spacing consistency with the surrounding fields, but without a duplicate label — i.e. `<div className="mb-5"><ContextPickerField docs={contextDocs} selected={interviewContext} onChange={setInterviewContext} /></div>`.)

Finally, update the call site in the default export (`:1430-1436`) to pass `email`:

```tsx
      {view === 'regular-setup' && (
        <RegularSetupScreen
          email={pendingEmail}
          onBack={() => setView('sign-in')}
          onContinue={(id, label) => { setUseCase(id); setPrimaryLabel(label); setReturnView('regular-setup'); setView('live') }}
          unlockedUseCases={getPlan(selectedPlan).unlockedUseCases as RegularUseCase[]}
        />
      )}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/DesktopCopilotPreview.test.tsx`
Expected: PASS (all tests, including both new ones and every pre-existing `RegularSetupScreen`/end-to-end test)

- [ ] **Step 5: Manually verify in the browser**

Run the dev server, visit `/desktop-copilot-preview`, sign in as a `regular` account, land on the tabbed setup:
- Interview tab shows a "Context" picker below Job description; clicking it opens the same 5 personal-Context mock documents used by Interview Prep
- Meeting tab shows the same picker where the old free-text box used to be; no leftover "Upload document" dead button

Then, using the sales dashboard flow (`/sales/sign-in` → dashboard → "Open Copilot"), start a Sales Call session and confirm the Context picker there shows the org's Knowledge Base documents (from Task 14) — this double-checks Interview/Meeting and Sales-call are correctly using different sources side by side.

- [ ] **Step 6: Commit**

```bash
git add src/pages/DesktopCopilotPreview.tsx src/pages/DesktopCopilotPreview.test.tsx
git commit -m "feat: wire Context picker into Interview and Meeting setup tabs"
```

---

### Task 16: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Full test suite**

Run: `npm run test:run`
Expected: all tests pass, no failures anywhere in the suite (not just the files touched above)

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: builds successfully

- [ ] **Step 4: Manual end-to-end walkthrough**

Run `npm run dev` and, in the browser:
1. Visit `/copilot/enterprise` — confirm two plan cards, Individual at $99.90/mo, Enterprise "Book a Call" opening a new tab.
2. Complete the Individual checkout (`/copilot/individual/checkout`) with a test name/email — confirm it lands on `/sales/dashboard`, no "Team" nav item, Overview shows a "Plan: Individual" card instead of a setup fee, Billing shows a flat $99.90/mo with no per-seat table.
3. Complete the Enterprise checkout is gone — instead confirm `/sales/sign-in` (existing enterprise-admin path) still works and shows the "Team" nav item, $5,000 setup fee, and per-seat billing as before.
4. From either dashboard, click "Open Copilot" and walk through Interview, Meeting, and Sales-call setup — confirm each has a working Context picker (personal library for Interview/Meeting always; org Knowledge Base for an enterprise sales-call, personal library for an individual sales-call).

- [ ] **Step 5: Commit (if any manual-testing fixes were needed)**

```bash
git add -A
git commit -m "fix: address issues found during end-to-end verification"
```

(Skip this commit if no fixes were needed.)
