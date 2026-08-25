# Desktop Copilot Multi Use-Case Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the desktop Copilot prototype (`src/pages/DesktopCopilotPreview.tsx`) from a single Interview use case to five use cases (Interview, Sales Call, Exam, Coding, Meeting), each with tailored setup fields and one of two Live Canvas interaction patterns, plus an Auto Respond toggle that lets either the user (Space bar) or the AI drive the response cycle.

**Architecture:** A single `UseCaseConfig` data module (`src/pages/desktopCopilot/useCases.ts`) drives use-case metadata (label, icon, setup fields, canvas pattern, complete-screen copy). The existing single-file prototype pattern is preserved — all screen components stay inside `DesktopCopilotPreview.tsx` as named-exported functions (for testability), generalized to read from this config instead of hardcoding "Interview" everywhere. Two Live Canvas variants exist: `LiveCanvas` (conversational: Interview/Sales Call/Meeting) and a new `ScreenshotCanvas` (Exam/Coding).

**Tech Stack:** React 18 + TypeScript, Vite, Tailwind CSS, lucide-react icons, Vitest + React Testing Library.

## Global Constraints

- This is a client-side mock prototype — no real audio/screen capture or AI backend. All "AI" behavior is simulated with mock data and timers, exactly as the existing Interview flow does today.
- Follow the existing single-file convention in `DesktopCopilotPreview.tsx`: screen components are named-exported functions in one file, not split into separate component files. Only the use-case config (`useCases.ts`) is a separate module, since it's shared data, not a screen.
- Match existing visual tokens exactly: `BG = '#0c1d48'`, `CARD`, `BORDER`, `INPUT_BG`, `INPUT_BD`, `BLUE = '#1a7aff'` (all defined at the top of `DesktopCopilotPreview.tsx`) — reuse them, don't redefine.
- Test style: React Testing Library `render`/`screen`/`fireEvent`, matching `src/components/agents/AgentStatusCards.test.tsx`. For timer-driven behavior, use `vi.useFakeTimers()` / `vi.advanceTimersByTime()` / `act()`, matching `src/hooks/useAgentSession.test.ts`. Every new/modified test file starts with a `// path/to/file` comment, matching existing convention.
- Run `npm test -- --run` after every task to confirm the full suite passes, not just the new test.

---

### Task 1: Use-case config module

**Files:**
- Create: `src/pages/desktopCopilot/useCases.ts`
- Test: `src/pages/desktopCopilot/useCases.test.ts`

**Interfaces:**
- Produces: `UseCaseId` (type), `CanvasPattern` (type), `SetupFieldId` (type), `UseCaseConfig` (interface), `USE_CASES: UseCaseConfig[]`, `getUseCase(id: UseCaseId): UseCaseConfig`. All later tasks import these from `./desktopCopilot/useCases` (relative to `src/pages/DesktopCopilotPreview.tsx`) or `./useCases` (relative to files inside `src/pages/desktopCopilot/`).

- [ ] **Step 1: Write the failing test**

```ts
// src/pages/desktopCopilot/useCases.test.ts
import { describe, it, expect } from 'vitest'
import { USE_CASES, getUseCase } from './useCases'

describe('useCases config', () => {
  it('has all 5 use cases in order', () => {
    expect(USE_CASES.map(u => u.id)).toEqual(['interview', 'sales-call', 'meeting', 'exam', 'coding'])
  })

  it('marks interview, sales-call, and meeting as conversational with answer length', () => {
    for (const id of ['interview', 'sales-call', 'meeting'] as const) {
      const config = getUseCase(id)
      expect(config.canvasPattern).toBe('conversational')
      expect(config.hasAnswerLength).toBe(true)
    }
  })

  it('marks exam and coding as screenshot-qa without answer length', () => {
    for (const id of ['exam', 'coding'] as const) {
      const config = getUseCase(id)
      expect(config.canvasPattern).toBe('screenshot-qa')
      expect(config.hasAnswerLength).toBe(false)
    }
  })

  it('throws for an unknown use case id', () => {
    expect(() => getUseCase('unknown' as never)).toThrow('Unknown use case: unknown')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/pages/desktopCopilot/useCases.test.ts`
Expected: FAIL — `Cannot find module './useCases'`

- [ ] **Step 3: Write the implementation**

```ts
// src/pages/desktopCopilot/useCases.ts
import { Video, Phone, Users, GraduationCap, Code2, type LucideIcon } from 'lucide-react'

export type UseCaseId = 'interview' | 'sales-call' | 'meeting' | 'exam' | 'coding'
export type CanvasPattern = 'conversational' | 'screenshot-qa'
export type SetupFieldId =
  | 'position' | 'resume' | 'job-description'
  | 'customer-name' | 'deal-stage' | 'talk-track'
  | 'meeting-title' | 'agenda' | 'screen-share-note'
  | 'subject' | 'language'
  | 'audio-device'

export interface UseCaseConfig {
  id: UseCaseId
  label: string
  description: string
  icon: LucideIcon
  canvasPattern: CanvasPattern
  hasAnswerLength: boolean
  setupFields: SetupFieldId[]
  completeHeading: string
  completeBody: string
}

export const USE_CASES: UseCaseConfig[] = [
  {
    id: 'interview',
    label: 'Interview',
    description: 'Real-time answers during your job interview',
    icon: Video,
    canvasPattern: 'conversational',
    hasAnswerLength: true,
    setupFields: ['position', 'resume', 'job-description', 'audio-device'],
    completeHeading: '👏 Your Interview is complete!',
    completeBody: 'Thank you for completing your AI interview with Your Favorite Company.',
  },
  {
    id: 'sales-call',
    label: 'Sales Call',
    description: 'Live coaching while you close a deal',
    icon: Phone,
    canvasPattern: 'conversational',
    hasAnswerLength: true,
    setupFields: ['customer-name', 'deal-stage', 'talk-track', 'audio-device'],
    completeHeading: '🤝 Your Sales Call is complete!',
    completeBody: 'Nice work. Your call notes have been saved for follow-up.',
  },
  {
    id: 'meeting',
    label: 'Meeting',
    description: 'Live talking points, tracked by speaker',
    icon: Users,
    canvasPattern: 'conversational',
    hasAnswerLength: true,
    setupFields: ['meeting-title', 'agenda', 'screen-share-note', 'audio-device'],
    completeHeading: '📝 Your Meeting is complete!',
    completeBody: 'Your meeting notes have been saved.',
  },
  {
    id: 'exam',
    label: 'Exam',
    description: 'Instant answers from a screenshot of your exam',
    icon: GraduationCap,
    canvasPattern: 'screenshot-qa',
    hasAnswerLength: false,
    setupFields: ['subject'],
    completeHeading: '🎓 Your Exam session is complete!',
    completeBody: 'Good luck with your results.',
  },
  {
    id: 'coding',
    label: 'Coding',
    description: 'Code answers for technical interviews & tests',
    icon: Code2,
    canvasPattern: 'screenshot-qa',
    hasAnswerLength: false,
    setupFields: ['language'],
    completeHeading: '💻 Your Coding session is complete!',
    completeBody: 'Nice work — your session history is saved below.',
  },
]

export function getUseCase(id: UseCaseId): UseCaseConfig {
  const found = USE_CASES.find(u => u.id === id)
  if (!found) throw new Error(`Unknown use case: ${id}`)
  return found
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run src/pages/desktopCopilot/useCases.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/desktopCopilot/useCases.ts src/pages/desktopCopilot/useCases.test.ts
git commit -m "feat: add use-case config module for desktop Copilot"
```

---

### Task 2: Generalize Setup + Preference flow per use case

**Files:**
- Modify: `src/pages/DesktopCopilotPreview.tsx:2` (import line), `:305-463` (`SetupScreen`), `:238-300` (`PreferenceModal`)
- Test: Create `src/pages/DesktopCopilotPreview.test.tsx`

**Interfaces:**
- Consumes: `getUseCase(id: UseCaseId): UseCaseConfig`, `UseCaseId` from `./desktopCopilot/useCases` (Task 1)
- Produces: `export function SetupScreen({ useCaseId, onContinue }: { useCaseId: UseCaseId; onContinue: (primaryLabel: string) => void })`, `export function PreferenceModal({ hasAnswerLength, onClose, onNext }: { hasAnswerLength: boolean; onClose: () => void; onNext: () => void })`. Task 7 (orchestrator) calls both with these exact signatures.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/pages/DesktopCopilotPreview.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { SetupScreen, PreferenceModal } from './DesktopCopilotPreview'

