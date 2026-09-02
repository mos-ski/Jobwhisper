# Pricing — Current State & Open Threads

This is the live, editable source of truth for pricing: what's actually charged today, where every number lives in the codebase, and what's still unresolved. Update this file the moment a price changes anywhere, or a new pricing idea gets floated, so it stays the one place to check "what do we currently charge, and does it agree with itself."

**Last corrected: 2026-09-02** — planning session with the founder settled the product shape of Auto Apply (§2 rewritten), not just the numbers. See §2 and §6 for what's now decided vs. still open.

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

**Premium includes Full-Auto Mode** (decided 2026-09-02, see §2) — Premium subscribers get Full-Auto job selection as part of the $197/mo plan. This is the one place the core subscription and the Auto Apply upsell touch each other; everything else in §2 is sold independently of Starter/Pro/Premium.

**Still not corrected anywhere in code or docs:** feature access matrix (Interview/Coding/Meeting mode gating) and annual pricing. `docs/PRICING_STRATEGY_PRD.md` §2–§5 still describes the *structure* (which tier gets which Copilot modes) using the old prices.

## 2. Auto Apply (product shape settled 2026-09-02)

The core product Jobwhisper sells is interview prep + live in-interview help (§1). Auto Apply and Resume Builder are **separate upsells** on top of that — not bundled into any subscription tier, and **not gated behind having a subscription at all**: someone can buy Auto Apply on its own, with no Starter/Pro/Premium plan.

Auto Apply forks into two products depending on who does the work:

### 2.1 AI-run (self-serve)

User tells us how many jobs they want ("I want help with 500 jobs"). The product does resume tailoring, job scouting, job filtering, and applying — end to end, AI-driven.

**$1 per successful application.** Charged only on success (§3) — an application that fails or is rejected at submission doesn't bill.

### 2.2 Human-run (done-for-you)

A real person manually applies on the user's behalf — lower volume, higher touch, a success manager assigned to guarantee the count. Sold as committed packages, not open-ended per-job billing (though the underlying rate is the same $10/successful job — see §6.2):

| Package | Jobs | Duration | Price | Includes |
|---|---|---|---|---|
| DFY — small | 50 | 1 month | **$497** | Application service only |
| DFY — large | 100 | 1 month | **$997** | Application service **+ 3 months of Jobwhisper product access** |

(Corrected 2026-09-02: the large package is **$997, not $999** — the $999 figure from earlier the same day was wrong.)

### 2.3 Full-Auto Mode → folded into Premium

The old "$10/mo Full-Auto Mode" nested upsell (auto-select jobs, no manual step) is retired as its own paid toggle. **Decided:** Full-Auto Mode becomes a **Premium subscription perk instead** — included in the $197/mo Premium tier, no separate charge. Exact mechanics (what a Premium subscriber gets vs. what a standalone AI-run buyer gets — e.g. included applies, a discounted per-job rate, or just the "no manual step" behavior with billing unchanged) not yet specified — see §6.9.

### 2.4 Resume Builder

Unchanged: $0.10/prompt (§3). Framed the same way as Auto Apply — "a feature upsell, unlock to use" — but whether it's also purchasable without a subscription (matching Auto Apply, §2 above) hasn't been explicitly confirmed the way Auto Apply's was. Don't assume parity without checking — see §6.8.

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

Currently hardcoded to the **old** $20/$100/$200, plus the old $15/mo Resume Builder and $40/mo Auto Apply add-on entries. Needs updating: tier prices to $47/$99/$197 (§1), and the Resume Builder/Auto Apply add-on entries **removed** (not re-priced — per §2/§3, these become pure usage-based, no flat add-on fee at all). Also touches `src/contracts/billing.ts`'s `AddOnId`/`FeatureAccess` shape more fundamentally than previously stated: entitlement to Auto Apply is **not** gated by having a subscription at all (confirmed 2026-09-02, §2) — it needs to work for accounts with no plan whatsoever, which the current contract shape (`FeatureAccess` keyed to an active `BillingSnapshot`) doesn't obviously support. Resume Builder's gating is unconfirmed either way — don't assume it follows Auto Apply's standalone model without checking (§6.8).

**Decided 2026-09-02: Auto Apply is removed from the subscribe-time checkout order bump entirely** (see §6.5). It's no longer offered as an "add this for $X/mo" checkbox at signup — consistent with there being no flat fee to sell there anymore. Resume Builder's presence in the order bump hasn't been addressed and is the same open question — don't assume it stays or goes without separate confirmation.

### 4.2 VSL checkout — `src/apps/web/pages/vsl-checkout-modal.tsx`

