# Desktop Copilot Auth + Pricing Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Insert a Sign Up/Sign In step and a Pricing/Payment flow between Onboarding and use-case access in the desktop Copilot prototype, so that what a user buys (or was invited to) determines which use case(s) they can reach — per [2026-06-24-desktop-copilot-pricing-design.md](../specs/2026-06-24-desktop-copilot-pricing-design.md).

**Architecture:** Two new config modules (`plans.ts` parallel to the existing `useCases.ts`) and three new screen components (`SignInScreen`, `PricingScreen`, `PaymentScreen`) live in `src/pages/desktopCopilot/` as standalone files — a deliberate exception to the "one big file" convention, justified because `DesktopCopilotPreview.tsx` has grown to 1236 lines and these are genuinely new, independently testable units. The existing `UseCaseSelectionScreen` (inside `DesktopCopilotPreview.tsx`) gains a filter prop instead of being replaced. The orchestrator's view-state machine is extended, not rebuilt.

**Tech Stack:** React 18 + TypeScript, Vite, Tailwind CSS, lucide-react icons, Vitest + React Testing Library.

## Global Constraints

- Client-side mock prototype — no real payment processing, auth backend, or invite/org validation. Any non-empty, well-formed input succeeds, matching the rest of this prototype's mocked validation.
- Visual tokens (`BG`, `CARD`, `BORDER`, `INPUT_BG`, `INPUT_BD`, `BLUE`) must be reused, never redefined, in every new file.
- Test style: React Testing Library `render`/`screen`/`fireEvent`; `vi` imported explicitly from `'vitest'` (matches `src/hooks/useAgentSession.test.ts`); every test file starts with a `// path/to/file` comment as its first line.
- Genuinely new, standalone modules (not modifications to `DesktopCopilotPreview.tsx`'s existing screens) get their own co-located test file, e.g. `useCases.ts` → `useCases.test.ts`. Modifications to existing screens inside `DesktopCopilotPreview.tsx` get their tests appended to the existing `src/pages/DesktopCopilotPreview.test.tsx`.
- Run `npm test -- --run` after every task to confirm the full suite passes, not just the new test. A baseline of 5 pre-existing, unrelated failures exists in `useAuth.test.tsx`/`StudentProfilePage.test.tsx` — confirm the failure count never exceeds that baseline.
- Do not push to any git remote during task execution — commits are local-only until the whole plan passes final review (push happens once, at the very end).

---

### Task 1: Extract shared primitives into `desktopCopilot/shared.tsx`

**Files:**
- Create: `src/pages/desktopCopilot/shared.tsx`
- Create: `src/pages/desktopCopilot/shared.test.tsx`
- Modify: `src/pages/DesktopCopilotPreview.tsx:1-101` (imports, design tokens, `formatTime`, `LightningLogo`, `MacWindow`, `Toggle` — locate by the `// Design tokens`, `// Lightforth lightning logo`, `// Mac Window Frame`, and `// Toggle` comments; exact line numbers may have drifted slightly)

**Interfaces:**
- Produces: `BG`, `CARD`, `BORDER`, `INPUT_BG`, `INPUT_BD`, `BLUE` (string constants), `formatTime(s: number): string`, `LightningLogo({ size }: { size?: number })`, `MacWindow({ children, blendBar, transparency }: ...)`, `Toggle({ on, onToggle }: { on: boolean; onToggle: () => void })`. Tasks 4, 5, 6 import the design tokens from `./shared` (relative to files inside `src/pages/desktopCopilot/`); `DesktopCopilotPreview.tsx` imports everything from `./desktopCopilot/shared`.

This is a pure move — no behavior change. The "test" for the move itself is that the full existing `DesktopCopilotPreview.test.tsx` suite (22 tests) still passes unchanged after the move.

- [ ] **Step 1: Write the failing test for the new module**

```tsx
// src/pages/desktopCopilot/shared.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { formatTime, MacWindow, Toggle } from './shared'

describe('formatTime', () => {
  it('formats seconds as mm:ss, zero-padded', () => {
    expect(formatTime(65)).toBe('01:05')
    expect(formatTime(5)).toBe('00:05')
  })
})

describe('MacWindow', () => {
  it('renders its children inside the window frame', () => {
    render(<MacWindow><p>Hello</p></MacWindow>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})

describe('Toggle', () => {
  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<Toggle on={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/pages/desktopCopilot/shared.test.tsx`
Expected: FAIL — `Cannot find module './shared'`

- [ ] **Step 3: Create `shared.tsx`**

```tsx
// src/pages/desktopCopilot/shared.tsx
import { cn } from '@/lib/utils'

export const BG       = '#0c1d48'
export const CARD     = 'rgba(255,255,255,0.07)'
export const BORDER   = 'rgba(255,255,255,0.12)'
export const INPUT_BG = 'rgba(255,255,255,0.08)'
export const INPUT_BD = 'rgba(255,255,255,0.15)'
export const BLUE     = '#1a7aff'

export function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

export function LightningLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M19 3L7 18H16L13 29L25 14H16L19 3Z" fill="#60a5fa" />
      <path d="M19 3L16 14H25L19 3Z" fill="#1a7aff" />
    </svg>
  )
}

export function MacWindow({ children, blendBar, transparency = 0 }: { children: React.ReactNode; blendBar?: boolean; transparency?: number }) {
  const bgAlpha = (100 - transparency) / 100
  const windowBg = `rgba(12, 29, 72, ${bgAlpha})`

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{ background: 'linear-gradient(145deg, #060e22 0%, #0a1628 50%, #050c1e 100%)' }}
    >
      <div
        className="flex w-full max-w-[960px] flex-col overflow-hidden rounded-2xl shadow-2xl transition-all duration-150"
        style={{ background: windowBg, height: 700, backdropFilter: `blur(${Math.round(transparency / 10)}px)` }}
      >
        <div
          className="flex h-10 flex-shrink-0 items-center px-4"
          style={{ background: blendBar ? windowBg : `rgba(0,0,0,${0.15 * bgAlpha + 0.05})` }}
        >
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="h-3 w-3 rounded-full" style={{ background: '#ffbd2e' }} />
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={cn('relative flex h-6 w-10 flex-shrink-0 items-center rounded-full px-0.5 transition-colors duration-200', on ? 'bg-green-500' : 'bg-white/20')}>
      <div className={cn('h-5 w-5 rounded-full bg-white shadow transition-transform duration-200', on ? 'translate-x-4' : 'translate-x-0')} />
    </button>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run src/pages/desktopCopilot/shared.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Update `DesktopCopilotPreview.tsx` to import from `shared.tsx` and delete the local duplicates**

Replace lines 1-101 (from the top of the file through the end of the `Toggle` function, i.e. everything before the `// Screen 0: Splash` comment) with:

```tsx
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Bell, Check, ChevronDown, ExternalLink, FileText, HelpCircle, Mic, Play, Settings, Sparkles, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getUseCase, USE_CASES, type UseCaseId } from './desktopCopilot/useCases'
import { BG, CARD, BORDER, INPUT_BG, INPUT_BD, BLUE, formatTime, LightningLogo, MacWindow, Toggle } from './desktopCopilot/shared'

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const MOCK_QA = [
  { speaker: 'Interviewer', q: "Can you tell me a little bit about yourself and your background?", a: "I'm a product designer and manager with over 6 years of experience building digital products across fintech, crypto, and AI spaces. I've shipped 12 live applications and led cross-functional teams from ideation all the way to launch. What drives me is the intersection of user empathy and business impact — I love creating products that are not just beautiful but genuinely solve real problems for real people." },
  { speaker: 'Interviewer', q: "What would you say is your greatest professional strength?", a: "My greatest strength is owning the full product lifecycle. I can sit in a strategy meeting in the morning, run a user research session in the afternoon, and review a design prototype by evening. That end-to-end ownership reduces handoff friction and speeds up delivery. I've used this to cut time-to-market by over 40% on my last two major products." },
  { speaker: 'Interviewer', q: "What are some areas where you feel you could still improve?", a: "Earlier in my career I focused heavily on execution without always ensuring long-term strategy and scalability were equally prioritized. I've since adopted frameworks like RICE and MoSCoW to balance short-term wins with long-term vision. I've also been intentional about improving how I communicate across larger cross-functional teams as they scale." },
  { speaker: 'Interviewer', q: "Why are you interested in this role and our company specifically?", a: "I've been following your company's trajectory closely. The focus on emerging markets and user-centric innovation aligns deeply with the work I've been doing in Africa's fintech ecosystem. What drew me most is the mission — building products that matter in markets often underserved by traditional tech. I believe my background positions me to contribute meaningfully from day one." },
  { speaker: 'Interviewer', q: "Can you walk me through how you approach a brand new product or feature?", a: "I start with the problem, not the solution. I run discovery sessions — user interviews, competitive analysis, data review — to understand the pain point deeply. From there I map out user journeys, define success metrics, and ideate collaboratively with engineering and design. I prototype early, test with real users, and iterate before any major development investment. The key is keeping the user at the centre at every stage." },
  { speaker: 'Interviewer', q: "Tell me about a time you had a conflict with a stakeholder. How did you handle it?", a: "On one project a senior stakeholder wanted to ship a feature I believed would hurt retention based on our research. Instead of pushing back directly, I prepared a data brief showing the risk alongside two alternative approaches that met their business goal differently. We aligned on a smaller version of the feature with a 30-day review gate. It shipped, performed well, and actually strengthened the relationship." },
  { speaker: 'Interviewer', q: "How do you prioritize features when you have limited time and resources?", a: "I use a combination of RICE scoring and stakeholder alignment sessions. RICE helps me quantify reach, impact, confidence, and effort objectively. But I pair that with qualitative input from customer success and sales — they often catch signals the data misses. The output is a ranked backlog everyone can see and challenge transparently. It removes a lot of the politics from prioritization." },
  { speaker: 'Interviewer', q: "How do you measure the success of a product or feature after it launches?", a: "Success starts with defining the right metrics before launch — not after. I work with the team to agree on a north star metric and two to three supporting KPIs tied directly to the problem we set out to solve. Post-launch I review these weekly for the first month, then monthly. I also run qualitative follow-ups with users to catch anything the numbers don't show." },
  { speaker: 'Interviewer', q: "Where do you see yourself professionally in the next three to five years?", a: "I see myself leading product strategy at a company building something with genuine societal impact — either as a VP of Product or a founder. I'm deeply interested in how AI can be layered into product experiences to make them smarter and more personalised. I'm also passionate about building and mentoring strong product teams, not just shipping great products myself." },
  { speaker: 'Interviewer', q: "Do you have any questions for us about the role or the team?", a: "Yes, a few. First — what does success look like for this role in the first 90 days? Second — how does the product team collaborate with engineering and design today, and where do you see room to improve that? And third — what's the biggest unsolved problem the product team is wrestling with right now? That last one tells me a lot about where I'd be spending my energy." },
]

const MOCK_RESUMES = [
  { name: 'Darnell Smith', role: 'Product Manager', date: '1st Jun, 2026' },
  { name: 'Darnell Smith', role: 'UI/UX Designer', date: '15th Apr, 2026' },
  { name: 'Darnell Smith', role: 'Software Engineer', date: '3rd Jan, 2026' },
]

type DesktopView = 'splash' | 'onboarding' | 'select-use-case' | 'setup' | 'live' | 'complete'
type CopilotStatus = 'listening' | 'processing' | 'answering'

// ---------------------------------------------------------------------------
```

(The blank `// ---------------------------------------------------------------------------` line at the end matches the divider that already precedes `// Screen 0: Splash` in the file — leave that divider and everything from `// Screen 0: Splash` onward untouched.)

- [ ] **Step 6: Run the full existing suite to confirm no regressions**

Run: `npm test -- --run src/pages/DesktopCopilotPreview.test.tsx`
Expected: PASS, same 22 tests as before this task — this confirms the move changed nothing observable

- [ ] **Step 7: Commit**

```bash
git add src/pages/desktopCopilot/shared.tsx src/pages/desktopCopilot/shared.test.tsx src/pages/DesktopCopilotPreview.tsx
git commit -m "refactor: extract shared design tokens and primitives into desktopCopilot/shared.tsx"
```

---

### Task 2: `plans.ts` config module

**Files:**
- Create: `src/pages/desktopCopilot/plans.ts`
- Create: `src/pages/desktopCopilot/plans.test.ts`

**Interfaces:**
- Consumes: `UseCaseId` from `./useCases` (Task 1 of the prior plan, already exists)
- Produces: `PlanId` (type), `PlanConfig` (interface), `PLANS: PlanConfig[]`, `getPlan(id: PlanId): PlanConfig`. Tasks 5, 6, 7 import these.

- [ ] **Step 1: Write the failing test**

```ts
// src/pages/desktopCopilot/plans.test.ts
import { describe, it, expect } from 'vitest'
import { PLANS, getPlan } from './plans'

describe('plans config', () => {
  it('has PRO, Premium, and Exam in order', () => {
    expect(PLANS.map(p => p.id)).toEqual(['pro', 'premium', 'exam'])
  })

  it('PRO and Premium both unlock interview, coding, and meeting', () => {
    for (const id of ['pro', 'premium'] as const) {
      expect(getPlan(id).unlockedUseCases).toEqual(['interview', 'coding', 'meeting'])
    }
  })

  it('Exam unlocks only exam', () => {
    expect(getPlan('exam').unlockedUseCases).toEqual(['exam'])
  })

  it('throws for an unknown plan id', () => {
    expect(() => getPlan('unknown' as never)).toThrow('Unknown plan: unknown')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/pages/desktopCopilot/plans.test.ts`
Expected: FAIL — `Cannot find module './plans'`

- [ ] **Step 3: Write the implementation**

```ts
// src/pages/desktopCopilot/plans.ts
import type { UseCaseId } from './useCases'

export type PlanId = 'pro' | 'premium' | 'exam'

export interface PlanConfig {
  id: PlanId
  label: string
  priceLabel: string
  description: string
  unlockedUseCases: UseCaseId[]
}

export const PLANS: PlanConfig[] = [
  {
    id: 'pro',
    label: 'PRO',
    priceLabel: '$49/mo',
    description: '50 credits — Interview, Coding, and Meeting Copilot, 1 credit per session',
    unlockedUseCases: ['interview', 'coding', 'meeting'],
  },
  {
    id: 'premium',
    label: 'Premium',
    priceLabel: '$79/mo',
    description: '100 credits — Interview, Coding, and Meeting Copilot, 1 credit per session',
    unlockedUseCases: ['interview', 'coding', 'meeting'],
  },
  {
    id: 'exam',
    label: 'Exam',
    priceLabel: '$500 one-time',
    description: 'Unlimited exam sessions, pay once',
    unlockedUseCases: ['exam'],
  },
]

export function getPlan(id: PlanId): PlanConfig {
  const found = PLANS.find(p => p.id === id)
  if (!found) throw new Error(`Unknown plan: ${id}`)
  return found
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run src/pages/desktopCopilot/plans.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/desktopCopilot/plans.ts src/pages/desktopCopilot/plans.test.ts
git commit -m "feat: add plans config module for desktop Copilot pricing"
```

---

### Task 3: Scope `UseCaseSelectionScreen` with a `useCaseIds` filter

**Files:**
- Modify: `src/pages/DesktopCopilotPreview.tsx` (the `// Screen 1b: Use-Case Selection` section, `UseCaseSelectionScreen` function)
- Modify: `src/pages/DesktopCopilotPreview.test.tsx` (the `describe('UseCaseSelectionScreen', ...)` block)

**Interfaces:**
- Consumes: `USE_CASES` from `./desktopCopilot/useCases` (already imported)
- Produces: `export function UseCaseSelectionScreen({ useCaseIds, onSelect }: { useCaseIds: UseCaseId[]; onSelect: (id: UseCaseId) => void })`. Task 7 (orchestrator) passes `useCaseIds` from the selected plan's `unlockedUseCases`.

- [ ] **Step 1: Update the existing tests to pass the new required prop, and add a filtering test**

Replace the `describe('UseCaseSelectionScreen', ...)` block in `src/pages/DesktopCopilotPreview.test.tsx` with:

```tsx
describe('UseCaseSelectionScreen', () => {
  it('renders only the cards for the given useCaseIds', () => {
    render(<UseCaseSelectionScreen useCaseIds={['interview', 'coding', 'meeting']} onSelect={() => {}} />)
    expect(screen.getByText('Interview')).toBeInTheDocument()
    expect(screen.getByText('Coding')).toBeInTheDocument()
    expect(screen.getByText('Meeting')).toBeInTheDocument()
    expect(screen.queryByText('Sales Call')).not.toBeInTheDocument()
    expect(screen.queryByText('Exam')).not.toBeInTheDocument()
  })

  it('renders all 5 cards when all 5 ids are passed', () => {
    render(<UseCaseSelectionScreen useCaseIds={['interview', 'sales-call', 'meeting', 'exam', 'coding']} onSelect={() => {}} />)
    expect(screen.getByText('Interview')).toBeInTheDocument()
    expect(screen.getByText('Sales Call')).toBeInTheDocument()
    expect(screen.getByText('Meeting')).toBeInTheDocument()
    expect(screen.getByText('Exam')).toBeInTheDocument()
    expect(screen.getByText('Coding')).toBeInTheDocument()
  })

  it('calls onSelect with the chosen use case id', () => {
    const onSelect = vi.fn()
    render(<UseCaseSelectionScreen useCaseIds={['interview', 'sales-call']} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Sales Call'))
    expect(onSelect).toHaveBeenCalledWith('sales-call')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run src/pages/DesktopCopilotPreview.test.tsx`
Expected: FAIL — `UseCaseSelectionScreen` doesn't accept `useCaseIds` yet, and renders all 5 unconditionally

- [ ] **Step 3: Update `UseCaseSelectionScreen`**

Replace the function with:

```tsx
export function UseCaseSelectionScreen({ useCaseIds, onSelect }: { useCaseIds: UseCaseId[]; onSelect: (id: UseCaseId) => void }) {
  const useCases = USE_CASES.filter(uc => useCaseIds.includes(uc.id))
  return (
    <div className="flex min-h-[580px] flex-col items-center px-12 py-10" style={{ background: BG }}>
      <h1 className="mb-3 text-center text-3xl font-bold text-white">What are you using Copilot for?</h1>
      <p className="mb-10 max-w-lg text-center text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Choose a use case to tailor how Copilot listens and responds.
      </p>
      <div className="grid w-full max-w-[700px] grid-cols-2 gap-3">
        {useCases.map(uc => {
          const Icon = uc.icon
          return (
            <button
              key={uc.id}
              onClick={() => onSelect(uc.id)}
              className="flex items-start gap-3 rounded-xl p-4 text-left transition-colors hover:bg-white/10"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: 'rgba(26,122,255,0.2)' }}>
                <Icon className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{uc.label}</p>
                <p className="mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{uc.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- --run src/pages/DesktopCopilotPreview.test.tsx`
Expected: PASS (the orchestrator's own call site will now have a type error from the missing `useCaseIds` prop — that's expected and fixed in Task 7, not this task's concern; confirm via `npx tsc --noEmit -p tsconfig.app.json` that the only new error is at that one call site)

- [ ] **Step 5: Commit**

```bash
git add src/pages/DesktopCopilotPreview.tsx src/pages/DesktopCopilotPreview.test.tsx
git commit -m "feat: scope UseCaseSelectionScreen to a useCaseIds filter"
```

---

### Task 4: `SignInScreen`

**Files:**
- Create: `src/pages/desktopCopilot/SignInScreen.tsx`
- Create: `src/pages/desktopCopilot/SignInScreen.test.tsx`

**Interfaces:**
- Consumes: `BG`, `INPUT_BG`, `INPUT_BD`, `BLUE` from `./shared` (Task 1)
- Produces: `export interface SignInResult { hasInviteCode: boolean }`, `export function SignInScreen({ onContinue }: { onContinue: (result: SignInResult) => void })`. Task 7 consumes this.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/pages/desktopCopilot/SignInScreen.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { SignInScreen } from './SignInScreen'

describe('SignInScreen', () => {
  it('defaults to sign-up mode with confirm password, no invite code field', () => {
    render(<SignInScreen onContinue={() => {}} />)
    expect(screen.getByText('Create your account')).toBeInTheDocument()
    expect(screen.getByText('Confirm password')).toBeInTheDocument()
    expect(screen.queryByText('Invite code')).not.toBeInTheDocument()
  })

  it('switches to enterprise mode when "I have an invite code" is clicked', () => {
    render(<SignInScreen onContinue={() => {}} />)
    fireEvent.click(screen.getByText('I have an invite code'))
    expect(screen.getByText('Enterprise Sign In')).toBeInTheDocument()
    expect(screen.getByText('Invite code')).toBeInTheDocument()
    expect(screen.queryByText('Confirm password')).not.toBeInTheDocument()
  })

  it('calls onContinue with hasInviteCode true after filling the enterprise form', () => {
    const onContinue = vi.fn()
    render(<SignInScreen onContinue={onContinue} />)
    fireEvent.click(screen.getByText('I have an invite code'))
    fireEvent.change(screen.getByPlaceholderText('Enter your invite code'), { target: { value: 'ENT123' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'rep@acme.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))
    expect(onContinue).toHaveBeenCalledWith({ hasInviteCode: true })
  })

  it('calls onContinue with hasInviteCode false after filling the sign-up form', () => {
    const onContinue = vi.fn()
    render(<SignInScreen onContinue={onContinue} />)
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'me@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))
    expect(onContinue).toHaveBeenCalledWith({ hasInviteCode: false })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run src/pages/desktopCopilot/SignInScreen.test.tsx`
Expected: FAIL — `Cannot find module './SignInScreen'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/desktopCopilot/SignInScreen.tsx
import { useState } from 'react'
import { BG, INPUT_BG, INPUT_BD, BLUE } from './shared'

type SignInMode = 'signup' | 'signin' | 'enterprise'

export interface SignInResult {
  hasInviteCode: boolean
}

export function SignInScreen({ onContinue }: { onContinue: (result: SignInResult) => void }) {
  const [mode, setMode] = useState<SignInMode>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')

  const inputStyle = { background: INPUT_BG, border: `1px solid ${INPUT_BD}`, color: 'white', outline: 'none' } as const

  const canContinue =
    mode === 'enterprise' ? inviteCode.trim().length > 0 && email.trim().length > 0 && password.length > 0 :
    mode === 'signup' ? email.trim().length > 0 && password.length > 0 && password === confirmPassword :
    email.trim().length > 0 && password.length > 0

  const heading =
    mode === 'enterprise' ? 'Enterprise Sign In' :
    mode === 'signup' ? 'Create your account' :
    'Welcome back'

  return (
    <div className="flex min-h-[580px] flex-col items-center px-12 py-10" style={{ background: BG }}>
      <h1 className="mb-3 text-center text-3xl font-bold text-white">{heading}</h1>
      <p className="mb-8 max-w-lg text-center text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {mode === 'enterprise'
          ? 'Sign in with the invite code and credentials provided by your organization admin.'
          : 'Sign in or create an account to continue to Lightforth Copilot.'}
      </p>

      <div className="w-full max-w-sm space-y-4">
        {mode === 'enterprise' && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">Invite code</label>
            <input
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value)}
              placeholder="Enter your invite code"
              className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
              style={inputStyle}
            />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold text-white">Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
            style={inputStyle}
          />
        </div>

        {mode === 'signup' && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
              style={inputStyle}
            />
          </div>
        )}

        <button
          onClick={() => { if (canContinue) onContinue({ hasInviteCode: mode === 'enterprise' }) }}
          className="h-11 w-full rounded-xl text-sm font-bold text-white transition-opacity"
          style={{ background: BLUE, opacity: canContinue ? 1 : 0.45 }}
        >
          Continue
        </button>

        {mode !== 'enterprise' && (
          <>
            <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
              <button
                onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                className="font-semibold text-blue-400 hover:underline"
              >
                {mode === 'signup' ? 'Sign in' : 'Create one'}
              </button>
            </p>
            <p className="text-center text-sm">
              <button onClick={() => setMode('enterprise')} className="font-semibold text-blue-400 hover:underline">
                I have an invite code
              </button>
            </p>
          </>
        )}

        {mode === 'enterprise' && (
          <p className="text-center text-sm">
            <button onClick={() => setMode('signin')} className="font-semibold text-blue-400 hover:underline">
              ← Use regular sign in instead
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- --run src/pages/desktopCopilot/SignInScreen.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/desktopCopilot/SignInScreen.tsx src/pages/desktopCopilot/SignInScreen.test.tsx
git commit -m "feat: add SignInScreen with enterprise invite-code mode"
```

---

### Task 5: `PricingScreen`

**Files:**
- Create: `src/pages/desktopCopilot/PricingScreen.tsx`
- Create: `src/pages/desktopCopilot/PricingScreen.test.tsx`

**Interfaces:**
- Consumes: `PLANS`, `type PlanId` from `./plans` (Task 2); `BG`, `CARD`, `BORDER`, `BLUE` from `./shared` (Task 1)
- Produces: `export function PricingScreen({ onSelect }: { onSelect: (id: PlanId) => void })`. Task 7 consumes this.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/pages/desktopCopilot/PricingScreen.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { PricingScreen } from './PricingScreen'

describe('PricingScreen', () => {
  it('renders PRO, Premium, and Exam cards with their price labels', () => {
    render(<PricingScreen onSelect={() => {}} />)
    expect(screen.getByText('PRO')).toBeInTheDocument()
    expect(screen.getByText('$49/mo')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
    expect(screen.getByText('$79/mo')).toBeInTheDocument()
    expect(screen.getByText('Exam')).toBeInTheDocument()
    expect(screen.getByText('$500 one-time')).toBeInTheDocument()
  })

  it('calls onSelect with the chosen plan id', () => {
    const onSelect = vi.fn()
    render(<PricingScreen onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Choose Premium'))
    expect(onSelect).toHaveBeenCalledWith('premium')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run src/pages/desktopCopilot/PricingScreen.test.tsx`
Expected: FAIL — `Cannot find module './PricingScreen'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/desktopCopilot/PricingScreen.tsx
import { PLANS, type PlanId } from './plans'
import { BG, CARD, BORDER, BLUE } from './shared'

export function PricingScreen({ onSelect }: { onSelect: (id: PlanId) => void }) {
  return (
    <div className="flex min-h-[580px] flex-col items-center px-12 py-10" style={{ background: BG }}>
      <h1 className="mb-3 text-center text-3xl font-bold text-white">Choose your plan</h1>
      <p className="mb-10 max-w-lg text-center text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Pick the plan that matches what you need Copilot for.
      </p>
      <div className="grid w-full max-w-[820px] grid-cols-3 gap-4">
        {PLANS.map(plan => (
          <div
            key={plan.id}
            className="flex flex-col rounded-2xl p-5"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}
          >
            <p className="text-sm font-semibold text-white">{plan.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{plan.priceLabel}</p>
            <p className="mt-2 flex-1 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {plan.description}
            </p>
            <button
              onClick={() => onSelect(plan.id)}
              className="mt-4 h-10 w-full rounded-xl text-sm font-bold text-white hover:opacity-90"
              style={{ background: BLUE }}
            >
              Choose {plan.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- --run src/pages/desktopCopilot/PricingScreen.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/desktopCopilot/PricingScreen.tsx src/pages/desktopCopilot/PricingScreen.test.tsx
git commit -m "feat: add PricingScreen with PRO/Premium/Exam cards"
```

---

### Task 6: `PaymentScreen`

**Files:**
- Create: `src/pages/desktopCopilot/PaymentScreen.tsx`
- Create: `src/pages/desktopCopilot/PaymentScreen.test.tsx`

**Interfaces:**
- Consumes: `getPlan`, `type PlanId` from `./plans` (Task 2); `BG`, `CARD`, `BORDER`, `INPUT_BG`, `INPUT_BD`, `BLUE` from `./shared` (Task 1)
- Produces: `export function PaymentScreen({ planId, onPaid, onBack }: { planId: PlanId; onPaid: () => void; onBack: () => void })`. Task 7 consumes this.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/pages/desktopCopilot/PaymentScreen.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { PaymentScreen } from './PaymentScreen'

describe('PaymentScreen', () => {
  it('shows the correct purchase summary for the given plan', () => {
    render(<PaymentScreen planId="pro" onPaid={() => {}} onBack={() => {}} />)
    expect(screen.getByText('$49/mo — PRO Plan')).toBeInTheDocument()
  })

  it('disables Pay until all card fields are filled, then calls onPaid', () => {
    const onPaid = vi.fn()
    render(<PaymentScreen planId="exam" onPaid={onPaid} onBack={() => {}} />)
    const payButton = screen.getByText('Pay $500 one-time')
    fireEvent.click(payButton)
    expect(onPaid).not.toHaveBeenCalled()

    fireEvent.change(screen.getByPlaceholderText('1234 1234 1234 1234'), { target: { value: '4242424242424242' } })
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/30' } })
    fireEvent.change(screen.getByPlaceholderText('123'), { target: { value: '123' } })
    fireEvent.click(payButton)
    expect(onPaid).toHaveBeenCalledTimes(1)
  })

  it('calls onBack when Back is clicked', () => {
    const onBack = vi.fn()
    render(<PaymentScreen planId="premium" onPaid={() => {}} onBack={onBack} />)
    fireEvent.click(screen.getByText('← Back'))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run src/pages/desktopCopilot/PaymentScreen.test.tsx`
Expected: FAIL — `Cannot find module './PaymentScreen'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/desktopCopilot/PaymentScreen.tsx
import { useState } from 'react'
import { getPlan, type PlanId } from './plans'
import { BG, CARD, BORDER, INPUT_BG, INPUT_BD, BLUE } from './shared'

export function PaymentScreen({ planId, onPaid, onBack }: { planId: PlanId; onPaid: () => void; onBack: () => void }) {
  const plan = getPlan(planId)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  const inputStyle = { background: INPUT_BG, border: `1px solid ${INPUT_BD}`, color: 'white', outline: 'none' } as const
  const canPay = cardNumber.trim().length > 0 && expiry.trim().length > 0 && cvc.trim().length > 0

  return (
    <div className="flex min-h-[580px] flex-col items-center px-12 py-10" style={{ background: BG }}>
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="mb-4 text-sm font-semibold text-blue-400 hover:underline">
          ← Back
        </button>
        <h1 className="mb-2 text-2xl font-bold text-white">Confirm payment</h1>
        <p className="mb-6 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {plan.priceLabel} — {plan.label} Plan
        </p>

        <div className="space-y-4 rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">Card number</label>
            <input
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              placeholder="1234 1234 1234 1234"
              className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
              style={inputStyle}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-white">Expiry</label>
              <input
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                placeholder="MM/YY"
                className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                style={inputStyle}
              />
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-white">CVC</label>
              <input
                value={cvc}
                onChange={e => setCvc(e.target.value)}
                placeholder="123"
                className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => { if (canPay) onPaid() }}
          className="mt-5 h-11 w-full rounded-xl text-sm font-bold text-white transition-opacity"
          style={{ background: BLUE, opacity: canPay ? 1 : 0.45 }}
        >
          Pay {plan.priceLabel}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- --run src/pages/desktopCopilot/PaymentScreen.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/desktopCopilot/PaymentScreen.tsx src/pages/desktopCopilot/PaymentScreen.test.tsx
git commit -m "feat: add PaymentScreen with mock card form"
```

---

### Task 7: Wire Sign-In → Pricing → Payment into the orchestrator

**Files:**
- Modify: `src/pages/DesktopCopilotPreview.tsx` (the `DesktopView` type, and the default-exported `DesktopCopilotPreview` function from the `// Main` comment to end of file)
- Modify: `src/pages/DesktopCopilotPreview.test.tsx` (the `describe('DesktopCopilotPreview end to end', ...)` block — two existing tests must be rewritten because they assumed Onboarding led straight to the use-case picker; one new test is added)

**Interfaces:**
- Consumes: every export from Tasks 1-6 (`SignInScreen`, `SignInResult`, `PricingScreen`, `PaymentScreen`, `PLANS`, `getPlan`, `PlanId` from `./desktopCopilot/plans`; `UseCaseSelectionScreen`'s new `useCaseIds` prop from Task 3)
- Produces: the default export `DesktopCopilotPreview`, unchanged signature (no props) — this is the route component, nothing downstream of it in the app.

- [ ] **Step 1: Rewrite the two existing end-to-end tests and add one new test**

In `src/pages/DesktopCopilotPreview.test.tsx`, find the `describe('DesktopCopilotPreview end to end', ...)` block. Replace its two `it(...)` tests with:

```tsx
  it('walks from splash through sign-up, pricing, and payment to the Exam setup screen', async () => {
    render(<DesktopCopilotPreview />)
    await act(async () => { vi.advanceTimersByTime(2300) })
    expect(screen.getByText('Welcome to Lightforth Co-Pilot')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Continue'))
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'me@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))
    expect(screen.getByText('Choose your plan')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Choose Exam'))
    fireEvent.change(screen.getByPlaceholderText('1234 1234 1234 1234'), { target: { value: '4242424242424242' } })
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/30' } })
    fireEvent.change(screen.getByPlaceholderText('123'), { target: { value: '123' } })
    fireEvent.click(screen.getByText('Pay $500 one-time'))

    expect(screen.getByText('Subject')).toBeInTheDocument()
    expect(screen.queryByText('Select Audio')).not.toBeInTheDocument()
  })

  it('a PRO purchase shows the scoped picker (no Exam) and routes Coding to the screenshot canvas', async () => {
    render(<DesktopCopilotPreview />)
    await act(async () => { vi.advanceTimersByTime(2300) })
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'me@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))

    fireEvent.click(screen.getByText('Choose PRO'))
    fireEvent.change(screen.getByPlaceholderText('1234 1234 1234 1234'), { target: { value: '4242424242424242' } })
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/30' } })
    fireEvent.change(screen.getByPlaceholderText('123'), { target: { value: '123' } })
    fireEvent.click(screen.getByText('Pay $49/mo'))

    expect(screen.getByText('What are you using Copilot for?')).toBeInTheDocument()
    expect(screen.queryByText('Exam')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Coding'))
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('Confirm'))
    expect(screen.getByText(/Press Space to capture/)).toBeInTheDocument()
  })

  it('an invite code at sign-in skips Pricing and goes straight to Sales Call setup', async () => {
    render(<DesktopCopilotPreview />)
    await act(async () => { vi.advanceTimersByTime(2300) })
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('I have an invite code'))
    fireEvent.change(screen.getByPlaceholderText('Enter your invite code'), { target: { value: 'ENT123' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'rep@acme.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))

    expect(screen.queryByText('Choose your plan')).not.toBeInTheDocument()
    expect(screen.getByText('Customer / Company name')).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run src/pages/DesktopCopilotPreview.test.tsx`
Expected: FAIL — the orchestrator still routes Onboarding's Continue straight to `select-use-case` with no Sign-In/Pricing/Payment steps

- [ ] **Step 3: Update the `DesktopView` type**

Find `type DesktopView = 'splash' | 'onboarding' | 'select-use-case' | 'setup' | 'live' | 'complete'` and replace with:

```tsx
type DesktopView = 'splash' | 'onboarding' | 'sign-in' | 'pricing' | 'payment' | 'select-use-case' | 'setup' | 'live' | 'complete'
```

- [ ] **Step 4: Add the new imports**

At the top of the file, alongside the existing `./desktopCopilot/useCases` and `./desktopCopilot/shared` imports, add:

```tsx
import { getPlan, type PlanId } from './desktopCopilot/plans'
import { SignInScreen } from './desktopCopilot/SignInScreen'
import { PricingScreen } from './desktopCopilot/PricingScreen'
import { PaymentScreen } from './desktopCopilot/PaymentScreen'
```

- [ ] **Step 5: Replace the default-exported orchestrator**

Replace the whole `// Main` section (the `export default function DesktopCopilotPreview()` block at the end of the file) with:

```tsx
// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
export default function DesktopCopilotPreview() {
  const [view, setView] = useState<DesktopView>('splash')
  const [useCase, setUseCase] = useState<UseCaseId>('interview')
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro')
  const [primaryLabel, setPrimaryLabel] = useState('')
  const [transparency, setTransparency] = useState(0)
  const [returnView, setReturnView] = useState<DesktopView>('select-use-case')

  const config = getUseCase(useCase)

  return (
    <MacWindow
      blendBar={
        view === 'splash' || view === 'onboarding' || view === 'sign-in' ||
        view === 'pricing' || view === 'payment' || view === 'select-use-case' || view === 'complete'
      }
      transparency={view === 'live' ? transparency : 0}
    >
      {view === 'splash'     && <SplashScreen     onDone={() => setView('onboarding')} />}
      {view === 'onboarding' && <OnboardingScreen onContinue={() => setView('sign-in')} />}
      {view === 'sign-in' && (
        <SignInScreen
          onContinue={({ hasInviteCode }) => {
            if (hasInviteCode) {
              setUseCase('sales-call')
              setReturnView('sign-in')
              setView('setup')
            } else {
              setView('pricing')
            }
          }}
        />
      )}
      {view === 'pricing' && (
        <PricingScreen onSelect={id => { setSelectedPlan(id); setView('payment') }} />
      )}
      {view === 'payment' && (
        <PaymentScreen
          planId={selectedPlan}
          onBack={() => setView('pricing')}
          onPaid={() => {
            const plan = getPlan(selectedPlan)
            if (plan.unlockedUseCases.length > 1) {
              setReturnView('pricing')
              setView('select-use-case')
            } else {
              setUseCase(plan.unlockedUseCases[0])
              setReturnView('pricing')
              setView('setup')
            }
          }}
        />
      )}
      {view === 'select-use-case' && (
        <UseCaseSelectionScreen
          useCaseIds={getPlan(selectedPlan).unlockedUseCases}
          onSelect={id => { setUseCase(id); setReturnView('select-use-case'); setView('setup') }}
        />
      )}
      {view === 'setup' && (
        <SetupScreen
          useCaseId={useCase}
          onBack={() => setView(returnView)}
          onContinue={label => { setPrimaryLabel(label); setView('live') }}
        />
      )}
      {view === 'live' && config.canvasPattern === 'conversational' && (
        <LiveCanvas
          useCaseId={useCase as 'interview' | 'sales-call' | 'meeting'}
          primaryLabel={primaryLabel}
          onEnd={() => setView('complete')}
          onBack={() => setView(returnView)}
          transparency={transparency}
          onTransparencyChange={setTransparency}
        />
      )}
      {view === 'live' && config.canvasPattern === 'screenshot-qa' && (
        <ScreenshotCanvas
          useCaseId={useCase as 'exam' | 'coding'}
          primaryLabel={primaryLabel}
          onEnd={() => setView('complete')}
          onBack={() => setView(returnView)}
          transparency={transparency}
          onTransparencyChange={setTransparency}
        />
      )}
      {view === 'complete' && <CompleteScreen useCaseId={useCase} onGoHome={() => setView('splash')} />}
    </MacWindow>
  )
}
```

Note: `onBack` on `SetupScreen`/`LiveCanvas`/`ScreenshotCanvas` now reads from `returnView` instead of the previous hardcoded `'select-use-case'` literal — this fixes a real bug the new flow would otherwise introduce (clicking "back" from the Exam or Sales Call setup/canvas would have landed on a use-case picker scoped to the wrong plan, or one that doesn't include Sales Call at all).

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- --run src/pages/DesktopCopilotPreview.test.tsx`
Expected: PASS, all tests in the file

- [ ] **Step 7: Run the full suite and the type checker**

Run: `npm test -- --run`
Expected: PASS, with only the same 5 known pre-existing failures (`useAuth.test.tsx`, `StudentProfilePage.test.tsx`) — confirm no new failures

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: no errors in any file this plan touched (`DesktopCopilotPreview.tsx`, `useCases.ts`, `plans.ts`, `shared.tsx`, `SignInScreen.tsx`, `PricingScreen.tsx`, `PaymentScreen.tsx`)

- [ ] **Step 8: Manual verification**

Run: `npm run dev`, open `/desktop-copilot-preview`, and walk both paths end to end:
- Splash → Onboarding → Sign Up (fill email/password/confirm) → Pricing (3 cards) → choose PRO → mock payment → scoped picker (Interview/Coding/Meeting only) → pick one → Setup → Preference → Canvas → Complete
- Splash → Onboarding → click "I have an invite code" → fill invite code/email/password → straight to Sales Call Setup (no Pricing screen shown)

- [ ] **Step 9: Commit**

```bash
git add src/pages/DesktopCopilotPreview.tsx src/pages/DesktopCopilotPreview.test.tsx
git commit -m "feat: wire Sign-In, Pricing, and Payment into the orchestrator"
```

---

## Plan Self-Review

**Spec coverage:** Sign Up/Sign In with invite-code toggle (Task 4), Pricing screen with 3 plan cards (Task 5), mock Payment screen reused across PRO/Premium/Exam (Task 6), `UseCaseSelectionScreen` scoped to a plan's unlocked use cases (Task 3), enterprise invite-code path skipping Pricing entirely and landing on Sales Call's existing Setup screen as the "dashboard" (Task 7), full orchestrator wiring (Task 7). The shared-primitives extraction (Task 1) and `plans.ts` config module (Task 2) are foundational infrastructure the spec implies but doesn't name directly. Out-of-scope items from the spec (real payment/auth backend, credits-remaining indicator, dedicated Sales Dashboard, Knowledge Center) are correctly not implemented here.

**Type consistency:** `PlanId`, `PlanConfig`, `PLANS`, `getPlan` (Task 2) are consumed identically in Tasks 5, 6, 7. `SignInResult` (Task 4) matches how Task 7's `onContinue` callback destructures `{ hasInviteCode }`. `UseCaseSelectionScreen`'s `useCaseIds` prop (Task 3) matches how Task 7 calls it with `getPlan(selectedPlan).unlockedUseCases`. `PaymentScreen`'s `{ planId, onPaid, onBack }` (Task 6) matches Task 7's call site exactly.

**No placeholders:** every step shows complete code, not descriptions.
