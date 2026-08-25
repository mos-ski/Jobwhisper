# Sales waitlist landing: realistic hero mockup + visual explainer + trust row

## Problem

The `LiveOverlayDemo` hero (shipped earlier this session) is a real improvement
over static text, but it's still a small, abstract "mini app card." Reference
screenshots from Cluely (a competitor AI meeting-copilot) show a stronger
pattern: the overlay is shown as a realistic screenshot composited over an
actual call in progress, a two-step "listens → assists" visual explainer
right below the fold, and an icon-based trust row instead of paragraph text —
directly matching the original feedback that "the hero and one scroll-depth
below it need to carry the entire pitch visually."

## Scope

Sales/enterprise landing page only (`src/pages/marketing/EnterpriseCopilotLanding.tsx`).
Not touching Copilot or Exam Ghost landing pages. Three pieces, additive to
what already shipped — nothing existing gets deleted except the current hero
visual, which gets replaced by a bigger version of the same idea:

1. Hero: realistic composited call-mockup with the AI overlay floating on top.
2. New section: two-step "listens → assists" explainer, placed directly after
   the existing `ProofStrip`.
3. New section: 3-card icon trust row (stealth-forward tone, matching Cluely's
   framing), placed after the two-step explainer.

The existing "Built for rolling out a whole team" feature grid (admin/team
capabilities — a different value prop from "how the AI works during a call")
stays as-is, unchanged, further down the page. Case studies, admin-dashboard
preview, pricing, FAQ, and footer/waitlist block are all unchanged.

## Design decisions already made (do not re-litigate)

- No real photos of people — no licensed/rights-cleared assets exist for a
  sales-call scenario. All call-tile visuals are CSS-illustrated shapes,
  following the existing pattern in `GoogleMeetMock()`
  (`src/pages/InterviewCopilot.tsx:514-609`), not reused verbatim (it's
  private/unexported and Google-Meet-themed) but used as the reference for
  head/shoulder shapes, name badges, and control-bar styling.
- Colors stay on-brand: navy `#08285c` (already used elsewhere on this page
  for CTA/case-study sections) and teal `#2dd4bf` (the page's existing
  accent) — not Cluely's blue/white palette.
- Trust-row tone is stealth-forward, closely matching Cluely's "undetectable"
  framing (explicit user decision — do not soften to a more corporate tone).
- The hero's live animation logic (the phase state machine in
  `LiveOverlayDemo.tsx`) is reused, not rebuilt — only its outer chrome
  changes from "standalone card" to "floating panel over a call background."

## Part 1: Hero — composited call mockup

### Structure (outer to inner)

