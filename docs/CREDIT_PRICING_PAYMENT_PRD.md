# JobWhisper Credit, Pricing & Payment System — PRD

> **Numbers superseded 2026-09-02 — see `PRICING.md` at the repo root for current tier prices, DFY plans, and usage rates.** The payment-architecture sections (§4 onward: Stripe design, webhooks, ledger, data model) are unaffected and still current.

- **Version:** 1.0
- **Status:** Draft / In-Review
- **Author:** Product
- **Relationship to other docs:** Consolidates and carries forward `docs/PRICING_STRATEGY_PRD.md` (credit mechanics + subscription/add-on pricing) and adds the piece that document explicitly left out: **how the payment system itself works.** Where this doc repeats a decision from the pricing strategy doc, that doc remains the origin of record; where the two ever disagree, treat that as a bug to reconcile, not two valid answers.
- **Also touches:** `docs/DESKTOP_COPILOT_PRD.md` §3/§8, which prices "Regular Copilot Pro/Premium" at $49/$79 and uses session-length credit metering (1 credit/hour) — a different product surface from JobWhisper's own Pro/Premium ($100/$200) and per-feature metering described here. This conflict is **still unresolved** (see §3.5) and this doc does not resolve it.

---

## 1. Executive Summary

JobWhisper's monetization has three layers that need to work together but are conceptually separate:

1. **Credits** — the usage currency. Every metered action in the product (a Resume Builder message, an Auto Apply application, a minute of live Copilot) costs a fixed number of credits, deducted from a wallet balance.
2. **Pricing** — how a user gets credits and feature access in the first place: a monthly/annual subscription tier (Starter/Pro/Premium) that grants a recurring credit allowance and a base feature set, optional recurring add-ons (Resume Builder, Auto Apply) layered on top, and optional one-time top-ups to buy more credits directly.
3. **Payments** — the actual money movement behind all of the above. **This layer does not exist yet.** The entire product today is a frontend prototype running on static mock data (`src/mocks/billing.ts`, `src/mocks/account.ts`, `src/mocks/wallet.ts`) — there is no Stripe integration, no backend ledger, and no real charge has ever been made. This document specifies what needs to be built.

---

## 2. Credit System (Wallet Mechanics)

This section restates the mechanics already implemented in `src/lib/credits.ts` and `src/mocks/wallet.ts` — it is describing what's built in the frontend, not proposing something new, except where noted.

### 2.1 What a credit is

- **1 credit = $0.40 USD**, fixed (`CENTS_PER_CREDIT = 40` in `src/lib/credits.ts`).
- The **backend system of record is real currency (cents)**, never "credits" as a native unit. Credits are a **display-layer abstraction** computed from a cents balance via `centsToCredits()` / `creditsToCents()`. Any backend ledger, Stripe amount, or database column should be denominated in cents — the same convention Stripe itself uses natively — with credit-number conversion happening only at render time.
- Credits shown to a user are **always a whole number, rounded away from zero** — never floored to look smaller than the true balance, and a deduction never rounds down to a displayed "0 credits" if any amount was actually spent (`roundAwayFromZero()`). A dollar figure shown next to a credit amount is always an exact multiplication of that whole number, never an approximation, and is never prefixed with "~".

### 2.2 Wallet model

Each account has one credit wallet:

```
CreditWallet {
  balance: number   // credits, derived — the real value is the cents ledger balance
  currency: 'credits'
  reserved: number   // credits held/pending, not yet finalized — see §4.7 on holds
}
```

(`src/contracts/billing.ts`). The `reserved` field exists in the type today but nothing in the mocks populates it — it's reserved (no pun intended) for the payment-system build to implement holds on in-progress metered usage (§4.7), so a live Copilot session can't overdraw the balance mid-session.

### 2.3 Per-feature metered rates

From `FEATURE_RATES` in `src/mocks/wallet.ts` and `creditUsageRows` in `src/mocks/account.ts`:

| Feature | Trigger | Rate |
|---|---|---|
| Resume Builder | One prompt/message sent to AI | 1 credit ($0.40) / message |
| Auto Apply | One successful job application | 3 credits ($1.20) / application |
| Interview Prep | Metered per minute of live session | 2 credits ($0.80) / min |
| Interview Copilot | Metered per minute of live session | 2 credits ($0.80) / min |
| Coding Copilot | Metered per minute of live session | 2 credits ($0.80) / min |
| Meeting Copilot | Metered per minute of live session | 2 credits ($0.80) / min |
| ATS Scoring | Click "Score Resume" | Free (0 credits) |
| AI Suggester | Rewrite a phrase/statement | Free (0 credits) |

