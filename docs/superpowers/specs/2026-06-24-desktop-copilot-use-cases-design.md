# Desktop Copilot — Multi Use-Case Expansion

## Context

The desktop Copilot app (prototyped at [`src/pages/DesktopCopilotPreview.tsx`](../../../src/pages/DesktopCopilotPreview.tsx), route `/desktop-copilot-preview`) is being turned into a standalone, sellable product (download CTA on the marketing site → macOS/Windows/iOS app). Today the prototype only supports one use case: **Interview**. The product is expanding to support four more: **Sales Call, Exam, Coding, Meeting**. This is the first of three specs covering the expansion (use-case flows → pricing/billing → Knowledge Center, in that order); pricing and Knowledge Center are deliberately out of scope here.

The prototype is a client-side mock (no real audio/screen capture or AI backend) used to design and demo the UX — this spec extends that same prototype, not a native app build.

## Use-Case Selection Screen

A new screen inserted between `OnboardingScreen` (permissions) and `SetupScreen`, after the user grants access. Five cards, one per use case:

| Use case | Icon | Description |
|---|---|---|
| Interview | `Video` | Real-time answers during your job interview |
| Sales Call | `Phone` | Live coaching while you close a deal |
| Exam | `GraduationCap` | Instant answers from a screenshot of your exam |
| Coding | `Code2` | Code answers for technical interviews & tests |
| Meeting | `Users` | Live talking points, tracked by speaker |

Selecting a card sets a `useCase` value in app state (`DesktopCopilotPreview`'s top-level state) and routes to a use-case-specific `SetupScreen`.

**Removed:** the existing internal `Live Interview` / `Coding` tab toggle inside `SetupScreen` (current lines 306, 346–355) — redundant now that Coding is a top-level use case.

## Setup Screen Per Use Case

The existing card-based layout (rounded sections, same visual style as today's Position/Resume/Job Description/Audio cards) is reused, with fields swapped per use case:

| Use case | Fields |
|---|---|
| **Interview** (unchanged) | Position, Resume (upload or "Use Lightforth Resume"), Job description (optional), Audio device |
| **Sales Call** | Customer/Company name, Deal stage (dropdown: Discovery / Demo / Negotiation / Closing), Talk track notes (optional textarea), Audio device |
| **Meeting** | Meeting title, Agenda (optional textarea), Audio device, screen-share reminder note |
| **Exam** | Subject (free text, e.g. "Calculus II"), Start button — no audio/resume needed, purely screenshot-triggered |
| **Coding** | Language/stack (optional free text, "leave blank to auto-detect"), Start button — no audio needed |

All five continue to flow into the existing `PreferenceModal` (Response Style: Default/Headlines/Coaching) before going live.

### Preference Modal addition: Answer Length

For **Interview, Sales Call, and Meeting only** (the spoken/conversational use cases), the Preference modal gains a second selector: **Answer Length** — `Short` / `Medium` / `Long` — presented the same way as the existing Response Style selector (segmented buttons + live preview text + confirm). Exam and Coding don't get this control, since their answers are sized by the content of the question, not a speaking-time preference.

## Live Canvas: Two Patterns

Rather than five distinct live screens, use cases collapse into two interaction patterns, each a variant of the canvas:

### Conversational pattern (Interview, Sales Call, Meeting)

Reuses the existing `LiveCanvas` structure unchanged: top bar (use-case label + timer + End button), status bar (audio-strength meter + Listening/Processing/Answering state), transcript panel, Space-bar-driven listening → processing → answering cycle, Settings modal (Stealth Mode, Transparency, Always on Top, font size, scroll speed).

Per-use-case differences are data/label-only, not structural:
- Speaker label: "Interviewer" (Interview) · "Customer" (Sales Call) · "Speaker 1" / "Speaker 2" / etc., with a resolved name if available (Meeting)
- Top bar title: "Interview for {role}" / "Sales Call with {customer}" / "Meeting: {title}"
- Meeting shows a screen-share thumbnail since it's capturing video, not just audio

### Screenshot Q&A pattern (Exam, Coding)

A new canvas variant. No continuous audio-strength meter or "Listening" state. Flow: idle ("Press Space to capture your screen") → screenshot captured → "Analyzing..." → answer rendered. Past screenshot+answer pairs in the session appear below as history, mirroring the existing transcript history pattern but keyed by screenshot rather than spoken question.

- **Coding**: answer renders as a syntax-highlighted code block with a Copy button (same copy interaction as the Resume Builder's AI diff view)
- **Exam**: answer renders as plain explanatory text, same as today's interview answer text

Both variants keep the Settings modal (font size, scroll speed, stealth mode, transparency).

## Shared Architecture

A single `UseCase` config object (new file, e.g. `src/pages/desktopCopilot/useCases.ts`) drives the whole flow:

```ts
type CanvasPattern = 'conversational' | 'screenshot-qa'

interface UseCaseConfig {
  id: 'interview' | 'sales-call' | 'exam' | 'coding' | 'meeting'
  label: string
  icon: LucideIcon
  description: string
  canvasPattern: CanvasPattern
  hasAnswerLength: boolean   // Interview/Sales Call/Meeting = true
  setupFields: SetupFieldConfig[]
}
```

Adding a future 6th use case becomes a new config entry, not a new screen. The `CompleteScreen` stays shared, with use-case-specific copy ("Your Sales Call is complete!" vs "Your Interview is complete!") pulled from the config.

## Out of Scope (covered in later specs)

- Pricing/billing differences between use cases (one-time fee for Exam, org/seat pricing for Sales Call, credit-based for Interview/Coding/Meeting)
- Knowledge Center (per-use-case document upload: resumes, FAQs/scripts, meeting docs)
- Real audio capture, screen capture, speaker diarization, and AI backend integration — this spec covers the mocked prototype UX only

## Verification

Run the prototype locally (`npm run dev`, navigate to `/desktop-copilot-preview`) and walk through all 5 use cases end to end: Splash → Onboarding → Use-Case Selection → Setup (use-case-specific fields) → Preference modal (with Answer Length where applicable) → Live Canvas (correct pattern) → Complete screen (correct copy).