1. **Outer desktop/browser frame** — a bigger container (`max-w-3xl`, was
   `max-w-sm`) with a title bar: three traffic-light dots (reuse the existing
   `#ff5f57` / `#febc2e` / `#28c840` dot pattern already used in
   `LiveTranscriptCard` and the page's "What your admin sees" section) plus
   a centered label `"Zoom — Sales Call"` in small gray text. Rounded
   `rounded-2xl`, `border border-slate-200`, `shadow-2xl`.

2. **Call background** — new component `CallBackground` (see Part 4), a
   2-tile illustrated video call: left tile = the rep (Lightforth's own
   user), right tile = the prospect. Reuses the head/shoulder CSS-shape
   pattern from `GoogleMeetMock`, recolored to a neutral slate/navy gradient
   (not tied to any real skin-tone assumption — keep it abstract/geometric,
   more like a silhouette than a realistic face, avoiding the specificity of
   the original `GoogleMeetMock`'s tone-specific gradients). Bottom-left name
   badge "You", bottom-right name badge "Prospect". A thin bottom control bar
   with mic/video/end-call icons (lucide-react `Mic`, `Video`, `Phone`),
   purely decorative, no interactivity.

3. **Floating overlay panel** — `LiveOverlayDemo`, restyled (see Part 2),
   absolutely positioned over the call background, roughly centered,
   `max-w-md`, frosted dark background (`bg-[#0b1530]/95`, `backdrop-blur`)
   so the call tiles are still faintly visible behind it at the edges,
   matching the reference screenshot's translucency.

4. **Floating pill control bar** — a small decorative pill positioned just
   above the overlay panel: a circular logo mark + `"Hide"` with a chevron +
   a small stop-icon button, matching image 1's top pill exactly in spirit
   (not pixel-identical). Static, non-interactive — it's set dressing that
   sells "this is a real running app," not a functional control.

### `LiveOverlayDemo` chrome changes (Part 2)

The component's internal phase/timer/typing logic is unchanged. Only the
returned JSX's outer wrapper and header change:

- Remove the traffic-light dots and the `"Live call"` badge row (they now
  live one level up, in the outer desktop frame from Part 1) — replace with
  a slim top row showing the status text left-aligned (`"Listening to
  customer..."` etc.) and the deal-stage dot tracker right-aligned.
- Add a decorative bottom row below the Q&A content: a fake input bar
  reading `"Ask about your screen or conversation..."` in muted gray, with a
  small `"Smart"` pill tag and a circular teal send-button icon on the
  right — purely decorative (no input element, no state), matching image 1's
  chat bar.
- Add a new optional prop `variant?: 'panel' | 'card'` (default `'panel'`).
  `'card'` renders the original standalone traffic-light-dot card exactly as
  it shipped this session (kept for the static "assists" proof frame in Part
  3, so that section doesn't need its own copy of the chrome). `'panel'`
  renders the new chrome described above. This is a rendering-only branch —
  the phase/timer state machine underneath is identical either way.
- Add a new optional prop `forceStatic?: boolean` (default `false`). When
  true, behaves like the existing `prefers-reduced-motion` path (renders
  `TURNS[0]` fully typed, no timers armed) regardless of the user's actual
  motion preference. Used by the explainer section's static "assists" proof
  frame so it doesn't animate a second time on the same page.

None of this changes the component's public test-observable behavior for the
existing default usage (`<LiveOverlayDemo />` with no props renders exactly
as before) — existing tests must still pass unmodified.

## Part 3: New section — "How Sales Closer AI helps during a call"

Placed immediately after `<ProofStrip items={PROOF} tone="light" />`
(`EnterpriseCopilotLanding.tsx:107`), full width, `py-20`, two cards
side-by-side on `sm:grid-cols-2` (stacked on mobile):

- **Left card** — background `#08285c` (navy), white text. Heading `"Sales
  Closer AI listens in to the call"`. Body: `"It picks up context in real
  time, so it's ready the moment you need it."`. Below: a call timer
  (`"00:16"`, large bold) + `"Recording"` label with a small pulsing red dot,
  plus a static waveform made of ~30 vertical bars of varying height in
  teal, matching image 2's waveform strip. All static (no animation needed —
  a still waveform reads fine here; do not wire up any timer).
- **Right card** — background white, navy text, border. Heading `"When you
  need help, it assists you instantly"`. Body: `"Hit the shortcut and get a
  live suggested response, pulled from your own playbook."`. Below: `<LiveOverlayDemo variant="card" forceStatic />` at a smaller size
  (`max-w-sm`, matching its original shipped size) as the visual proof —
  reusing the exact component from Part 2's `'card'` variant rather than
  building a second static mockup.

## Part 4: New section — trust row (stealth-forward)

Placed immediately after Part 3's section, `py-20`, heading `"Undetectable,
every call"`, subheading `"Your prospect never knows it's there."` Below: 3
cards in a `sm:grid-cols-3` grid, each a small bordered card with a compact
mockup on top and two lines of copy below (bold headline + one-sentence
caption, no paragraph):

1. **"Invisible to screen share"** — mini mockup: two small side-by-side
   panels labeled `"You see"` (shows a tiny version of the overlay panel)
   and `"They see"` (shows just the plain call tiles, no overlay). Caption:
   `"Share your screen mid-call — the panel never appears in what they see."`
2. **"Live during the call, not after it"** — mini mockup: a small
   horizontal timeline with a highlighted point mid-call labeled `"here"`
   and a greyed-out point after the call labeled `"too late"`. Caption:
   `"Coaching happens in the moment that decides the deal."` (Distinct
   visual treatment from the existing `ProofStrip` pill of the same phrase —
   this is a mockup, not a repeated text pill.)
3. **"No bots, no footprint"** — mini mockup: a small participants-list
   snippet (2-3 name rows) with a badge reading `"No AI detected"` in the
   corner, echoing image 3's "No bots detected" pattern. Caption: `"Sales
   Closer AI never joins the call or shows up in the participant list."`

## Part 5: `CallBackground` component

New file, `src/components/marketing/CallBackground.tsx`. Exports
`CallBackground()`, no props, no state, purely presentational (no timers,
no animation). Renders the 2-tile illustrated call background described in
Part 1, reusable by the hero. Not reused by Part 3/4 (those use their own
small static mockups per the descriptions above, kept inline in
`EnterpriseCopilotLanding.tsx` since they're simple and section-specific).

## Testing

- `LiveOverlayDemo`'s existing 4 tests must still pass unmodified. They only
  assert on `Prospect`, the customer line text, and `Suggested Response` —
  none of them assert on the `Live call` badge or the traffic-light dots, so
  changing the default variant's chrome (Part 2) does not break them.
  Confirmed by reading the current test file: no existing assertion
  references `Live call` or the dot markup.
- Add two new tests: one asserting `<LiveOverlayDemo variant="card" />`
  renders the original traffic-light-dot chrome (assert the `Live call`
  badge text is present), and the default/`'panel'` variant does not render
  that badge text. Another asserting `<LiveOverlayDemo forceStatic />`
  freezes the frame immediately on render (same assertion style as the
  existing reduced-motion test, but via the prop instead of mocking
  `matchMedia`).
- `CallBackground` gets a smoke test: renders without throwing, contains the
  `"You"` and `"Prospect"` name badges.
- Extend `CopilotWaitlistLanding.test.tsx`'s enterprise test (or add a
  sibling test) to assert the new section headings (`"Sales Closer AI
  listens in to the call"`, `"Undetectable, every call"`) render on the
  page.

## Out of scope

- Copilot and Exam Ghost landing pages (not touched).
- The existing "Built for rolling out a whole team" feature grid (unchanged,
  stays where it is).
- Any literal video/gif capture (still a live component, per the earlier
  decision this session).
