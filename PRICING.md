# Pricing — Current State & Open Threads

This is the live, editable source of truth for pricing: what's actually charged today, where every number lives in the codebase, and what's still unresolved. Update this file the moment a price changes anywhere, or a new pricing idea gets floated, so it stays the one place to check "what do we currently charge, and does it agree with itself."

**Last corrected: 2026-09-23 (second pass)** — the subscription became **three unlimited plans**, the credit allowance that separated the tiers is gone, and **annual billing is retired everywhere**: one price per plan, Starter weekly and the other two monthly. Pay-as-you-go survives for people without a plan and now covers **interview minutes** as well as resume prompts and applications. The pricing page keeps **three tabs** — one per way of buying. Implemented in code the same day (§4).

## The plans, at a glance

| Plan | Cadence | Price | What it unlocks |
|---|---|---|---|
| **Starter** | Weekly, auto-renewing | **$47/week** | Interview Prep **and** Interview Copilot, unlimited, on web, desktop and mobile |
| **Pro** | Monthly | **$99/month**, or **$79/month** paid annually | Everything in Starter, plus Meeting Copilot, Coding Copilot, Resume Builder, and Auto Apply for **500 jobs a month** |
| **Premium** | Monthly | **$497/month**, or **$398/month** paid annually | Everything in Pro, with **the job cap taken off Auto Apply**, plus priority support |

**Annual billing applies to the monthly plans only** — 20% off, on Pro and Premium. **Starter is weekly and opts out**: switching a billing toggle to annual leaves its price where it is, and every surface that offers the switch says so on Starter's card — "Annual billing does not apply to weekly plans" — rather than letting the card look like it missed the toggle. That note is live on the pricing page, the signup plan picker and the in-app plan comparison.

**Unlimited means the interview side, on every plan** — Prep and every Copilot, no credit balance, no minute counting, no mid-session top-up. **Auto Apply is the one metered thing left inside a plan**, and its volume is what separates Pro from Premium. The credit economy otherwise survives only for people **without** a plan (§2.1).

**Every platform on every plan** (revised 2026-09-23): web, desktop and mobile, with no platform held back for a higher tier. **Call recording is on every plan too**, for the same reason — it was briefly Premium's differentiator and is now universal.

**Starter is weekly on purpose.** It is sized for the week someone actually has interviews rather than a month of readiness, and it renews weekly until cancelled.

**Open, and load-bearing: Starter's $47 is priced above Pro in practice.** At $47/week, four weeks is ~$204 against Pro's $99/month for strictly more product, so the cards ladder backwards for anyone staying longer than two weeks. That is defensible as a deliberate short-term premium — a week pass for someone interviewing on Thursday, the way day passes price above memberships — but it needs saying on the card, or the page reads as a mistake. Two ways out if it is not deliberate: price Starter under a month of Pro, or label it explicitly as a one-week pass and let the ladder read as urgency rather than value.

**What moved, against the old matrix:**

- **Starter keeps Interview Prep** and **gains desktop and mobile.** Desktop was Pro-and-above before; now no platform is tiered at all.
- **Auto Apply and Resume Builder moved into Pro**, having been standalone pay-as-you-go products outside every tier. Resume Builder is unlimited there; Auto Apply is capped at 500 jobs a month and uncapped on Premium. Both remain buyable standalone by non-subscribers.
- **Call recording is universal**, not a Premium feature (it was one for about an hour on 2026-09-23).

### Open threads on this model

1. **~~Premium's second differentiator~~ — resolved 2026-09-23.** It is Auto Apply without a job cap, and the price now has arithmetic behind it: at the $1/successful-application pay-as-you-go rate (§3), Pro's 500-job allowance is worth ~$500, so **Premium's $497 is priced at roughly what Pro's cap is worth.** Someone applying past 500 a month is better off on Premium, which is exactly the upgrade argument the old "2x credits" framing never made.
2. **~~A fair-use ceiling on Auto Apply~~ — mostly resolved.** Pro's 500 jobs a month is that ceiling. **Premium's uncapped Auto Apply is the remaining exposure**: every application carries real marginal cost, and nothing bounds it but how many roles a person can plausibly be matched to. The $497 price covers ~500 applications at cost, so the risk is confined to the tail — a Premium subscriber applying to thousands. Worth watching in the data before it needs a policy.
3. **Starter's $47/week is priced above Pro in practice** — see below.
4. **Knowledge Base caps survive** (Starter 3, Pro 5, Premium 10) and are the one per-tier ceiling left. Decide deliberately whether "unlimited" should swallow them too; today it does not, and they give the tiers texture beyond the feature list.
4. **Migration.** Existing subscribers are on $47/$99/$497 with credit balances, and today's Starter is monthly with Interview Prep. What happens to unspent balances, to annual subscribers, and to Starter subscribers moving to a weekly plan without Prep is unresolved — see `docs/superpowers/plans/2026-09-23-merged-pricing-system.md` Task 7.

