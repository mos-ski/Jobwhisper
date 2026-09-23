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
| Annual billing | **Retired everywhere** — pricing page, signup flow and in-app comparison. One price per plan. (Dropped, briefly restored, then dropped for good on 2026-09-23.) |
| Pro | **$99/month** |
| Starter price | **$47/week** — the founder's correction of the recommended $19. See the open thread in `PRICING.md` §1: four weeks of it is ~$204 against Pro's $99, so the ladder reads backwards unless the card says "one week" loudly |

## The plans

| Plan | Cadence | Price | Includes |
|---|---|---|---|
| **Starter** | Weekly | **$47/week** | Interview Copilot only — web **and** desktop. Unlimited |
| **Pro** | Monthly | **$99/month** | Interview Prep, Interview Copilot, Coding Copilot, Meeting Copilot, Auto Apply, Resume Builder. All unlimited |
| **Premium** | Monthly | **$497/month** | Everything in Pro, plus call recording and priority support. **One more differentiator still open** |

The pricing page keeps **three tabs**, one per way of buying: subscription plans, pay as you go, done for you. Pay-as-you-go carries **three** products now — interview minutes (new, $0.10/min from $10, covering Prep and Copilot alike), resume prompts, and applications.

Two deliberate inversions of today's matrix, recorded so they do not read as mistakes later: Starter **loses Interview Prep**, which it has today, and **gains the desktop app**, which is Pro-and-above today. Auto Apply and Resume Builder move from standalone prepaid credits into the Pro subscription, while remaining purchasable standalone by non-subscribers.

### Still open

1. **Premium's second differentiator.** Call recording alone is thin against the gap to Pro ($497 vs $99), and the volume differentiator that justified that gap — 4,000 credits against Pro's 1,000 — no longer exists under unlimited. Candidates: session transcripts with searchable history, priority/low-latency model access, a human coach review, multi-seat.
2. **Premium's price**, which follows from 1. Left at today's $497/$398 for now.
3. **A fair-use ceiling on Auto Apply**, per the constraint below. Not in the UI yet because the number is not chosen.

### Built 2026-09-23

Tasks 1, 2, 3 and Task 6 step 1 are done and pushed: `PRICING.md` rewritten, `REVENUE-STREAMS.md` repriced with its revenue model flagged stale (it needs a Starter retention assumption before it can be recomputed), the merged pricing page and its test, the plan fixtures and their three consumers, the `CONTRACT-REQUESTS.md` entry, and the landing page's cost answer. Tasks 4, 5 and 7 — the in-product credit UI, admin/emails/help centre, and migration — are untouched, so a subscriber's dashboard still shows a credit balance that the pricing page no longer sells.

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

- [x] **Step 1: Rewrite §1 and §1.1** as three unlimited plans on the cadences above, replacing the credits/month columns with what each plan unlocks.
- [x] **Step 2: Rewrite §2** so prepaid Resume Builder and Auto Apply are explicitly the no-subscription path, and say what a subscriber sees instead.
- [x] **Step 3: Rewrite §3** — per-feature usage rates now apply only to non-subscribers.
- [x] **Step 4: Record what is retired** — the monthly credit allowance, mid-cycle top-ups for subscribers, "1 credit = 1 minute" as plan language, and Premium's "2x size" framing. Knowledge Base caps survive, deliberately.
- [x] **Step 5: Update §4's surface list** to the files in Tasks 2-6 so the doc keeps pointing at real code.

---

### Task 2: The merged pricing page

**Files:**
- Modify: `src/apps/web/pages/pricing-page.tsx`
- Test: `src/apps/web/pages/pricing-page.test.tsx`

**Interfaces:**
- Consumes: plan fixtures from Task 3.
- Produces: one plan row of three cards, a Done-For-You section, a pay-as-you-go section for non-subscribers; no `?tab=` parameter.

- [x] **Step 1: Write the failing test** — three plan cards with their cadence labels, a DFY region, a PAYG region, and no tabs.
- [x] **Step 2: Run it and watch it fail.** `npm test -- --run src/apps/web/pages/pricing-page.test.tsx`
- [x] **Step 3: Replace the tab machinery** with sections. `PricingTab`, `SUPPORTING_CONTENT` keyed by tab, and the `?tab=` URL state all come out; the per-tab guide/FAQ/closing content merges into one set.
- [x] **Step 4: Keep `BillingToggle`** and give each card its own cadence ("/week" / "/month"). The weekly plan carries no annual rate, so the toggle moves the two monthly cards and leaves Starter's alone.
- [x] **Step 5: Rewrite the FAQ and the credit guide** — "How interview credits work" is no longer true for subscribers.
- [x] **Step 6: Keep `data-theme="light"`** on the page root (it is the only marketing page built from semantic tokens).
- [x] **Step 7: Run the test and the full suite.**

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

- [x] **Step 1: File the contract request** — `BillingSnapshot` needs to express "unlimited on this plan" without a wallet balance; propose the shape, do not edit `src/contracts/billing.ts`.
- [x] **Step 2: Replace `includedUsageCents`** with cadence + entitlement in `authPlanFixtures`.
- [x] **Step 3: Update the signup and comparison views** to the new features and prices, including the weekly cadence on Starter.
- [x] **Step 4: Run the suite.**

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

- [x] **Step 1: Update the landing FAQ** to the new prices and cadences.
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
