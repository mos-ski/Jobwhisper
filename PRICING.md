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

Plan 1 is the only place a subscription exists at all. Plans 2 and 3 are sold fully standalone — no Starter/Pro/Premium required, and (revised 2026-09-02) no subscription tier changes how they behave either. The two are cleanly decoupled now.

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

| Tier | Price | Credits/mo (approx.) | ~min/mo of Copilot |
|---|---|---|---|
| **Starter** | **$47/month** | ≈500 credits | ≈500 min |
| **Pro** | **$99/month** | ≈1,000 credits | ≈1,000 min |
| **Premium** | **$197/month** | ≈4,000 credits | ≈4,000 min |

**Premium revised 2026-09-02: ≈2,000 → ≈4,000 credits/mo, branded "2x size."** With Coding and Meeting Copilot now shared by Pro and Premium alike (§1.1), usage volume is Premium's actual differentiator, not features — this makes that gap real instead of token (previously ≈2,000 vs Pro's ≈1,000 was already 2x; doubling again makes it 4x Pro, a much clearer upgrade case). Worth a naming gut-check: "2x size" reads as 2x *something*, but the actual ratio to Pro is 4x — fine if "2x" means "we doubled what Premium used to be," confusing if a user reads it as "2x Pro." Pick the framing deliberately when this becomes UI copy.

**First-time Pro offer:** $40 first month, renews at $99/month. This resolves an inconsistency that existed across older docs (the transition plan alone said $99, $100, and $100 in three different places for the renewal price) and also resolves the coincidence flagged in the previous version of this file — VSL's checkout should now explicitly charge $40 first month / $99 renewal to match, not just happen to be close.

**Credits/mo revised 2026-09-02 to round, approximate numbers** (≈500/1,000/2,000) — rounding up from the exact price ÷ $0.10 derivation (470/990/1,970) to clean marketing figures, at 1 credit = 1 minute of Copilot throughout (§3's $0.10/credit/min rate). Rounding *up* slightly narrows the margin further rather than widening it (≈500 credits is $50 of Copilot time against a $47 price) — worth knowing that's the direction this rounding pushes, not assuming it fixed the earlier zero-margin concern.

*(Correcting my own error, not the founder's: I'd previously written ≈50/100/200 here, an order of magnitude off — the actual typo was in the credits figure, not the minutes. ≈500/1,000/2,000 is the number that's actually close to the exact 470/990/1,970 derivation.)*

**Not a plan — the un-subscribed state.** Revised 2026-09-02: someone with no active subscription still gets 50 min/mo, up from the 5 credits the older PRDs state. **This is intentionally not shown as a "Free" plan card anywhere in the UI** — no tier row, no pricing table entry — it's just what happens by default before someone subscribes, not a fourth option being sold alongside Starter/Pro/Premium. (I'd added it as a table row in an earlier pass; pulled back out of both tables in this one, per that instruction.) **Reset anchor confirmed 2026-09-02: rolling 30 days from last reset, not calendar month** — reasoning given: 50 minutes is roughly one interview session, so it makes more sense to refill 30 days after it's used than to wait for an arbitrary calendar-month boundary.

**Mid-cycle top-ups, added 2026-09-02.** A subscriber who runs out of monthly credits before the cycle resets — e.g. mid-interview — can buy more on the spot rather than waiting for the reset. Same UI pattern as Plan 2's "Add credits" modal (§2.1: preset amount buttons + an "Other" custom input, live $→credit conversion, whole-number validation), reused here rather than a separate design. **$10 minimum purchase** — matching Auto Apply's floor in §2.1, not Resume Builder's $5. Top-up credits are Plan 1 wallet credits (§1's $0.10/credit/min rate), spent alongside the monthly allowance, not a separate balance with its own expiry. Not yet built in code — no purchase UI exists for this any more than it does for §2.1 (§6 item 1).

**Knowledge Base document limits, added 2026-09-02.** The Knowledge Base (resume, job description, and other context documents Copilot/Prep/Resume Builder draw from) caps how many documents a tier can have uploaded at once: **Starter 3, Pro 5, Premium 10.** Not credit-metered — a flat per-tier ceiling, same idea as the monthly minutes row but for storage, not usage. Not yet enforced anywhere in code (`src/features/documents/documents-view.tsx`, the Knowledge Base picker in Copilot/Prep/desktop).

### 1.1 Feature access matrix — what each tier actually unlocks

| Capability | Starter | Pro | Premium |
|---|---|---|---|
| Interview Prep | ✓ | ✓ | ✓ |
| Interview Copilot (web) | ✓ | ✓ | ✓ |
| Interview Copilot (desktop app) | — | ✓ | ✓ |
| Coding Copilot | — | ✓ | ✓ |
| Meeting Copilot | — | ✓ | ✓ |
| Monthly minutes (§ above) | ≈500 | ≈1,000 | ≈4,000 |
| Knowledge Base documents | 3 | 5 | 10 |

The un-subscribed/free state (50 min/mo, §1 above) isn't a column here on purpose — it's not a plan, so it doesn't belong in a table meant to compare plans. In practice it behaves like a capped version of the Starter row (Interview Prep + web Copilot only), but that's carried over from the older PRDs, not something separately reconfirmed.

**Revised 2026-09-02: Meeting Copilot and Coding Copilot are both shared by Pro and Premium — confirmed, not a mistake.** Auto Apply Full-Auto Mode is **removed from this table entirely** — Plan 1 is interview-only now, no cross-reference into Plan 2/3 (see §2.3, rewritten).

**Premium vs. Pro — resolved 2026-09-02.** Same feature set on purpose; Premium's differentiator is volume, made explicit by the 4,000-credit "2x size" jump above rather than left as an accidental byproduct of unrelated decisions.

**Caveat, don't treat the row structure above as freshly confirmed either:** it's still carried over from `docs/PRICING_STRATEGY_PRD.md` §2 except where explicitly revised in this session.

**Still not corrected anywhere in code:** the feature access matrix now lives in §1.1 above, but nothing in `src/mocks/billing.ts`/`account.ts` reflects it. Annual pricing is also still unaddressed.

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

### 4.1 Subscription + add-ons — `src/mocks/billing.ts`, `src/mocks/account.ts`

Currently hardcoded to the **old** $20/$100/$200, plus the old $15/mo Resume Builder and $40/mo Auto Apply add-on entries — none of which match Plans 2/3's actual shape anymore. Needs a real rebuild, not a price edit: `src/contracts/billing.ts`'s `AddOnId`/`FeatureAccess` shape assumes an add-on requires an active `BillingSnapshot` subscription, which is now wrong for both Auto Apply and Resume Builder (§2) — they need their own standalone entitlement/purchase path (a prepaid credit balance per feature, per §2.1) that works for accounts with no subscription at all. This is a bigger contract change than the tier-price update in §1.

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
