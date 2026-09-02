# Pricing — Current State & Open Threads

This is the live, editable source of truth for pricing: what's actually charged today, where every number lives in the codebase, and what's still unresolved. Update this file the moment a price changes anywhere, or a new pricing idea gets floated, so it stays the one place to check "what do we currently charge, and does it agree with itself."

**Last corrected: 2026-09-02** — three planning conversations with the founder settled the whole product shape, not just numbers: this is now genuinely **three plans + a marketplace**, not a subscription with a pile of feature upsells bolted on. Doc is stable enough to review as a whole before implementation starts (§7 is the one section still purely backlog).

## The three plans, at a glance

Users are sold one of three distinct intents — these aren't three tiers of one product, they're three different products with three different pricing shapes:

| Plan | Answers | What it is | Pricing shape |
|---|---|---|---|
| **1. Ace Your Interview** (§1) | "Are you looking to ace your next interview?" | Interview Prep + Interview Copilot | Recurring subscription — Starter/Pro/Premium |
| **2. Find Jobs Yourself** (§2.1) | "Are you looking for jobs right now?" (DIY) | Auto Apply (AI-run) + Resume Builder | Prepaid credits, bought upfront (preset amounts + custom "Other" input), valid 12 months, spent down as used — not a recurring charge |
| **3. Find Jobs, Done For You** (§2.2) | Same question, but hands-off | Auto Apply + Resume Builder + a human success manager + Jobwhisper product access | Flat committed package ($497 / $997) |
| **The Marketplace** (§5) | — | One-time content: swipe files, scripts, templates | Flat one-time purchases, $9–$29 |

Plan 1 is the only place a subscription exists at all. Plans 2 and 3 are sold standalone — no Starter/Pro/Premium required — except that being a Premium subscriber changes *how* Plan 2's Auto Apply behaves (§2.3).

## Pricing documents in this repo

| Doc | What it is | Status |
|---|---|---|
| **`PRICING.md`** (this file) | Current numbers + open questions | Live — edit this one |
| `docs/PRICING_STRATEGY_PRD.md` | Original subscription/add-on strategy rationale ($20/$100/$200 tiers) | Superseded by this file's numbers; rationale still valid |
| `docs/CREDIT_PRICING_PAYMENT_PRD.md` | Credit mechanics + Stripe/payment build spec | Payment-architecture sections still valid; its pricing numbers are superseded by this file |
| `docs/JobWhisper-Credit-Pricing-Payment-PRD.md` | A second, independently-written version of the same credit/payment PRD (converted from PDF 2026-09-02) | Largely duplicates `CREDIT_PRICING_PAYMENT_PRD.md` — kept for reference, not the numbers to use |
| `docs/Lightforth_to_Jobwhisper_Transition_Plan.md` | Lightforth→Jobwhisper migration plan: coexistence window, user migration, email campaign, timeline (converted from PDF 2026-09-02) | Migration mechanics still valid; its pricing table is superseded by this file |

---

## 1. Plan 1 — Ace Your Interview (subscription tiers, corrected 2026-09-02)

| Tier | Price | Credits/mo (approx.) |
|---|---|---|
| **Starter** | **$47/month** | ≈50 credits |
| **Pro** | **$99/month** | ≈100 credits |
| **Premium** | **$197/month** | ≈200 credits |

**First-time Pro offer:** $40 first month, renews at $99/month. This resolves an inconsistency that existed across older docs (the transition plan alone said $99, $100, and $100 in three different places for the renewal price) and also resolves the coincidence flagged in the previous version of this file — VSL's checkout should now explicitly charge $40 first month / $99 renewal to match, not just happen to be close.

**Credits/mo revised 2026-09-02 to round, approximate numbers** (≈50/100/200) instead of the previous exact price ÷ $0.10 derivation (470/990/1,970) — cleaner for marketing, and it walks back the "zero gross margin" issue that exact derivation implied, since ≈50 credits ($5 of Copilot time at $0.10/credit/min) is well under the $47 price.

**Flagging a real conflict, not resolving it myself:** you also said these round numbers are "50 credits / **500 minutes**," "100 credits / **1,000 mins**," "200 credits / **2,000 mins**" — a 10:1 ratio. But §3's rate is $0.10/credit **per minute**, i.e. 1 credit = 1 minute, established a few corrections back. At that rate, 50 credits is 50 minutes, not 500. Before I put "500/1,000/2,000 minutes" anywhere: is that a typo (one extra zero, meant 50/100/200 min, matching credits 1:1), or is the *subscription* credit meant to convert to minutes differently than Plan 2's per-action credit does? I've left minutes out of the table above rather than guess.

