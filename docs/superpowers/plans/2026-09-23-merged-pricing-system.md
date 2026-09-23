# Merged Pricing System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three separately-shaped products on the pricing page (subscription tiers, prepaid job-search credits, done-for-you packages) with one set of three unlimited subscription plans, with pay-as-you-go surviving only for people without a plan and Done-For-You kept as its own section of the same page.

**Architecture:** `PRICING.md` is the source of truth and is rewritten first; every surface below derives its numbers from it. Plan shape lives in `src/mocks/billing.ts` and `src/apps/web/pages/pricing-page.tsx`; entitlement lives behind `src/contracts/billing.ts`, which cannot be edited here, so the shape it needs is filed in `CONTRACT-REQUESTS.md` instead.

**Tech Stack:** React 19, TypeScript, Base UI tabs, Vitest, Testing Library, CSS tokens.

## Decisions taken (2026-09-23, founder)

| Question | Answer |
|---|---|
| Starter cadence | **Auto-renewing weekly subscription** — the first weekly cadence in the product |
| Credits | **Retired for subscribers; pay-as-you-go survives for people with no plan** (Resume Builder $5 min, Auto Apply $1/successful application) |
| Done-For-You | **Stays, as its own section of the merged pricing page** — not a tab, not folded into a tier |
| Annual billing | **Dropped entirely.** No monthly/annual toggle anywhere; Starter bills weekly, Pro and Premium monthly |
| Pro | **$79/month**, replacing today's $99 monthly / $79 annual split |

## The plans

| Plan | Cadence | Price | Includes |
|---|---|---|---|
| **Starter** | Weekly | **OPEN** (see below) | Interview Copilot only — web **and** desktop. Unlimited |
| **Pro** | Monthly | **$79** | Interview Prep, Interview Copilot, Coding Copilot, Meeting Copilot, Auto Apply, Resume Builder. All unlimited |
| **Premium** | Monthly | **OPEN** (today $497) | Everything in Pro, plus call recording and **one more differentiator, OPEN** |

Two deliberate inversions of today's matrix, recorded so they do not read as mistakes later: Starter **loses Interview Prep**, which it has today, and **gains the desktop app**, which is Pro-and-above today. Auto Apply and Resume Builder move from standalone prepaid credits into the Pro subscription, while remaining purchasable standalone by non-subscribers.

### Open before implementation starts

1. **Starter's weekly price.** Recommended **$19/week**: impulse-priced for someone with one interview loop, and four weeks of it ($76) lands just under Pro's $79, so a second month of Starter argues for itself as an upgrade rather than competing with Pro. $15/week if it should clearly undercut instead.
2. **Premium's second differentiator.** Call recording alone is thin against the gap to Pro. Candidates: session transcripts with searchable history, priority/low-latency model access, a human coach review, multi-seat.
3. **Premium's price**, which follows from 2.

## Global Constraints

- No raw color values outside the token files; no Tailwind palette utilities.
- `src/contracts/*` is not editable. `CreditWallet` and `FeatureAccess.creditCost` no longer describe a subscriber under this model — file the replacement shape in `CONTRACT-REQUESTS.md`, do not edit the contract.
- Every screen that renders an `insufficient-credits` state (AGENTS.md §6 item 9) must either keep it for a genuinely metered surface or have it deliberately removed, not left rendering a balance that no longer exists.
- "Unlimited" needs a fair-use ceiling on Auto Apply before launch — each application carries real marginal cost, which is why it is $1/successful-application today. `src/mocks/admin-messaging.ts` already floats "10 Auto Apply submissions per day"; pick a number and put it in the small print rather than discovering it in the margin.
- Weekly billing does not exist anywhere in the codebase today. It is a new cadence, not a relabelled month.

---

### Task 1: PRICING.md as the settled source of truth

**Files:**
- Modify: `PRICING.md`
- Modify: `REVENUE-STREAMS.md`

**Interfaces:**
- Produces: the three-plan table, the pay-as-you-go-for-non-subscribers rule, the DFY section, and the retired-concepts list every later task reads from.

- [ ] **Step 1: Rewrite §1 and §1.1** as three unlimited plans on the cadences above, replacing the credits/month columns with what each plan unlocks.
- [ ] **Step 2: Rewrite §2** so prepaid Resume Builder and Auto Apply are explicitly the no-subscription path, and say what a subscriber sees instead.
- [ ] **Step 3: Rewrite §3** — per-feature usage rates now apply only to non-subscribers.
- [ ] **Step 4: Record what is retired** — annual billing, the monthly credit allowance, mid-cycle top-ups for subscribers, Knowledge Base document caps if unlimited supersedes them (decide explicitly).
- [ ] **Step 5: Update §4's surface list** to the files in Tasks 2-6 so the doc keeps pointing at real code.

---

### Task 2: The merged pricing page

**Files:**
- Modify: `src/apps/web/pages/pricing-page.tsx`
- Test: `src/apps/web/pages/pricing-page.test.tsx`

**Interfaces:**
- Consumes: plan fixtures from Task 3.
- Produces: one plan row of three cards, a Done-For-You section, a pay-as-you-go section for non-subscribers; no `?tab=` parameter, no billing toggle.

