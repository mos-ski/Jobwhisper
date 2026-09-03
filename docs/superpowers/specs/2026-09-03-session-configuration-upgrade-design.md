# Interview Session Configuration Upgrade — Design

## Goal

Bring several capabilities from a reference competitor's session-creation overlay (Parakeet AI) into this product's own interview session configuration flows: a model-tier selector, a response-language selector, resume-based autofill, and setup-time Auto Answer / Save Transcript toggles — applied across all three existing (and currently separately implemented) configure flows: Interview Copilot (web), Interview Prep (web), and the Desktop app. Also improve the Knowledge Base document picker used by all three (select-all, inline document add) and add a "Meeting Detect" toggle to the Desktop app's settings.

Front-end/mock-data only, consistent with the rest of this codebase — no real AI model routing, no real resume parsing, no real meeting-app detection.

## Non-goals

- No real backend/AI wiring for model tier or language — selecting a value only changes local state/copy, same convention as every other mocked control in this app.
- No consolidation of the three separately-implemented configure views (`CopilotConfigureView`, `InterviewConfigureView`, `DesktopConfigureView`) into one shared component — out of scope, a larger refactor than requested.
- No full "Window Settings" section (stealth mode, transparency, always-on-top) in the Desktop app — only the one requested "Meeting Detect" toggle. The docs already envision the bigger section; not building it now.
- No real screen-recording/meeting-app detection — "Meeting Detect" is a mocked toggle with no OS-level hook.
- No changes to billing/credits — model tier does not affect price, consistent with `PRICING.md`'s flat per-feature rate.

## Part 1 — New setup fields (Copilot, Prep, Desktop)

### Data model

`src/contracts/copilot.draft.ts` — extend `CopilotSetup`:
```ts
export type CopilotModelTier = 'balanced' | 'precision'

// added to CopilotSetup:
readonly responseLanguage: string   // e.g. 'English'
readonly modelTier: CopilotModelTier
readonly autoAnswer: boolean        // default false
readonly saveTranscript: boolean    // default true (opt-out, preserves today's always-on behavior)
```

`src/contracts/interview.draft.ts` — extend `InterviewPrepSession`:
```ts
// added to InterviewPrepSession:
readonly responseLanguage: string
readonly modelTier: CopilotModelTier   // reuse the same type, imported from copilot.draft.ts
readonly autoAnswer: boolean           // see "Auto Answer in Prep" below — default false
readonly saveTranscript: boolean       // default true
```

`DesktopConfigureView` (`src/features/desktop/desktop-configure-view.tsx`) currently uses local `useState` fields rather than either contract type. Add matching local state: `responseLanguage`, `modelTier`, `autoAnswer`, `saveTranscript` — same pattern as its existing `targetRole`/`companyName`/etc.

### Model tier options

Two tiers, not three — avoids inventing granularity with no real backing difference:

| Value | Label | Copy |
|---|---|---|
| `balanced` (default) | Balanced | Fast responses, great for most interviews |
| `precision` | Precision | Deeper reasoning, slightly slower |

Rendered as a `<select>`, matching the existing Interview Type / Difficulty / Coding Language controls already in these forms. Deliberately not named after a vendor/model (e.g. "Gemini 3.5 Flash Lite") — this product doesn't expose which AI vendor powers a feature anywhere else, and `PRICING.md` treats all Copilot modes as charging identically regardless of underlying tech.

### Response language options

Single-select `<select>`, same control pattern: English (default), Spanish, French, German, Portuguese, Mandarin Chinese.

### Resume-based autofill

A "Fill fields from resume" action next to the Company Name / Target Role fields in the Configure step. Uses whichever resume was picked/uploaded in the upload step (already present as prior state in all three flows). On click, populates Company Name, Target Role, and Interview Description using the same typewriter-fill animation already built for the "Additional context" AI-suggestion action — reuses that existing mechanic rather than introducing a new one. Mocked: the "extracted" values come from a small canned mapping keyed off the resume's mock id, same fidelity as the existing Additional-Context AI suggestion.

### Auto Answer

