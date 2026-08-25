# Landing Pages Module — Design

## Purpose
A workspace for building standalone marketing-funnel landing pages, separate from the
main Lightforth app. Each page is built, reviewed live, then deployed as its own Vercel
project with a real domain attached. Devs can copy the file directly — no build step, no
framework, no dependency on the main app's codebase.

## Structure
```
public/landing-pages/
  _template.html       shared starter: design system + empty scaffold
  README.md            what this folder is, naming convention, how to deploy one page
  concierge/index.html Lightforth Concierge ($500 one-time "Success Manager" upsell)
  manager/index.html   Lightforth Manager ($10 first-month Pro coupon funnel)
```

**Revised from the original design:** initially built as a repo-root `landing-pages/`
folder deployed as separate, brand-new Vercel projects per funnel. The user's actual
expectation was that everything stay reachable from the one Vercel link already being
shared/bookmarked (`test-lightforth.vercel.app`), not a fresh, unfamiliar link per page.
Moved into `public/landing-pages/` instead — Vite copies `public/` verbatim into the
build output, so each page is served as a real static file at
`test-lightforth.vercel.app/landing-pages/<funnel>/`, automatically, on every deploy of
the main app. No separate Vercel project, no extra step.

Each page is still a fully self-contained `index.html` with zero build step and zero
dependency on `src/` or the main app's React code — only the *hosting* changed, not the
page format. A funnel can still be pulled into its own standalone Vercel project later if
it needs a real standalone custom domain (documented in the README) — that path still
works, it's just no longer the default.

## Design system (shared across funnels)
Extracted from the two existing reference pages into `_template.html`:
- CSS variables for the palette (`--black`, `--gold`, `--green`, `--blue`, `--purple`, etc.)
- Instrument Sans (Google Fonts), system-ui fallback
- Shared section patterns: sticky nav, hero with pill badge, FAQ accordion, pricing/checkout
  card (black, radial glow), testimonial grid, footer
- Inline SVG icons, no image assets, no JS dependencies

New funnel pages start by copying `_template.html` into a new folder and customizing —
keeps every future page visually consistent with these two without re-deriving the palette.

## Checkout flow (prototype, not real payment processing)
Both funnels sell the regular Lightforth app (Concierge: a $500 one-time service add-on;
Manager: a discounted first month of Pro). Matches the mock-payment fidelity already used
for the Desktop Copilot checkout screens earlier in this codebase — fake card fields, no
real processor, no backend call.

- **Concierge:** "Get my Success Manager — $500" reveals a mock card-entry panel (same
  black/glow card styling already on the page) → "Pay $500" → success state confirming
  next steps. Implemented as a same-page show/hide toggle, consistent with the page's
  existing JS patterns.
- **Manager:** existing claim-form → coupon-reveal flow is unchanged. "Continue to
  checkout" now reveals the same mock card panel instead of setting a Stripe Payment Link
  href → "Pay $10" → success state confirming the discounted first month.

No real Stripe integration. The previous `TODO: Replace this placeholder URL` Stripe-link
comments are removed since there's no longer a real-payment-link seam to fill in — the
mock checkout replaces it entirely. If real payment processing is wanted later, that's a
new, separate piece of work, not a placeholder swap.

## Out of scope
- Real Stripe/payment processing
- A gallery or index page for browsing funnels (explicitly not wanted — each funnel is
  independent, the README is just maintenance documentation, not a live route)
- Any change to the main app's `src/` tree, routing, or build