**Note — this differs from the Desktop Copilot product's session-length billing** (`docs/DESKTOP_COPILOT_PRD.md` §8: 1 credit per hour or fraction thereof, not per-minute). If "Copilot" in this table and "Copilot" in the desktop PRD are meant to be the same underlying sessions billed two different ways depending on surface (web vs. desktop app), that needs to be an explicit, stated rule — not an accident of two PRDs written independently. Flagged as an open question (§3.5).

### 2.4 Credit sources

A wallet balance can be credited from exactly three sources today (visible in `creditHistoryRows`, `src/mocks/account.ts`):

1. **Monthly subscription renewal** — on each successful billing cycle, the wallet is refilled to the plan's included credit grant (e.g. "Pro plan credits refreshed +4000¢" = 100 credits, matching the Pro tier's `includedUsageCents`). This is **currently modeled as a full refill/reset**, not an additive top-up — needs confirmation of whether unused credits **roll over** and stack, or **expire** at renewal (open question, §3.5 already flags per-tier credit amounts as needing sign-off; whether they roll over is a related, separate decision).
2. **Self-serve top-up purchase** — a one-time purchase via the "Add Funds" flow (`src/ui/add-funds-dialog.tsx`): quick preset amounts or a custom amount, added to the wallet immediately and described in-product as staying "on your account until you spend it" (i.e., top-up credits do **not** expire or reset at renewal — only the subscription's included allowance does). This is the flow that needs real payment processing (§4.4.2).
3. **Referral bonus** — a fixed bonus grant when a referred user subscribes (`referralRows` / the "+100¢ Referral bonus" row in `creditHistoryRows`). Bonus amount, eligibility rules, and whether it's one-sided or reciprocal are not specified anywhere yet — open question.

### 2.5 Non-subscriber trial balance

Users without an active subscription still get **5 free credits per month** (`TRIAL_BALANCE_CENTS = 120` / `TRIAL_TOTAL_CENTS = 200` in cents — 200¢ ÷ 40 = 5 credits), refreshed monthly on a rolling basis. This needs a defined reset anchor (calendar month vs. rolling 30 days from signup) before it can be implemented against real time — currently just a static mock value with no reset logic at all.

---

## 3. Subscription Pricing

This section restates `docs/PRICING_STRATEGY_PRD.md` — see that document for the full strategic rationale (§1 there). Reproduced here so this document is self-contained; that document remains canonical if the two ever drift.

### 3.1 Tiers

| Tier | Price (mo / yr, 20% off annual) | Surface | Interview | Coding | Meeting | Credits/mo |
|---|---|---|---|---|---|---|
| **Starter** | $20/mo · $192/yr | Web only | ✅ | ❌ | ❌ | 20 |
| **Pro** | $100/mo · $960/yr | Web + Desktop | ✅ | ✅ | ❌ | 100 |
| **Premium** | $200/mo · $1,920/yr | Web + Desktop | ✅ | ✅ | ✅ | 200 |

(`authPlanFixtures` in `src/mocks/billing.ts`, `billingPlans` in `src/mocks/account.ts`.) Resume Builder and Auto Apply are **not** included at any tier — sold separately (§3.2).

### 3.2 Add-on marketplace

Requires an active subscription (any tier). Each is its own **recurring** charge, cancellable independently of the base plan:

| Add-on | Price | Nested upsell (requires base add-on active first) |
|---|---|---|
| Resume Builder | $15/mo | AI Suggestions & Premium Templates — price not yet set by the business |
| Auto Apply | $40/mo | Full-Auto Mode — +$10/mo (removes manual job-selection step) |

(`checkoutAddOnFixtures` / `billingAddOns` in the mocks.)

### 3.3 Checkout upsell flow

At subscribe time (any tier), an order-bump step offers Auto Apply and/or Resume Builder before completing checkout — default unchecked, cart total updates live if added, dismissible without blocking the base subscription. Nested upsells (Full-Auto, AI Suggestions) are **not** offered here — they surface later, inside the Auto Apply / Resume Builder product surfaces themselves once the base add-on is active.

### 3.4 Feature access matrix

| Capability | Starter | Pro | Premium | Resume Builder add-on | Auto Apply add-on |
|---|---|---|---|---|---|
| Interview Copilot (web) | ✅ | ✅ | ✅ | — | — |
| Interview Copilot (desktop) | ❌ | ✅ | ✅ | — | — |
| Coding Copilot | ❌ | ✅ | ✅ | — | — |
| Meeting Copilot | ❌ | ❌ | ✅ | — | — |
| Resume Builder | ❌ | ❌ | ❌ | ✅ | — |
| — AI Suggestions / Premium Templates | ❌ | ❌ | ❌ | 🔒 further unlock | — |
| Auto Apply (semi-manual) | ❌ | ❌ | ❌ | — | ✅ |
| — Full-Auto mode | ❌ | ❌ | ❌ | — | 🔒 further unlock |

### 3.5 Open pricing questions (carried from `PRICING_STRATEGY_PRD.md`, unresolved)

1. Price for the Resume Builder nested upsell (AI Suggestions / Premium Templates).
2. Whether unused monthly credits roll over or reset at renewal (§2.4 above — not explicit in the original doc either).
3. Annual pricing/discount for add-ons — monthly-only, or do they get an annual option too?
4. **Reconciling Pro/Premium pricing and credit-metering model with `docs/DESKTOP_COPILOT_PRD.md`'s "Regular Copilot Pro/Premium"** ($49/$79, session-length billing) — one SKU/one billing model, or genuinely two separate products?
5. What happens to an add-on if its underlying base subscription is cancelled/downgraded — cancels automatically, or can it run independently?
6. Referral bonus amount and eligibility rules (§2.4).

---

## 4. Payment System Architecture (new — the scope this doc adds)

### 4.1 Provider

**Stripe**, specifically **Stripe Billing** (subscriptions) + **Stripe Checkout** (hosted payment UI) + **Stripe Customer Portal** (self-serve plan/payment-method management). Rationale: it's the de facto standard for exactly this shape of product (tiered subscriptions + metered add-ons + one-time purchases), it keeps raw card data off our servers entirely (PCI SAQ-A, §4.10), and its subscription-item model maps directly onto "one base plan + N independent add-ons" without custom proration math. No other provider is referenced anywhere in the codebase or existing docs; this is a recommendation for sign-off, not a confirmed decision — flag for sign-off alongside the other open questions if there's a reason to reconsider (e.g. a specific market requiring a different processor).

### 4.2 Money model

Continue the cents-as-source-of-truth convention already established in `src/lib/credits.ts` (§2.1) straight through into the payment layer — Stripe itself is cents-native (its API takes integer minor units), so there is no conversion layer to build between "our money model" and "Stripe's money model." **Credits never exist as a Stripe-side concept** — Stripe only ever sees dollars/cents for subscriptions, add-ons, and top-up purchases. The credit ledger (§4.7) is purely our own layer that translates a successful payment into a cents balance, which the frontend then renders as credits exactly as it does today.

### 4.3 Core Stripe objects

| Stripe object | Maps to |
|---|---|
| `Customer` | One per JobWhisper account, created at first checkout (or at signup, TBD). |
| `Product` + `Price` | One Product per plan (Starter/Pro/Premium) and per add-on (Resume Builder, Auto Apply, and their nested upsells), each with a recurring monthly Price and, where offered, an annual Price. |
| `Subscription` | **One subscription per customer**, not one per plan/add-on. The base plan and every active add-on are separate **Subscription Items** on that single subscription — this is what makes "add Auto Apply mid-cycle" a `SubscriptionItem.create` with automatic proration rather than a second subscription to reconcile against the first. |
| `Checkout Session` (mode: `subscription`) | New subscription signup, including the add-on order-bump (§3.3) as additional line items on the same session. |
| `Checkout Session` (mode: `payment`) | One-time credit top-up purchase (§4.4.2) — not a subscription line item. |
| `Invoice` | Generated automatically by Stripe on each billing-cycle renewal and on any proration; drives the monthly credit grant (§4.7) via webhook. |
| `Customer Portal` | Self-serve payment-method updates, invoice history, and cancellation — avoids building custom UI for things Stripe already provides securely. |

### 4.4 Checkout flows

**4.4.1 New subscription (with add-on order bump)**
1. User picks a tier on the plan-selection screen (`src/features/billing/plan-selection-view.tsx`) and optionally checks Auto Apply / Resume Builder in the order-bump step (§3.3).
2. Backend creates a Checkout Session (mode `subscription`) with one line item for the plan Price and one line item per selected add-on Price, redirects to Stripe-hosted checkout.
3. On completion, Stripe fires `checkout.session.completed` → webhook handler creates/updates our subscription record, grants the plan's initial credit allowance, and marks the selected add-ons entitled (§4.5, §4.6).

**4.4.2 One-time credit top-up**
1. User opens the Add Funds dialog (`src/ui/add-funds-dialog.tsx`), picks a preset or custom credit amount.
2. Backend creates a Checkout Session (mode `payment`) for `creditsToCents(amount)`, redirects to checkout.
3. On `checkout.session.completed`, webhook handler credits the wallet ledger directly by that cents amount — no subscription involved, works identically for subscribers and non-subscribers (anyone can top up, per the existing dialog copy — "add to your balance to keep going").

**4.4.3 Add/remove an add-on mid-cycle**
`SubscriptionItem.create` / `.update(quantity: 0)` (or delete) on the existing subscription. Stripe prorates automatically based on time remaining in the current billing period — default to Stripe's standard "prorate immediately" behavior unless product decides otherwise. Adding an add-on entitles the feature immediately on successful payment (via webhook, not by trusting the client-side add-to-cart action).

**4.4.4 Plan upgrade/downgrade**
`Subscription.update` changing the base plan's Subscription Item Price. Upgrades take effect immediately with prorated charge; downgrades should take effect **at the end of the current billing period** (standard SaaS practice — a user shouldn't lose access they already paid for this cycle) unless product decides otherwise — open question.