Currently hardcoded to $40 first month / **$100/mo** renewal, plus the 9-item one-time upsell stack (unaffected by these corrections, still $9–$999). Needs updating: renewal price $100 → $99 to match the corrected Pro price (§1). **The $999 "Done-For-You Resume & LinkedIn Overhaul" line item is likely a different product from §2's new $997 (100-job) DFY package**, not the same thing needing a price fix — one is a resume/LinkedIn writing service, the other is job-application execution + platform access. They coincidentally sit near the same price point. Don't merge them without confirming — see §6.10.

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
| ~~Auto-Apply Concierge — We Apply For You, Daily~~ | ~~$499~~ | **Resolved 2026-09-02 — superseded, not added as-is.** This old idea (a vague "daily" recurring concierge) is what the human-run DFY packages in §2.2 became: $497 for 50 jobs/1 month, with an actual success manager and a defined job count instead of an open-ended "every day you stay subscribed." Close in price by coincidence of independent thinking landing in the same place, not by design. |

**Not shown in this particular screenshot** (may just be scrolled out of view, not necessarily dropped): Cover Letter Swipe File ($15), STAR Story Bank ($19), Follow-Up Email Templates ($9), and the $999 Done-For-You Resume & LinkedIn Overhaul — all of which *are* in the current VSL checkout. Unconfirmed whether the old Lightforth flow had a shorter list, or this is just a partial view.

The $567 "Total due today" shown in the screenshot ($19 swipe file + $499 concierge, sales-tax-free) was just that specific example's math, not a separate price point — noted for completeness now that the row above is resolved.

## 6. Open reconciliation items

**Resolved 2026-09-02, in a planning conversation with the founder:**

1. ~~Auto Apply: subscription add-on vs. pay-per-job vs. both~~ — pay-per-job only, no flat add-on fee. See §3.
2. ~~DFY packages ($497/$997) vs. DFY per-job rate ($10/job)~~ — not two competing models. The packages **are** the $10/job rate, sold as a committed batch with a success manager attached instead of open-ended billing. See §2.2.
3. ~~"$0.10/credit/min" ambiguity~~ — 1 credit per unit, always; dollar value per credit varies by feature. See §3.
4. ~~Auto-Apply Concierge ($499)~~ — superseded by the $497/50-job DFY package, not added to VSL separately. See §5.
5. ~~Auto Apply in the subscribe-time checkout order bump~~ — removed. See §4.1.
6. ~~Does Auto Apply require a subscription~~ — no. Confirmed standalone-purchasable, no Starter/Pro/Premium plan needed. See §2.
7. ~~Full-Auto Mode's fate~~ — folded into Premium as an included perk, not sold separately at any price. See §2.3.

**Still open:**

8. **Resume Builder: standalone-purchasable like Auto Apply, or subscription-gated?** (§2.4) Only Auto Apply was explicitly confirmed as not requiring a subscription — don't assume Resume Builder follows the same rule without checking. Its presence in the (mostly-removed) checkout order bump is the same open question in a different spot (§4.1).
9. **What exactly does "Full-Auto Mode is a Premium perk" mean mechanically?** (§2.3) Included applies at no per-job charge, a discount on the $1/$10 rates, or just unlocking the "no manual step" behavior with billing unchanged? Not specified yet.
10. **VSL's $999 "Done-For-You Resume & LinkedIn Overhaul" vs. the new $997 100-job DFY package** (§4.2) — probably different products (writing service vs. application execution) that happen to sit near the same price. Confirm they're meant to stay separate rather than silently merging or confusing users who see both.
11. **Interview Prep priced above Interview Copilot** ($0.20/min vs. $0.10/min, §3) — raised in conversation 2026-09-02 as possibly backwards (practice mode costing more than the live, flagship Copilot session) — not yet confirmed either way, still using the numbers as given.
12. **Mocks not yet updated** — `src/mocks/billing.ts` and `src/mocks/account.ts` still show the old $20/$100/$200 tier prices and the now-removed $15/$40 add-on entries; `src/apps/web/pages/vsl-checkout-modal.tsx` still shows $100/mo renewal and doesn't have the Auto Apply product at all (it's never existed in the app, only in docs). This file being correct doesn't mean the app is — treat as a to-do, not done.
13. Everything already flagged as open in `docs/PRICING_STRATEGY_PRD.md` §8 and `docs/CREDIT_PRICING_PAYMENT_PRD.md` §8 that isn't addressed above is still open (annual pricing, referral bonus amount, credit rollover vs. reset, Stripe sign-off, refund/dispute policy, tax, multi-currency).
