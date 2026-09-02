# JobWhisper Pricing & Monetization Strategy — PRD

> **Numbers superseded 2026-09-02 — see `PRICING.md` at the repo root for current tier prices, DFY plans, and usage rates.** The strategic rationale and tier *structure* below (feature access matrix, add-on model) still stand; only the dollar amounts have changed.

- **Version:** 1.0
- **Status:** Draft / In-Review
- **Author:** Product
- **Supersedes:** the `$27 / $49 / $79` Starter/Pro/Premium numbers currently hard-coded in `src/mocks/billing.ts` and `src/mocks/account.ts`

---

## 1. Strategic Rationale

Today's competitors sell one single feature (an interview copilot) for roughly $20/mo. JobWhisper's current plan structure competes on the same axis but bundles everything — Resume Builder, Auto Apply, and interview tooling — into one subscription price per tier, which caps how much value we capture from power users.

The new strategy has two moves:

1. **Rebuild the subscription ladder purely around interview capability.** Interview Copilot is the product. Starter, Pro, and Premium differ only in *surface* (web vs. desktop) and *which live-session modes* are unlocked (Interview / Coding / Meeting) — not in which standalone tools are included.
2. **Pull Resume Builder and Auto Apply out of every tier and sell them as separate recurring add-ons**, each with its own further upsell inside it. This raises the ceiling on LTV per user instead of capping it at the top subscription tier — a subscriber can pay for Interview Copilot alone, or stack add-ons and land near $150–$200+/mo.

The credit system (usage-based metering, $0.40/credit) is unchanged and sits underneath all of this — it governs *usage* of whatever the user has already unlocked, not *access*.

---

## 2. Subscription Tiers

| Tier | Price (mo / yr, 20% off annual*) | Surface | Interview mode | Coding mode | Meeting mode |
|---|---|---|---|---|---|
| **Starter** | **$20/mo** · $192/yr | Web only | ✅ | ❌ | ❌ |
| **Pro** | **$100/mo** · $960/yr | Web + Desktop app | ✅ | ✅ | ❌ |
| **Premium** | **$200/mo** · $1,920/yr | Web + Desktop app | ✅ | ✅ | ✅ |

\* Annual discount carries forward the convention already used in `src/mocks/billing.ts`. Confirm we still want 20% off annual at these new price points.

Notes:
- "Interview / Coding / Meeting mode" maps directly to the existing `CopilotMode` union (`'interview' | 'coding' | 'meeting'`) already implemented in `src/features/copilot/interview-copilot-view.tsx`. No new copilot engine is needed — this is a gating change, not a new feature.
- Desktop app access (Pro/Premium only) aligns with the product already scoped in `docs/DESKTOP_COPILOT_PRD.md` ("Regular Copilot — Pro/Premium"). **Open reconciliation item:** that doc prices Pro/Premium at $49/$79 for the desktop product specifically. Decide whether the desktop PRD's pricing is retired in favor of the numbers in this doc (desktop access becomes a feature *of* Pro/Premium, not a separately priced product), or whether "JobWhisper Pro/Premium" and "Lightforth Copilot Pro/Premium" remain two distinct SKUs. Recommend the former — one Pro/Premium price, desktop app included as the surface differentiator.
- **Resume Builder and Auto Apply are not included at any tier**, including Premium. This is a deliberate change from the current mock data, where Starter already includes Resume Builder and Pro already includes Auto-Apply.
- Per-tier credit allotments (Starter/Pro/Premium currently ship 20/55/100 credits in the mocks) need to be re-derived for the new price points — proposed starting point below, **needs business sign-off before build**, since it directly sets gross margin:

  | Tier | Proposed monthly credit grant | $ value at $0.40/credit |
  |---|---|---|
  | Starter | 20 credits | $8 |
  | Pro | 100 credits | $40 |
  | Premium | 200 credits | $80 |

---

## 3. Add-On Marketplace (excluded from all tiers)

Add-ons require an active subscription (any tier) — they are not sold standalone to unsubscribed accounts. Each is billed as its own **recurring** charge, separate from the base plan, and can be cancelled independently.

### 3.1 Resume Builder — $15/mo

- Unlocks the existing Resume Builder flow (`src/features/resume/resume-builder-view.tsx`) for accounts that don't already have it.
- Usage inside it stays credit-metered exactly as today (1 credit / message).
- **Nested upsell — AI Suggestions / Premium Templates:** an additional add-on, price TBD (not yet specified by the business), that unlocks AI-generated content suggestions and the premium template set inside Resume Builder. Sold only to accounts that already have the base Resume Builder add-on active.