- **Copilot**: unchanged meaning — whether Copilot answers live-interviewer questions automatically or waits for a manual trigger. New: this becomes a **setup-time default** (checkbox in the Preferences step's new "Behavior" section) rather than something only chosen mid-session. The existing live-session `CopilotLiveSettingsModal` Auto/Manual runtime toggle now seeds its initial value from this setup field instead of always defaulting to manual; it remains changeable live.
- **Interview Prep**: reframed, since Prep has no live interviewer for Copilot to answer on behalf of — here the AI is the interviewer and the human is the one answering. Auto Answer instead toggles: **Manual** (default) — the user answers each practice question before seeing feedback; **Auto** — the AI immediately reveals a model/sample answer alongside the question, for a "read and learn" pass instead of active practice. Rendered as a checkbox in the Configure step (Prep has no separate Preferences step).
- **Desktop**: interview-only, mirrors Copilot's meaning (live-interviewer auto-answer).

### Save Transcript

Checkbox, default checked (preserves today's always-saved behavior as an opt-out). Present in all three flows' Behavior section.

### Field placement per flow

| Field | Copilot (web) | Prep (web) | Desktop |
|---|---|---|---|
| Model tier | Preferences step (`CopilotPreferencesView`), next to Response Type/Length | Configure step (`InterviewConfigureView`) — Prep has no separate preferences step | Configure form |
| Response language | Preferences step | Configure step | Configure form |
| Fill from resume | Configure step, next to Company/Role | Configure step | Configure form |
| Auto Answer (checkbox) | Preferences step, new "Behavior" section | Configure step, new "Behavior" section (reframed meaning above) | Configure form, "Behavior" section |
| Save Transcript (checkbox) | Preferences step, "Behavior" section | Configure step, "Behavior" section | Configure form, "Behavior" section |

Checkboxes (not the pill-style `Switch` used for things like Automatic Reload elsewhere) — visually distinguishes one-off session behavior flags from persistent account settings, and matches the reference screenshot.

## Part 2 — Knowledge Base picker: select-all + inline add

The KB document picker (a `Dialog` with a checkbox list of `ContextDocumentRow`s) is currently hand-duplicated three times: `CopilotConfigureView` (`interview-copilot-view.tsx:371-416`), `InterviewConfigureView` (`interview-prep-view.tsx:294-325`), and `DesktopConfigureView` (`desktop-configure-view.tsx:173-195`), with minor copy/sizing differences between them.

**Extract first, then add features once:** pull a shared `KnowledgeBasePickerDialog` component (new file, `src/features/documents/knowledge-base-picker-dialog.tsx`, alongside the existing `documents-view.tsx`) taking `documents: readonly ContextDocumentRow[]`, `selectedIds`, `onConfirm`, and small copy-variance props (description text, list max-height) to preserve each call site's existing minor differences. All three configure views switch to rendering this shared component instead of their own inline `Dialog` markup.

New features, built once inside the shared component:
- **Select all**: header row above the list with a checkbox reflecting all/none/some-selected state; toggling it selects or clears every document in the draft selection.
- **Inline add (paste text only)**: a small "+ Add document" affordance that reveals a textarea (mirroring `DocumentsManualView`'s paste-text pattern) and a Save action that appends a new mock `ContextDocumentRow` to the list and auto-selects it. Upload and URL-scrape are **not** embedded inline — those are genuine page-level flows in the existing Documents Add flow (`documents-add-page.tsx` → `/documents` or `/documents/manual`); the dialog instead shows a "More ways to add — go to Documents" link out to that flow for those two methods.

## Part 3 — Desktop app: Meeting Detect toggle

The Desktop app's only settings surface today is a flat list inside one `Dialog` (`desktop-session-view.tsx:80-98`: Theme, Microphone, Sign out — no tabs, no sections). No "Meeting Detect" concept exists anywhere in the codebase yet.

Add a **"Window"** grouped section header within that same flat list (not a new `Tabs` structure — only one new control is in scope, so full tab sectioning would be premature) containing:
- **Meeting Detect** — checkbox + short description ("Notify me when a meeting app is active"), default off. Mocked: no real OS-level detection; toggling only changes local state and is inert otherwise.

The section header is styled the same as the implicit grouping already used elsewhere in this settings list, just with a small uppercase label ("Window") above the row, matching the "Ace Your Interview" / "Find Jobs Yourself" grouping labels already used in `account-view.tsx`'s Billing page for a precedent.

## Testing / verification

Front-end-only change — verification means:
1. `npx tsc --noEmit -p tsconfig.app.json` — no new errors beyond the existing pre-change baseline.
2. `npx vitest run` — matches the existing baseline (pre-existing jsdom gap in `auth-flow.test.tsx`, unrelated).
3. Manual browser pass through all three configure flows (Copilot web, Prep web, Desktop) at desktop width, plus mobile width (375px) for the two web flows, confirming: new fields render and are usable, "Fill from resume" fills the expected fields, Auto Answer/Save Transcript checkboxes persist into the session, KB picker select-all and inline-add work in all three call sites, and the Desktop settings dialog shows the new Window/Meeting Detect row.