**4.4.5 Cancellation**
Default to **cancel at period end**, not immediate revocation — consistent with §4.4.4's downgrade behavior and with how the Customer Portal handles cancellation by default. Whether cancelling the base plan auto-cancels its add-ons or leaves them running independently is still open (§3.5, item 5) and needs an answer before this flow can be fully specified — recommend auto-cancelling add-ons together with the base plan, since the add-ons' own copy ("requires an active subscription") implies they can't exist without one, but this needs explicit confirmation.

### 4.5 Webhook-driven state sync

**Stripe is the source of truth for subscription/payment state — our database mirrors it, it never leads it.** Every state change in our system that matters for entitlement or billing should originate from a verified Stripe webhook event, not from the client reporting "I just paid." This matters because it's the only way to be safe against a user closing the tab mid-checkout, a payment succeeding after a delay, or a client-side bug lying about payment success.

Minimum required event handlers:

| Event | Action |
|---|---|
| `checkout.session.completed` | Provision new subscription/add-on or credit a top-up (§4.4.1, §4.4.2). |
| `invoice.paid` | Grant the plan's monthly credit refill (§2.4, item 1); extend the entitlement period. |
| `invoice.payment_failed` | Begin dunning (§4.8) — do **not** immediately revoke access on the first failure. |
| `customer.subscription.updated` | Sync plan/add-on entitlement state (upgrade, downgrade, add-on added/removed) into our `BillingSnapshot`-equivalent backend record. |
| `customer.subscription.deleted` | Revoke entitlement at the confirmed end of the paid period. |
| `charge.dispute.created` | Flag account for review (§4.9) — do not auto-revoke without a defined policy. |

