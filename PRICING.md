# Pricing — Current State & Open Threads

This is the live, editable source of truth for pricing: what's actually charged today, where every number lives in the codebase, and what's still unresolved. Update this file the moment a price changes anywhere, or a new pricing idea gets floated, so it stays the one place to check "what do we currently charge, and does it agree with itself."

**Last corrected: 2026-09-02** (two follow-up corrections same day: Interview Prep rate and Resume Builder unit wording, §3; upsell reference material added, §5; Auto Apply/Resume Builder flat add-on fees dropped in favor of pure usage-based pricing, §3/§6.1 — decided).

## Pricing documents in this repo

| Doc | What it is | Status |
|---|---|---|
| **`PRICING.md`** (this file) | Current numbers + open questions | Live — edit this one |
| `docs/PRICING_STRATEGY_PRD.md` | Original subscription/add-on strategy rationale ($20/$100/$200 tiers) | Superseded by this file's numbers; rationale still valid |
| `docs/CREDIT_PRICING_PAYMENT_PRD.md` | Credit mechanics + Stripe/payment build spec | Payment-architecture sections still valid; its pricing numbers are superseded by this file |
| `docs/JobWhisper-Credit-Pricing-Payment-PRD.md` | A second, independently-written version of the same credit/payment PRD (converted from PDF 2026-09-02) | Largely duplicates `CREDIT_PRICING_PAYMENT_PRD.md` — kept for reference, not the numbers to use |
| `docs/Lightforth_to_Jobwhisper_Transition_Plan.md` | Lightforth→Jobwhisper migration plan: coexistence window, user migration, email campaign, timeline (converted from PDF 2026-09-02) | Migration mechanics still valid; its pricing table is superseded by this file |

---

## 1. Subscription tiers (corrected 2026-09-02)

| Tier | Price | Credits/mo (= min/mo of Copilot) | Notes |
|---|---|---|---|
| **Starter** | **$47/month** | 470 | was $20/mo, 20 credits |
| **Pro** | **$99/month** | 990 | was $100/mo, 100 credits |
| **Premium** | **$197/month** | 1,970 | was $200/mo, 200 credits |

**First-time Pro offer:** $40 first month, renews at $99/month. This resolves an inconsistency that existed across older docs (the transition plan alone said $99, $100, and $100 in three different places for the renewal price) and also resolves the coincidence flagged in the previous version of this file — VSL's checkout should now explicitly charge $40 first month / $99 renewal to match, not just happen to be close.

**Credits/mo re-derived 2026-09-02** as price ÷ $0.10 (the Interview/Coding/Meeting Copilot rate, §3) — see `docs/JobWhisper-Credit-Pricing-Payment-PRD.md` §3.1 for the full derivation and two things worth confirming before treating it as final: it implies **zero gross margin on the credit allowance itself** (the subscription price converts 1:1 into usable Copilot minutes), and Interview Prep's $0.20/credit/min rate means the same credit pool buys half as many Prep minutes as Copilot minutes — so "credits/mo" isn't a single minutes-equivalent number once more than one feature is in play.

**Still not corrected anywhere in code or docs:** feature access matrix (Interview/Coding/Meeting mode gating) and annual pricing. `docs/PRICING_STRATEGY_PRD.md` §2–§5 still describes the *structure* (which tier gets which Copilot modes) using the old prices.

## 2. Done-for-you plans (new, 2026-09-02)

| Plan | Price |
|---|---|
| Done-for-you (small) | $497 |
| Done-for-you (full) | $999 |

**Not yet specified:** what differentiates the $497 tier from the $999 tier. The VSL checkout (`src/apps/web/pages/vsl-checkout-modal.tsx`) already has a $999 "Done-For-You Resume & LinkedIn Overhaul" add-on — unconfirmed whether that's the $999 referenced here, or a separate thing. The $10/successful-job DFY rate in §3 below may also be the same offering priced a different way (per-job vs. flat package) — also unconfirmed. Needs a decision before implementation: is DFY sold as flat packages ($497/$999), pay-per-successful-job ($10/job), or both depending on context?

## 3. Usage-based rates (corrected 2026-09-02)

| Feature | Rate | Was |
|---|---|---|
| Interview Copilot | $0.10 / credit / min | $0.80/min (2 credits) |
| Coding Copilot | $0.10 / credit / min | $0.80/min (2 credits) |
| Meeting Copilot | $0.10 / credit / min | $0.80/min (2 credits) |
| Interview Prep | $0.20 / credit / min | $0.80/min (2 credits) |
| Auto Apply — self-serve | $1 / successful applied job | $1.20/application (3 credits), not success-gated |
| Auto Apply — done-for-you | $10 / successful job | new |
| Resume Builder | $0.10 / prompt | $0.40/message (1 credit) |

