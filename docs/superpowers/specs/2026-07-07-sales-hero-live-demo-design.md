# Sales waitlist landing hero: looping live-overlay demo

## Problem

The enterprise/sales landing page (`/copilot/enterprise`, used as the sales
waitlist page via `?waitlist`) leans on a static text card (`LiveTranscriptCard`)
in the hero to show "AI answers live during the call." Feedback: nobody reads
paragraph text above the fold — the strongest selling point (an invisible
overlay feeding reps answers in real time) needs to be *seen* happening, not
described. Text should be captions, not the explanation.

## Scope

Sales/enterprise landing page hero only (`src/pages/marketing/EnterpriseCopilotLanding.tsx`).
Not touching `CopilotLanding.tsx` or `ExamCopilotLanding.tsx`, and not adding a
second below-the-fold visual section — those are separate follow-ups if wanted
later.

## Approach

Build a new component, `LiveOverlayDemo`, that replaces `LiveTranscriptCard` in
the hero. Same dark "mini app window" chrome (traffic-light dots, badge with
pulsing dot) for visual continuity with the rest of the page. Instead of static
lines, it autoplays a scripted 3-turn sales call on an infinite loop:

1. **Listening** — customer objection line types in character-by-character
   (reusing the typing-effect timing pattern from the existing desktop Copilot
   prototype's `SalesLiveCanvas`).
2. **Preparing response** — brief pulsing-dots state.
3. **Answering** — AI's suggested response types in under a "Suggested
   Response" label with a blue accent border, matching the real product's
   visual language.
4. A small 3-step deal-stage tracker (Discovery → Demo → Negotiation) advances
   one step per completed turn.
5. After turn 3, the whole sequence resets to turn 1 and repeats. Runs forever
   — no user interaction, no controls, no end state.

Content: 3 short customer/response pairs adapted from the existing
`MOCK_SALES_QA` bank in `DesktopCopilotPreview.tsx` (kept as a local constant
in the new component — not importing from that page, which is a large
interactive prototype, not a shared module).

Accessibility: component is `aria-hidden` decorative (the real information —
"live AI coaching during calls" — is already stated in the surrounding heading
and copy). Respects `prefers-reduced-motion`: renders the first turn's final
state statically instead of animating/looping.

Timers (`setInterval`/`setTimeout`) clean up on unmount, matching the existing
pattern in `DesktopCopilotPreview.tsx`, so it doesn't leak or misbehave under
the existing `CopilotWaitlistLanding.test.tsx` render/unmount cycle.

## Out of scope

- No literal `.gif`/video file — this ships as a live component (no ffmpeg/
  Playwright install needed; see design discussion — user confirmed this
  approach over a captured-video pipeline).
- Copilot and Exam Ghost landing pages.
- A second scroll-depth visual section (raised in feedback, not part of this task).

## Testing

Extend `CopilotWaitlistLanding.test.tsx` (or a sibling test) to assert the new
component renders without throwing and shows the first turn's customer line,
consistent with existing test conventions in that file (render via
`MemoryRouter`, assert on visible text).