All handlers must be **idempotent** (Stripe redelivers events; the same event ID processed twice must not double-credit a wallet or double-provision a subscription) and must **verify the webhook signature** before processing anything.

### 4.6 Entitlement resolution

Today, `BillingSnapshot` (`src/contracts/billing.ts`) is a single static mock object. In production, this becomes a **server-computed view** derived from: the customer's current Stripe subscription + its active Subscription Items → which plan tier is active, which `BillableFeature`s and `AddOnId`s are entitled, plus the wallet's current cents balance converted to the `CreditWallet` shape. The frontend contract (`BillingSnapshot`, `FeatureAccess`, `AddOnAccess`) does not need to change shape — only its data source changes, from a static import to an API call backed by the webhook-synced state in §4.5. This is a meaningful implementation detail worth stating explicitly: **the existing frontend types were already designed correctly for this** — no contract redesign needed, only a real backend behind them.

### 4.7 Credit ledger & usage holds

- **Append-only ledger.** Every credit-affecting event (subscription grant, top-up, referral bonus, feature usage deduction) is one immutable row, mirroring the shape already visible in `creditHistoryRows` (`src/contracts/account.draft.ts`: `CreditHistoryRow`). Current balance is always a derived sum, never a mutated single field — this is what makes the transaction history view (already built in the UI) trustworthy and auditable rather than a display of a number that could silently drift from reality.
- **Usage holds for live sessions.** A live Copilot session bills per-minute while it's still running — the wallet needs a **hold** placed at session start (using the `reserved` field already present but unused in `CreditWallet`, §2.2) so a session can't run past the point the user's balance would go negative, and so two features can't both spend the "last" credit simultaneously. Convert the hold to a real ledger deduction as the session progresses or ends; release any unused hold if the session ends early.
- **Idempotency keys.** Every ledger-writing operation triggered by a webhook must be keyed by the Stripe event ID (or a derived idempotency key) to guarantee a redelivered webhook cannot double-credit or double-charge.