describe('SetupScreen', () => {
  it('renders Position, Resume, and Job description fields for interview', () => {
    render(<SetupScreen useCaseId="interview" onContinue={() => {}} />)
    expect(screen.getByText('Position')).toBeInTheDocument()
    expect(screen.getByText('Choose Resume')).toBeInTheDocument()
    expect(screen.getByText(/Job description/)).toBeInTheDocument()
    expect(screen.queryByText('Customer / Company name')).not.toBeInTheDocument()
  })

  it('renders Customer name and Deal stage fields for sales-call, not Position', () => {
    render(<SetupScreen useCaseId="sales-call" onContinue={() => {}} />)
    expect(screen.getByText('Customer / Company name')).toBeInTheDocument()
    expect(screen.getByText('Deal stage')).toBeInTheDocument()
    expect(screen.queryByText('Position')).not.toBeInTheDocument()
  })

  it('renders Meeting title and a screen-share note for meeting', () => {
    render(<SetupScreen useCaseId="meeting" onContinue={() => {}} />)
    expect(screen.getByText('Meeting title')).toBeInTheDocument()
    expect(screen.getByText(/share your screen/)).toBeInTheDocument()
  })

  it('renders only Subject for exam, with no audio field', () => {
    render(<SetupScreen useCaseId="exam" onContinue={() => {}} />)
    expect(screen.getByText('Subject')).toBeInTheDocument()
    expect(screen.queryByText('Select Audio')).not.toBeInTheDocument()
  })

  it('renders Language field for coding and allows Continue with it blank', () => {
    render(<SetupScreen useCaseId="coding" onContinue={() => {}} />)
    expect(screen.getByText(/Language \/ stack/)).toBeInTheDocument()
    const continueBtn = screen.getByText('Continue')
    expect(continueBtn).not.toHaveStyle({ opacity: 0.45 })
  })

  it('opens the Preference modal on Continue once a required field is filled', () => {
    render(<SetupScreen useCaseId="exam" onContinue={() => {}} />)
    fireEvent.change(screen.getByPlaceholderText('e.g. Calculus II'), { target: { value: 'Calculus II' } })
    fireEvent.click(screen.getByText('Continue'))
    expect(screen.getByText('Preference')).toBeInTheDocument()
  })
})

