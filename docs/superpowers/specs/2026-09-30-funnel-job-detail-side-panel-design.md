# Auto-Apply Funnel: Job Detail as a Right-Side Panel — Design

Date: 2026-09-30
Status: approved (approach "a" — same interaction as the app's Jobs tab)

## Context

On the try-auto-apply funnel matches step (`/v3/try/auto-apply?step=matches`), selecting a match
replaces the whole list with a full-page detail (`JobDetail`, back button "All matches"). The
signed-in app's Jobs tab (`AutoApplyJobsView` → `JobPreview`, `auto-apply-view.tsx:1603`) instead
keeps the list visible and shows the detail beside it: a right-hand panel on desktop, a sheet from
the bottom on mobile. The funnel gets that same interaction; the full-page detail goes away.

## Behavior

### Layout (desktop, ≥1024px)

- Matches content becomes a row: `MatchList` (`min-w-0 flex-1`) + detail panel
  (`lg:w-[26rem] lg:shrink-0`). The list compresses; the panel appears in flow beside it
  (not an overlay).
- `FunnelShell` gains a third width, `xwide: 'max-w-5xl'`, used only while the panel is open —
  3xl is too narrow for list + 26rem side by side. List-only stays `wide` (3xl).

### Panel (`JobDetailPanel`, `data-slot="funnel-job-panel"`)

Existing `JobDetail` content, restructured as a panel:

- Header: job title as `<h2>` (list `FunnelTitle` remains the page `<h1>`), company · location ·
  work mode line, close **X** button (`aria-label="Close job details"`) — replaces the
  "All matches" back button.
- Body (scrolls): salary · posted line, summary, "Why it matched" card (score badge + reasons).
- Mobile drag-handle bar (`lg:hidden`), same affordance as `JobPreview`.
- Mobile-only primary action inside the sheet: `Apply to this job`
  (`data-slot="funnel-job-panel-apply"`, `lg:hidden`) — the shell footer sits under the
  fixed sheet on mobile, so the CTA must live in the sheet there. On desktop the shell footer
  remains the only Apply.

### Mobile (<1024px)

- Panel is a bottom sheet: `fixed inset-x-0 bottom-0`, rounded top, `max-h-[90vh]`, internal
  scroll, `z-50`, over an `bg-overlay` backdrop (`lg:hidden`, `z-40`) that closes on click —
  structure copied from `JobPreview`.

### Motion

- Entry animation only: from the right on desktop, from the bottom on mobile
  (`animate-slide-in-bottom lg:animate-slide-in-right lg:rtl:animate-slide-in-left`,
  `motion-reduce:animation-none`). New `slideInBottom` / `slideInLeft` keyframes sit next to the
  existing `slideInRight` in `src/index.css`.

### State

- No new state. `selectedJobId` already lives in the URL (`?job=`, `try-auto-apply-page.tsx`),
  so browser Back closes the panel. Close paths (X, backdrop, Esc) all call
  `onSelectJob(null)`, which drops the param.

### Keyboard / focus

- Esc closes the panel, not the funnel: the panel registers a capture-phase `keydown` listener
  that handles Escape and calls `preventDefault()`; `FunnelShell`'s existing Escape → leave-setup
  handler skips when `event.defaultPrevented`. (Shell guard is the only shell change besides
  the width map.)
- On open, focus moves to the close X. On unmount, focus returns to the element that opened the
  panel (the job row). Selected row gets `aria-current="true"`.
- No focus trap: on desktop the panel is a non-modal `complementary` region (Jobs-tab precedent);
  documented as a deliberate choice.

### Footer

- Unchanged from today: `Apply to this job` while a job is open, `Apply to all N` otherwise.
  Both render at `xwide`/`wide` max width respectively.

## Files

| File | Change |
| --- | --- |
| `src/features/funnel/funnel-shell.tsx` | `xwide` width; Escape guard honors `defaultPrevented` |
| `src/features/funnel/funnel-auto-apply-view.tsx` | row layout, `JobDetailPanel`, delete full-page `JobDetail`, `aria-current` on rows, mobile sheet CTA |
| `src/index.css` | `slideInBottom`, `slideInLeft` keyframes + utility classes |
| `src/features/funnel/funnel-auto-apply-view.test.tsx` | list stays visible when open; h2 title; X/Esc close; focus → X |
| `FLOWS.md`, `src/apps/web/MANIFEST.md` | matches-step interaction + panel states |

## Verification

Targeted vitest (`funnel-auto-apply-view`, `funnel-kit`, `try-auto-apply-flow`), `tsc` against
`tsconfig.app.json` (no new errors), headless DOM + screenshots at 1440px and 360px, light theme
(only theme the funnel ships).

## Out of scope

- Jobs tab (`AutoApplyJobsView`) itself — already has this interaction; not touched.
- Focus trap / `aria-modal` on the mobile sheet (see keyboard note).
- Scroll-position persistence between list and panel.