### 4.8 Dunning / failed payments

On `invoice.payment_failed`:
- **Do not immediately lock the account.** Stripe's default Smart Retries schedule re-attempts the charge automatically over roughly two weeks — use that window as the grace period rather than inventing a separate one, unless product wants something shorter/longer (open question — no grace-period length has been specified anywhere yet).
- During the grace period, the account should show a clear "payment failed, update your card" state (not built anywhere in the UI yet) without cutting off access mid-window — this needs a corresponding "past due" UI state, since none of `Plan` or `BillingSnapshot['status']` currently has one (`'unavailable' | 'loading' | 'ready'` today — `'past_due'` needs to be added).
- If retries are exhausted and the subscription moves to Stripe's `unpaid`/`canceled` status, entitlement reverts to the non-subscriber trial state (§2.5), not to zero access.

### 4.9 Refunds & chargebacks

No policy exists yet — needs product/finance sign-off. At minimum, spec the mechanics once policy is decided: refunds issued through Stripe should reverse the corresponding ledger grant (not silently leave a wallet balance funded by a refunded charge), and disputes/chargebacks (`charge.dispute.created`) should flag the account for manual review rather than auto-revoking, since a false dispute shouldn't instantly lock out a legitimate user.

### 4.10 Security & compliance

- **PCI scope stays at SAQ-A** by using Stripe Checkout/Customer Portal (hosted, Stripe-controlled payment forms) rather than building custom card-collection UI — no raw card data should ever touch our frontend or backend.
- **Webhook endpoint** must verify Stripe's signature header on every request and reject unsigned/invalid payloads.
- **Secrets** (Stripe secret key, webhook signing secret) live in environment variables (see `.env.example` convention already in the repo), never in client-bundled code.
- **Tax** — no tax collection exists anywhere in the current pricing model. If JobWhisper needs to charge sales tax/VAT in any jurisdiction, Stripe Tax is the natural fit given the rest of the Stripe-native design — open question on whether this is in scope for v1 or deferred.
- **Currency** — USD only, no multi-currency requirement stated anywhere in existing docs. Confirm before assuming this is permanently out of scope.

---

## 5. Proposed Data Model (backend — none of this exists yet)

```
users
  id, email, stripe_customer_id, plan (nullable), created_at

subscriptions
  id, user_id, stripe_subscription_id, status (active/past_due/canceled/...),
  current_period_end, plan_price_id

subscription_items
  id, subscription_id, stripe_subscription_item_id, kind ('plan' | 'addon'),
  add_on_id (nullable, e.g. 'resume-builder'), stripe_price_id

credit_ledger
  id, user_id, amount_cents (signed), source
    ('subscription_grant' | 'topup' | 'referral_bonus' | 'usage_deduction' | 'refund_reversal'),
  description, stripe_event_id (nullable, for idempotency), created_at

credit_holds
  id, user_id, amount_cents, feature, session_id, status ('open' | 'settled' | 'released'),
  created_at, settled_at
```

This is a starting sketch for the implementing team, not a final schema — indexes, foreign keys, and exact status enums are an implementation detail.

---