## Pricing documents in this repo

| Doc | What it is | Status |
|---|---|---|
| **`PRICING.md`** (this file) | Current numbers + open questions | Live — edit this one |
| `docs/PRICING_STRATEGY_PRD.md` | Original subscription/add-on strategy rationale ($20/$100/$200 tiers) | Superseded by this file's numbers; rationale still valid |
| `docs/CREDIT_PRICING_PAYMENT_PRD.md` | Credit mechanics + Stripe/payment build spec | Payment-architecture sections still valid; its pricing numbers are superseded by this file |
| `docs/JobWhisper-Credit-Pricing-Payment-PRD.md` | A second, independently-written version of the same credit/payment PRD (converted from PDF 2026-09-02) | Largely duplicates `CREDIT_PRICING_PAYMENT_PRD.md` — kept for reference, not the numbers to use |
| `docs/Lightforth_to_Jobwhisper_Transition_Plan.md` | Lightforth→Jobwhisper migration plan: coexistence window, user migration, email campaign, timeline (converted from PDF 2026-09-02) | Migration mechanics still valid; its pricing table is superseded by this file |

---

## 1. The plans (merged 2026-09-23)

The three plans above are one product sold at three commitment levels, not three different products. Everything they cover is unlimited; the tiers differ only in what they cover, plus the Knowledge Base cap.

**Not a plan — the un-subscribed state.** Someone with no active subscription still gets 50 min/mo of Copilot, on a rolling 30 days from last reset rather than a calendar month. **This is intentionally not shown as a "Free" plan card anywhere in the UI** — no tier row, no pricing table entry. It is what happens by default before someone subscribes, not a fourth option being sold.

**Retired by this merge**, and not to be reintroduced piecemeal:

| Retired | Was | Now |
|---|---|---|
| Annual billing | 20% off, monthly equivalent shown on the card | Gone. One price per plan |
| Monthly credit allowance per tier | ≈500 / 1,000 / 4,000 credits | Unlimited use of what the plan covers |
| Mid-cycle top-ups for subscribers | $10 minimum, wallet credits | Nothing to top up |
| "1 credit = 1 minute" as plan language | The tiers' unit of comparison | Only meaningful pay-as-you-go (§3) |
| Premium's "2x size" framing | 4,000 credits vs Pro's 1,000 | Needs a real differentiator (open thread 1) |
| Starter as a monthly plan with Interview Prep | $47/month | $19/week, Copilot only |

### 1.1 Feature access matrix — what each plan actually unlocks

| Capability | Starter | Pro | Premium |
|---|---|---|---|
| Interview Prep | ✓ unlimited | ✓ unlimited | ✓ unlimited |
| Interview Copilot | ✓ unlimited | ✓ unlimited | ✓ unlimited |
| Web, desktop **and** mobile | ✓ | ✓ | ✓ |
| Call recording | ✓ | ✓ | ✓ |
| Meeting Copilot | — | ✓ unlimited | ✓ unlimited |
| Coding Copilot | — | ✓ unlimited | ✓ unlimited |
| Resume Builder | — | ✓ unlimited | ✓ unlimited |
| **Auto Apply** | — | **500 jobs/month** | **Unlimited** |
| Priority support | — | — | ✓ |
| Knowledge Base documents | 3 | 5 | 10 |

Auto Apply is the only row with a number in it. That is deliberate: it is the one capability with a real per-use cost, so it is the one that ladders.

The un-subscribed state isn't a column here on purpose — it isn't a plan, so it doesn't belong in a table meant to compare plans.

## 2. Finding Jobs without a plan (Auto Apply + Resume Builder)