### 3.2 Auto Apply — $40/mo

- Unlocks the existing Auto Apply flow (`src/features/auto-apply/auto-apply-view.tsx`) in its current **semi-manual** form: the user selects which jobs to apply to; the tool handles the application itself.
- Usage inside it stays credit-metered exactly as today (3 credits / application).
- **Nested upsell — Full-Auto mode: +$10/mo:** removes the manual job-selection step. The AI finds *and* selects jobs on the user's behalf with no manual step. Sold only to accounts that already have the base Auto Apply add-on active.

---

## 4. Checkout / Cart Upsell Flow

When a user clicks **Subscribe** on any plan card (Starter, Pro, or Premium), before completing checkout, present an order-bump step offering the Auto Apply add-on (and Resume Builder) to add to the cart:

- Default state: unchecked — user can proceed with just the base plan.
- If they add one or both, the cart total updates live (e.g., Premium $200 + Auto Apply $40 + Resume Builder $15 ≈ $255/mo, or scaled down combinations landing around the "$150–200+" range depending on tier).
- This is a single extra step in the existing checkout, not a separate page — user can dismiss and continue with the base plan alone.
- Nested upsells (Full-Auto, AI Suggestions/Templates) are **not** offered at this first-checkout moment — they're surfaced later, inside the Auto Apply / Resume Builder product surfaces themselves, once the user is actually using the base add-on (matches how Meeting-mode upgrade prompts already work per `docs/DESKTOP_COPILOT_PRD.md` §3).

---

## 5. Feature Access Matrix (reference)

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

---

## 6. Credit System (unchanged)

No changes to the mechanics in `src/lib/credits.ts`:
- 1 credit = $0.40.
- Per-feature metered rates stay as-is: Resume Builder 1 cr/message, Auto Apply 3 cr/application, Interview/Coding/Meeting Copilot 2 cr/min.
- Non-subscriber trial balance (5 credits/mo) is unaffected.
- Access gating (tier + add-on entitlement) is a separate layer *in front of* credit metering — a user can be entitled to a feature but still run out of credits, and vice versa is never possible (no entitlement = feature not reachable regardless of credit balance).

---

## 7. Implementation Notes (current codebase is a frontend-only prototype — no Stripe/backend exists yet)

- `src/contracts/billing.ts` — `Plan` type is currently `'free' | 'pro' | 'business'`, which doesn't match the Starter/Pro/Premium naming used in the UI/mocks. Needs to become `'starter' | 'pro' | 'premium'`, and `BillableFeature` needs entries split out for the new add-on/nested-unlock structure (e.g. distinguishing base Auto Apply from Full-Auto mode, base Resume Builder from AI Suggestions/Templates).
- `src/mocks/billing.ts` and `src/mocks/account.ts` need the new prices, credit grants, and feature-gate lists (currently Starter includes Resume Builder and Pro includes Auto-Apply — both need to move out to add-ons).
- No cart/checkout upsell UI exists today — this is new.
- No add-on/entitlement purchase flow exists today (only referral bonus credits) — this is new.
- No Stripe or other payment backend exists — all billing today is static mock data. This PRD describes product/pricing structure; wiring to a real payment provider is a separate, later effort.

---

## 8. Open Questions (need business/product sign-off before build)

1. Price for the Resume Builder nested upsell (AI Suggestions / Premium Templates) — not yet specified.
2. Per-tier monthly credit grants at the new price points (proposed in §2, needs confirmation).
3. Annual pricing/discount for add-ons — do Resume Builder and Auto Apply get an annual option, or monthly-only?
4. Reconciling this doc's Pro/Premium with `docs/DESKTOP_COPILOT_PRD.md`'s "Regular Copilot Pro/Premium" — one SKU or two?
5. What happens to an add-on if the underlying base subscription is cancelled/downgraded — does the add-on cancel automatically, or can it run independently?

---

## 9. Suggested Build Order

1. Update `src/contracts/billing.ts` types (Plan naming, add-on/entitlement model).
2. Update `src/mocks/billing.ts` / `src/mocks/account.ts` with new tier prices, credit grants, and feature gates (remove Resume Builder/Auto Apply from tier feature lists).
3. Update plan-selection and billing-page UI to reflect the new tier feature matrix (`src/features/billing/plan-selection-view.tsx`, `src/apps/web/pages/billing-page.tsx`).
4. Build the add-on cart/upsell step in the subscribe flow (§4).
5. Build entitlement gating for Resume Builder / Auto Apply (locked state + "unlock" CTA) and their nested upsells.
6. Defer real payment integration (Stripe) — out of scope for this pass, prototype stays mock-data driven.