describe('PreferenceModal', () => {
  it('shows Answer Length when hasAnswerLength is true', () => {
    render(<PreferenceModal hasAnswerLength={true} onClose={() => {}} onNext={() => {}} />)
    expect(screen.getByText('Answer Length')).toBeInTheDocument()
    expect(screen.getByText('Short')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Long')).toBeInTheDocument()
  })

  it('hides Answer Length when hasAnswerLength is false', () => {
    render(<PreferenceModal hasAnswerLength={false} onClose={() => {}} onNext={() => {}} />)
    expect(screen.queryByText('Answer Length')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run src/pages/DesktopCopilotPreview.test.tsx`
Expected: FAIL — `SetupScreen`/`PreferenceModal` are not exported yet, and the new fields don't exist

- [ ] **Step 3: Update the import line**

In `src/pages/DesktopCopilotPreview.tsx:2-3`, replace:

```tsx
import { Bell, Check, ChevronDown, ExternalLink, FileText, HelpCircle, Mic, Play, Settings, Sparkles, Upload, Video, X, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'
```

with:

```tsx
import { Bell, Check, ChevronDown, ExternalLink, FileText, HelpCircle, Mic, Play, Settings, Sparkles, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getUseCase, USE_CASES, type UseCaseId } from './desktopCopilot/useCases'
```

(`Video` and `Code2` are dropped here — they were only used by the old internal tab toggle being removed in this task. `USE_CASES` isn't used until Task 6, but importing it now avoids touching this line again.)

- [ ] **Step 4: Replace `PreferenceModal`**

Replace the whole `PreferenceModal` function (`src/pages/DesktopCopilotPreview.tsx:238-300`, from `// Preference Modal` comment through its closing `}`) with:

```tsx
// ---------------------------------------------------------------------------
// Preference Modal
// ---------------------------------------------------------------------------
type ResponseStyle = 'Default' | 'Headlines' | 'Coaching'
type AnswerLength = 'Short' | 'Medium' | 'Long'

export function PreferenceModal({ hasAnswerLength, onClose, onNext }: { hasAnswerLength: boolean; onClose: () => void; onNext: () => void }) {
  const [selected, setSelected] = useState<ResponseStyle>('Headlines')
  const [answerLength, setAnswerLength] = useState<AnswerLength>('Medium')

  const previews: Record<ResponseStyle, string> = {
    Default: '"I redesigned a vehicle maintenance app that had low engagement. Led a team to identify pain points, improved UI, and introduced a personalised dashboard. Engagement increased by 30% in 3 months, and customer satisfaction improved significantly."',
    Headlines: '"Absolutely! I\'d love to share my experience.\n• Situation: Our vehicle maintenance app had low engagement.\n• Task: I led a cross-functional team to redesign the app.\n• Action: User interviews → Redesigned UI → Simplified navigation.\n• Result: Engagement increased by 30% in 3 months."',
    Coaching: '"Start by setting the context — mention the project and its challenges. Then highlight your leadership role and actions. Be sure to emphasise impact. Keep it conversational and confident."',
  }

  const notes: Record<ResponseStyle, string> = {
    Default: 'Best for candidates who want a direct, no-frills answer.',
    Headlines: 'Best for candidates who want structured responses that hit all key points.',
    Coaching: 'Best for candidates who prefer brief coaching instead of a full answer.',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl p-6 shadow-2xl" style={{ background: '#111827', border: `1px solid rgba(255,255,255,0.1)` }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Preference</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-white/50 hover:text-white" /></button>
        </div>

        <p className="mb-3 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Select Response Type</p>
        <div className="mb-4 flex gap-2">
          {(['Default', 'Headlines', 'Coaching'] as ResponseStyle[]).map(s => (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors"
              style={{
                background: selected === s ? 'rgba(26,122,255,0.15)' : 'transparent',
                border: `1.5px solid ${selected === s ? BLUE : 'rgba(255,255,255,0.15)'}`,
                color: selected === s ? '#60a5fa' : 'rgba(255,255,255,0.6)',
              }}
            >
              <div className={cn('h-3.5 w-3.5 rounded-full border flex items-center justify-center flex-shrink-0', selected === s ? 'border-blue-400' : 'border-white/30')}>
                {selected === s && <div className="h-2 w-2 rounded-full bg-blue-400" />}
              </div>
              {s}
            </button>
          ))}
        </div>

        <div className="mb-3 rounded-xl p-4 text-xs leading-relaxed text-white whitespace-pre-line" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {previews[selected]}
        </div>

        <div className="mb-5 flex items-center gap-2">
          <Check className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{notes[selected]}</p>
        </div>

        {hasAnswerLength && (
          <>
            <p className="mb-3 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Answer Length</p>
            <div className="mb-5 flex gap-2">
              {(['Short', 'Medium', 'Long'] as AnswerLength[]).map(len => (
                <button
                  key={len}
                  onClick={() => setAnswerLength(len)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors"
                  style={{
                    background: answerLength === len ? 'rgba(26,122,255,0.15)' : 'transparent',
                    border: `1.5px solid ${answerLength === len ? BLUE : 'rgba(255,255,255,0.15)'}`,
                    color: answerLength === len ? '#60a5fa' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {len}
                </button>
              ))}
            </div>
          </>
        )}

        <button onClick={onNext} className="h-11 w-full rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ background: BLUE }}>
          Confirm
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Replace `SetupScreen`**

Replace the whole `SetupScreen` function (`src/pages/DesktopCopilotPreview.tsx:305-463`, from `// Screen 2: Setup` comment through its closing `}`) with:

```tsx
// ---------------------------------------------------------------------------
// Screen 2: Setup
// ---------------------------------------------------------------------------
type DealStage = 'Discovery' | 'Demo' | 'Negotiation' | 'Closing'
const DEAL_STAGES: DealStage[] = ['Discovery', 'Demo', 'Negotiation', 'Closing']

export function SetupScreen({ useCaseId, onContinue }: { useCaseId: UseCaseId; onContinue: (primaryLabel: string) => void }) {
  const config = getUseCase(useCaseId)
  const fields = new Set(config.setupFields)

  const [jobTitle, setJobTitle] = useState('')
  const [selectedResume, setSelectedResume] = useState<string | null>('adewale_damola_PM_resume.pdf')
  const [jobDesc, setJobDesc] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [dealStage, setDealStage] = useState<DealStage>('Discovery')
  const [talkTrack, setTalkTrack] = useState('')
  const [meetingTitle, setMeetingTitle] = useState('')
  const [agenda, setAgenda] = useState('')
  const [subject, setSubject] = useState('')
  const [language, setLanguage] = useState('')
  const [audioConnected, setAudioConnected] = useState(true)
  const [dontAskAgain, setDontAskAgain] = useState(true)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [showPreference, setShowPreference] = useState(false)

  const inputStyle = { background: INPUT_BG, border: `1px solid ${INPUT_BD}`, color: 'white', outline: 'none' } as const

  const primaryLabel =
    useCaseId === 'interview' ? jobTitle :
    useCaseId === 'sales-call' ? customerName :
    useCaseId === 'meeting' ? meetingTitle :
    useCaseId === 'exam' ? subject :
    language

  const requiresLabel = useCaseId !== 'coding'
  const canContinue = requiresLabel ? primaryLabel.trim().length > 0 : true

  return (
    <div className="flex flex-1 flex-col min-h-0" style={{ background: BG }}>
      <div className="flex h-14 items-center justify-between border-b px-6" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-2">
          <LightningLogo size={24} />
          <span className="text-base font-bold text-white">Lightforth</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10" style={{ borderColor: BORDER }}>
            <LightningLogo size={12} /> Upgrade
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10">
            <Bell className="h-4 w-4 text-white/60" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10">
            <HelpCircle className="h-4 w-4 text-white/60" />
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500" />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-10 py-6">
        <div className="mx-auto max-w-[520px]">
          <h1 className="mb-6 text-center text-xl font-bold text-white">👋 Hola, Welcome to {config.label} Co-Pilot</h1>

          <div className="space-y-4">
            {fields.has('position') && (
              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <p className="mb-2 text-sm font-semibold text-white">Position</p>
                <input
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="Enter job role"
                  className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                  style={inputStyle}
                />
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>Suggestions:</span>
                  {['Product Designer', 'Product Manager'].map(s => (
                    <button key={s} onClick={() => setJobTitle(s)} className="font-semibold text-blue-400 hover:underline">{s}</button>
                  ))}
                </div>
              </div>
            )}

            {fields.has('resume') && (
              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <p className="mb-2 text-sm font-semibold text-white">Choose Resume</p>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/10 transition-colors" style={{ border: `1px solid ${BORDER}` }}>
                    <Upload className="h-4 w-4" /> Upload a Resume
                  </button>
                  <button onClick={() => setShowResumeModal(true)} className="relative flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors" style={{ background: 'rgba(26,122,255,0.15)', border: `1px solid ${BLUE}`, color: '#60a5fa' }}>
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[9px] font-bold text-blue-400" style={{ background: '#0c1d48', border: `1px solid ${BLUE}` }}>RECOMMENDED</span>
                    <LightningLogo size={14} /> Use Lightforth Resume
                  </button>
                </div>
                {selectedResume && (
                  <div className="mt-2 flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <FileText className="h-4 w-4 fill-red-400 text-red-400" />
                    <span>{selectedResume}</span>
                    <button onClick={() => setSelectedResume(null)}><X className="h-3.5 w-3.5 hover:text-white" /></button>
                  </div>
                )}
              </div>
            )}

            {fields.has('job-description') && (
              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <p className="mb-2 text-sm font-semibold text-white">Job description <span className="font-normal text-white/40">(optional)</span></p>
                <div className="relative">
                  <textarea
                    value={jobDesc}
                    onChange={e => setJobDesc(e.target.value)}
                    placeholder="Write or paste here..."
                    className="w-full resize-none rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                    style={{ ...inputStyle, height: 72 }}
                  />
                  <button onClick={() => setJobDesc("We're looking for a talented individual to join our growing team. You'll collaborate cross-functionally to deliver innovative solutions.")} className="absolute bottom-2.5 right-3 flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-white/70 hover:text-white" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <Sparkles className="h-3 w-3" /> Suggest for me
                  </button>
                </div>
              </div>
            )}

            {fields.has('customer-name') && (
              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <p className="mb-2 text-sm font-semibold text-white">Customer / Company name</p>
                <input
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                  style={inputStyle}
                />
              </div>
            )}

            {fields.has('deal-stage') && (
              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <p className="mb-2 text-sm font-semibold text-white">Deal stage</p>
                <div className="flex flex-wrap gap-2">
                  {DEAL_STAGES.map(stage => (
                    <button
                      key={stage}
                      onClick={() => setDealStage(stage)}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                      style={{
                        background: dealStage === stage ? 'rgba(26,122,255,0.2)' : 'transparent',
                        border: `1px solid ${dealStage === stage ? BLUE : INPUT_BD}`,
                        color: dealStage === stage ? '#60a5fa' : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {fields.has('talk-track') && (
              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <p className="mb-2 text-sm font-semibold text-white">Talk track notes <span className="font-normal text-white/40">(optional)</span></p>
                <textarea
                  value={talkTrack}
                  onChange={e => setTalkTrack(e.target.value)}
                  placeholder="Key points, objection handling, pricing notes..."
                  className="w-full resize-none rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                  style={{ ...inputStyle, height: 72 }}
                />
              </div>
            )}

            {fields.has('meeting-title') && (
              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <p className="mb-2 text-sm font-semibold text-white">Meeting title</p>
                <input
                  value={meetingTitle}
                  onChange={e => setMeetingTitle(e.target.value)}
                  placeholder="e.g. Q3 Roadmap Review"
                  className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                  style={inputStyle}
                />
              </div>
            )}

            {fields.has('agenda') && (
              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <p className="mb-2 text-sm font-semibold text-white">Agenda <span className="font-normal text-white/40">(optional)</span></p>
                <textarea
                  value={agenda}
                  onChange={e => setAgenda(e.target.value)}
                  placeholder="What's on the agenda..."
                  className="w-full resize-none rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                  style={{ ...inputStyle, height: 72 }}
                />
              </div>
            )}

            {fields.has('screen-share-note') && (
              <div className="rounded-2xl p-4" style={{ background: 'rgba(96,165,250,0.08)', border: `1px solid ${BORDER}` }}>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Meetings work best when you share your screen — Copilot uses it to tell speakers apart.
                </p>
              </div>
            )}

            {fields.has('subject') && (
              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <p className="mb-2 text-sm font-semibold text-white">Subject</p>
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Calculus II"
                  className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                  style={inputStyle}
                />
              </div>
            )}

            {fields.has('language') && (
              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <p className="mb-2 text-sm font-semibold text-white">Language / stack <span className="font-normal text-white/40">(optional)</span></p>
                <input
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  placeholder="Leave blank to auto-detect"
                  className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                  style={inputStyle}
                />
              </div>
            )}

            {fields.has('audio-device') && (
              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Select Audio</p>
                  {audioConnected && <span className="text-xs font-semibold text-green-400">Connected</span>}
                </div>
                <button onClick={() => setAudioConnected(true)} className="flex h-10 w-full items-center justify-between rounded-xl px-4 text-sm text-white/80 hover:bg-white/10 transition-colors" style={{ border: `1px solid ${INPUT_BD}`, background: INPUT_BG }}>
                  <span className="flex items-center gap-2"><Mic className="h-4 w-4 text-white/50" />{audioConnected ? "Default - Adewale' Airpod Pro" : 'No audio device selected'}</span>
                  <ChevronDown className="h-4 w-4 text-white/50" />
                </button>
                <button onClick={() => setAudioConnected(true)} className="mt-2 h-9 w-full rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ background: 'rgba(26,122,255,0.35)' }}>
                  Enable Microphone Access
                </button>
              </div>
            )}

            <label className="flex cursor-pointer select-none items-center gap-3 px-1">
              <div className={cn('h-5 w-5 flex-shrink-0 rounded flex items-center justify-center', dontAskAgain ? 'bg-blue-500' : 'border border-white/30')} onClick={() => setDontAskAgain(a => !a)}>
                {dontAskAgain && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Don't ask again</span>
            </label>

            <button
              onClick={() => { if (canContinue) setShowPreference(true) }}
              className="h-11 w-full rounded-xl text-sm font-bold text-white transition-opacity"
              style={{ background: BLUE, opacity: canContinue ? 1 : 0.45 }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {showResumeModal && (
        <ResumeModal
          onClose={() => setShowResumeModal(false)}
          onSelect={(name) => { setSelectedResume(`${name.toLowerCase().replace(' ', '_')}_resume.pdf`); setShowResumeModal(false) }}
        />
      )}
      {showPreference && (
        <PreferenceModal
          hasAnswerLength={config.hasAnswerLength}
          onClose={() => setShowPreference(false)}
          onNext={() => onContinue(primaryLabel || config.label)}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- --run src/pages/DesktopCopilotPreview.test.tsx`
Expected: PASS (8 tests). Note: the main `DesktopCopilotPreview` default export still calls `<SetupScreen onContinue={t => ...} />` and `<LiveCanvas jobTitle={...} />` without `useCaseId` — this will be a type error until Task 7. For this task, run `npx tsc --noEmit -p tsconfig.app.json` and confirm the **only** errors are in the `DesktopCopilotPreview` default-export function at the bottom of the file (the orchestrator, fixed in Task 7) — not inside `SetupScreen` or `PreferenceModal` themselves.

- [ ] **Step 7: Commit**

```bash
git add src/pages/DesktopCopilotPreview.tsx src/pages/DesktopCopilotPreview.test.tsx
git commit -m "feat: generalize Setup and Preference screens per use case"
```

---

### Task 3: Screenshot Q&A Canvas (Exam / Coding) with Auto Respond

**Files:**
- Modify: `src/pages/DesktopCopilotPreview.tsx` (add new component after the existing `LiveCanvas` function, i.e. after line 625 in the original file — exact line will have shifted after Task 2's edits, insert directly before the `// Screen 4: Complete` comment)
- Test: Modify `src/pages/DesktopCopilotPreview.test.tsx`

**Interfaces:**
- Consumes: `getUseCase` from `./desktopCopilot/useCases` (Task 1); `formatTime`, `Toggle`, `Settings` icon, `X` icon (all already in this file)
- Produces: `export function ScreenshotCanvas({ useCaseId, primaryLabel, onEnd, transparency, onTransparencyChange }: { useCaseId: 'exam' | 'coding'; primaryLabel: string; onEnd: () => void; transparency: number; onTransparencyChange: (v: number) => void })`. Task 7 (orchestrator) renders this for `exam`/`coding`.

**Behavior spec for Auto Respond (also applies to Task 4's `LiveCanvas`):** a `Settings` modal toggle. When **off** (default), the user presses Space to capture a screenshot, then presses Space again once answered to advance to the next question — exactly like today's interview flow. When **on**, the same state machine advances automatically on a timer, with no Space bar needed.

- [ ] **Step 1: Write the failing tests**

```tsx
// Append to src/pages/DesktopCopilotPreview.test.tsx
import { vi } from 'vitest'
import { ScreenshotCanvas } from './DesktopCopilotPreview'

describe('ScreenshotCanvas', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('starts idle, prompting the user to press Space', () => {
    render(<ScreenshotCanvas useCaseId="exam" primaryLabel="Calculus II" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    expect(screen.getByText(/Press Space to capture/)).toBeInTheDocument()
  })

  it('captures, analyzes, and shows an answer on consecutive Space presses', () => {
    render(<ScreenshotCanvas useCaseId="exam" primaryLabel="Calculus II" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    fireEvent.keyDown(window, { code: 'Space' })
    act(() => { vi.advanceTimersByTime(600) })
    expect(screen.getByText('Analyzing...')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(900) })
    expect(screen.getByText(/press Space for the next question/)).toBeInTheDocument()
  })

  it('renders the answer as a code block with a Copy button for coding', () => {
    render(<ScreenshotCanvas useCaseId="coding" primaryLabel="" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    fireEvent.keyDown(window, { code: 'Space' })
    act(() => { vi.advanceTimersByTime(1500) })
    expect(screen.getByText('Copy')).toBeInTheDocument()
  })

  it('auto-advances without Space presses when Auto Respond is on', () => {
    render(<ScreenshotCanvas useCaseId="exam" primaryLabel="Calculus II" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    fireEvent.click(screen.getByTestId('open-settings'))
    fireEvent.click(screen.getByText('Auto Respond').closest('div')!.parentElement!.querySelector('button')!)
    act(() => { vi.advanceTimersByTime(2000 + 600 + 900) })
    expect(screen.getByText(/press Space for the next question|Answer ready/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run src/pages/DesktopCopilotPreview.test.tsx`
Expected: FAIL — `ScreenshotCanvas` is not exported yet

- [ ] **Step 3: Add `data-testid="open-settings"` to the existing Settings gear button**

This testid is needed by the Auto Respond test above and will also be used in Task 4. In the to-be-written `ScreenshotCanvas` below, the gear button already carries it — no separate edit needed here since this is a new component.

- [ ] **Step 4: Insert the `ScreenshotCanvas` component**

Insert directly before the `// ---- Screen 4: Complete ----` comment block:

```tsx
// ---------------------------------------------------------------------------
// Screen 3b: Screenshot Q&A Canvas (Exam / Coding)
// ---------------------------------------------------------------------------
type ScreenshotStatus = 'idle' | 'capturing' | 'analyzing' | 'answered'

const MOCK_EXAM_QA = [
  { q: "A particle moves along a line with velocity v(t) = 3t^2 - 12t + 9. Find all times t ≥ 0 when the particle is at rest.", a: "The particle is at rest when v(t) = 0.\n3t^2 - 12t + 9 = 0\nDivide by 3: t^2 - 4t + 3 = 0\nFactor: (t - 1)(t - 3) = 0\nSo t = 1 and t = 3. The particle is at rest at t = 1 second and t = 3 seconds." },
  { q: "Find the derivative of f(x) = ln(x^2 + 1).", a: "Using the chain rule: f'(x) = (2x) / (x^2 + 1)." },
  { q: "Evaluate the integral ∫(2x + 3) dx.", a: "∫(2x + 3) dx = x^2 + 3x + C, where C is the constant of integration." },
]

const MOCK_CODING_QA = [
  { q: "Write a function that returns the nth Fibonacci number using memoization.", a: "function fib(n, memo = {}) {\n  if (n in memo) return memo[n]\n  if (n <= 1) return n\n  memo[n] = fib(n - 1, memo) + fib(n - 2, memo)\n  return memo[n]\n}" },
  { q: "Reverse a singly linked list in place.", a: "function reverseList(head) {\n  let prev = null\n  let curr = head\n  while (curr) {\n    const next = curr.next\n    curr.next = prev\n    prev = curr\n    curr = next\n  }\n  return prev\n}" },
]

export function ScreenshotCanvas({ useCaseId, primaryLabel, onEnd, transparency, onTransparencyChange }: { useCaseId: 'exam' | 'coding'; primaryLabel: string; onEnd: () => void; transparency: number; onTransparencyChange: (v: number) => void }) {
  const config = getUseCase(useCaseId)
  const bank = useCaseId === 'coding' ? MOCK_CODING_QA : MOCK_EXAM_QA

  const [status, setStatus] = useState<ScreenshotStatus>('idle')
  const [index, setIndex] = useState(0)
  const [history, setHistory] = useState<{ q: string; a: string }[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [stealthMode, setStealthMode] = useState(true)
  const [alwaysOnTop, setAlwaysOnTop] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [autoRespond, setAutoRespond] = useState(false)

  const statusRef = useRef(status)
  const indexRef = useRef(index)
  useEffect(() => { statusRef.current = status }, [status])
  useEffect(() => { indexRef.current = index }, [index])
  useEffect(() => { const id = setInterval(() => setElapsed(e => e + 1), 1000); return () => clearInterval(id) }, [])

  const capture = () => {
    if (statusRef.current === 'idle') setStatus('capturing')
    else if (statusRef.current === 'answered') {
      setHistory(h => [...h, bank[indexRef.current]])
      setIndex(i => (i + 1) % bank.length)
      setStatus('idle')
    }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || autoRespond) return
      e.preventDefault()
      capture()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [autoRespond, bank])

  useEffect(() => {
    if (status !== 'capturing') return
    const id = setTimeout(() => setStatus('analyzing'), 600)
    return () => clearTimeout(id)
  }, [status])

  useEffect(() => {
    if (status !== 'analyzing') return
    const id = setTimeout(() => setStatus('answered'), 900)
    return () => clearTimeout(id)
  }, [status])

  useEffect(() => {
    if (!autoRespond) return
    const delay = status === 'capturing' ? 600 : status === 'analyzing' ? 900 : 2000
    const id = setTimeout(capture, delay)
    return () => clearTimeout(id)
  }, [autoRespond, status, index])

  const statusText: Record<ScreenshotStatus, string> = {
    idle: autoRespond ? 'Watching your screen...' : 'Press Space to capture your screen',
    capturing: 'Capturing screen...',
    analyzing: 'Analyzing...',
    answered: autoRespond ? 'Answer ready' : 'Answer ready — press Space for the next question',
  }

  const current = bank[index]

  return (
    <div className="flex flex-1 flex-col" style={{ background: '#0A1628' }}>
      <style>{`
        @keyframes processingDot { 0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(-5px);opacity:1} }
      `}</style>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl" style={{ background: '#0D1929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: '#1E2D45' }}>
              <p className="text-sm font-semibold text-white">Settings</p>
              <button onClick={() => setShowSettings(false)}><X className="h-4 w-4 text-slate-400 hover:text-white" /></button>
            </div>
            <div className="space-y-6 p-5">
              <div>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Window Settings</p>
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-sm font-medium text-slate-200">Auto Respond</p><p className="mt-0.5 text-xs text-slate-500">AI answers automatically — turn off to capture with Space yourself</p></div>
                    <Toggle on={autoRespond} onToggle={() => setAutoRespond(a => !a)} />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-sm font-medium text-slate-200">Stealth Mode</p><p className="mt-0.5 text-xs text-slate-500">Hides Copilot from screen share</p></div>
                    <Toggle on={stealthMode} onToggle={() => setStealthMode(s => !s)} />
                  </div>
                  <div>
                    <div className="mb-2 flex justify-between"><p className="text-sm font-medium text-slate-200">Transparent Background</p><span className="text-xs text-slate-400">{transparency}%</span></div>
                    <input type="range" min={0} max={100} value={transparency} onChange={e => onTransparencyChange(Number(e.target.value))} className="w-full accent-primary" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-sm font-medium text-slate-200">Always on Top</p><p className="mt-0.5 text-xs text-slate-500">Keeps Copilot above all other windows</p></div>
                    <Toggle on={alwaysOnTop} onToggle={() => setAlwaysOnTop(s => !s)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-shrink-0 items-center justify-between px-5 py-3" style={{ background: '#0A1628' }}>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          {config.label}{primaryLabel ? ` — ${primaryLabel}` : ''}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-slate-300">{formatTime(elapsed)}</span>
          <button onClick={onEnd} className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-600">End Session</button>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 px-5 py-2" style={{ background: '#0F2340' }}>
        <span className="text-xs italic text-slate-400">{statusText[status]}</span>
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <label className="flex items-center gap-2">
            Font size
            <input type="range" min={12} max={20} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-20 accent-primary" />
            <span className="w-5 text-slate-500">{fontSize}</span>
          </label>
          <button data-testid="open-settings" onClick={() => setShowSettings(true)}><Settings className="h-4 w-4 text-slate-400 hover:text-white transition-colors" /></button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden p-2">
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl" style={{ background: '#0D1929', border: '1px solid #1E2D45' }}>
          <div className="flex-1 space-y-6 overflow-y-auto p-5">
            {history.map((item, i) => (
              <div key={i} className="space-y-2 border-b border-white/5 pb-4">
                <p className="text-sm text-white">{item.q}</p>
                {useCaseId === 'coding' ? (
                  <pre className="overflow-x-auto rounded-lg p-3 text-xs text-green-300" style={{ background: '#0A1628' }}><code>{item.a}</code></pre>
                ) : (
                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200" style={{ fontSize }}>{item.a}</p>
                )}
              </div>
            ))}

            {status === 'analyzing' && (
              <div className="flex items-center gap-1.5 py-1">
                {[0, 1, 2].map(i => <div key={i} className="h-2 w-2 rounded-full bg-slate-500" style={{ animation: 'processingDot 0.9s ease-in-out infinite', animationDelay: `${i * 0.18}s` }} />)}
              </div>
            )}

            {status === 'answered' && (
              <div className="space-y-2">
                <p className="text-sm text-white">{current.q}</p>
                {useCaseId === 'coding' ? (
                  <div className="relative">
                    <pre className="overflow-x-auto rounded-lg p-3 text-xs text-green-300" style={{ background: '#0A1628' }}><code>{current.a}</code></pre>
                    <button
                      onClick={() => { navigator.clipboard?.writeText(current.a); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
                      className="absolute right-2 top-2 rounded-md px-2 py-1 text-[10px] font-semibold text-white/70 hover:text-white"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                ) : (
                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200" style={{ fontSize }}>{current.a}</p>
                )}
              </div>
            )}

            {status === 'idle' && history.length === 0 && (
              <p className="text-xs italic text-slate-600">{autoRespond ? 'Auto Respond is on — Copilot will capture automatically.' : 'Press Space to capture your first question...'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- --run src/pages/DesktopCopilotPreview.test.tsx`
Expected: PASS (12 tests)

- [ ] **Step 6: Commit**

```bash
git add src/pages/DesktopCopilotPreview.tsx src/pages/DesktopCopilotPreview.test.tsx
git commit -m "feat: add screenshot Q&A canvas for Exam/Coding with Auto Respond"
```

---

### Task 4: Generalize `LiveCanvas` for Sales Call / Meeting, with Auto Respond

**Files:**
- Modify: `src/pages/DesktopCopilotPreview.tsx:18-29` (`MOCK_QA`), `:468-625` (`LiveCanvas`, original line numbers — locate by the `// Screen 3: Live Canvas` comment)
- Test: Modify `src/pages/DesktopCopilotPreview.test.tsx`

**Interfaces:**
- Consumes: nothing new from other tasks
- Produces: `export function LiveCanvas({ useCaseId, primaryLabel, onEnd, transparency, onTransparencyChange }: { useCaseId: 'interview' | 'sales-call' | 'meeting'; primaryLabel: string; onEnd: () => void; transparency: number; onTransparencyChange: (v: number) => void })`. Task 7 renders this for `interview`/`sales-call`/`meeting`.

- [ ] **Step 1: Write the failing tests**

```tsx
// Append to src/pages/DesktopCopilotPreview.test.tsx
import { LiveCanvas } from './DesktopCopilotPreview'

describe('LiveCanvas', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('labels the speaker "Interviewer" and titles the bar "Interview for {label}"', () => {
    render(<LiveCanvas useCaseId="interview" primaryLabel="Product Manager" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    expect(screen.getByText('Interview for Product Manager')).toBeInTheDocument()
    fireEvent.keyDown(window, { code: 'Space' })
    expect(screen.getAllByText('Interviewer').length).toBeGreaterThan(0)
  })

  it('labels the speaker "Customer" and titles the bar "Sales Call with {label}"', () => {
    render(<LiveCanvas useCaseId="sales-call" primaryLabel="Acme Corp" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    expect(screen.getByText('Sales Call with Acme Corp')).toBeInTheDocument()
    fireEvent.keyDown(window, { code: 'Space' })
    expect(screen.getAllByText('Customer').length).toBeGreaterThan(0)
  })

  it('labels speakers "Speaker 1" etc. and titles the bar "Meeting: {label}"', () => {
    render(<LiveCanvas useCaseId="meeting" primaryLabel="Q3 Roadmap Review" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    expect(screen.getByText('Meeting: Q3 Roadmap Review')).toBeInTheDocument()
    fireEvent.keyDown(window, { code: 'Space' })
    expect(screen.getAllByText('Speaker 1').length).toBeGreaterThan(0)
  })

  it('auto-advances through listening/processing/answering when Auto Respond is on', () => {
    render(<LiveCanvas useCaseId="interview" primaryLabel="Product Manager" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    fireEvent.click(screen.getByTestId('open-settings'))
    fireEvent.click(screen.getByText('Auto Respond').closest('div')!.parentElement!.querySelector('button')!)
    act(() => { vi.advanceTimersByTime(1800) })
    expect(screen.getByText('Processing...')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1200) })
    expect(screen.getByText('Answering...')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run src/pages/DesktopCopilotPreview.test.tsx`
Expected: FAIL — `LiveCanvas` isn't exported yet and doesn't accept `useCaseId`/`primaryLabel`

- [ ] **Step 3: Add a `speaker` field to `MOCK_QA`**

Replace `MOCK_QA` (`src/pages/DesktopCopilotPreview.tsx:18-29`) so every entry has `speaker: 'Interviewer'` prepended — for example the first two entries become:

```tsx
const MOCK_QA = [
  { speaker: 'Interviewer', q: "Can you tell me a little bit about yourself and your background?", a: "I'm a product designer and manager with over 6 years of experience building digital products across fintech, crypto, and AI spaces. I've shipped 12 live applications and led cross-functional teams from ideation all the way to launch. What drives me is the intersection of user empathy and business impact — I love creating products that are not just beautiful but genuinely solve real problems for real people." },
  { speaker: 'Interviewer', q: "What would you say is your greatest professional strength?", a: "My greatest strength is owning the full product lifecycle. I can sit in a strategy meeting in the morning, run a user research session in the afternoon, and review a design prototype by evening. That end-to-end ownership reduces handoff friction and speeds up delivery. I've used this to cut time-to-market by over 40% on my last two major products." },
  // ... apply the same `speaker: 'Interviewer',` prefix to all remaining entries, keeping their existing q/a text unchanged
]
```

Apply `speaker: 'Interviewer',` as the first property of all 10 existing `MOCK_QA` entries, without changing any `q`/`a` text.

- [ ] **Step 4: Replace `LiveCanvas`**

Replace the whole `LiveCanvas` function and its surrounding section comment (`src/pages/DesktopCopilotPreview.tsx`, from `// Screen 3: Live Canvas` through the closing `}` of the function) with:

```tsx
// ---------------------------------------------------------------------------
// Screen 3a: Conversational Canvas (Interview / Sales Call / Meeting)
// ---------------------------------------------------------------------------
type ConversationalUseCase = 'interview' | 'sales-call' | 'meeting'

const MOCK_SALES_QA = [
  { speaker: 'Customer', q: "Look, I like the product, but the price point is a stretch for us this quarter.", a: "Acknowledge the budget concern, then re-anchor on value: \"I hear you on budget — a lot of our customers felt the same before they saw the time saved. What if we started with the core tier and revisited expansion next quarter?\"" },
  { speaker: 'Customer', q: "What makes you different from your competitors?", a: "Lead with your strongest differentiator backed by proof: \"We integrate natively with your existing stack — no migration needed. A similar customer cut onboarding time by 60% switching to us.\"" },
  { speaker: 'Customer', q: "Can you send over a proposal by end of week?", a: "Confirm and create urgency: \"Absolutely, I'll have it in your inbox by Thursday. Should we put 30 minutes on the calendar Friday to walk through it together?\"" },
]

const MOCK_MEETING_TRANSCRIPT = [
  { speaker: 'Speaker 1', q: "I think we should push the launch date by two weeks to finish QA.", a: "Support the rationale, propose a checkpoint: \"That tracks with the bug count we're seeing. Can we set a go/no-go review next Wednesday so we don't lose more time than necessary?\"" },
  { speaker: 'Speaker 2', q: "Marketing already has assets scheduled for the original date.", a: "Bridge the conflict: \"Let's loop in marketing today so they can adjust the campaign calendar in parallel rather than finding out next week.\"" },
  { speaker: 'Speaker 3', q: "What's the actual blocker on QA — is it resourcing or scope?", a: "Push for clarity: \"Worth asking the QA lead directly whether it's headcount or test coverage, since the fix is different either way.\"" },
]

const CONVERSATIONAL_BANKS: Record<ConversationalUseCase, { speaker: string; q: string; a: string }[]> = {
  interview: MOCK_QA,
  'sales-call': MOCK_SALES_QA,
  meeting: MOCK_MEETING_TRANSCRIPT,
}

const TITLE_TEXT: Record<ConversationalUseCase, (label: string) => string> = {
  interview: label => `Interview for ${label}`,
  'sales-call': label => `Sales Call with ${label}`,
  meeting: label => `Meeting: ${label}`,
}

export function LiveCanvas({ useCaseId, primaryLabel, onEnd, transparency, onTransparencyChange }: { useCaseId: ConversationalUseCase; primaryLabel: string; onEnd: () => void; transparency: number; onTransparencyChange: (v: number) => void }) {
  const bank = CONVERSATIONAL_BANKS[useCaseId]
  const [copilotStatus, setCopilotStatus] = useState<CopilotStatus>('listening')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [qDisplayed, setQDisplayed] = useState('')
  const [aDisplayed, setADisplayed] = useState('')
  const [history, setHistory] = useState<{ speaker: string; q: string; a: string }[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [stealthMode, setStealthMode] = useState(true)
  const [alwaysOnTop, setAlwaysOnTop] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [scrollSpeed, setScrollSpeed] = useState(3)
  const [autoRespond, setAutoRespond] = useState(false)

  const statusRef = useRef(copilotStatus)
  const qIndexRef = useRef(questionIndex)
  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => { statusRef.current = copilotStatus }, [copilotStatus])
  useEffect(() => { qIndexRef.current = questionIndex }, [questionIndex])

  useEffect(() => { const id = setInterval(() => setElapsed(e => e + 1), 1000); return () => clearInterval(id) }, [])
  useEffect(() => { panelRef.current?.scrollTo({ top: panelRef.current.scrollHeight, behavior: 'smooth' }) }, [qDisplayed, aDisplayed, copilotStatus])

  const advance = () => {
    const cur = statusRef.current
    const qi = qIndexRef.current
    if (cur === 'listening') { setQDisplayed(bank[qi].q); setCopilotStatus('processing') }
    else if (cur === 'processing') { setCopilotStatus('answering') }
    else { setHistory(h => [...h, bank[qi]]); setQuestionIndex(i => (i + 1) % bank.length); setCopilotStatus('listening') }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || autoRespond) return
      e.preventDefault()
      advance()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [autoRespond, bank])

  useEffect(() => {
    if (!autoRespond) return
    const delay = copilotStatus === 'listening' ? 1800 : copilotStatus === 'processing' ? 1200 : 1800
    const id = setTimeout(advance, delay)
    return () => clearTimeout(id)
  }, [autoRespond, copilotStatus, questionIndex])

  useEffect(() => {
    if (copilotStatus !== 'listening') return
    setQDisplayed(''); setADisplayed('')
    const text = bank[questionIndex].q; let i = 0
    const id = setInterval(() => { i++; setQDisplayed(text.slice(0, i)); if (i >= text.length) clearInterval(id) }, 22)
    return () => clearInterval(id)
  }, [copilotStatus, questionIndex, bank])

  useEffect(() => {
    if (copilotStatus !== 'answering') return
    setADisplayed('')
    const text = bank[questionIndex].a; let i = 0
    const id = setInterval(() => { i += 6; setADisplayed(text.slice(0, i)); if (i >= text.length) clearInterval(id) }, 10)
    return () => clearInterval(id)
  }, [copilotStatus, questionIndex, bank])

  const statusText: Record<CopilotStatus, string> = { listening: 'Listening...', processing: 'Processing...', answering: 'Answering...' }
  const speakerLabel = bank[questionIndex].speaker

  return (
    <div className="flex flex-1 flex-col" style={{ background: '#0A1628' }}>
      <style>{`
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 6px rgba(34,197,94,0.3),0 0 14px rgba(34,197,94,0.1)}50%{box-shadow:0 0 12px rgba(34,197,94,0.45),0 0 24px rgba(34,197,94,0.15)} }
        @keyframes processingDot { 0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(-5px);opacity:1} }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
      `}</style>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl" style={{ background: '#0D1929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: '#1E2D45' }}>
              <p className="text-sm font-semibold text-white">Settings</p>
              <button onClick={() => setShowSettings(false)}><X className="h-4 w-4 text-slate-400 hover:text-white" /></button>
            </div>
            <div className="space-y-6 p-5">
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Session Preferences</p>
                <div className="space-y-2 rounded-lg p-3 text-xs" style={{ background: '#0A1628' }}>
                  <div className="flex justify-between"><span className="text-slate-500">Role</span><span className="font-medium text-slate-200 truncate max-w-[140px]">{primaryLabel}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Skip setup</span><span className="font-medium text-green-400">On</span></div>
                </div>
                <button onClick={() => setShowSettings(false)} className="mt-3 w-full rounded-lg py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>Reset — show setup next time</button>
              </div>
              <div className="border-t" style={{ borderColor: '#1E2D45' }} />
              <div>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Window Settings</p>
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-sm font-medium text-slate-200">Auto Respond</p><p className="mt-0.5 text-xs text-slate-500">AI answers automatically — turn off to press Space yourself</p></div>
                    <Toggle on={autoRespond} onToggle={() => setAutoRespond(a => !a)} />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-sm font-medium text-slate-200">Stealth Mode</p><p className="mt-0.5 text-xs text-slate-500">Hides Copilot from screen share</p></div>
                    <Toggle on={stealthMode} onToggle={() => setStealthMode(s => !s)} />
                  </div>
                  <div>
                    <div className="mb-2 flex justify-between"><p className="text-sm font-medium text-slate-200">Transparent Background</p><span className="text-xs text-slate-400">{transparency}%</span></div>
                    <input type="range" min={0} max={100} value={transparency} onChange={e => onTransparencyChange(Number(e.target.value))} className="w-full accent-primary" />
                    <p className="mt-1.5 text-xs text-slate-500">Adjust window transparency over other apps</p>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-sm font-medium text-slate-200">Always on Top</p><p className="mt-0.5 text-xs text-slate-500">Keeps Copilot above all other windows</p></div>
                    <Toggle on={alwaysOnTop} onToggle={() => setAlwaysOnTop(s => !s)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-shrink-0 items-center justify-between px-5 py-3" style={{ background: '#0A1628' }}>
        <div className="flex items-center gap-2 text-sm text-slate-300"><div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />{TITLE_TEXT[useCaseId](primaryLabel)}</div>
        <div className="flex items-center gap-3"><span className="font-mono text-sm text-slate-300">{formatTime(elapsed)}</span><button onClick={onEnd} className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-600">End Session</button></div>
      </div>

      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 px-5 py-2" style={{ background: '#0F2340' }}>
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-[3px]">{[5,8,11,14].map((h,i) => <div key={i} className="w-[3px] rounded-sm bg-green-400" style={{height:h}} />)}</div>
            <span className="text-green-400">Strong</span>
          </div>
          <span className="italic text-slate-400">{statusText[copilotStatus]}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <label className="flex items-center gap-2">
            Auto scroll
            <input type="range" min={1} max={5} value={scrollSpeed} onChange={e => setScrollSpeed(Number(e.target.value))} className="w-20 accent-primary" />
            <span className="w-3 text-slate-500">{scrollSpeed}</span>
          </label>
          <label className="flex items-center gap-2">
            Font size
            <input type="range" min={12} max={20} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-20 accent-primary" />
            <span className="w-5 text-slate-500">{fontSize}</span>
          </label>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden p-2">
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl transition-all duration-500" style={{ background: '#0D1929', border: copilotStatus === 'listening' ? '1px solid #22c55e' : '1px solid #1E2D45', ...(copilotStatus === 'listening' ? { animation: 'glowPulse 2s ease-in-out infinite' } : {}) }}>
          <div className="flex flex-shrink-0 items-center justify-between border-b px-4 py-3" style={{ borderColor: '#1E2D45' }}>
            <div className="flex items-center gap-2 text-sm font-medium text-white">Live Response<div className="h-2 w-2 rounded-full bg-red-500" /></div>
            <button data-testid="open-settings" onClick={() => setShowSettings(true)}><Settings className="h-4 w-4 text-slate-400 hover:text-white transition-colors" /></button>
          </div>
          <div ref={panelRef} className="flex-1 space-y-6 overflow-y-auto p-5">
            {history.map((item, i) => (
              <div key={i} className="space-y-3">
                <div><p className="mb-1 text-xs text-slate-500">{item.speaker}</p><div className="inline-block rounded-lg px-3 py-2" style={{ background: '#1A2F4A' }}><p className="text-sm text-white">{item.q}</p></div></div>
                <p className="text-sm leading-relaxed text-slate-200">{item.a}</p>
              </div>
            ))}
            <div className="space-y-3">
              {qDisplayed && (
                <div><p className="mb-1 text-xs text-slate-500">{speakerLabel}</p><div className="inline-block rounded-lg px-3 py-2" style={{ background: '#1A2F4A' }}><p className="text-sm text-white">{qDisplayed}{copilotStatus === 'listening' && qDisplayed.length < bank[questionIndex].q.length && <span style={{ animation: 'blink 0.5s ease-in-out infinite' }}>|</span>}</p></div></div>
              )}
              {copilotStatus === 'processing' && <div className="flex items-center gap-1.5 py-1">{[0,1,2].map(i => <div key={i} className="h-2 w-2 rounded-full bg-slate-500" style={{ animation: 'processingDot 0.9s ease-in-out infinite', animationDelay: `${i * 0.18}s` }} />)}</div>}
              {copilotStatus === 'answering' && aDisplayed && <p className="leading-relaxed text-slate-200" style={{ fontSize }}>{aDisplayed}{aDisplayed.length < bank[questionIndex].a.length && <span className="ml-px inline-block w-[2px] bg-primary align-middle" style={{ height: '1em', animation: 'blink 0.45s ease-in-out infinite' }} />}</p>}
              {!qDisplayed && history.length === 0 && <p className="text-xs italic text-slate-600">{autoRespond ? 'Auto Respond is on — listening automatically...' : 'Press Space to start the simulation...'}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- --run src/pages/DesktopCopilotPreview.test.tsx`
Expected: PASS (16 tests)

- [ ] **Step 6: Commit**

```bash
git add src/pages/DesktopCopilotPreview.tsx src/pages/DesktopCopilotPreview.test.tsx
git commit -m "feat: generalize LiveCanvas for Sales Call/Meeting with Auto Respond"
```

---

### Task 5: Per-use-case `CompleteScreen` copy

**Files:**
- Modify: `src/pages/DesktopCopilotPreview.tsx` (the `// Screen 4: Complete` section, `CompleteScreen` function)
- Test: Modify `src/pages/DesktopCopilotPreview.test.tsx`

**Interfaces:**
- Consumes: `getUseCase` from `./desktopCopilot/useCases` (Task 1)
- Produces: `export function CompleteScreen({ useCaseId, onGoHome }: { useCaseId: UseCaseId; onGoHome: () => void })`. Task 7 renders this for all 5 use cases.

- [ ] **Step 1: Write the failing tests**

```tsx
// Append to src/pages/DesktopCopilotPreview.test.tsx
import { CompleteScreen } from './DesktopCopilotPreview'

describe('CompleteScreen', () => {
  it('shows the Interview-specific heading', () => {
    render(<CompleteScreen useCaseId="interview" onGoHome={() => {}} />)
    expect(screen.getByText('👏 Your Interview is complete!')).toBeInTheDocument()
  })

  it('shows the Sales Call-specific heading', () => {
    render(<CompleteScreen useCaseId="sales-call" onGoHome={() => {}} />)
    expect(screen.getByText('🤝 Your Sales Call is complete!')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run src/pages/DesktopCopilotPreview.test.tsx`
Expected: FAIL — `CompleteScreen` isn't exported yet and still hardcodes Interview copy

- [ ] **Step 3: Replace `CompleteScreen`**

Replace the whole `CompleteScreen` function with:

```tsx
// ---------------------------------------------------------------------------
// Screen 4: Complete
// ---------------------------------------------------------------------------
export function CompleteScreen({ useCaseId, onGoHome }: { useCaseId: UseCaseId; onGoHome: () => void }) {
  const config = getUseCase(useCaseId)
  return (
    <div className="flex flex-1 flex-col justify-center px-12 py-16" style={{ background: 'linear-gradient(145deg, #0c1d48 0%, #0d3285 55%, #1a5aff 100%)' }}>
      <div className="max-w-[520px]">
        <h1 className="mb-5 text-4xl font-bold leading-tight text-white">{config.completeHeading}</h1>
        <p className="mb-10 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {config.completeBody}
        </p>
        <div className="flex gap-3">
          <button onClick={onGoHome} className="h-11 rounded-xl border border-white/40 px-6 text-sm font-semibold text-white hover:bg-white/10">
            Go Home
          </button>
          <button className="flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-bold text-white hover:opacity-90" style={{ background: BLUE }}>
            See Report <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- --run src/pages/DesktopCopilotPreview.test.tsx`
Expected: PASS (18 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/DesktopCopilotPreview.tsx src/pages/DesktopCopilotPreview.test.tsx
git commit -m "feat: per-use-case CompleteScreen copy"
```

---

### Task 6: Use-Case Selection Screen

**Files:**
- Modify: `src/pages/DesktopCopilotPreview.tsx` (insert new component after `OnboardingScreen`, before the `// Resume Import Modal` comment)
- Test: Modify `src/pages/DesktopCopilotPreview.test.tsx`

**Interfaces:**
- Consumes: `USE_CASES` from `./desktopCopilot/useCases` (Task 1)
- Produces: `export function UseCaseSelectionScreen({ onSelect }: { onSelect: (id: UseCaseId) => void })`. Task 7 renders this between Onboarding and Setup.

- [ ] **Step 1: Write the failing tests**

```tsx
// Append to src/pages/DesktopCopilotPreview.test.tsx
import { UseCaseSelectionScreen } from './DesktopCopilotPreview'

describe('UseCaseSelectionScreen', () => {
  it('renders all 5 use case cards', () => {
    render(<UseCaseSelectionScreen onSelect={() => {}} />)
    expect(screen.getByText('Interview')).toBeInTheDocument()
    expect(screen.getByText('Sales Call')).toBeInTheDocument()
    expect(screen.getByText('Meeting')).toBeInTheDocument()
    expect(screen.getByText('Exam')).toBeInTheDocument()
    expect(screen.getByText('Coding')).toBeInTheDocument()
  })

  it('calls onSelect with the chosen use case id', () => {
    const onSelect = vi.fn()
    render(<UseCaseSelectionScreen onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Sales Call'))
    expect(onSelect).toHaveBeenCalledWith('sales-call')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run src/pages/DesktopCopilotPreview.test.tsx`
Expected: FAIL — `UseCaseSelectionScreen` doesn't exist yet

- [ ] **Step 3: Insert the `UseCaseSelectionScreen` component**

Insert directly after `OnboardingScreen`'s closing `}`, before the `// Resume Import Modal` comment:

```tsx
// ---------------------------------------------------------------------------
// Screen 1b: Use-Case Selection
// ---------------------------------------------------------------------------
export function UseCaseSelectionScreen({ onSelect }: { onSelect: (id: UseCaseId) => void }) {
  return (
    <div className="flex min-h-[580px] flex-col items-center px-12 py-10" style={{ background: BG }}>
      <h1 className="mb-3 text-center text-3xl font-bold text-white">What are you using Copilot for?</h1>
      <p className="mb-10 max-w-lg text-center text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Choose a use case to tailor how Copilot listens and responds.
      </p>
      <div className="grid w-full max-w-[700px] grid-cols-2 gap-3">
        {USE_CASES.map(uc => {
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
Expected: PASS (20 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/DesktopCopilotPreview.tsx src/pages/DesktopCopilotPreview.test.tsx
git commit -m "feat: add use-case selection screen"
```

---

### Task 7: Wire the orchestrator end to end

**Files:**
- Modify: `src/pages/DesktopCopilotPreview.tsx:37` (`DesktopView` type), and the default-exported `DesktopCopilotPreview` function (from `// Main` comment to end of file)
- Test: Modify `src/pages/DesktopCopilotPreview.test.tsx`

**Interfaces:**
- Consumes: every export produced by Tasks 1–6 (`getUseCase`, `UseCaseId`, `SetupScreen`, `PreferenceModal`, `ScreenshotCanvas`, `LiveCanvas`, `CompleteScreen`, `UseCaseSelectionScreen`)
- Produces: the default export `DesktopCopilotPreview`, unchanged signature (no props) — this is the route component, nothing downstream of it in the app.

- [ ] **Step 1: Write the failing test**

```tsx
// Append to src/pages/DesktopCopilotPreview.test.tsx
import DesktopCopilotPreview from './DesktopCopilotPreview'

describe('DesktopCopilotPreview end to end', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('walks from splash through use-case selection to the Exam setup screen', async () => {
    render(<DesktopCopilotPreview />)
    await act(async () => { vi.advanceTimersByTime(2300) })
    expect(screen.getByText('Welcome to Lightforth Co-Pilot')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Continue'))
    expect(screen.getByText('What are you using Copilot for?')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Exam'))
    expect(screen.getByText('Subject')).toBeInTheDocument()
    expect(screen.queryByText('Select Audio')).not.toBeInTheDocument()
  })

  it('routes Coding to the screenshot canvas and Interview to the conversational canvas', async () => {
    render(<DesktopCopilotPreview />)
    await act(async () => { vi.advanceTimersByTime(2300) })
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('Coding'))
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('Confirm'))
    expect(screen.getByText(/Press Space to capture/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/pages/DesktopCopilotPreview.test.tsx`
Expected: FAIL — the orchestrator still only knows the old `'setup' | 'live' | 'complete'` flow and passes `jobTitle`/no `useCaseId` to its children

- [ ] **Step 3: Update the `DesktopView` type**

In `src/pages/DesktopCopilotPreview.tsx:37`, replace:

```tsx
type DesktopView = 'splash' | 'onboarding' | 'setup' | 'live' | 'complete'
```

with:

```tsx
type DesktopView = 'splash' | 'onboarding' | 'select-use-case' | 'setup' | 'live' | 'complete'
```

- [ ] **Step 4: Replace the default-exported orchestrator**

Replace the whole `// Main` section (the `export default function DesktopCopilotPreview()` block at the end of the file) with:

```tsx
// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
export default function DesktopCopilotPreview() {
  const [view, setView] = useState<DesktopView>('splash')
  const [useCase, setUseCase] = useState<UseCaseId>('interview')
  const [primaryLabel, setPrimaryLabel] = useState('')
  const [transparency, setTransparency] = useState(0)

  const config = getUseCase(useCase)

  return (
    <MacWindow blendBar={view === 'splash' || view === 'onboarding' || view === 'select-use-case' || view === 'complete'} transparency={view === 'live' ? transparency : 0}>
      {view === 'splash'          && <SplashScreen          onDone={() => setView('onboarding')} />}
      {view === 'onboarding'      && <OnboardingScreen      onContinue={() => setView('select-use-case')} />}
      {view === 'select-use-case' && <UseCaseSelectionScreen onSelect={id => { setUseCase(id); setView('setup') }} />}
      {view === 'setup'           && <SetupScreen useCaseId={useCase} onContinue={label => { setPrimaryLabel(label); setView('live') }} />}
      {view === 'live' && config.canvasPattern === 'conversational' && (
        <LiveCanvas
          useCaseId={useCase as 'interview' | 'sales-call' | 'meeting'}
          primaryLabel={primaryLabel}
          onEnd={() => setView('complete')}
          transparency={transparency}
          onTransparencyChange={setTransparency}
        />
      )}
      {view === 'live' && config.canvasPattern === 'screenshot-qa' && (
        <ScreenshotCanvas
          useCaseId={useCase as 'exam' | 'coding'}
          primaryLabel={primaryLabel}
          onEnd={() => setView('complete')}
          transparency={transparency}
          onTransparencyChange={setTransparency}
        />
      )}
      {view === 'complete' && <CompleteScreen useCaseId={useCase} onGoHome={() => setView('splash')} />}
    </MacWindow>
  )
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- --run src/pages/DesktopCopilotPreview.test.tsx`
Expected: PASS (22 tests)

- [ ] **Step 6: Run the full suite and the type checker**

Run: `npm test -- --run`
Expected: PASS, all suites, no failures

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: no errors

- [ ] **Step 7: Manual verification**

Run: `npm run dev`, open `/desktop-copilot-preview`, and walk through all 5 use cases end to end: Splash → Onboarding → Use-Case Selection → Setup (use-case-specific fields) → Preference modal (Answer Length shown for Interview/Sales Call/Meeting, hidden for Exam/Coding) → Live Canvas (correct pattern, correct speaker labels) → toggle Auto Respond in Settings and confirm it advances without pressing Space → Complete screen (correct copy per use case).

- [ ] **Step 8: Commit**

```bash
git add src/pages/DesktopCopilotPreview.tsx src/pages/DesktopCopilotPreview.test.tsx
git commit -m "feat: wire use-case selection and per-use-case canvas dispatch into the orchestrator"
```

---

## Plan Self-Review

**Spec coverage:** Use-case selection screen (Task 6), per-use-case Setup fields (Task 2), Answer Length preference (Task 2), conversational canvas with speaker labels (Task 4), screenshot Q&A canvas with code-block + Copy for Coding (Task 3), shared `UseCaseConfig` architecture (Task 1), per-use-case Complete copy (Task 5), end-to-end wiring (Task 7). The Auto Respond toggle requested mid-plan is covered in Tasks 3 and 4. Pricing/billing and Knowledge Center are explicitly out of scope for this plan (separate specs).

**Type consistency:** `UseCaseId`, `UseCaseConfig`, `getUseCase`, `USE_CASES` (Task 1) are consumed identically in Tasks 2, 5, 6, 7. `SetupScreen`'s `onContinue: (primaryLabel: string) => void` (Task 2) matches how Task 7 consumes it. `LiveCanvas`/`ScreenshotCanvas` both take `{ useCaseId, primaryLabel, onEnd, transparency, onTransparencyChange }` (Tasks 3, 4), matching how Task 7 calls them. `PreferenceModal`'s `hasAnswerLength` prop (Task 2) is read from `config.hasAnswerLength` (Task 1) consistently.

**No placeholders:** every step shows complete code, not descriptions.
