# Desktop Copilot — Auth + Pricing-Gated Access Flow

## Context

This is the second of three planned specs for the desktop Copilot expansion (the first, [desktop-copilot-use-cases-design.md](2026-06-24-desktop-copilot-use-cases-design.md), built the 5 use-case flows and the free-form `UseCaseSelectionScreen`). The product direction changed: use-case access is no longer freely chosen — it's gated behind sign-up and what the user buys (or was invited to). Onboarding is now followed by Sign Up/Sign In, then Pricing, and the plan purchased there (or an enterprise invite code entered at sign-up) determines which use case(s) the user can reach next.

## Flow Change

Old: `Splash → Onboarding → UseCaseSelectionScreen (free pick of all 5) → Setup → Preference → Canvas → Complete`

New:

```
Splash → Onboarding → Sign Up/Sign In
  → (no invite code) → Pricing → Payment → UseCaseSelectionScreen (scoped) or straight to Setup → Preference → Canvas → Complete
  → (invite code)    → Enterprise Sign In → Sales Call Setup → Preference → Canvas → Complete
```

`UseCaseSelectionScreen` is reused, not replaced — it gains a `useCaseIds: UseCaseId[]` filter prop so it can render a subset of `USE_CASES` instead of always all 5.

## Sign Up / Sign In

A new screen between Onboarding and Pricing. Mirrors the existing web app's auth pattern (`src/pages/Auth.tsx`, `useAuth`/`AuthProvider`, `src/hooks/useAuth.tsx`) — same account system, same `login(token)` call, same demo-login fallback — but restyled to match this prototype's dark `MacWindow` aesthetic (`BG`, `CARD`, `BORDER` tokens) instead of `Auth.tsx`'s light web theme. It mirrors `Auth.tsx`'s mode structure (choice → email → password → login), not its literal markup.

One addition: a secondary link, **"I have an invite code"**, next to the normal sign-up/sign-in options. Clicking it reveals an invite-code field and switches the form into **enterprise sign-in mode** — email + password only, no "create account" path, since enterprise users are pre-provisioned by their organization's admin (per the product rule: anyone with an invite code was already paid for by the enterprise admin). Any non-empty code + credentials succeeds, consistent with how the rest of this prototype mocks validation.

- **Regular sign-up/sign-in** (no invite code) → proceeds to **Pricing**.
- **Enterprise sign-in** (invite code entered) → skips Pricing entirely and routes straight to the existing Sales Call `SetupScreen`, treated as the enterprise user's "dashboard."

## Pricing Tracks

**Revised per Figma** ([node 15860-61921](https://www.figma.com/design/YQFMH7Tll54QoLNqRhvPx0/Lightforth-v.3.0?node-id=15860-61921)): Exam is no longer a separate one-time plan — it's bundled into Pro/Premium alongside Interview, Coding, and Meeting. Because Sales Call is reached only via an enterprise invite code at sign-in, and Exam is now part of the credit bundle, the Pricing screen has exactly **two** cards, matching the Figma "Level Up" design:


| Plan                         | Price                              | Credits | Unlocks                          |
| ---------------------------- | ---------------------------------- | ------- | -------------------------------- |
| **Pro**                      | $49/mo (or $39/mo billed annually) | 100     | Interview, Coding, Meeting, Exam |
| **Premium** ("Most Popular") | $79/mo (or $63/mo billed annually) | 250     | Interview, Coding, Meeting, Exam |


A functional Annual/Monthly billing toggle on the screen's hero panel recomputes both cards' displayed price at a 20% discount when Annual is selected; it does not affect `PaymentScreen`, which always shows the monthly rate.

```ts
type PlanId = 'pro' | 'premium'
type BillingCycle = 'monthly' | 'annual'

interface PlanConfig {
  id: PlanId
  label: string
  monthlyPrice: number
  credits: number
  popular: boolean
  bullets: string[]
  bestForNote: string
  unlockedUseCases: UseCaseId[]
}
```

Both plans set `unlockedUseCases: ['interview', 'coding', 'meeting', 'exam']` — they differ only in price/credits/copy, not in which use cases they unlock. Since every remaining plan now unlocks more than one use case, `PaymentScreen` always routes to the scoped `UseCaseSelectionScreen` next — there's no longer a single-use-case "skip the picker" branch.

## New Screens

`**SignInScreen**` — mirrors `Auth.tsx`'s mode flow (choice / email / password / login), restyled dark. Adds the "I have an invite code" link described above, which reveals an invite-code field and switches to enterprise sign-in mode.

`**PricingScreen**` — two-column layout per the Figma design: a hero panel (headline, copy, billing toggle) beside the two plan cards, stacked vertically, rendered from `PLANS: PlanConfig[]`. Each card is itself the click target (matching the design, where Pro has no separate CTA button and Premium's "Upgrade to Premium" bar is a visual label inside the same clickable card, not a nested button).

`**PaymentScreen**` — one generic component reused for Pro and Premium. Mock card form (card number, expiry, CVC — no real validation beyond non-empty). Shows a one-line purchase summary derived from the selected `PlanConfig` at its monthly rate (e.g. "$49/mo — Pro Plan"). On submit, proceeds to the next step.

## Post-Access Routing

After `PaymentScreen` completes: route to `UseCaseSelectionScreen` with `useCaseIds={config.unlockedUseCases}`, which renders Interview/Coding/Meeting/Exam cards (never Sales Call, since that's invite-only).

After enterprise sign-in (invite code): route straight to Sales Call's `SetupScreen`, bypassing Pricing and the picker entirely.

From there, the flow is unchanged from the first spec: `Setup → Preference → Canvas (conversational or screenshot-qa per use case) → Complete`.

## Out of Scope

- Real payment processing, subscription billing, or invite-code/organization backend validation — this remains a client-side mock prototype.
- A persistent "credits remaining" indicator during live sessions — explicitly deferred; not part of this pass.
- The Knowledge Center spec (third planned spec) — document upload per use case is still untouched here.
- A dedicated, distinct "Sales Dashboard" screen — the existing Sales Call `SetupScreen` serves as the enterprise user's landing point for this pass.

## Verification

Run the prototype locally (`npm run dev`, navigate to `/desktop-copilot-preview`) and walk both paths end to end:

- Regular sign-up → Pro or Premium → toggle Annual/Monthly and confirm prices update → mock payment → scoped picker shows Interview/Coding/Meeting/Exam (never Sales Call) → pick each in turn → correct Setup fields → correct canvas pattern
- Sign-in with "I have an invite code" → enterprise sign-in fields appear, no sign-up option → straight to Sales Call Setup (no Pricing screen shown at all)

