# Pricing — Current State & Open Threads

This is a live index, not a strategy document: where every price actually lives in this codebase right now, whether the surfaces agree with each other, and what's still unresolved. For the full rationale behind the subscription/add-on model, read `docs/PRICING_STRATEGY_PRD.md` and `docs/CREDIT_PRICING_PAYMENT_PRD.md` — those remain canonical for *why*; this file is canonical for *where things stand today* and *what's in flight*.

Update this file whenever a price changes anywhere in the app, or a new pricing idea gets floated, so it stays the one place to check "what do we currently charge, and does it agree with itself."

---

## 1. Live pricing surfaces

There are currently **three separate, unconnected pricing surfaces** in this codebase. They don't share a data model, and two of them disagree with each other in ways that need a decision, not just a code fix.

### 1.1 Subscription + add-ons (the "real" product pricing)

Implemented in mocks, matches `docs/PRICING_STRATEGY_PRD.md`'s proposal:

| Item | Price | Source |
|---|---|---|
| Starter | $20/mo · $192/yr | `src/mocks/billing.ts`, `src/mocks/account.ts` |
| Pro | $100/mo · $960/yr | same |
| Premium | $200/mo · $1,920/yr | same |
| Resume Builder add-on | $15/mo | same |
| — AI Suggestions / Premium Templates (nested) | "Coming soon" (price not set) | `src/mocks/account.ts` |
| Auto Apply add-on | $40/mo | same |
| — Full-Auto mode (nested) | +$10/mo | same |

Credit metering underneath (1 credit = $0.40, per-feature rates) is documented in `docs/CREDIT_PRICING_PAYMENT_PRD.md` §2 and implemented in `src/lib/credits.ts` — unaffected by anything below.

**Status:** frontend-only, no Stripe/backend (see `docs/CREDIT_PRICING_PAYMENT_PRD.md` §4 for the full build-out plan). This is the only surface with a real path to production billing.

### 1.2 VSL checkout (`/vsl`)

A completely separate, self-contained checkout flow ported from a standalone sales-page prototype — does **not** read from or write to the subscription/add-on model above:

| Item | Price | Source |
|---|---|---|
| "Jobwhisper Pro" — first month, 60% off | $40 (then renews at $100/mo) | `src/apps/web/pages/vsl-checkout-modal.tsx` |
| 5 Must-Master Interview Questions swipe file | $19 | same |
| 10 Resume Templates | $29 | same |
| Cover Letter Swipe File | $15 | same |
| Salary Negotiation Scripts | $15 | same |
| LinkedIn Optimization Checklist | $12 | same |
| STAR Story Bank | $19 | same |
| Follow-Up Email Templates | $9 | same |
| 30-Day Job Search Action Plan | $17 | same |
| Done-For-You Resume & LinkedIn Overhaul | $999 | same |

**Status:** fully mocked, no real payment processing (see the note in `src/apps/web/MANIFEST.md`'s `/vsl` row).

**Note the coincidence, not (yet) a decision:** the VSL page's $100/mo renewal happens to match the real Pro tier price in §1.1. That's not wired together anywhere — it's two hardcoded `100`s that happen to agree today and will silently drift the moment either one changes.

### 1.3 Auto Apply — job-count pricing (new, unconfirmed, not in code anywhere)

Raised in a chat with Joe and Promise, 2026-09-02, as an alternative to the flat $40/mo Auto Apply add-on in §1.1. Not implemented, not fully specified — recorded here so the idea doesn't get lost before it's decided one way or the other.

The pitch: ask the user up front how many job applications they want (e.g. "I want 500 jobs"), and Auto Apply runs until it's applied to that many, instead of being a flat monthly unlock.

Two tiers were floated:

- **Self-serve** — user pays for the batch of applications themselves. Written in the chat as "$1 for 500 jobs" — **ambiguous as captured**: unclear whether that means $1 total for a batch of 500, $1 per job (which would make 500 jobs = $500, not "$1 for 500"), or was a rough placeholder number being tested out loud rather than a real proposal. Needs to be pinned down before this goes anywhere.
- **Done-for-you (DFY)** — Jobwhisper handles everything: builds the resume, finds the jobs, applies on the user's behalf, and includes Interview Copilot access for the roles applied to. Priced at **$10/job** — e.g. 100 jobs = $1,000.

**This directly conflicts with §1.1's Auto Apply model** (flat $40/mo unlock + optional Full-Auto), which is priced per month of access, not per job outcome. These aren't reconcilable by just picking numbers — they're different pricing *shapes* (subscription-for-access vs. pay-per-outcome), and adopting the job-count model would mean deciding whether it replaces the $40/mo add-on entirely, sits alongside it as a second Auto Apply product, or the DFY tier specifically replaces something else (it overlaps with Resume Builder + Auto Apply + Interview Copilot all at once, which today are three separately-sold things).

---

## 2. Open reconciliation items

1. **VSL vs. subscription model** — VSL sells a one-time-discounted subscription plus a stack of one-time low-ticket digital products; the real billing model sells a flat-tier subscription plus recurring add-ons. Decide whether VSL is a genuinely different funnel/offer (fine to stay separate) or needs to actually charge into the same subscription system it currently just mimics the price of.
2. **Auto Apply job-count pricing vs. $40/mo add-on** — see §1.3. Needs a decision before any implementation: replace, add alongside, or drop the idea.
3. **"$1 for 500 jobs" is ambiguous as recorded** — confirm with whoever proposed it whether that's a total, a per-job rate, or a placeholder.
4. **If DFY ($10/job) ships**, it needs to be reconciled against the *existing* Resume Builder ($15/mo), Auto Apply ($40/mo), and Interview Copilot (subscription-gated) — DFY bundles pieces of all three into a single pay-per-outcome price, which the current entitlement model (`src/contracts/billing.ts`) has no shape for.
5. Everything already flagged as open in `docs/PRICING_STRATEGY_PRD.md` §8 and `docs/CREDIT_PRICING_PAYMENT_PRD.md` §8 is still open — this file doesn't resolve those, just adds the two new items above (2 and 3).