## 6. Non-Functional Requirements

- **Webhook reliability.** The webhook endpoint must handle Stripe's retry behavior gracefully (idempotent processing, §4.5/§4.7) and should alert if event processing lag exceeds a few minutes — a delayed `invoice.paid` handler means a paying user sees a stale, unrefreshed credit balance.
- **Reconciliation.** Periodically (e.g. daily job) reconcile our subscription/entitlement records against Stripe's actual state to catch any missed or out-of-order webhook — the two should never be allowed to silently drift apart without detection.
- **Entitlement check latency.** `BillingSnapshot` resolution (§4.6) gates access to core product surfaces on every load — this needs to be fast (cached/denormalized, not a live Stripe API call on every page load) even though its underlying source of truth is webhook-synced.
- **Auditability.** Every ledger entry and every entitlement change should be traceable back to the Stripe event that caused it — this is both a support-debugging requirement (a user disputing "why did my credits change") and a financial-audit requirement.

---

## 7. Success Metrics

- **Checkout conversion rate** — plan-selection view → completed Checkout Session, tracked separately for new subscriptions vs. add-on attach vs. credit top-ups (three different funnels with likely different conversion characteristics).
- **Involuntary churn rate** — % of subscriptions lost to failed payments (dunning exhausted) vs. voluntary cancellation — these need different retention strategies.
- **Webhook processing success rate** — % of events processed successfully on first attempt without needing Stripe's retry.
- **Ledger/Stripe drift incidents** — count of reconciliation-job mismatches found (§6) — target zero, but needs to be measured to know if it's actually zero.
- **Time-to-entitlement** — from successful payment to the user actually seeing the unlocked feature/credits in the product — should be near-instant, not "check back later."

---

## 8. Open Questions — consolidated

*(carried from §3.5, plus new payment-specific items)*

1. Price for the Resume Builder nested upsell (AI Suggestions / Premium Templates).
2. Whether unused monthly subscription credits roll over or reset at renewal.
3. Annual pricing for add-ons — offered or monthly-only?
4. Reconciling this doc's Pro/Premium ($100/$200, per-feature metering) with the Desktop Copilot PRD's Pro/Premium ($49/$79, session-length metering) — one SKU or two, one metering model or two?
5. Does cancelling/downgrading the base plan auto-cancel active add-ons, or can they run independently?
6. Referral bonus amount and eligibility rules.
7. Stripe as the confirmed payment provider, or does a specific market/requirement demand otherwise?
8. Grace period length for failed payments — default to Stripe Smart Retries (~2 weeks), or something product-specified?
9. Refund and chargeback policy — not specified anywhere yet.
10. Tax collection (Stripe Tax) — in scope for v1 or deferred?
11. Multi-currency support — confirmed out of scope, or just never discussed?
12. Downgrade timing — end of billing period (recommended, §4.4.4) or immediate?

---

## 9. Suggested Build Order

*(extends `PRICING_STRATEGY_PRD.md` §9, picking up from step 6 — "defer real payment integration" — which this document now un-defers)*

1. *(from the pricing doc)* Update `src/contracts/billing.ts` types, `src/mocks/billing.ts` / `src/mocks/account.ts`, plan-selection/billing-page UI, and the add-on cart/upsell + entitlement-gating UI. These can proceed against mock data independent of payment work.
2. Stand up the Stripe account, Product/Price catalog for every tier + add-on + nested upsell (blocked on §3.5 items 1–3 for exact prices).
3. Build the backend data model (§5) and webhook endpoint with signature verification.
4. Implement `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated/deleted` handlers (§4.5) against the new data model, with idempotency (§4.7).
5. Wire the New Subscription checkout flow (§4.4.1) end-to-end, replacing the mock plan-selection submit action.
6. Wire the credit top-up checkout flow (§4.4.2), replacing the `onAddFunds` mock handler in `add-funds-dialog.tsx`.
7. Wire add-on attach/detach (§4.4.3) and plan upgrade/downgrade (§4.4.4) against real Subscription Item updates.
8. Build the `past_due` / dunning UI state (§4.8) — does not exist today.
9. Build the reconciliation job (§6) and basic admin visibility into ledger/subscription state for support debugging.
10. Refunds/disputes handling, tax, and any deferred items from §8 — sequence depends on which open questions get resolved first.