**Revised 2026-09-23.** Auto Apply and Resume Builder are now **included, unlimited, in Pro and Premium** (§1.1). Everything in this section is what they cost **to someone with no plan** — still sold standalone, still no subscription required, and still the only place the credit economy survives. A subscriber never sees a balance, a rate, or a top-up for either tool.

Resume tailoring that happens automatically *as part of* an Auto Apply application is **not** a Resume Builder charge — it's just Auto Apply doing its job, bundled into the $1/$10 price. "Resume Builder" as its own billed product only means a user deliberately opening the tool to build, fix, or tailor a resume themselves.

### 2.1 Pay as you go — the three products, for people with no plan

**How it's bought:** prepaid credits, purchased upfront — one purchase flow per product, since each has its own unit and its own minimum:

| Product | Minimum purchase | Rate | Example |
|---|---|---|---|
| **Interview** (added 2026-09-23) | $10 | $0.10/credit/minute | $10 → 100 minutes |
| Resume Builder | $5 | $0.10/credit/prompt | $5 → 50 prompts |
| Auto Apply (AI-run) | $10 | $1/credit/successful application | $10 → 10 successful applications |

**Interview credits cover both Interview Prep and a live Interview Copilot session**, on web and desktop — one balance for the whole interview side rather than one per tool, since both meter the same way (a minute is a minute) and a candidate switching between practice and the real call should not have to think about which balance is paying. Its $10 floor matches Auto Apply's rather than Resume Builder's $5, carried over from the retired mid-cycle top-up, which was the same purchase at the same rate.

Confirmed 2026-09-02: this is a **one-time purchase, not a recurring monthly charge.** Credits are **valid for 12 months from purchase** (revised 2026-09-02, matching the Codex reference below — not literally forever as first stated), spent down at whatever pace the user actually uses the product. When the balance runs low, or 12 months passes, they buy more.