**Premium includes Full-Auto Mode** (decided 2026-09-02, see §2) — Premium subscribers get Full-Auto job selection as part of the $197/mo plan. This is the one place the core subscription and the Auto Apply upsell touch each other; everything else in §2 is sold independently of Starter/Pro/Premium.

**Still not corrected anywhere in code or docs:** feature access matrix (Interview/Coding/Meeting mode gating) and annual pricing. `docs/PRICING_STRATEGY_PRD.md` §2–§5 still describes the *structure* (which tier gets which Copilot modes) using the old prices.

## 2. Plans 2 & 3 — Finding Jobs (Auto Apply + Resume Builder)

The core product (Plan 1) is interview prep + live in-interview help. Everything below answers a different question — "are you looking for jobs right now?" — and is sold **standalone, no Starter/Pro/Premium subscription required.**

Resume tailoring that happens automatically *as part of* an Auto Apply application is **not** a Resume Builder charge — it's just Auto Apply doing its job, bundled into the $1/$10 price. "Resume Builder" as its own billed product only means a user deliberately opening the tool to build, fix, or tailor a resume themselves.

### 2.1 Plan 2 — Find Jobs Yourself (DIY)

**How it's bought:** prepaid credits, purchased upfront — one purchase flow per feature, since Resume Builder and Auto Apply are independent purchases with independent minimums:

| Feature | Minimum purchase | Rate | Example |
|---|---|---|---|
| Resume Builder | $5 | $0.10/credit/prompt | $5 → 50 prompts |
| Auto Apply (AI-run) | $10 | $1/credit/successful application | $10 → 10 successful applications |

Confirmed 2026-09-02: this is a **one-time purchase, not a recurring monthly charge.** Credits are **valid for 12 months from purchase** (revised 2026-09-02, matching the Codex reference below — not literally forever as first stated), spent down at whatever pace the user actually uses the product. When the balance runs low, or 12 months passes, they buy more.

**UI pattern, not a slider** (revised 2026-09-02) — reference screenshots shared of an "Add credits" modal (OpenAI Codex's credit purchase flow): a row of 3 preset amount buttons, plus an "Other" option that reveals a custom-amount text input. **The minimum purchase ($5 / $10) is the placeholder text in that custom input**, not a literal draggable slider. Worth carrying over from the reference too: it live-converts the entered amount to a credit count next to the field, and validates that the amount converts to a whole number of credits before allowing checkout (rejects e.g. an amount that works out to 166.667 credits) — a good, cheap correctness check to copy. One modal per feature (Resume Builder, Auto Apply), each with its own presets and its own minimum — exact preset amounts (Codex's example used 3 tiers) not chosen yet, just the pattern.

**Auto Apply (AI-run):** user tells us how many jobs they want help with ("500 jobs"). The product does job scouting, filtering, resume tailoring, and applying — end to end, AI-driven. **$1 per successful application**, success-gated (§3) — a failed or rejected submission doesn't bill.

### 2.2 Plan 3 — Find Jobs, Done For You

A real person manually applies on the user's behalf, with a success manager assigned to guarantee the count. Sold as flat, committed packages, not open per-job billing — though the underlying economics are the same $10/successful job as the human-run rate (§3), just packaged with a bundle discount and a person attached:

| Package | Jobs | Duration | Price | Includes |
|---|---|---|---|---|
| DFY — small | 50 | 1 month | **$497** | Resume tailoring, job scouting/filtering, applying, success manager |
| DFY — large | 100 | 1 month | **$997** | Same, **+ 3 months of Jobwhisper product access** (Plan 1) |

(Corrected 2026-09-02: the large package is $997, not the $999 floated earlier the same day.)

**Confirmed: the VSL checkout's existing "$999 Done-For-You Resume & LinkedIn Overhaul" offer *is* this — not a separate product.** It needs to be updated to actually present the $497/$997 packages (§4.2), not left as a single $999 line item.

### 2.3 Full-Auto Mode — a Premium perk, mechanics confirmed

The old "$10/mo Full-Auto Mode" paid toggle is retired. **Confirmed 2026-09-02, folded into Premium (Plan 1) instead, and now mechanically concrete:**

- **Premium subscribers:** set job preferences once, Auto Apply runs autonomously, user is notified when the target job count is reached. No per-application confirmation step.
- **Everyone else (Plan 2, no Premium):** the AI still drives everything — finds, filters, tailors, prepares each application — but the user has to click "apply" themselves to actually submit each one.

So the AI is always the one *doing* the work in both cases; Premium's actual perk is removing the manual submit-click, not doing more AI work than the base product already does.

### 2.4 Resume Builder standalone gating — resolved

Resolved by the prepaid-credit model above (§2.1): Resume Builder is purchased the same standalone way as Auto Apply, no subscription required, $5 minimum. Parity with Auto Apply confirmed.

