# Pricing — Current State & Open Threads

This is the live, editable source of truth for pricing: what's actually charged today, where every number lives in the codebase, and what's still unresolved. Update this file the moment a price changes anywhere, or a new pricing idea gets floated, so it stays the one place to check "what do we currently charge, and does it agree with itself."

**Last corrected: 2026-09-02.**

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

| Tier | Price | Notes |
|---|---|---|
| **Starter** | **$47/month** | was $20/mo |
| **Pro** | **$99/month** | was $100/mo |
| **Premium** | **$197/month** | was $200/mo |

**First-time Pro offer:** $40 first month, renews at $99/month. This resolves an inconsistency that existed across older docs (the transition plan alone said $99, $100, and $100 in three different places for the renewal price) and also resolves the coincidence flagged in the previous version of this file — VSL's checkout should now explicitly charge $40 first month / $99 renewal to match, not just happen to be close.

**Not yet corrected anywhere in code or docs:** credit allotments per tier (previously 20/100/200 for Starter/Pro/Premium), feature access matrix (Interview/Coding/Meeting mode gating), and annual pricing. `docs/PRICING_STRATEGY_PRD.md` §2–§5 still describes the *structure* (which tier gets which Copilot modes) — only the three headline dollar amounts above are confirmed corrected so far.

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
| Interview Prep | $0.12 / credit / min | $0.80/min (2 credits) |
| Auto Apply — self-serve | $1 / successful applied job | $1.20/application (3 credits), not success-gated |
| Auto Apply — done-for-you | $10 / successful job | new |
| Resume Builder | $0.10 / message | $0.40/message (1 credit) |

**Ambiguity to resolve:** the phrasing "$0.10/credit/min" is ambiguous as given — it could mean (a) a flat $0.10 charged per minute of usage (with "credit" just meaning "the metered unit," i.e. same as saying "$0.10/min"), or (b) that a credit is being redefined from $0.40 to some new value specifically in this context. `docs/CREDIT_PRICING_PAYMENT_PRD.md` §2.1 fixes 1 credit = $0.40 everywhere — these new numbers don't divide cleanly into that (e.g. $0.10 isn't a multiple of $0.40), so either the $0.40/credit constant is also changing, or these are meant to bypass the credit abstraction entirely and bill in direct dollars. Treated here as flat per-unit dollar rates (reading (a)) until confirmed otherwise, since that's the only reading consistent with the other three rows, which don't mention "credit" at all.

**Also new:** Auto Apply is now explicitly **success-gated** ("successful auto applied job" / "successful done for you job") — a user is charged only when an application actually succeeds, not per attempt. This wasn't true of the old 3-credit/application rate and needs to be reflected in whatever metering logic gets built (`docs/CREDIT_PRICING_PAYMENT_PRD.md` §4.6 on holds/ledger will need updating for this — a hold that never converts to a charge if the application fails, rather than a hold that always settles).

This table doesn't yet cover Coding Copilot or Meeting Copilot (no new rate given for either) — assume the old $0.80/min (2 credits) rate stands for those until corrected.

## 4. Live pricing surfaces (where these numbers need to actually get wired in)

### 4.1 Subscription + add-ons — `src/mocks/billing.ts`, `src/mocks/account.ts`

Currently hardcoded to the **old** $20/$100/$200. Needs updating to $47/$99/$197 (§1). Resume Builder ($15/mo) and Auto Apply ($40/mo) add-on prices from the old model aren't mentioned in the corrections above — unclear whether they still stand as flat monthly unlocks alongside the new per-successful-job Auto Apply rate (§3), or whether the flat $40/mo Auto Apply add-on is being replaced by pure usage-based billing. **This is the same open question as before, now sharper**: is Auto Apply a monthly subscription add-on, a pay-per-successful-job product, or both?

### 4.2 VSL checkout — `src/apps/web/pages/vsl-checkout-modal.tsx`

Currently hardcoded to $40 first month / **$100/mo** renewal, plus the 9-item one-time upsell stack (unaffected by these corrections, still $9–$999). Needs updating: renewal price $100 → $99 to match the corrected Pro price (§1). The $999 "Done-For-You Resume & LinkedIn Overhaul" line item should be reconciled against §2's new $497/$999 DFY plans once that's resolved.

### 4.3 Emails — `src/emails/templates/*.ts`

Receipt/reminder/failed-payment templates use illustrative example amounts ($40, $100) for demo purposes only, not canonical pricing — not urgent to update, but worth aligning to real numbers (e.g. $99 instead of $100) next time those templates are touched, so the previews don't quietly teach the wrong price by example.

---

## 5. Open reconciliation items

1. **Auto Apply: subscription add-on vs. pay-per-job vs. both** (§4.1) — the single biggest open question. The old model was a flat $40/mo unlock; the new numbers are per-successful-job ($1 self-serve, $10 DFY). Needs a decision on whether these coexist, and if so how (e.g. $40/mo unlocks the *feature*, then usage is billed per successful job on top).
2. **DFY packages ($497/$999) vs. DFY per-job rate ($10/job)** (§2) — same successful-outcome DFY product priced two different ways, or two different things.
3. **"$0.10/credit/min" ambiguity** (§3) — confirm whether the $0.40/credit constant is being redefined or these are flat dollar rates outside the credit system.
4. **Mocks not yet updated** — `src/mocks/billing.ts` and `src/mocks/account.ts` still show the old $20/$100/$200 and old credit rates; `src/apps/web/pages/vsl-checkout-modal.tsx` still shows $100/mo renewal. This file being correct doesn't mean the app is — treat as a to-do, not done.
5. Everything already flagged as open in `docs/PRICING_STRATEGY_PRD.md` §8 and `docs/CREDIT_PRICING_PAYMENT_PRD.md` §8 that isn't addressed above is still open (annual pricing for add-ons, referral bonus amount, credit rollover vs. reset, Stripe sign-off, refund/dispute policy, tax, multi-currency).