- [ ] **Step 1: Write the failing test** — three plan cards with their cadence labels, a DFY region, a PAYG region, and no billing-period toggle.
- [ ] **Step 2: Run it and watch it fail.** `npm test -- --run src/apps/web/pages/pricing-page.test.tsx`
- [ ] **Step 3: Replace the tab machinery** with sections. `PricingTab`, `SUPPORTING_CONTENT` keyed by tab, and the `?tab=` URL state all come out; the per-tab guide/FAQ/closing content merges into one set.
- [ ] **Step 4: Remove `BillingToggle`, `annual` state and `annualMonthlyPrice`.** Cards carry their own cadence ("per week" / "per month").
- [ ] **Step 5: Rewrite the FAQ and the credit guide** — "How interview credits work" is no longer true for subscribers.
- [ ] **Step 6: Keep `data-theme="light"`** on the page root (it is the only marketing page built from semantic tokens).
- [ ] **Step 7: Run the test and the full suite.**

---

### Task 3: Plan fixtures and the entitlement shape

**Files:**
- Modify: `src/mocks/billing.ts`, `src/mocks/account.ts`
- Modify: `CONTRACT-REQUESTS.md`
- Modify: `src/features/billing/plan-selection-view.tsx`, `src/features/billing/plan-compare-view.tsx`
- Modify: `src/apps/web/pages/auth-plan-page.tsx`

**Interfaces:**
- Consumes: `Plan` (`'starter' | 'pro' | 'premium'`, unchanged).
- Produces: fixtures carrying cadence and unlimited entitlement instead of `includedUsageCents`.

- [ ] **Step 1: File the contract request** — `BillingSnapshot` needs to express "unlimited on this plan" without a wallet balance; propose the shape, do not edit `src/contracts/billing.ts`.
- [ ] **Step 2: Replace `includedUsageCents`** with cadence + entitlement in `authPlanFixtures`.
- [ ] **Step 3: Update the signup and comparison views** to the new features and prices, including the weekly cadence on Starter.
- [ ] **Step 4: Run the suite.**

---

### Task 4: In-product entitlement replaces credit gating

**Files:**
- Modify: `src/features/dashboard/dashboard-view.tsx`, `src/features/account/account-view.tsx`
- Modify: `src/features/copilot/interview-copilot-view.tsx`, `src/features/interview/interview-prep-view.tsx`
- Modify: `src/features/billing/add-credits-dialog.tsx`, `src/ui/upgrade-dialog.tsx`
- Modify: `src/apps/web/pages/credit-history-page.tsx`, `src/apps/web/pages/billing-page.tsx`
- Modify: `src/lib/credits.ts`

**Interfaces:**
- Produces: a subscriber sees "Unlimited" where a balance used to be; a non-subscriber still sees a balance for the features they bought.

- [ ] **Step 1: Decide per surface** whether it is subscriber-only, non-subscriber-only, or both, and write that decision into the file as a comment where it is not obvious.
- [ ] **Step 2: Replace balance widgets** for subscribers without deleting the non-subscriber path.
- [ ] **Step 3: Retire the `insufficient-credits` state** on features a plan covers; keep `not-entitled` — it is now the main block reason.
- [ ] **Step 4: Keep `src/lib/credits.ts`** — pay-as-you-go still needs it. Do not delete it as dead code.
- [ ] **Step 5: Run the suite.**

---

### Task 5: Admin, emails, help centre

**Files:**
- Modify: `src/features/admin/admin-accounts-view.tsx`, `src/features/admin/admin-configuration-view.tsx`
- Modify: `src/mocks/admin-accounts.ts`, `src/mocks/admin-products.ts`, `src/mocks/admin-configuration.ts`
- Modify: `src/data/help-center/articles/account-billing.ts`, `src/data/help-center/articles/getting-started.ts`
- Modify: `src/emails/templates/*`

**Interfaces:**
- Produces: admin credit adjustment scoped to pay-as-you-go balances; billing help and emails describing plans, not allowances.

- [ ] **Step 1: Scope credit adjustment** to non-subscriber balances; a subscriber's plan is what an admin changes now.
- [ ] **Step 2: Update the plan and price rows** in the admin product and configuration mocks.
- [ ] **Step 3: Rewrite the billing help articles.**
- [ ] **Step 4: Run the suite.**

---

### Task 6: Marketing copy

**Files:**
- Modify: `src/apps/web/pages/landing-page.tsx` (FAQ: "Plans start at $47 a month… $0.10 per credit")
- Modify: `src/apps/web/product-content.ts`
- Modify: `src/apps/web/pages/vsl-checkout-modal.tsx`, `src/features/billing/pro-offer-widget.tsx`
- Modify: `docs/LIGHTFORTH_END_TO_END_SMARTER_SCRIPT.md`
- Test: `src/apps/web/pages/landing-page.test.tsx`

- [ ] **Step 1: Update the landing FAQ** to the new prices and cadences.
- [ ] **Step 2: Reconcile the Pro offer widget** — "$40 first month" needs a decision against $79/month with no annual option.
- [ ] **Step 3: Update the VSL checkout** line items.
- [ ] **Step 4: Update the end-to-end script**, which names the pricing story.
- [ ] **Step 5: Run the full suite.**

---

### Task 7: Migration of existing subscribers

**Files:**
- Modify: `PRICING.md` (a migration section)
- Modify: `docs/Lightforth_to_Jobwhisper_Transition_Plan.md` if the story there still holds

- [ ] **Step 1: Decide what happens to unspent credit balances** on the day plans go unlimited.
- [ ] **Step 2: Decide what happens to annual subscribers** now that annual billing is retired.
- [ ] **Step 3: Decide what happens to today's Starter subscribers**, who move from a monthly plan with Interview Prep to a weekly plan without it.
- [ ] **Step 4: Write it down** — this is a real communication, not just a data change.