## 3. Usage-based rates (corrected 2026-09-02)

| Feature | Rate | Was |
|---|---|---|
| Interview Copilot | $0.10 / credit / min | $0.80/min (2 credits) |
| Coding Copilot | $0.10 / credit / min | $0.80/min (2 credits) |
| Meeting Copilot | $0.10 / credit / min | $0.80/min (2 credits) |
| Interview Prep | $0.10 / credit / min | $0.80/min (2 credits) |
| Auto Apply — self-serve | $1 / successful applied job | $1.20/application (3 credits), not success-gated |
| Auto Apply — done-for-you | $10 / successful job | new |
| Resume Builder | $0.10 / prompt | $0.40/message (1 credit) |

**Decided 2026-09-02:** Auto Apply and Resume Builder charge at these rates, not the old flat $40/mo and $15/mo add-on fees — those are dropped entirely, not stacked alongside these. In practice this is a **prepaid credit balance** the user buys upfront (§2.1, $5/$10 minimums, valid 12 months), then spends down at the rates above — not billed action-by-action with zero commitment. Subscription tiers (§1: Starter/Pro/Premium) are a separate thing entirely — they still gate Interview/Coding/Meeting Copilot as before, and their own credit allowance works the same way (§1) but is granted monthly by the subscription, not bought as a standalone purchase.

*(Interview Prep's rate moved twice the same day: $0.12 → $0.20 (a typo fix) → **$0.10, matching Interview Copilot exactly** (a deliberate decision, resolving the "Prep costs more than the flagship Copilot" concern below). Resume Builder's unit corrected from "message" to "prompt" — same $0.10 rate, just the more accurate word for what triggers the charge.)*

**Ambiguity resolved 2026-09-02:** the fixed $0.40/credit constant (`docs/CREDIT_PRICING_PAYMENT_PRD.md` §2.1) is dropped. The new model is **1 credit per metered unit, always** (1 credit/min, 1 credit/prompt — never 2 or 3 like the old rates), with the *dollar value* of that 1 credit varying by feature. So "$0.10/credit/min" reads as "1 credit per minute, and in this context a credit is worth $0.10." Still open: whether "credit" survives as a user-facing display concept at all under this model, versus just billing flat per-unit dollar amounts with no credit language in between.

**Also new:** Auto Apply is now explicitly **success-gated** ("successful auto applied job" / "successful done for you job") — a user is charged only when an application actually succeeds, not per attempt. This wasn't true of the old 3-credit/application rate and needs to be reflected in whatever metering logic gets built (`docs/CREDIT_PRICING_PAYMENT_PRD.md` §4.6 on holds/ledger will need updating for this — a hold that never converts to a charge if the application fails, rather than a hold that always settles).

**Coding Copilot and Meeting Copilot are confirmed at $0.10/credit/min** (2026-09-02), same as Interview Copilot — all three Copilot modes now charge identically. This replaces an earlier placeholder that kept them at the old $0.80/min while only fixing the credit-count wording; a real rate has since been given.

## 4. Live pricing surfaces (where these numbers need to actually get wired in)

### 4.1 Subscription + add-ons — `src/mocks/billing.ts`, `src/mocks/account.ts`

Currently hardcoded to the **old** $20/$100/$200, plus the old $15/mo Resume Builder and $40/mo Auto Apply add-on entries — none of which match Plans 2/3's actual shape anymore. Needs a real rebuild, not a price edit: `src/contracts/billing.ts`'s `AddOnId`/`FeatureAccess` shape assumes an add-on requires an active `BillingSnapshot` subscription, which is now wrong for both Auto Apply and Resume Builder (§2) — they need their own standalone entitlement/purchase path (a prepaid credit balance per feature, per §2.1) that works for accounts with no subscription at all. This is a bigger contract change than the tier-price update in §1.

**Decided 2026-09-02: Auto Apply and Resume Builder are both removed from the subscribe-time checkout order bump entirely** — neither is offered as an "add this for $X/mo" checkbox at signup anymore. They're sold through their own standalone "Add credits" purchase flow (§2.1), unconnected to the Plan 1 subscribe flow.

### 4.2 VSL checkout — `src/apps/web/pages/vsl-checkout-modal.tsx`

Currently hardcoded to $40 first month / **$100/mo** renewal, plus the 9-item one-time upsell stack. Needs updating:
- Renewal price $100 → $99, to match the corrected Pro price (§1).
- **The $999 "Done-For-You Resume & LinkedIn Overhaul" line item needs to become the actual $497/$997 DFY packages (§2.2), not a single $999 item.** Confirmed 2026-09-02 — this is the same product, not a separate one; the earlier guess that they were different things was wrong.

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
| ~~Auto-Apply Concierge — We Apply For You, Daily~~ | ~~$499~~ | **Resolved 2026-09-02 — superseded, not added as-is.** This old idea (a vague "daily" recurring concierge) is what the human-run DFY packages in §2.2 became: $497 for 50 jobs/1 month, with an actual success manager and a defined job count instead of an open-ended "every day you stay subscribed." Close in price by coincidence of independent thinking landing in the same place, not by design. |

