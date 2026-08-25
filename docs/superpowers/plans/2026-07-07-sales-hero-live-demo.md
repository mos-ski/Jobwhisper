# Sales Hero Live Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static hero transcript card on the sales/enterprise waitlist landing page with a looping, autoplaying animated recreation of the live-coaching overlay, so the page's strongest selling point is seen in action instead of described in text.

**Architecture:** One new self-contained presentational component, `LiveOverlayDemo`, driven by `setInterval`/`setTimeout` state machine (mirrors the timing pattern already used in `src/pages/DesktopCopilotPreview.tsx`'s `SalesLiveCanvas`), swapped into the hero of `EnterpriseCopilotLanding.tsx` in place of the existing `LiveTranscriptCard`.

**Tech Stack:** React 18 + TypeScript, Tailwind classes (matching existing marketing components), Vitest + Testing Library (existing project setup).

## Global Constraints

- Sales/enterprise landing page hero only — do not modify `CopilotLanding.tsx` or `ExamCopilotLanding.tsx`.
- No literal video/gif asset — this ships as a live React component (per approved design in `docs/superpowers/specs/2026-07-07-sales-hero-live-demo-design.md`).
- Component must be decorative (`aria-hidden="true"`) and must render a static, non-animating frame when `prefers-reduced-motion: reduce` is set.
- All timers must clean up on unmount (no leaks under the existing `CopilotWaitlistLanding.test.tsx` render/unmount cycle).
- Loop forever — 3 scripted turns, then reset to turn 1, indefinitely. No end state, no user controls.

---

### Task 1: `LiveOverlayDemo` component

**Files:**
- Create: `src/components/marketing/LiveOverlayDemo.tsx`
- Test: `src/components/marketing/LiveOverlayDemo.test.tsx`

**Interfaces:**
- Produces: `export function LiveOverlayDemo(): JSX.Element` — no props. All content (the 3 sales-call turns, accent color `#2dd4bf`, badge text `"Live call"`) is internal to the component, matching the values `EnterpriseCopilotLanding.tsx` currently passes into `LiveTranscriptCard`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/marketing/LiveOverlayDemo.test.tsx
import { act, render, screen, waitFor } from '@testing-library/react'
import { LiveOverlayDemo } from './LiveOverlayDemo'

describe('LiveOverlayDemo', () => {
  it('renders the customer line typing in during the listening phase', async () => {
    render(<LiveOverlayDemo />)

    await waitFor(() => {
      expect(screen.getByText(/Prospect/i)).toBeInTheDocument()
      expect(screen.getByText(/more than we budgeted/i)).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('shows the AI suggested response after the processing phase completes', async () => {
    render(<LiveOverlayDemo />)

    await waitFor(() => {
      expect(screen.getByText('Suggested Response')).toBeInTheDocument()
    }, { timeout: 4000 })
  })

  it('does not leak timers after unmount', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { unmount } = render(<LiveOverlayDemo />)
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })
    unmount()
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200))
    })
    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
```

Note on timers: this component chains `setInterval`/`setTimeout` across separate React effect re-renders, and empirically, vitest's fake-timer engine (`vi.useFakeTimers()` + `advanceTimersByTime`/`advanceTimersByTimeAsync`) does not reliably cascade through this chain in this project's vitest version — both a single large advance and several small chained advances were tried and produced flaky or stuck results. Use **real timers** instead: `waitFor` (which polls the DOM and wraps each poll in `act` internally) for assertions that need the animation to progress, and an explicit `act(async () => { await new Promise(resolve => setTimeout(resolve, N)) })` for any other real-time wait (a bare `await new Promise(setTimeout)` with no `act` wrapper triggers a "not wrapped in act" warning, since real timers fire real state updates the test isn't wrapping). This makes the suite ~3s slower but fully deterministic — confirmed with 4 consecutive clean runs before finalizing this plan.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/marketing/LiveOverlayDemo.test.tsx`
Expected: FAIL — `Cannot find module './LiveOverlayDemo'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/components/marketing/LiveOverlayDemo.tsx
import { useEffect, useRef, useState } from 'react'

const ACCENT = '#2dd4bf'
const BADGE = 'Live call'

type Phase = 'listening' | 'processing' | 'answering' | 'hold'

interface Turn {
  q: string
  a: string
}

const TURNS: Turn[] = [
  {
    q: "It's more than we budgeted for this year.",
    a: 'Reframe around the cost of staying put — ask what the status quo is actually costing them per month.',
  },
  {
    q: "What makes you different from your current tool?",
    a: 'We integrate natively with your existing stack — no migration needed. A similar customer cut onboarding time by 60%.',
  },
  {
    q: 'Can you send a proposal by end of week?',
    a: "Confirm and create urgency: I'll have it in your inbox by Thursday — want 30 minutes Friday to walk through it?",
  },
]

const DEAL_STAGES = ['Discovery', 'Demo', 'Negotiation']

const TYPE_MS = 22
const HOLD_AFTER_ANSWER_MS = 1800
const PROCESSING_MS = 1100

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    query.addEventListener?.('change', handler)
    return () => query.removeEventListener?.('change', handler)
  }, [])
  return reduced
}

export function LiveOverlayDemo() {
  const reducedMotion = usePrefersReducedMotion()
  const [turnIndex, setTurnIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('listening')
  const [qDisplayed, setQDisplayed] = useState('')
  const [aDisplayed, setADisplayed] = useState('')
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (reducedMotion) return

    const clearTimers = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    const turn = TURNS[turnIndex]

    if (phase === 'listening') {
      setADisplayed('')
      let i = 0
      intervalRef.current = setInterval(() => {
        i++
        setQDisplayed(turn.q.slice(0, i))
        if (i >= turn.q.length) {
          clearTimers()
          timeoutRef.current = setTimeout(() => setPhase('processing'), 500)
        }
      }, TYPE_MS)
    } else if (phase === 'processing') {
      timeoutRef.current = setTimeout(() => setPhase('answering'), PROCESSING_MS)
    } else if (phase === 'answering') {
      let i = 0
      intervalRef.current = setInterval(() => {
        i += 3
        setADisplayed(turn.a.slice(0, i))
        if (i >= turn.a.length) {
          clearTimers()
          timeoutRef.current = setTimeout(() => setPhase('hold'), HOLD_AFTER_ANSWER_MS)
        }
      }, TYPE_MS)
    } else {
      timeoutRef.current = setTimeout(() => {
        setQDisplayed('')
        setADisplayed('')
        setTurnIndex(i => (i + 1) % TURNS.length)
        setPhase('listening')
      }, 400)
    }

    return clearTimers
  }, [phase, turnIndex, reducedMotion])

  const stageIndex = phase === 'hold' ? Math.min(turnIndex + 1, DEAL_STAGES.length - 1) : turnIndex
  const statusText: Record<Phase, string> = {
    listening: 'Listening to customer...',
    processing: 'Preparing response...',
    answering: 'Coaching...',
    hold: 'Coaching...',
  }

  const displayedQ = reducedMotion ? TURNS[0].q : qDisplayed
  const displayedA = reducedMotion ? TURNS[0].a : aDisplayed
  const displayedStageIndex = reducedMotion ? 0 : stageIndex
  const displayedStatus = reducedMotion ? statusText.answering : statusText[phase]

  return (
    <div
      aria-hidden="true"
      className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0b1530] p-5 shadow-2xl shadow-slate-900/30"
    >
      <div className="mb-5 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
          {BADGE}
        </span>
        <span className="ml-auto flex items-center gap-1">
          {DEAL_STAGES.map((stage, i) => (
            <span
              key={stage}
              className="h-1.5 w-1.5 rounded-full transition-colors"
              style={{ background: i <= displayedStageIndex ? ACCENT : 'rgba(255,255,255,0.15)' }}
            />
          ))}
        </span>
      </div>

      <p className="mb-4 text-[11px] italic text-white/40">{displayedStatus}</p>

      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/35">Prospect</p>
          <p className="mt-1.5 text-sm leading-relaxed text-white/65">{displayedQ}</p>
        </div>
        {displayedA && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>Suggested Response</p>
            <p className="mt-1.5 text-sm leading-relaxed text-white">{displayedA}</p>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/marketing/LiveOverlayDemo.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/LiveOverlayDemo.tsx src/components/marketing/LiveOverlayDemo.test.tsx
git commit -m "feat: add looping live-overlay demo component for marketing pages"
```

---

### Task 2: Wire into the sales/enterprise landing hero

**Files:**
- Modify: `src/pages/marketing/EnterpriseCopilotLanding.tsx:1-7` (imports), `:103-116` (hero visual)
- Modify: `src/pages/marketing/CopilotWaitlistLanding.test.tsx` (add one assertion)

**Interfaces:**
- Consumes: `LiveOverlayDemo` from Task 1 (`src/components/marketing/LiveOverlayDemo.tsx`), no props.

- [ ] **Step 1: Update the failing test first**

`LiveOverlayDemo` needs its typing animation to elapse in real time before "Suggested Response" appears. Task 1 found that this project's vitest fake-timer engine does not reliably cascade through this component's chained `setInterval`/`setTimeout` sequence (verified empirically — both single and chained fake-timer advances got stuck) — use real timers with `waitFor` instead, exactly as `LiveOverlayDemo.test.tsx` (from Task 1) already does. Replace the whole `'hides enterprise pricing and footer copy in waitlist mode'` test in `src/pages/marketing/CopilotWaitlistLanding.test.tsx` with:

```tsx
  it('hides enterprise pricing and footer copy in waitlist mode', async () => {
    renderAt('/copilot/enterprise?waitlist', <EnterpriseCopilotLanding />)

    expect(screen.getByRole('heading', { name: 'Join the waitlist' })).toBeInTheDocument()
    expect(screen.getByText('Be first in line when Lightforth Sales Copilot opens up. Drop your email and we\'ll reach out directly.')).toBeInTheDocument()
    expect(screen.queryByText(/\$5,000/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/\$79/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Simple, per-seat pricing' })).not.toBeInTheDocument()
    expect(screen.queryByText(/Lightforth\. All rights reserved\./)).not.toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Suggested Response')).toBeInTheDocument()
    }, { timeout: 4000 })
  })
```

And add `waitFor` to the existing `@testing-library/react` import at the top of the file:

```tsx
import { render, screen, waitFor } from '@testing-library/react'
```

This makes the test itself `async` (note the `async ()` on the `it(...)` callback) and takes a few real seconds to run, matching the cost already accepted for `LiveOverlayDemo.test.tsx` in Task 1. `'Suggested Response'` is the label the new `LiveOverlayDemo` puts over the AI answer line; the old `LiveTranscriptCard` it replaces never renders that string (it labels the answer with the speaker name instead), so this assertion only passes once Step 3 is done.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/marketing/CopilotWaitlistLanding.test.tsx`
Expected: FAIL — `Unable to find an element with the text: Suggested Response`

- [ ] **Step 3: Replace the hero import and JSX**

In `src/pages/marketing/EnterpriseCopilotLanding.tsx`, replace this import:

```tsx
import { LiveTranscriptCard } from '@/components/marketing/LiveTranscriptCard'
```

with:

```tsx
import { LiveOverlayDemo } from '@/components/marketing/LiveOverlayDemo'
```

Then replace the hero visual block:

```tsx
          <div className="mt-14 flex justify-center">
            <LiveTranscriptCard
              accent={ACCENT}
              badge="Live call"
              lines={[
                { speaker: 'Prospect', text: "It's more than we budgeted for this year." },
                {
                  speaker: 'Sales Closer AI',
                  text: 'Reframe around the cost of staying put — ask what the status quo is actually costing them per month...',
                  isAnswer: true,
                },
              ]}
            />
          </div>
```

with:

```tsx
          <div className="mt-14 flex justify-center">
            <LiveOverlayDemo />
          </div>
```

Then check whether `ACCENT` (`const ACCENT = '#2dd4bf'`, near the top of the file) has any other usages: `grep -n "ACCENT" src/pages/marketing/EnterpriseCopilotLanding.tsx`. This project has `noUnusedLocals: true` in `tsconfig.app.json:20`, so an unused top-level `const` is a **build error**, not just a style nit — if the grep shows only the declaration line left, delete that declaration line entirely.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/marketing/CopilotWaitlistLanding.test.tsx`
Expected: PASS (all 3 tests in the file, including the new assertion). This test takes a few real seconds (the `waitFor` genuinely waits for the animation) — that's expected, not a hang.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: no errors. This specifically catches an unused `ACCENT` if Step 3's cleanup was missed.

- [ ] **Step 6: Commit**

```bash
git add src/pages/marketing/EnterpriseCopilotLanding.tsx src/pages/marketing/CopilotWaitlistLanding.test.tsx
git commit -m "feat: swap static hero transcript card for looping live demo on sales landing page"
```

---

### Task 3: Visual verification in the browser

**Files:** None (verification only).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (leave running in the background; do not kill it afterward)

- [ ] **Step 2: Open the sales waitlist page**

Navigate to `http://localhost:5173/copilot/enterprise?waitlist` (adjust port if the dev server logs a different one).

- [ ] **Step 3: Watch one full loop**

Confirm: the prospect line types in, a brief "Preparing response..." pause happens, the AI suggested response types in under a teal "Suggested Response" label, the 3-dot deal-stage indicator advances, and after the 3rd exchange it resets back to turn 1 and repeats — indefinitely, with no console errors.

- [ ] **Step 4: Confirm the rest of the page is unaffected**

Scroll through the full page and confirm every other section (proof strip, features, case studies, admin dashboard preview, FAQ, waitlist form) still renders as before.