**UI pattern, not a slider** (revised 2026-09-02) — reference screenshots shared of an "Add credits" modal (OpenAI Codex's credit purchase flow): a row of 3 preset amount buttons, plus an "Other" option that reveals a custom-amount text input. **The minimum purchase ($5 / $10) is the placeholder text in that custom input**, not a literal draggable slider. **Confirmed 2026-09-02: $5/$10 is a hard floor** on pay-as-you-go purchases, not just a suggested starting point — the "Other" input shouldn't accept less. Worth carrying over from the reference too: it live-converts the entered amount to a credit count next to the field, and validates that the amount converts to a whole number of credits before allowing checkout (rejects e.g. an amount that works out to 166.667 credits) — a good, cheap correctness check to copy. One modal per feature (Resume Builder, Auto Apply), each with its own presets and its own minimum — exact preset amounts (Codex's example used 3 tiers) not chosen yet, just the pattern.

**Auto Apply (AI-run):** user tells us how many jobs they want help with ("500 jobs"). The product does job scouting, filtering, resume tailoring, and applying — end to end, AI-driven. **$1 per successful application**, success-gated (§3) — a failed or rejected submission doesn't bill.

### 2.2 Plan 3 — Find Jobs, Done For You

A real person manually applies on the user's behalf, with a success manager assigned to guarantee the outcome. Sold as flat, one-time packages — **not a subscription, not open per-job billing.**

| Package | Guarantee | Price | Includes |
|---|---|---|---|
| DFY — small | **10 interviews** | **$497**, one-time | Resume tailoring, job scouting/filtering, applying, success manager, **Jobwhisper product access until the guarantee is fulfilled** |
| DFY — large | **20 interviews** | **$997**, one-time | Same, **Jobwhisper product access until the guarantee is fulfilled** |

**Revised 2026-09-04: the guarantee metric changed from a job-application count to an interview count, and access changed from a fixed number of months to open-ended.** Previously: 50/100 applications submitted, bundled with 1/3 months of Jobwhisper access respectively. Now: 10/20 interviews *landed* is the actual guarantee — a stronger commitment than "we applied to N jobs for you" — and access to the rest of Jobwhisper continues for as long as it takes to deliver that guarantee, rather than expiring on a fixed calendar window regardless of whether the success manager has finished. Prices are unchanged ($497/$997). This supersedes the "50 jobs / 1 month" and "100 jobs / 3 months" language used everywhere below and in every other pricing doc in this repo.

**Confirmed: the VSL checkout's existing "$999 Done-For-You Resume & LinkedIn Overhaul" offer *is* this — not a separate product.** It needs to be updated to actually present the $497/$997 packages, not left as a single $999 line item.

**Confirmed 2026-09-02: the $497 (small, 10-interview) package is added to the VSL checkout's cart** as one of the selectable add-on line items, alongside the existing swipe files/templates/scripts (§4.2, §5) — not replacing that stack, joining it.

**The $997 (large) package is explicitly kept out of the cart** — confirmed 2026-09-02. It's upsold separately, later, as a nurturing campaign (extends §7's cross-sell idea rather than being a second item alongside $497). **Hard constraint for whenever/wherever $997 does get surfaced: a user must never be able to select both $497 and $997 at once** — they're tiers of the same package, not additive purchases. If $997 is ever added to a selectable UI (cart, upsell screen, anywhere), it needs to be mutually exclusive with $497 (radio-button style, not two independent checkboxes) — this was raised explicitly as the thing to avoid, not a minor detail.

### 2.3 Job selection — a free preference, not a paid tier, confirmed

**Revised 2026-09-02, superseding the "Full-Auto is a Premium perk" decision from earlier the same day.** "Full-Auto Mode" as a Premium-subscription-gated concept is retired entirely — it's not a $10/mo toggle, and it's not folded into Premium either. Instead, it's a **free preference inside Auto Apply itself** (Plan 2/3), open to everyone regardless of subscription, and **confirmed to cost the same either way**:

- **"Auto apply for me"** — 100% hands-off. The AI selects jobs and applies, no manual step anywhere.
- **"I'll select my jobs myself"** — the user picks which roles to target; the AI still does the actual applying.

**Confirmed 2026-09-02: same credits, same cost, regardless of which preference is picked.** This also resolves the lingering question about whether a manual per-job submit-confirmation step survives anywhere — it doesn't. Submission is always AI-driven in both modes; the only thing the preference changes is who curates the target list.

### 2.4 Resume Builder standalone gating — resolved

Resolved by the prepaid-credit model above (§2.1): Resume Builder is purchased the same standalone way as Auto Apply, no subscription required, $5 minimum. Parity with Auto Apply confirmed.

## 3. Usage-based rates (corrected 2026-09-02)

| Feature | Rate |
|---|---|
| Interview Copilot | $0.10 / credit / min |
| Coding Copilot | $0.10 / credit / min |
| Meeting Copilot | $0.10 / credit / min |
| Interview Prep | $0.10 / credit / min |
| Auto Apply — self-serve | $1 / successful applied job |
| Auto Apply — done-for-you | $10 / successful job |
| Resume Builder | $0.10 / prompt |

**Decided 2026-09-02:** Auto Apply and Resume Builder charge at these rates, not the old flat $40/mo and $15/mo add-on fees — those are dropped entirely, not stacked alongside these. In practice this is a **prepaid credit balance** the user buys upfront (§2.1, $5/$10 minimums, valid 12 months), then spends down at the rates above — not billed action-by-action with zero commitment. Subscription tiers (§1: Starter/Pro/Premium) are a separate thing entirely — they still gate Interview/Coding/Meeting Copilot as before, and their own credit allowance works the same way (§1) but is granted monthly by the subscription, not bought as a standalone purchase.

*(Interview Prep's rate moved twice the same day: $0.12 → $0.20 (a typo fix) → **$0.10, matching Interview Copilot exactly** (a deliberate decision, resolving the "Prep costs more than the flagship Copilot" concern below). Resume Builder's unit corrected from "message" to "prompt" — same $0.10 rate, just the more accurate word for what triggers the charge.)*

**Ambiguity resolved 2026-09-02:** the fixed $0.40/credit constant (`docs/CREDIT_PRICING_PAYMENT_PRD.md` §2.1) is dropped. The new model is **1 credit per metered unit, always** (1 credit/min, 1 credit/prompt — never 2 or 3 like the old rates), with the *dollar value* of that 1 credit varying by feature. So "$0.10/credit/min" reads as "1 credit per minute, and in this context a credit is worth $0.10." Still open: whether "credit" survives as a user-facing display concept at all under this model, versus just billing flat per-unit dollar amounts with no credit language in between.

**Also new:** Auto Apply is now explicitly **success-gated** ("successful auto applied job" / "successful done for you job") — a user is charged only when an application actually succeeds, not per attempt. This wasn't true of the old 3-credit/application rate and needs to be reflected in whatever metering logic gets built (`docs/CREDIT_PRICING_PAYMENT_PRD.md` §4.6 on holds/ledger will need updating for this — a hold that never converts to a charge if the application fails, rather than a hold that always settles).

**Coding Copilot and Meeting Copilot are confirmed at $0.10/credit/min** (2026-09-02), same as Interview Copilot — all three Copilot modes now charge identically. This replaces an earlier placeholder that kept them at the old $0.80/min while only fixing the credit-count wording; a real rate has since been given.

## 4. Live pricing surfaces (where these numbers need to actually get wired in)

### 4.1 Wired in 2026-09-23 — the merged model in code

| Surface | File | State |
|---|---|---|
| Public pricing page | `src/apps/web/pages/pricing-page.tsx` | **Done.** One plan set, tabs gone, `?tab=` retired, Done-For-You and pay-as-you-go as sections, annual toggle kept and skipping weekly Starter |
| Signup plan cards | `src/mocks/billing.ts`, `src/features/billing/plan-selection-view.tsx`, `src/features/demo/demo-pricing-panel.tsx` | **Done.** `includedUsageCents` replaced by a cadence and an `included` label |
| In-app plan comparison | `src/mocks/account.ts`, `src/features/billing/plan-compare-view.tsx`, `src/contracts/account.draft.ts` | **Done.** Annual fields optional for the weekly plan; `credits` field renamed `included` |
| Landing FAQ | `src/apps/web/pages/landing-page.tsx` | **Done.** Cost answer rewritten |
| Entitlement contract | `src/contracts/billing.ts` | **Open.** `CreditWallet` and `FeatureAccess.creditCost` no longer describe a subscriber. Not editable here — filed in `CONTRACT-REQUESTS.md` |
| In-product credit UI | dashboard balance, account usage, top-up dialogs, `src/lib/credits.ts` | **Open.** Task 4 of the plan doc: a subscriber should see "Unlimited", a non-subscriber still sees a balance |
| Admin, emails, help centre | `src/features/admin/*`, `src/emails/templates/*`, `src/data/help-center/articles/*` | **Open.** Tasks 5 of the plan doc. Credit adjustment should scope to pay-as-you-go balances only |

Plan of record for the open rows: `docs/superpowers/plans/2026-09-23-merged-pricing-system.md`.

**Decided 2026-09-02: Auto Apply and Resume Builder are both removed from the subscribe-time checkout order bump entirely** — neither is offered as an "add this for $X/mo" checkbox at signup anymore. They're sold through their own standalone "Add credits" purchase flow (§2.1), unconnected to the Plan 1 subscribe flow.

### 4.2 VSL checkout — `src/apps/web/pages/vsl-checkout-modal.tsx`

Currently hardcoded to $40 first month / **$100/mo** renewal, plus the 9-item one-time upsell stack. Needs updating:
- Renewal price $100 → $99, to match the corrected Pro price (§1).
- **The $999 "Done-For-You Resume & LinkedIn Overhaul" line item becomes the $497 DFY package (§2.2), and only the $497 package** — confirmed 2026-09-02. The $997 tier deliberately does not get a cart slot here; it's upsold later via a nurturing campaign (§2.2, §7).

### 4.3 Emails — `src/emails/templates/*.ts`

Receipt/reminder/failed-payment templates use illustrative example amounts ($40, $100) for demo purposes only, not canonical pricing — not urgent to update, but worth aligning to real numbers (e.g. $99 instead of $100) next time those templates are touched, so the previews don't quietly teach the wrong price by example.

---

## 5. The Marketplace (one-time content upsells)

The fourth bucket alongside the three plans — flat, one-time purchases, unconnected to any subscription or credit balance. Currently only lives in the VSL checkout's 9-item stack.

A screenshot of an older, **Lightforth-branded** checkout step ("Wait — Boost Your Results", step 2 of 3) was shared 2026-09-02 as reference for comparison. Recorded here as source material, not as confirmed additions to the current VSL checkout:

| Add-on | Price | Notes |
|---|---|---|
| 5 Must-Master Interview Questions — Answer Swipe File | $19 | Already in the current VSL checkout (`vsl-checkout-modal.tsx`) |
| 10 Fully Customizable Resume Templates | $29 | Already in the current VSL checkout |
| Salary Negotiation Word-for-Word Scripts | $15 | Already in the current VSL checkout |
| LinkedIn Profile Optimization Checklist | $12 | Already in the current VSL checkout |
| 30-Day Job Search Action Plan | $17 | Already in the current VSL checkout |

(The old Lightforth screenshot also had an "Auto-Apply Concierge — We Apply For You, Daily" row at $499 — removed from this reference table entirely now that it's fully superseded, not just struck through. The idea lives on as the human-run DFY packages in §2.2.)

**Not shown in this particular screenshot** (may just be scrolled out of view, not necessarily dropped): Cover Letter Swipe File ($15), STAR Story Bank ($19), Follow-Up Email Templates ($9), and the $999 Done-For-You Resume & LinkedIn Overhaul — all of which *are* in the current VSL checkout. Unconfirmed whether the old Lightforth flow had a shorter list, or this is just a partial view.

## 6. Open reconciliation items

Every structural and pricing question raised through 2026-09-02 has been resolved, across several planning conversations — condensed to a changelog rather than a growing numbered list of strikethroughs, since re-litigating already-settled items wasn't adding anything:

- Auto Apply and Resume Builder: pay-per-use (prepaid credits), no flat add-on fee, no subscription required, not in the signup order bump. §2, §2.1, §4.1.
- DFY packages ($497/$997) guarantee 10/20 interviews landed, one-time purchases (not subscriptions), with Jobwhisper access bundled until the guarantee is fulfilled rather than a fixed number of months. §2.2.
- $497 goes in the VSL cart; $997 deliberately doesn't (upsold later, §7) — and the two must never be selectable together. §2.2, §4.2.
- Job selection (self-pick vs. AI-pick) is a free preference inside Auto Apply, same cost either way, no manual submit step for anyone. Supersedes the earlier "Full-Auto is a Premium perk" idea, which lasted less than a day. §2.3.
- Credits: 1 per unit always, dollar value varies by feature, $5/$10 minimums are hard floors, 12-month validity. §2.1, §3.
- Interview Prep matches Interview Copilot's rate exactly ($0.10/credit/min). §3.
- Free/un-subscribed state: 50 min, rolling 30-day reset, not shown as a UI-visible plan. §1.
- Plan 1 subscribers can top up credits mid-cycle using the same "Add credits" modal pattern as Plan 2, $10 minimum. §1.
- Knowledge Base document limits per tier: Starter 3, Pro 5, Premium 10. §1, §1.1.
- Premium vs. Pro: same features (Coding + Meeting Copilot on both), Premium's real differentiator is volume — ≈4,000 vs ≈1,000 min/mo, branded "2x size." §1, §1.1.
- VSL's old $999 Resume/LinkedIn item and the old Lightforth $499 concierge are both superseded by the current DFY/Auto Apply structure, not separate products. §2.2, §5.

**Still genuinely open:**

1. **Nothing about Plans 2/3 exists in the app yet.** `src/mocks/billing.ts`/`account.ts` still show the old flat add-on model; there's no "Add credits" purchase UI, no DFY package selector, and no real Auto Apply product surface. Treat the whole Plan 2/3 purchase flow as net-new, not a mock-data edit.
2. Whether "credit" survives as a user-facing word at all, or these become flat per-unit dollar rates with no credit language (§3) — a display-layer choice, not urgent.
3. Everything still open in `docs/PRICING_STRATEGY_PRD.md` §8 and `docs/CREDIT_PRICING_PAYMENT_PRD.md` §8 that isn't covered above: annual pricing, referral bonus amount, Stripe sign-off, refund/dispute policy, tax, multi-currency.

## 7. Marketing & upsell flows (backlog)

Not pricing decisions — ideas for how pricing gets *presented* to a user after the fact, captured here so they don't get lost before there's time to spec them properly.

- **Nurturing campaign for the $997 DFY package.** Confirmed 2026-09-02: $997 is intentionally kept out of the VSL cart (§2.2) and sold instead through an ongoing nurture flow rather than a single pop-up — likely including, but not limited to, first-time $40 Pro buyers. Not specified yet: the actual campaign steps/timing/channels, or how it enforces that a user who already has $497 gets upgraded to $997 rather than being sold both.