**Not shown in this particular screenshot** (may just be scrolled out of view, not necessarily dropped): Cover Letter Swipe File ($15), STAR Story Bank ($19), Follow-Up Email Templates ($9), and the $999 Done-For-You Resume & LinkedIn Overhaul — all of which *are* in the current VSL checkout. Unconfirmed whether the old Lightforth flow had a shorter list, or this is just a partial view.

The $567 "Total due today" shown in the screenshot ($19 swipe file + $499 concierge, sales-tax-free) was just that specific example's math, not a separate price point — noted for completeness now that the row above is resolved.

## 6. Open reconciliation items

**Resolved 2026-09-02, across two planning conversations with the founder:**

1. ~~Auto Apply: subscription add-on vs. pay-per-job vs. both~~ — pay-per-job (prepaid credits), no flat monthly add-on fee. See §2.1.
2. ~~DFY packages ($497/$997) vs. DFY per-job rate ($10/job)~~ — the packages **are** the $10/job rate, sold as a committed batch with a success manager attached. See §2.2.
3. ~~"$0.10/credit/min" ambiguity~~ — 1 credit per unit, always; dollar value per credit varies by feature. See §3.
4. ~~Auto-Apply Concierge ($499)~~ — superseded by the $497/50-job DFY package. See §5.
5. ~~Auto Apply in the subscribe-time checkout order bump~~ — removed (Resume Builder too). See §4.1.
6. ~~Does Auto Apply require a subscription~~ — no, standalone-purchasable. See §2.
7. ~~Full-Auto Mode's fate~~ — folded into Premium as an included perk. See §2.3.
8. ~~Resume Builder: standalone or subscription-gated~~ — standalone, same as Auto Apply. See §2.4.
9. ~~What does "Full-Auto is a Premium perk" mean mechanically~~ — Premium sets preferences and gets notified when done (fully autonomous); everyone else gets AI-prepared applications but clicks "apply" per job themselves. See §2.3.
10. ~~VSL's $999 Resume & LinkedIn Overhaul vs. the $997 DFY package~~ — same product. VSL needs rebuilding to present the actual $497/$997 packages. See §2.2, §4.2.
11. ~~Is the credit purchase a recurring monthly charge or a one-time top-up~~ — one-time, valid 12 months, spent down at whatever pace usage happens. See §2.1.
12. ~~Interview Prep priced above Interview Copilot~~ — fixed by matching Prep's rate down to $0.10, same as Copilot. Not a pricing-logic argument, just a decision to make them equal. See §3.

**Still open:**

13. **Is the $5/$10 minimum a hard floor** on the "Other" custom input (can't type in less) **or just the placeholder/suggested amount** (could theoretically still enter less)? Not specified — the Codex reference implies a floor (it validates the amount some other way), but that's inference, not confirmation.
14. **Nothing about Plans 2/3 exists in the app yet** — `src/mocks/billing.ts`/`account.ts` still show the old flat add-on model, and there's no "Add credits" purchase UI, no DFY package selector, and no Auto Apply product surface at all beyond the auto-apply-view.tsx mock screens (which predate this whole redesign and don't reflect it). This is a bigger build than updating numbers in existing mocks — treat the whole Plan 2/3 purchase flow as net-new.
15. Everything already flagged as open in `docs/PRICING_STRATEGY_PRD.md` §8 and `docs/CREDIT_PRICING_PAYMENT_PRD.md` §8 that isn't addressed above is still open (annual pricing, referral bonus amount, Stripe sign-off, refund/dispute policy, tax, multi-currency).

## 7. Marketing & upsell flows (backlog)

Not pricing decisions — ideas for how pricing gets *presented* to a user after the fact, captured here so they don't get lost before there's time to spec them properly.

- **Cross-sell Plan 3 (Done For You) to first-time $40 buyers.** If a first-time visitor takes the $40 first-month Pro offer (§1), show an in-app marketing pop-up trying to sell them into the Done-For-You package (§2.2, $497/$997) — presumably on the logic that someone who just committed to a paid trial is a warm lead for the higher-ticket hands-off offer. Not specified yet: when the pop-up fires (immediately post-purchase, after some usage signal, N days in), what it says, whether it's one-shot or can reappear, or whether it targets both DFY tiers or leads with one.
