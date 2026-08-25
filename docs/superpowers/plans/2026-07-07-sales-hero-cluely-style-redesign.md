# Sales Hero Cluely-Style Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the sales/enterprise landing page hero into a realistic composited call+overlay mockup, and add two new below-the-fold sections (a two-step "listens/assists" explainer and a stealth-themed icon trust row), per the design spec.

**Architecture:** `LiveOverlayDemo` (already shipped) gains two optional props (`variant`, `forceStatic`) so its existing animation logic can be reused in three different visual contexts without duplication. A new presentational `CallBackground` component provides the illustrated call-tile background for the hero. All new JSX lives in `EnterpriseCopilotLanding.tsx`.

**Tech Stack:** React 18 + TypeScript, Tailwind, lucide-react icons, Vitest + Testing Library.

## Global Constraints

- Sales/enterprise landing page only (`src/pages/marketing/EnterpriseCopilotLanding.tsx`) — do not touch `CopilotLanding.tsx` or `ExamCopilotLanding.tsx`.
- No real photos — all visuals are CSS/Tailwind shapes, no new image assets.
- Colors: navy `#08285c` / `#0b1530` / `#0c1d48` and teal `#2dd4bf` for all decorative/theme/accent surfaces — no new brand palette. This does not forbid small universal semantic UI colors already used elsewhere on this page (red for a call-end/hang-up button or a recording indicator, matching the existing traffic-light dots and the real product's own "End Call" styling) — those are conventional affordances, not brand-palette choices. User confirmed this reading explicitly when a reviewer flagged `bg-red-500` on the hero's hang-up button as a conflict.
- Trust-row copy is stealth-forward (explicit user decision) — do not soften wording during implementation.
- `LiveOverlayDemo`'s existing 4 tests must keep passing unmodified — no existing assertion may need to change.
- `tsconfig.app.json` has `noUnusedLocals: true` — no unused imports/constants left behind.
- The existing "Built for rolling out a whole team" feature grid stays unchanged, further down the page.

---

### Task 1: `LiveOverlayDemo` — `variant` and `forceStatic` props

**Files:**
- Modify: `src/components/marketing/LiveOverlayDemo.tsx` (full file)
- Test: `src/components/marketing/LiveOverlayDemo.test.tsx` (add 2 tests)

**Interfaces:**
- Produces: `LiveOverlayDemo(props?: { variant?: 'panel' | 'card'; forceStatic?: boolean })`. `variant` defaults to `'panel'` (new floating-panel chrome, no props needed for existing default `<LiveOverlayDemo />` call sites elsewhere — wait, there are no other call sites yet outside this component's own tests; Task 3/4 will use both variants explicitly). `'card'` renders the original traffic-light-dot chrome exactly as shipped this session. `forceStatic` (default `false`) freezes the frame on `TURNS[0]`'s fully-typed state with no timers armed, same visual result as the existing reduced-motion path.

- [ ] **Step 1: Write the two new failing tests**

Add to the end of `src/components/marketing/LiveOverlayDemo.test.tsx`, inside the existing `describe('LiveOverlayDemo', ...)` block, right before the final closing `})`:

```tsx
  it('variant="card" renders the original badge chrome; the default panel variant does not', () => {
    const { unmount } = render(<LiveOverlayDemo variant="card" />)
    expect(screen.getByText('Live call')).toBeInTheDocument()
    unmount()

    render(<LiveOverlayDemo />)
    expect(screen.queryByText('Live call')).not.toBeInTheDocument()
  })

  it('forceStatic freezes the frame immediately without animating', () => {
    render(<LiveOverlayDemo forceStatic />)
    expect(screen.getByText(/more than we budgeted/i)).toBeInTheDocument()
    expect(screen.getByText('Suggested Response')).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `npx vitest run src/components/marketing/LiveOverlayDemo.test.tsx`
Expected: the 4 pre-existing tests still PASS; the 2 new tests FAIL — `variant`/`forceStatic` props don't exist yet, so `'card'` renders the current (only) chrome, which already has `Live call` in it — meaning the first new test's *second* half (`queryByText('Live call')).not.toBeInTheDocument()` after a plain `<LiveOverlayDemo />`) is the one that fails, since today's only chrome always renders `Live call`. The `forceStatic` test fails because passing an unknown prop has no effect — the component still starts animating from an empty string, so `more than we budgeted` and `Suggested Response` are not present synchronously.

- [ ] **Step 3: Replace the whole component file**

Replace all of `src/components/marketing/LiveOverlayDemo.tsx` with:

```tsx
import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'

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

export function LiveOverlayDemo({
  variant = 'panel',
  forceStatic = false,
}: { variant?: 'panel' | 'card'; forceStatic?: boolean } = {}) {
  const reducedMotion = usePrefersReducedMotion()
  const frozen = reducedMotion || forceStatic
  const [turnIndex, setTurnIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('listening')
  const [qDisplayed, setQDisplayed] = useState('')
  const [aDisplayed, setADisplayed] = useState('')
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (frozen) return

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
  }, [phase, turnIndex, frozen])

  const stageIndex = phase === 'hold' ? Math.min(turnIndex + 1, DEAL_STAGES.length - 1) : turnIndex
  const statusText: Record<Phase, string> = {
    listening: 'Listening to customer...',
    processing: 'Preparing response...',
    answering: 'Coaching...',
    hold: 'Coaching...',
  }

  const displayedQ = frozen ? TURNS[0].q : qDisplayed
  const displayedA = frozen ? TURNS[0].a : aDisplayed
  const displayedStageIndex = frozen ? 0 : stageIndex
  const displayedStatus = frozen ? statusText.answering : statusText[phase]

  const dealStageTracker = (
    <span className="flex items-center gap-1">
      {DEAL_STAGES.map((stage, i) => (
        <span
          key={stage}
          className="h-1.5 w-1.5 rounded-full transition-colors"
          style={{ background: i <= displayedStageIndex ? ACCENT : 'rgba(255,255,255,0.15)' }}
        />
      ))}
    </span>
  )

  const qaContent = (
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
  )

  if (variant === 'card') {
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
          <span className="ml-auto">{dealStageTracker}</span>
        </div>

        <p className="mb-4 text-[11px] italic text-white/40">{displayedStatus}</p>

        {qaContent}
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1530]/95 p-5 shadow-2xl shadow-slate-900/40 backdrop-blur"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] italic text-white/40">{displayedStatus}</p>
        {dealStageTracker}
      </div>

      {qaContent}

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <span className="flex-1 text-xs text-white/35">Ask about your screen or conversation...</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/50">Smart</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: ACCENT }}>
          <Send className="h-3 w-3 text-[#0b1530]" />
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify all 6 pass**

Run: `npx vitest run src/components/marketing/LiveOverlayDemo.test.tsx`
Expected: PASS (6 tests), pristine output.

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/LiveOverlayDemo.tsx src/components/marketing/LiveOverlayDemo.test.tsx
git commit -m "feat: add variant and forceStatic props to LiveOverlayDemo"
```

---

### Task 2: `CallBackground` component

**Files:**
- Create: `src/components/marketing/CallBackground.tsx`
- Test: `src/components/marketing/CallBackground.test.tsx`

**Interfaces:**
- Produces: `export function CallBackground(): JSX.Element` — no props, no state, purely presentational.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/marketing/CallBackground.test.tsx
import { render, screen } from '@testing-library/react'
import { CallBackground } from './CallBackground'

describe('CallBackground', () => {
  it('renders both call-tile name badges', () => {
    render(<CallBackground />)
    expect(screen.getByText('You')).toBeInTheDocument()
    expect(screen.getByText('Prospect')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/marketing/CallBackground.test.tsx`
Expected: FAIL — `Cannot find module './CallBackground'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/components/marketing/CallBackground.tsx
import { Mic, Phone, Video } from 'lucide-react'

function CallTile({ name, gradient }: { name: string; gradient: string }) {
  return (
    <div className="relative flex items-end justify-center pb-10" style={{ background: gradient }}>
      <div className="flex flex-col items-center">
        <div className="h-11 w-11 rounded-full bg-white/15" />
        <div className="-mt-1 h-9 w-20 rounded-t-full bg-white/10" />
      </div>
      <span
        className="absolute bottom-2 left-2 rounded px-2 py-1 text-[10px] font-medium text-white"
        style={{ background: 'rgba(0,0,0,0.45)' }}
      >
        {name}
      </span>
    </div>
  )
}

export function CallBackground() {
  return (
    <div aria-hidden="true" className="relative h-full w-full overflow-hidden" style={{ background: '#0c1d48' }}>
      <div className="grid h-full grid-cols-2 gap-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <CallTile name="You" gradient="linear-gradient(160deg, #1a2f5c 0%, #0c1d48 100%)" />
        <CallTile name="Prospect" gradient="linear-gradient(160deg, #14294f 0%, #0a1836 100%)" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex h-9 items-center justify-center gap-2.5" style={{ background: 'rgba(10,20,45,0.85)' }}>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
          <Mic className="h-3 w-3 text-white/70" />
        </span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
          <Video className="h-3 w-3 text-white/70" />
        </span>
        <span className="flex h-6 w-14 items-center justify-center rounded-full bg-red-500">
          <Phone className="h-3 w-3 rotate-[135deg] text-white" />
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/marketing/CallBackground.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/CallBackground.tsx src/components/marketing/CallBackground.test.tsx
git commit -m "feat: add CallBackground illustrated call-tile component"
```

---

### Task 3: Hero — composited call mockup

**Files:**
- Modify: `src/pages/marketing/EnterpriseCopilotLanding.tsx` (imports + hero visual block)

**Interfaces:**
- Consumes: `LiveOverlayDemo` (default `variant='panel'`, no props needed) from Task 1; `CallBackground` (no props) from Task 2.

- [ ] **Step 1: Update the imports**

In `src/pages/marketing/EnterpriseCopilotLanding.tsx`, replace:

```tsx
import { ArrowRight, Check, Database, Headphones, UserPlus } from 'lucide-react'
```

with:

```tsx
import { ArrowRight, Check, ChevronDown, Database, Headphones, Square, UserPlus } from 'lucide-react'
```

Add this import alongside the existing `LiveOverlayDemo` import (keep both):

```tsx
import { LiveOverlayDemo } from '@/components/marketing/LiveOverlayDemo'
import { CallBackground } from '@/components/marketing/CallBackground'
```

- [ ] **Step 2: Replace the hero visual block**

Find this block (the current hero visual):

```tsx
          <div className="mt-14 flex justify-center">
            <LiveOverlayDemo />
          </div>
```

Replace it with:

```tsx
          <div className="mt-16 flex justify-center px-4">
            <div className="relative w-full max-w-3xl">
              <div className="absolute -top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full px-3 py-1.5 shadow-lg" style={{ background: '#0c1d48' }}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: '#2dd4bf' }}>
                  <span className="h-2 w-2 rounded-full bg-[#0c1d48]" />
                </span>
                <span className="text-xs font-semibold text-white">Hide</span>
                <ChevronDown className="h-3 w-3 text-white/50" />
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded bg-white/10">
                  <Square className="h-2.5 w-2.5 fill-white/70 text-white/70" />
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
                <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="mx-auto text-xs font-semibold text-slate-400">Zoom — Sales Call</span>
                </div>
                <div className="relative h-[360px] sm:h-[420px]">
                  <CallBackground />
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <LiveOverlayDemo />
                  </div>
                </div>
              </div>
            </div>
          </div>
```

- [ ] **Step 3: Run the page's existing test to confirm nothing broke**

Run: `npx vitest run src/pages/marketing/CopilotWaitlistLanding.test.tsx`
Expected: PASS (all 3 tests) — this test's enterprise case already asserts `Suggested Response` renders, which it still does inside the new markup (same `LiveOverlayDemo` panel-variant call, unchanged props).

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -i "EnterpriseCopilotLanding\|CallBackground\|LiveOverlayDemo"`
Expected: no output (empty). This filters out the pre-existing unrelated vitest-globals noise in that command's full output (a known false-positive from running `tsconfig.app.json` in isolation — the real build, `npm run build`, is the authoritative check and does not have this noise) and isolates errors relevant to this task's files.

- [ ] **Step 5: Commit**

```bash
git add src/pages/marketing/EnterpriseCopilotLanding.tsx
git commit -m "feat: composite realistic call+overlay mockup for the sales hero"
```

---

### Task 4: Two-step explainer section + trust row section

**Files:**
- Modify: `src/pages/marketing/EnterpriseCopilotLanding.tsx`

**Interfaces:**
- Consumes: `LiveOverlayDemo` with `variant="card" forceStatic` (Task 1) for the explainer's right card.

- [ ] **Step 1: Update the failing test first**

Add this assertion inside the existing `'hides enterprise pricing and footer copy in waitlist mode'` test in `src/pages/marketing/CopilotWaitlistLanding.test.tsx`, right after the `waitFor(...)` block that checks for `'Suggested Response'` (added in the earlier session):

```tsx
    expect(screen.getByRole('heading', { name: 'Sales Closer AI listens in to the call' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Undetectable, every call' })).toBeInTheDocument()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/marketing/CopilotWaitlistLanding.test.tsx`
Expected: FAIL — neither heading exists yet.

- [ ] **Step 3: Insert the two new sections**

In `src/pages/marketing/EnterpriseCopilotLanding.tsx`, find this line:

```tsx
      <ProofStrip items={PROOF} tone="light" />
```

Immediately after it (before the next `<section id="features"...>`), insert:

```tsx

      {/* HOW IT HELPS — two-step listen/assist explainer */}
      <section className="border-t border-slate-100 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900">How Sales Closer AI helps during a call</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl p-8 text-white" style={{ background: '#08285c' }}>
              <h3 className="text-lg font-bold">Sales Closer AI listens in to the call</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">It picks up context in real time, so it's ready the moment you need it.</p>
              <div className="mt-8 text-center">
                <p className="text-4xl font-black">00:16</p>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-xs font-medium text-white/60">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                  Recording
                </p>
              </div>
              <div className="mt-6 flex h-10 items-end justify-center gap-[3px]">
                {[6, 10, 14, 8, 18, 12, 20, 9, 15, 7, 19, 11, 16, 8, 13, 20, 10, 17, 6, 14, 9, 18, 12, 7, 15, 11, 19, 8].map((h, i) => (
                  <span key={i} className="w-1 rounded-full" style={{ height: h, background: '#2dd4bf' }} />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">When you need help, it assists you instantly</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Hit the shortcut and get a live suggested response, pulled from your own playbook.</p>
              <div className="mt-6 flex justify-center">
                <LiveOverlayDemo variant="card" forceStatic />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST ROW — stealth-forward, icon-based */}
      <section className="border-t border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Undetectable, every call</h2>
          <p className="mt-3 text-sm text-slate-600">Your prospect never knows it's there.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3">
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase text-slate-400">You see</p>
                  <div className="h-14 rounded-lg" style={{ background: '#0b1530' }} />
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase text-slate-400">They see</p>
                  <div className="h-14 rounded-lg bg-slate-200" />
                </div>
              </div>
              <h3 className="mt-4 font-bold text-slate-900">Invisible to screen share</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">Share your screen mid-call — the panel never appears in what they see.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
              <div className="relative mt-3 h-10 rounded-xl bg-slate-50 p-4">
                <div className="mt-1 h-1 rounded-full bg-slate-200" />
                <div className="absolute left-[38%] top-2 flex -translate-x-1/2 flex-col items-center">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#2dd4bf' }} />
                  <span className="mt-1 text-[10px] font-semibold text-teal-600">here</span>
                </div>
                <div className="absolute left-[85%] top-2 flex -translate-x-1/2 flex-col items-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="mt-1 text-[10px] text-slate-400">too late</span>
                </div>
              </div>
              <h3 className="mt-8 font-bold text-slate-900">Live during the call, not after it</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">Coaching happens in the moment that decides the deal.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase text-slate-400">Participants (2)</p>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">No AI detected</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2.5 w-3/4 rounded bg-slate-200" />
                  <div className="h-2.5 w-1/2 rounded bg-slate-200" />
                </div>
              </div>
              <h3 className="mt-4 font-bold text-slate-900">No bots, no footprint</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">Sales Closer AI never joins the call or shows up in the participant list.</p>
            </div>
          </div>
        </div>
      </section>
```

Do not remove or modify anything else in the file — this is a pure insertion between the `<ProofStrip .../>` line and the existing `<section id="features"...>` line.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/marketing/CopilotWaitlistLanding.test.tsx`
Expected: PASS (all 3 tests).

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -i "EnterpriseCopilotLanding\|CallBackground\|LiveOverlayDemo"`
Expected: no output (empty) — see Task 3 Step 4 for why this filtered command is the right check here instead of the raw command's full output.

- [ ] **Step 6: Commit**

```bash
git add src/pages/marketing/EnterpriseCopilotLanding.tsx src/pages/marketing/CopilotWaitlistLanding.test.tsx
git commit -m "feat: add two-step explainer and stealth-themed trust row sections"
```

---

### Task 5: Full-suite verification

**Files:** None (verification only).

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run`
Expected: PASS — all test files green, including the 2 files from Tasks 1-2 and the 1 file modified in Tasks 3-4. Total test count will have grown by 3 (2 new `LiveOverlayDemo` tests + 1 new `CallBackground` test) plus 2 new assertions inside an existing test, from the 106 passing at the start of this plan.

- [ ] **Step 2: Run the real build**

Run: `npm run build`
Expected: succeeds with no TypeScript errors and no new warnings beyond the pre-existing "chunk size" warning. This is the authoritative typecheck (see Task 3 Step 4's note on why the isolated `tsc -p tsconfig.app.json` command is noisy and not authoritative on its own).

- [ ] **Step 3: Commit if anything changed**

If Steps 1-2 required no fixes, there is nothing to commit here — this task is verification-only. If a fix was needed, commit it with a message describing what broke and why (e.g. `fix: <description>`), then re-run Steps 1-2 to confirm.

---

### Task 6: Visual verification in the browser

**Files:** None (verification only).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (leave running in the background; do not kill it afterward)

- [ ] **Step 2: Open the sales waitlist page**

Navigate to `http://localhost:5173/copilot/enterprise?waitlist` (adjust port if the dev server logs a different one).

- [ ] **Step 3: Check the hero**

Confirm: a browser-chrome-style frame with traffic-light dots and a "Zoom — Sales Call" label, containing a 2-tile illustrated call background ("You" / "Prospect" name badges, bottom call-control bar), with the floating dark overlay panel centered on top showing the live typing animation (prospect line → "Preparing response..." → "Suggested Response" answer → loops). A small pill reading "Hide ▾ ■" floats just above the frame's top edge.

- [ ] **Step 4: Check the two new sections**

Scroll down past the proof strip. Confirm the "How Sales Closer AI helps during a call" section renders two cards (navy "listens" card with a timer + waveform, white "assists" card with a static/frozen copy of the overlay panel showing the fully-typed first exchange). Below that, confirm the "Undetectable, every call" section renders 3 cards with their mini mockups (You-see/They-see split, a "here"/"too late" timeline, and a participants list with a "No AI detected" badge).

- [ ] **Step 5: Confirm the rest of the page is unaffected**

Scroll through the rest of the page and confirm the existing "Built for rolling out a whole team" feature grid, case studies, admin dashboard preview, pricing, FAQ, and waitlist form all still render exactly as before, with no visual regressions and no console errors.