**Decided 2026-09-02:** Auto Apply and Resume Builder are **pure usage-based, no flat monthly add-on fee.** This drops the old $40/mo Auto Apply add-on and $15/mo Resume Builder add-on entirely — not "in addition to" the rates above, *instead of*. A user pays only for what they actually use (per successful application, per prompt), with no unlock/subscription cost layered on top. This resolves what was open item #1 below. Subscription tiers (§1: Starter/Pro/Premium) are unaffected — they still gate Interview/Coding/Meeting Copilot as before.

*(Interview Prep corrected from an earlier same-day $0.12 to $0.20 — a typo in the first pass, not two different numbers in flux. Resume Builder's unit corrected from "message" to "prompt" — same $0.10 rate, just the more accurate word for what triggers the charge.)*

**Ambiguity resolved 2026-09-02:** the fixed $0.40/credit constant (`docs/CREDIT_PRICING_PAYMENT_PRD.md` §2.1) is dropped. The new model is **1 credit per metered unit, always** (1 credit/min, 1 credit/prompt — never 2 or 3 like the old rates), with the *dollar value* of that 1 credit varying by feature. So "$0.10/credit/min" reads as "1 credit per minute, and in this context a credit is worth $0.10." Still open: whether "credit" survives as a user-facing display concept at all under this model, versus just billing flat per-unit dollar amounts with no credit language in between.

**Also new:** Auto Apply is now explicitly **success-gated** ("successful auto applied job" / "successful done for you job") — a user is charged only when an application actually succeeds, not per attempt. This wasn't true of the old 3-credit/application rate and needs to be reflected in whatever metering logic gets built (`docs/CREDIT_PRICING_PAYMENT_PRD.md` §4.6 on holds/ledger will need updating for this — a hold that never converts to a charge if the application fails, rather than a hold that always settles).

**Coding Copilot and Meeting Copilot are confirmed at $0.10/credit/min** (2026-09-02), same as Interview Copilot — all three Copilot modes now charge identically. This replaces an earlier placeholder that kept them at the old $0.80/min while only fixing the credit-count wording; a real rate has since been given.

## 4. Live pricing surfaces (where these numbers need to actually get wired in)

### 4.1 Subscription + add-ons — `src/mocks/billing.ts`, `src/mocks/account.ts`

Currently hardcoded to the **old** $20/$100/$200, plus the old $15/mo Resume Builder and $40/mo Auto Apply add-on entries. Needs updating: tier prices to $47/$99/$197 (§1), and the Resume Builder/Auto Apply add-on entries **removed** (not re-priced — per §3's decision, these become pure usage-based, no flat add-on fee at all). Also touches `src/contracts/billing.ts`'s `AddOnId`/`FeatureAccess` shape, since "entitled: true/false" for a flat unlock doesn't map cleanly onto pure usage billing — entitlement to use Auto Apply/Resume Builder at all should probably just mean "has an active subscription," with usage metered separately, rather than a separate purchasable entitlement.

**Decided 2026-09-02: Auto Apply is removed from the subscribe-time checkout order bump entirely** (see §6.7). It's no longer offered as an "add this for $X/mo" checkbox at signup — consistent with there being no flat fee to sell there anymore. Resume Builder's presence in the order bump hasn't been addressed and is the same open question — don't assume it stays or goes without separate confirmation.

### 4.2 VSL checkout — `src/apps/web/pages/vsl-checkout-modal.tsx`

Currently hardcoded to $40 first month / **$100/mo** renewal, plus the 9-item one-time upsell stack (unaffected by these corrections, still $9–$999). Needs updating: renewal price $100 → $99 to match the corrected Pro price (§1). The $999 "Done-For-You Resume & LinkedIn Overhaul" line item should be reconciled against §2's new $497/$999 DFY plans once that's resolved.

### 4.3 Emails — `src/emails/templates/*.ts`

Receipt/reminder/failed-payment templates use illustrative example amounts ($40, $100) for demo purposes only, not canonical pricing — not urgent to update, but worth aligning to real numbers (e.g. $99 instead of $100) next time those templates are touched, so the previews don't quietly teach the wrong price by example.

---

## 5. Upsell / add-on reference material (from the old Lightforth checkout)

A screenshot of an older, **Lightforth-branded** checkout step ("Wait — Boost Your Results", step 2 of 3) was shared 2026-09-02 as reference for upsell copy/pricing to consider. Recorded here as source material, not as confirmed additions to the current VSL checkout:

| Add-on | Price | Notes |
|---|---|---|
| 5 Must-Master Interview Questions — Answer Swipe File | $19 | Already in the current VSL checkout (`vsl-checkout-modal.tsx`) |
| 10 Fully Customizable Resume Templates | $29 | Already in the current VSL checkout |
| Salary Negotiation Word-for-Word Scripts | $15 | Already in the current VSL checkout |
| LinkedIn Profile Optimization Checklist | $12 | Already in the current VSL checkout |
| 30-Day Job Search Action Plan | $17 | Already in the current VSL checkout |
| **Auto-Apply Concierge — We Apply For You, Daily** | **$499** | **Not in the current VSL checkout.** Copy from the screenshot: "Our highest-converting add-on: our system applies to matching roles on your behalf every day you stay subscribed." Marked "Most popular add-on" in the old UI. |

**Not shown in this particular screenshot** (may just be scrolled out of view, not necessarily dropped): Cover Letter Swipe File ($15), STAR Story Bank ($19), Follow-Up Email Templates ($9), and the $999 Done-For-You Resume & LinkedIn Overhaul — all of which *are* in the current VSL checkout. Unconfirmed whether the old Lightforth flow had a shorter list, or this is just a partial view.

**Open questions:**
- Should "Auto-Apply Concierge — We Apply For You, Daily" ($499) be added to the current VSL checkout's add-on list? It reads as a *recurring/ongoing* service ("every day you stay subscribed") rather than a one-time purchase like the other VSL add-ons — worth confirming it's meant to bill the same way as the rest of the stack (one-time) or as a subscription, since those are different Stripe objects per `docs/CREDIT_PRICING_PAYMENT_PRD.md` §4.3.
- Is $499 the same "self-serve Auto Apply" concept as §3's `$1/successful applied job` rate, priced as a flat monthly package instead of per-job? Same open shape-conflict as the DFY plans in §2 — a recurring/flat offer and a pay-per-outcome rate for what may be the same underlying feature.
- The $567 "Total due today" shown in the screenshot ($19 swipe file + $499 concierge, sales-tax-free) is just that specific example's math, not a separate price point.

## 6. Open reconciliation items

1. ~~Auto Apply: subscription add-on vs. pay-per-job vs. both~~ — **Resolved 2026-09-02: pay-per-job only, no flat add-on fee.** See §3.
2. **DFY packages ($497/$999) vs. DFY per-job rate ($10/job)** (§2) — still open. Same shape-question as #1 was: does $10/job coexist with the flat packages (e.g. packages are a volume discount once job count is known upfront), or does one replace the other? Given how #1 was resolved, the likely-consistent answer is the packages are a flat-rate *option* for users who'd rather not think in per-job terms, not a separate product — but this needs the same explicit confirmation #1 just got, not an assumption.
3. ~~"$0.10/credit/min" ambiguity~~ — **Resolved 2026-09-02: 1 credit per unit, always; dollar value per credit varies by feature.** See §3. Still open within this: whether "credit" stays a user-facing concept at all, or these become flat per-unit dollar rates with no credit language.
4. **Mocks not yet updated** — `src/mocks/billing.ts` and `src/mocks/account.ts` still show the old $20/$100/$200 tier prices and the now-removed $15/$40 add-on entries; `src/apps/web/pages/vsl-checkout-modal.tsx` still shows $100/mo renewal. This file being correct doesn't mean the app is — treat as a to-do, not done.
5. **Auto-Apply Concierge ($499)** (§5) — add to the VSL checkout or not, and if so, is it one-time (like the rest of the VSL stack) or recurring (as its own copy implies)? Also now worth asking directly: is this the same thing as the pay-per-job Auto Apply in a flat-rate wrapper, i.e. the same question as #2 but for Auto Apply instead of DFY?
6. **Interview Prep priced above Interview Copilot** ($0.20/min vs. $0.10/min, §3) — raised in conversation 2026-09-02 as possibly backwards (practice mode costing more than the live, flagship Copilot session) — not yet confirmed either way, still using the numbers as given.
7. ~~Auto Apply in the subscribe-time checkout order bump~~ — **Resolved 2026-09-02: removed.** Auto Apply is no longer offered as an order-bump item at signup (§4.1). **Still open:** Resume Builder's presence in that same order bump — not addressed, don't assume either answer.
8. Everything already flagged as open in `docs/PRICING_STRATEGY_PRD.md` §8 and `docs/CREDIT_PRICING_PAYMENT_PRD.md` §8 that isn't addressed above is still open (annual pricing, referral bonus amount, credit rollover vs. reset, Stripe sign-off, refund/dispute policy, tax, multi-currency).
