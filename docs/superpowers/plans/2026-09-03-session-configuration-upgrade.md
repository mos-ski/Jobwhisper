# Interview Session Configuration Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a model-tier selector, response-language selector, resume-based autofill, and setup-time Auto Answer / Save Transcript checkboxes to Interview Copilot, Interview Prep, and the Desktop app's configure screens; extract a shared Knowledge Base picker with select-all and inline paste-add; add a Meeting Detect toggle to the Desktop app's settings.

**Architecture:** Extend two existing mock-data contracts (`CopilotSetup`, `InterviewPrepSession`) with four new fields, reuse existing `FormSelectField`/`Checkbox`/`AiSuggestionAction` UI primitives (no new design-system components needed for the field additions), and extract one new shared component (`KnowledgeBasePickerDialog`) to de-duplicate the picker that's currently hand-copied three times.

**Tech Stack:** React 19 + TypeScript, Tailwind v4, existing `@/ui` design-system primitives, Vite, Vitest.

## Global Constraints

- Front-end/mock-data only — no real AI model routing, no real resume parsing, no real meeting-app detection. Every "smart" action (autofill, model tier, language) only changes local component state or copy.
- No consolidation of `CopilotConfigureView` / `InterviewConfigureView` / `DesktopConfigureView` beyond the Knowledge Base picker extraction — they stay three separate components.
- This codebase has no per-component unit test convention (11 existing test files total, none testing these wizard views) — verification is `tsc` + the existing `vitest` baseline + manual browser walkthrough per task, not new unit tests. Match this established pattern rather than introducing TDD ceremony for UI-only changes.
- `tsc` baseline: run `npx tsc --noEmit -p tsconfig.app.json` before starting and treat that output as the baseline — after each task, only NEW errors are a problem.
- `vitest` baseline: `npx vitest run` — 1 file / 10 tests fail today (`src/apps/web/auth-flow.test.tsx`, a pre-existing jsdom gap unrelated to this work). Any task that changes that count needs investigation.
- Checkboxes (not the pill-style `Switch`) for all new Behavior toggles — matches the reference screenshot and distinguishes one-off session flags from persistent account settings like Automatic Reload.
- Model tier options are exactly two: `balanced` (default) / `precision` — do not add a third tier.
- Response language options are exactly: English (default), Spanish, French, German, Portuguese, Mandarin Chinese.

---

### Task 1: Extend contracts and mock data

**Files:**
- Modify: `src/contracts/copilot.draft.ts`
- Modify: `src/contracts/interview.draft.ts`
- Modify: `src/mocks/copilot.ts`
- Modify: `src/mocks/interview.ts`

**Interfaces:**
- Produces: `CopilotModelTier` type (`'balanced' | 'precision'`), four new fields on `CopilotSetup` (`responseLanguage: string`, `modelTier: CopilotModelTier`, `autoAnswer: boolean`, `saveTranscript: boolean`), three new fields on `InterviewPrepSession` (`responseLanguage: string`, `modelTier: CopilotModelTier`, `saveTranscript: boolean` — no `autoAnswer`, see design doc §"Auto Answer" for why Prep doesn't get this field).

- [ ] **Step 1: Add `CopilotModelTier` and extend `CopilotSetup`**

In `src/contracts/copilot.draft.ts`, add after the existing `CopilotMode` type (currently line 5):

```ts
export type CopilotModelTier = 'balanced' | 'precision';
```

Then extend `CopilotSetup` (currently lines 7-20) by adding four fields before the closing `};`:

```ts
export type CopilotSetup = {
  readonly mode: CopilotMode;
  readonly uploadedFileName: string;
  readonly interviewType: string;
  readonly difficulty: string;
  readonly targetRole: string;
  readonly companyName: string;
  readonly additionalContext: string;
  readonly responseMode: CopilotResponseMode;
  readonly responseLength: CopilotResponseLength;
  readonly meetingTitle?: string;
  readonly meetingAgenda?: string;
  readonly codingLanguage?: string;
  readonly responseLanguage: string;
  readonly modelTier: CopilotModelTier;
  readonly autoAnswer: boolean;
  readonly saveTranscript: boolean;
};
```

- [ ] **Step 2: Extend `InterviewPrepSession`**

In `src/contracts/interview.draft.ts`, add an import at the top of the file (it currently has no imports):

```ts
import type { CopilotModelTier } from './copilot.draft'
```

Then extend `InterviewPrepSession` (currently lines 15-24):

```ts
export type InterviewPrepSession = {
  readonly id: string;
  readonly uploadedFileName: string;
  readonly interviewType: InterviewType;
  readonly difficulty: InterviewDifficulty;
  readonly targetRole: string;
  readonly companyName: string;
  readonly additionalContext: string;
  readonly optionalDocuments: readonly string[];
  readonly responseLanguage: string;
  readonly modelTier: CopilotModelTier;
  readonly saveTranscript: boolean;
};
```

- [ ] **Step 3: Update the `copilotSetup` mock**

In `src/mocks/copilot.ts`, add the four new fields to `copilotSetup` (currently lines 11-22):

```ts
export const copilotSetup: CopilotSetup = {
  mode: 'interview',
  uploadedFileName: 'adewale_damola_PM_resume.pdf',
  interviewType: 'Introductory',
  difficulty: 'Medium',
  targetRole: 'Product Manager',
  companyName: 'Google',
  additionalContext:
    'Use this space to include job description details, portfolio notes, or anything the interviewer should probe during the live call.',
  responseMode: 'default',
  responseLength: 'medium',
  responseLanguage: 'English',
  modelTier: 'balanced',
  autoAnswer: false,
  saveTranscript: true,
}
```

- [ ] **Step 4: Update the `interviewSession` mock**

In `src/mocks/interview.ts`, add the three new fields to `interviewSession` (currently lines 3-13):

```ts
export const interviewSession: InterviewPrepSession = {
  id: 'interview-session-001',
  uploadedFileName: 'adewale_damola_PM_resume.pdf',
  interviewType: 'introductory',
  difficulty: 'medium',
  targetRole: 'Product Manager',
  companyName: 'Google',
  additionalContext:
    'I am preparing for a product manager interview focused on growth, user research, and cross-functional leadership. The role expects clear examples of prioritization, metrics, and stakeholder communication.',
  optionalDocuments: ['Product case notes.pdf'],
  responseLanguage: 'English',
  modelTier: 'balanced',
  saveTranscript: true,
}
```

- [ ] **Step 5: Verify and commit**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: new errors only in `desktop-configure-view.tsx` (doesn't use these types yet — fine, addressed in Task 5) and possibly in the two consuming views (addressed in Tasks 3-4) — no errors in `copilot.draft.ts`, `interview.draft.ts`, `mocks/copilot.ts`, or `mocks/interview.ts` themselves.

```bash
git add src/contracts/copilot.draft.ts src/contracts/interview.draft.ts src/mocks/copilot.ts src/mocks/interview.ts
git commit -m "Add model tier, language, auto answer, and save transcript to session config contracts"
```

---

### Task 2: Shared `KnowledgeBasePickerDialog` component

**Files:**
- Create: `src/features/documents/knowledge-base-picker-dialog.tsx`
- Modify: `src/ui/index.ts` (no change needed — this lives in `features`, not `ui`, since it's document-domain-specific, matching where `documents-view.tsx` already lives)

**Interfaces:**
- Consumes: `ContextDocumentRow` from `@/contracts/documents.draft`; `Checkbox`, `Dialog`, `DialogClose`, `DialogPopup`, `DialogTitle`, `Button`, `FormTextArea` from `@/ui`.
- Produces: `KnowledgeBasePickerDialog` component with props `{ open: boolean; onOpenChange: (open: boolean) => void; documents: readonly ContextDocumentRow[]; selectedIds: ReadonlySet<string>; onConfirm: (ids: ReadonlySet<string>) => void; onAddDocument: (doc: ContextDocumentRow) => void; description: string; listMaxHeightClassName?: string }`. Later tasks (3, 5, 6) replace their own inline `Dialog` blocks with this component.

- [ ] **Step 1: Write the component**

Create `src/features/documents/knowledge-base-picker-dialog.tsx`:

```tsx
import { useState } from 'react'
import { FileText, Plus } from 'lucide-react'

import type { ContextDocumentRow } from '@/contracts/documents.draft'
import { Button, Checkbox, Dialog, DialogClose, DialogPopup, DialogTitle, FormTextArea } from '@/ui'

export type KnowledgeBasePickerDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly documents: readonly ContextDocumentRow[]
  readonly selectedIds: ReadonlySet<string>
  readonly onConfirm: (ids: ReadonlySet<string>) => void
  readonly onAddDocument: (doc: ContextDocumentRow) => void
  readonly description: string
  readonly listMaxHeightClassName?: string
}

let pastedDocCounter = 0

export function KnowledgeBasePickerDialog({
  open,
  onOpenChange,
  documents,
  selectedIds,
  onConfirm,
  onAddDocument,
  description,
  listMaxHeightClassName = 'max-h-60',
}: KnowledgeBasePickerDialogProps) {
  const [draftIds, setDraftIds] = useState<ReadonlySet<string>>(selectedIds)
  const [addOpen, setAddOpen] = useState(false)
  const [pastedText, setPastedText] = useState('')
  const allSelected = documents.length > 0 && documents.every((doc) => draftIds.has(doc.id))

  function toggleDoc(id: string) {
    setDraftIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    setDraftIds(allSelected ? new Set() : new Set(documents.map((doc) => doc.id)))
  }

  function handleSavePastedDoc() {
    const trimmed = pastedText.trim()
    if (!trimmed) return
    pastedDocCounter += 1
    const newDoc: ContextDocumentRow = {
      id: `context-document-pasted-${pastedDocCounter}`,
      name: trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed,
      kind: 'DOCX',
      sizeOrUrl: `${trimmed.length} characters`,
      addedAtLabel: 'Just now',
    }
    onAddDocument(newDoc)
    setDraftIds((prev) => new Set(prev).add(newDoc.id))
    setPastedText('')
    setAddOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setDraftIds(selectedIds)
        onOpenChange(next)
      }}
    >
      <DialogPopup aria-label="Add documents from Knowledge Base">
        <DialogClose />
        <DialogTitle>Add from Knowledge Base</DialogTitle>
        <p className="mt-1 text-sm text-ink-muted">{description}</p>

        {documents.length > 0 ? (
          <label className="mt-4 flex min-h-9 cursor-pointer items-center gap-3 rounded-lg border-b border-border px-3 pb-2 text-sm font-medium text-ink">
            <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} aria-label="Select all documents" />
            Select all
          </label>
        ) : null}

        <div className={`mt-1 grid ${listMaxHeightClassName} gap-1 overflow-y-auto`}>
          {documents.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-muted">No documents in your Knowledge Base yet.</p>
          ) : (
            documents.map((doc) => (
              <label key={doc.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 hover:bg-surface-subtle">
                <Checkbox checked={draftIds.has(doc.id)} onCheckedChange={() => toggleDoc(doc.id)} aria-label={doc.name} />
                <FileText aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{doc.name}</span>
                <span className="shrink-0 text-xs text-ink-muted">{doc.sizeOrUrl}</span>
              </label>
            ))
          )}
        </div>

        {addOpen ? (
          <div className="mt-4 grid gap-2 rounded-lg border border-border p-3">
            <FormTextArea
              id="kb-picker-paste-text"
              label="Paste document text"
              value={pastedText}
              onChange={(event) => setPastedText(event.target.value)}
              placeholder="Paste a job description, notes, or any context text…"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={handleSavePastedDoc} disabled={!pastedText.trim()}>Save document</Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-text hover:text-accent"
            >
              <Plus aria-hidden="true" className="size-4" />
              Add document
            </button>
            <a href="/v3/documents/add" className="text-xs font-medium text-ink-muted underline underline-offset-4 hover:text-ink">
              More ways to add — go to Documents
            </a>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              onConfirm(draftIds)
              onOpenChange(false)
            }}
          >
            Add Selected
          </Button>
        </div>
      </DialogPopup>
    </Dialog>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: no new errors attributable to this file. (`FormTextArea`'s `onChange` type must match `React.ChangeEventHandler<HTMLTextAreaElement>` — confirm against `src/ui/form-panel.tsx:330` if this errors.)

- [ ] **Step 3: Commit**

```bash
git add src/features/documents/knowledge-base-picker-dialog.tsx
git commit -m "Add shared KnowledgeBasePickerDialog with select-all and inline add"
```

---

### Task 3: Interview Copilot — wire shared picker, resume autofill, and new Preferences fields

**Files:**
- Modify: `src/features/copilot/interview-copilot-view.tsx`

**Interfaces:**
- Consumes: `KnowledgeBasePickerDialog` from Task 2; `CopilotModelTier` from Task 1.
- Produces: `CopilotConfigureView` now renders controlled Target Role / Company Name fields and a "Fill from resume" action; `CopilotPreferencesView` now renders Model, Response language, and a Behavior section (Auto Answer, Save Transcript).

- [ ] **Step 1: Replace `CopilotConfigureView`'s inline KB dialog with the shared component, and add resume autofill**

In `src/features/copilot/interview-copilot-view.tsx`, `CopilotConfigureView` currently spans lines 248-419 (see plan research — the function body, the interview/coding/meeting field blocks, then the inline `Dialog`). Make these changes:

1. Add to the import block from `@/features/documents/knowledge-base-picker-dialog`:
```ts
import { KnowledgeBasePickerDialog } from '@/features/documents/knowledge-base-picker-dialog'
```

2. Replace the function body (lines 248-274, i.e. everything from the `export function CopilotConfigureView` signature down to the closing of `toggleDraftDoc`) with:

```tsx
export function CopilotConfigureView({ homeHref, uploadHref, preferencesHref, setup, knowledgeBaseDocuments }: CopilotConfigureViewProps) {
  const mode = setup.mode
  const [additionalContext, setAdditionalContext] = useState(setup.additionalContext)
  const [targetRole, setTargetRole] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [selectedDocIds, setSelectedDocIds] = useState<ReadonlySet<string>>(new Set())
  const [pickerOpen, setPickerOpen] = useState(false)
  const [documents, setDocuments] = useState(knowledgeBaseDocuments)
  const selectedDocuments = documents.filter((doc) => selectedDocIds.has(doc.id))
  const { type, isTyping } = useTypewriter()

  function handleAiSuggestion() {
    const base = additionalContext
    type(COPILOT_AI_SUGGESTION, (partial) => setAdditionalContext(base + partial))
  }

  function handleFillFromResume() {
    setTargetRole(setup.targetRole)
    setCompanyName(setup.companyName)
  }
```

(`openDocumentPicker`, `toggleDraftDoc`, and the `draftDocIds` state are removed — the shared dialog now owns its own draft-selection state internally.)

3. Replace the interview-mode field block (lines 294-318) so Target Role / Company Name are controlled and a "Fill from resume" action sits next to them:

```tsx
          {mode === 'interview' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <FormSelectField
                id="copilot-interview-type"
                label="Interview type"
                defaultValue={setup.interviewType.toLowerCase()}
                options={[
                  { label: 'Introductory', value: 'introductory' },
                  { label: 'Behavioral', value: 'behavioral' },
                  { label: 'Product case', value: 'product case' },
                ]}
              />
              <FormSelectField
                id="copilot-difficulty"
                label="Difficulty"
                defaultValue={setup.difficulty.toLowerCase()}
                options={[
                  { label: 'Easy', value: 'easy' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Hard', value: 'hard' },
                ]}
              />
              <FormField id="copilot-target-role" label="Target Role" placeholder="e.g. Senior Software Engineer" value={targetRole} onChange={(event) => setTargetRole(event.target.value)} />
              <FormField id="copilot-company" label="Company Name" placeholder="e.g. Google, Meta" value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
              <button
                type="button"
                onClick={handleFillFromResume}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-text hover:text-accent sm:col-span-full"
              >
                <Sparkles aria-hidden="true" className="size-4" />
                Fill fields from resume
              </button>
            </div>
          ) : mode === 'coding' ? (
```

4. Add `Sparkles` to the `lucide-react` import (currently line 2) — append it alongside the other icon imports.

5. Replace the trailing block — the `DocumentDropAction` call through the closing inline `<Dialog>...</Dialog>` (lines 348-416) — with:

```tsx
          <DocumentDropAction onTrigger={() => setPickerOpen(true)} hint="Add from Knowledge Base">
            {selectedDocuments.length > 0 ? (
              <span className="flex flex-wrap justify-center gap-2">
                {selectedDocuments.map((doc) => (
                  <span key={doc.id} className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-3 py-1 text-xs font-medium text-ink">
                    <FileText aria-hidden="true" className="size-3.5 text-ink-muted" />
                    {doc.name}
                  </span>
                ))}
              </span>
            ) : undefined}
          </DocumentDropAction>
          <FormTextArea
            id="copilot-additional-context"
            label="Additional context"
            value={additionalContext}
            onChange={(event) => setAdditionalContext(event.target.value)}
            className={cn(isTyping && 'ring-2 ring-accent shadow-[0_0_0_4px_var(--lf-accent-subtle)] transition-shadow duration-normal')}
          />
          <AiSuggestionAction onClick={handleAiSuggestion} disabled={isTyping} />
        </FormPanel>
      </section>

      <KnowledgeBasePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        documents={documents}
        selectedIds={selectedDocIds}
        onConfirm={setSelectedDocIds}
        onAddDocument={(doc) => setDocuments((prev) => [...prev, doc])}
        description="Select the documents you want Copilot to use as context for this session."
      />
    </Workspace>
  )
}
```

6. `Checkbox` stays imported — Step 2 below adds new `Checkbox` usages in `CopilotPreferencesView`. `Dialog`/`DialogClose`/`DialogPopup`/`DialogTitle` also stay — `CopilotLiveSettingsModal` and other views later in this same file still use them. Only `Plus` may have become unused by this specific edit; grep before removing it (`grep -n "<Plus" src/features/copilot/interview-copilot-view.tsx`) since it may still be used elsewhere in the file (e.g. history/empty-state views).

- [ ] **Step 2: Add Model, Language, and Behavior fields to `CopilotPreferencesView`**

Replace `CopilotPreferencesView` (lines 453-494) with:

```tsx
export function CopilotPreferencesView({ homeHref, configureHref, shareHref, setup }: CopilotPreferencesViewProps) {
  const [responseMode, setResponseMode] = useState(setup.responseMode)
  const [responseLength, setResponseLength] = useState(setup.responseLength)
  const [modelTier, setModelTier] = useState<CopilotModelTier>(setup.modelTier)
  const [responseLanguage, setResponseLanguage] = useState(setup.responseLanguage)
  const [autoAnswer, setAutoAnswer] = useState(setup.autoAnswer)
  const [saveTranscript, setSaveTranscript] = useState(setup.saveTranscript)
  const activeExample = RESPONSE_MODE_EXAMPLES[responseMode]

  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} current={copilotModeMeta[setup.mode].label} />
      <section className="px-4 py-9">
        <FormPanel
          title="Set Preference"
          step="2/3"
          footer={<FormPanelFooter backHref={configureHref} nextHref={shareHref} />}
        >
            <FormChoiceGroup<CopilotResponseMode>
              label="Select Response Type"
              name="copilot-response-type"
              options={[
                { label: 'Default', value: 'default' },
                { label: 'Headlines', value: 'headlines' },
                { label: 'Coaching', value: 'coaching' },
              ]}
              selected={responseMode}
              onSelectedChange={setResponseMode}
            />
            <ExampleResponseCard helperText={activeExample.helperText}>{activeExample.example}</ExampleResponseCard>
            <FormChoiceGroup<CopilotResponseLength>
              label="Select Response Length"
              name="copilot-response-length"
              options={[
                { label: 'Short', value: 'short' },
                { label: 'Medium', value: 'medium' },
                { label: 'Long', value: 'long' },
              ]}
              selected={responseLength}
              onSelectedChange={setResponseLength}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <FormSelectField
                id="copilot-model-tier"
                label="Model"
                value={modelTier}
                onValueChange={(value) => setModelTier(value as CopilotModelTier)}
                options={[
                  { label: 'Balanced', value: 'balanced' },
                  { label: 'Precision', value: 'precision' },
                ]}
              />
              <FormSelectField
                id="copilot-response-language"
                label="Response language"
                value={responseLanguage}
                onValueChange={setResponseLanguage}
                options={[
                  { label: 'English', value: 'English' },
                  { label: 'Spanish', value: 'Spanish' },
                  { label: 'French', value: 'French' },
                  { label: 'German', value: 'German' },
                  { label: 'Portuguese', value: 'Portuguese' },
                  { label: 'Mandarin Chinese', value: 'Mandarin Chinese' },
                ]}
              />
            </div>
            <div className="grid gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Behavior</p>
              <div>
                <Checkbox checked={autoAnswer} onCheckedChange={(checked) => setAutoAnswer(Boolean(checked))} label="Auto Answer (Beta)" />
                <p className="ms-6 mt-0.5 text-xs text-ink-muted">Copilot answers live-interviewer questions automatically instead of waiting for a manual trigger.</p>
              </div>
              <div>
                <Checkbox checked={saveTranscript} onCheckedChange={(checked) => setSaveTranscript(Boolean(checked))} label="Save Transcript" />
                <p className="ms-6 mt-0.5 text-xs text-ink-muted">Keep a written transcript of this session in your history.</p>
              </div>
            </div>
        </FormPanel>
      </section>
    </Workspace>
  )
}
```

Add `CopilotModelTier` to the `@/contracts/copilot.draft` type import list at the top of the file (alongside `CopilotResponseMode`, etc.), and confirm `Checkbox` and `FormSelectField` are already imported (they are — `Checkbox` at the existing `@/ui` import block, `FormSelectField` already used in `CopilotConfigureView`).

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: no new errors in this file beyond the pre-existing baseline (`Check` unused-import etc. — unrelated).

- [ ] **Step 4: Manual browser verification**

Start the dev server, navigate to `/v3/interview-copilot/configure`: confirm "Fill fields from resume" populates Target Role/Company Name, the Knowledge Base picker opens with a working "Select all" checkbox and an "Add document" paste-text affordance. Navigate to `/v3/interview-copilot/preferences`: confirm Model, Response language selects and the two new Behavior checkboxes render and toggle.

- [ ] **Step 5: Commit**

```bash
git add src/features/copilot/interview-copilot-view.tsx
git commit -m "Add model/language selectors, resume autofill, and behavior toggles to Copilot configure flow"
```

---

### Task 4: Interview Copilot — seed live-session Auto Answer from setup

**Files:**
- Modify: `src/features/copilot/interview-copilot-view.tsx`
- Modify: `src/apps/web/pages/copilot-session-page.tsx`
- Modify: `src/apps/web/pages/demo-modal.tsx`

**Interfaces:**
- Produces: `CopilotLiveViewProps` gains `initialAutoAnswer?: boolean` (default `false`, preserving today's behavior for any call site that doesn't pass it).

- [ ] **Step 1: Add the prop and use it to seed `responseMode`**

In `src/features/copilot/interview-copilot-view.tsx`, find `CopilotLiveViewProps` (the type just above `CopilotLiveView`, consumes `completeHref`, `session`, `isLoading`, `transcriptBank`, `codingBank`, `demoMode`) and add:

```ts
readonly initialAutoAnswer?: boolean
```

Then change the function signature and the `responseMode` state initializer (currently `export function CopilotLiveView({ completeHref, session, isLoading = false, transcriptBank = [], codingBank = [], demoMode = false }: CopilotLiveViewProps)` at line 1634, and `const [responseMode, setResponseMode] = useState<'auto' | 'manual'>('manual')` at line 1648):

```tsx
export function CopilotLiveView({ completeHref, session, isLoading = false, transcriptBank = [], codingBank = [], demoMode = false, initialAutoAnswer = false }: CopilotLiveViewProps) {
  // ...unchanged state above...
  const [responseMode, setResponseMode] = useState<'auto' | 'manual'>(initialAutoAnswer ? 'auto' : 'manual')
```

- [ ] **Step 2: Wire it from the two page-level call sites**

In `src/apps/web/pages/copilot-session-page.tsx`, add the mock import and pass the prop:

```tsx
import { copilotCodingBank, copilotInterviewTranscript, copilotLiveSession, copilotMeetingTranscript, copilotSetup } from '@/mocks/copilot'
```

```tsx
    <CopilotLiveView
      completeHref="/v3/interview-copilot/complete"
      session={session}
      isLoading={params.get('state') === 'loading'}
      transcriptBank={session.mode === 'meeting' ? copilotMeetingTranscript : copilotInterviewTranscript}
      codingBank={copilotCodingBank}
      initialAutoAnswer={copilotSetup.autoAnswer}
    />
```

In `src/apps/web/pages/demo-modal.tsx`, find the `<CopilotLiveView session={copilotLiveSession} ...>` call (around line 99-101) and add `initialAutoAnswer={copilotSetup.autoAnswer}` to its props (`copilotSetup` is already imported in this file).

- [ ] **Step 3: Typecheck and verify**

Run: `npx tsc --noEmit -p tsconfig.app.json` — no new errors.

Manual check: in `src/mocks/copilot.ts`, temporarily set `autoAnswer: true`, reload `/v3/interview-copilot/session`, confirm the live session opens with Auto Respond already active (not needing a manual toggle click) — then set it back to `false` before committing.

- [ ] **Step 4: Commit**

```bash
git add src/features/copilot/interview-copilot-view.tsx src/apps/web/pages/copilot-session-page.tsx src/apps/web/pages/demo-modal.tsx
git commit -m "Seed live Copilot session's Auto/Manual mode from setup-time Auto Answer"
```

---

### Task 5: Interview Prep — wire shared picker, resume autofill, and new Configure fields

**Files:**
- Modify: `src/features/interview/interview-prep-view.tsx`

**Interfaces:**
- Consumes: `KnowledgeBasePickerDialog` from Task 2; `CopilotModelTier` from Task 1 (import from `@/contracts/copilot.draft`).

- [ ] **Step 1: Replace `InterviewConfigureView`'s body and inline KB dialog**

In `src/features/interview/interview-prep-view.tsx`, `InterviewConfigureView` currently spans lines 206-328. Make these changes:

1. Add imports:
```ts
import type { CopilotModelTier } from '@/contracts/copilot.draft'
import { KnowledgeBasePickerDialog } from '@/features/documents/knowledge-base-picker-dialog'
```

2. Replace the function signature through `toggleDraftDoc` (lines 206-231) with:

```tsx
export function InterviewConfigureView({ homeHref, uploadHref, voiceHref, session, knowledgeBaseDocuments = [] }: InterviewConfigureViewProps) {
  const [additionalContext, setAdditionalContext] = useState(session.additionalContext)
  const [targetRole, setTargetRole] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [selectedDocIds, setSelectedDocIds] = useState<ReadonlySet<string>>(new Set())
  const [pickerOpen, setPickerOpen] = useState(false)
  const [documents, setDocuments] = useState(knowledgeBaseDocuments)
  const [modelTier, setModelTier] = useState<CopilotModelTier>(session.modelTier)
  const [responseLanguage, setResponseLanguage] = useState(session.responseLanguage)
  const [autoAnswer, setAutoAnswer] = useState(false)
  const [saveTranscript, setSaveTranscript] = useState(session.saveTranscript)
  const selectedDocuments = documents.filter((doc) => selectedDocIds.has(doc.id))
  const { type, isTyping } = useTypewriter()

  function handleAiSuggestion() {
    const base = additionalContext
    type(INTERVIEW_AI_SUGGESTION, (partial) => setAdditionalContext(base + partial))
  }

  function handleFillFromResume() {
    setTargetRole(session.targetRole)
    setCompanyName(session.companyName)
  }
```

(`autoAnswer` has no corresponding field on `InterviewPrepSession` per Task 1 — it's local-only UI state here, since Prep's Auto Answer doesn't persist into any live-session contract the way Copilot's does; it only controls the copy shown in the Behavior section for this session.)

3. Replace the Target Role / Company Name fields (lines 268-269) with controlled versions plus the autofill action, matching Copilot's pattern:

```tsx
              <FormField id="target-role" label="Target Role" placeholder="e.g. Senior Software Engineer" value={targetRole} onChange={(event) => setTargetRole(event.target.value)} />
              <FormField id="interview-company" label="Company Name" placeholder="e.g. Google, Meta" value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
              <button
                type="button"
                onClick={handleFillFromResume}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-text hover:text-accent sm:col-span-full"
              >
                <Sparkles aria-hidden="true" className="size-4" />
                Fill fields from resume
              </button>
```

4. Add `Sparkles` to the `lucide-react` import list at the top of the file.

5. Replace the tail of the component — from `<DocumentDropAction ...>` through the closing `<Dialog>...</Dialog>` (lines 271-325) — with:

```tsx
          <DocumentDropAction onTrigger={() => setPickerOpen(true)} hint="Add from Knowledge Base">
            {selectedDocuments.length > 0 ? (
              <span className="flex flex-wrap justify-center gap-2">
                {selectedDocuments.map((doc) => (
                  <span key={doc.id} className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-3 py-1 text-xs font-medium text-ink">
                    <FileText aria-hidden="true" className="size-3.5 text-ink-muted" />
                    {doc.name}
                  </span>
                ))}
              </span>
            ) : undefined}
          </DocumentDropAction>
          <FormTextArea
            id="interview-additional-context"
            label="Additional context"
            value={additionalContext}
            onChange={(event) => setAdditionalContext(event.target.value)}
            className={cn(isTyping && 'ring-2 ring-accent shadow-[0_0_0_4px_var(--lf-accent-subtle)] transition-shadow duration-normal')}
          />
          <AiSuggestionAction onClick={handleAiSuggestion} disabled={isTyping} />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormSelectField
              id="interview-model-tier"
              label="Model"
              value={modelTier}
              onValueChange={(value) => setModelTier(value as CopilotModelTier)}
              options={[
                { label: 'Balanced', value: 'balanced' },
                { label: 'Precision', value: 'precision' },
              ]}
            />
            <FormSelectField
              id="interview-response-language"
              label="Response language"
              value={responseLanguage}
              onValueChange={setResponseLanguage}
              options={[
                { label: 'English', value: 'English' },
                { label: 'Spanish', value: 'Spanish' },
                { label: 'French', value: 'French' },
                { label: 'German', value: 'German' },
                { label: 'Portuguese', value: 'Portuguese' },
                { label: 'Mandarin Chinese', value: 'Mandarin Chinese' },
              ]}
            />
          </div>
          <div className="grid gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Behavior</p>
            <div>
              <Checkbox checked={autoAnswer} onCheckedChange={(checked) => setAutoAnswer(Boolean(checked))} label="Auto Answer (Beta)" />
              <p className="ms-6 mt-0.5 text-xs text-ink-muted">Skip attempting each question yourself — reveal the AI's model answer immediately instead.</p>
            </div>
            <div>
              <Checkbox checked={saveTranscript} onCheckedChange={(checked) => setSaveTranscript(Boolean(checked))} label="Save Transcript" />
              <p className="ms-6 mt-0.5 text-xs text-ink-muted">Keep a written transcript of this session in your history.</p>
            </div>
          </div>
        </FormPanel>
      </section>

      <KnowledgeBasePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        documents={documents}
        selectedIds={selectedDocIds}
        onConfirm={setSelectedDocIds}
        onAddDocument={(doc) => setDocuments((prev) => [...prev, doc])}
        description="Select the documents you want the interviewer to use as context for this session."
        listMaxHeightClassName="max-h-80"
      />
    </Workspace>
  )
}
```

6. Remove now-unused `Dialog`/`DialogClose`/`DialogPopup`/`DialogTitle` imports **only if** confirmed unused elsewhere in the file (grep first — `InterviewLiveSettingsModal` likely still uses `Dialog` elsewhere in this file).

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.app.json` — no new errors beyond baseline.

- [ ] **Step 3: Manual browser verification**

Navigate to `/v3/interview-prep/configure`: confirm Fill-from-resume, Model/Language selects, both Behavior checkboxes, and the Knowledge Base picker's select-all + inline add all work.

- [ ] **Step 4: Commit**

```bash
git add src/features/interview/interview-prep-view.tsx
git commit -m "Add model/language selectors, resume autofill, and behavior toggles to Interview Prep configure flow"
```

---

### Task 6: Desktop app — configure screen fields + Meeting Detect setting

**Files:**
- Modify: `src/features/desktop/desktop-configure-view.tsx`
- Modify: `src/features/desktop/desktop-session-view.tsx`

**Interfaces:**
- Consumes: `KnowledgeBasePickerDialog` from Task 2; `CopilotModelTier` from Task 1.

- [ ] **Step 1: Add a `DarkCheckboxRow` helper and the new fields to `DesktopConfigureView`**

In `src/features/desktop/desktop-configure-view.tsx`:

1. Update imports — add `Sparkles` to the `lucide-react` import list, add `KnowledgeBasePickerDialog`:

```ts
import { useState, type ChangeEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown, FileText, Plus, Sparkles, X, Zap } from 'lucide-react'

import type { CopilotModelTier } from '@/contracts/copilot.draft'
import { copilotSetup } from '@/mocks/copilot'
import { contextDocumentRows } from '@/mocks/documents'
import { KnowledgeBasePickerDialog } from '@/features/documents/knowledge-base-picker-dialog'
```

This file's original `@/ui` import line (`import { Checkbox, Dialog, DialogClose, DialogPopup, DialogTitle } from '@/ui'`) is deleted entirely — none of those five are used anywhere else in this file (it has no other `@/ui` dependency; `DarkField`/`DarkSelect`/the new `DarkCheckboxRow` are all local, and buttons here are raw `<button>` elements, not the design-system `Button`). `Plus` stays as a `lucide-react` import: it's still used by the untouched "Add Documents" button and empty-state prompt in the Documents section, lines 111-114 and 130-135 of the original file — only that section's data source changes in step 5 below, not its icon usage.

2. Add a small dark-styled checkbox helper, next to the existing `DarkField`/`DarkSelect` helpers (after `DarkSelect`, before `export function DesktopConfigureView`):

```tsx
function DarkCheckboxRow({ checked, onChange, label, hint }: { readonly checked: boolean; readonly onChange: (checked: boolean) => void; readonly label: string; readonly hint: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 rounded border-white/30 bg-white/10 text-[#0052ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      />
      <span>
        <span className="block text-sm font-medium text-white">{label}</span>
        <span className="block text-xs text-white/60">{hint}</span>
      </span>
    </label>
  )
}
```

3. Replace the component body — from `export function DesktopConfigureView()` through the end of `toggleDoc` (lines 40-57) — with:

```tsx
export function DesktopConfigureView() {
  const navigate = useNavigate()
  const [targetRole, setTargetRole] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [interviewType, setInterviewType] = useState('Introductory')
  const [difficulty, setDifficulty] = useState('Medium')
  const [additionalContext, setAdditionalContext] = useState(copilotSetup.additionalContext)
  const [selectedDocIds, setSelectedDocIds] = useState<ReadonlySet<string>>(new Set())
  const [pickerOpen, setPickerOpen] = useState(false)
  const [documents, setDocuments] = useState(contextDocumentRows)
  const [modelTier, setModelTier] = useState<CopilotModelTier>(copilotSetup.modelTier)
  const [responseLanguage, setResponseLanguage] = useState(copilotSetup.responseLanguage)
  const [autoAnswer, setAutoAnswer] = useState(copilotSetup.autoAnswer)
  const [saveTranscript, setSaveTranscript] = useState(copilotSetup.saveTranscript)

  function handleFillFromResume() {
    setTargetRole(copilotSetup.targetRole)
    setCompanyName(copilotSetup.companyName)
  }
```

(`toggleDoc` is removed — the shared picker owns document selection now.)

4. Add the "Fill from resume" action right after the Target Role / Company Name row (after the `</div>` that closes the `flex gap-6` row containing those two `DarkField`s, currently ending at line 104):

```tsx
          <button
            type="button"
            onClick={handleFillFromResume}
            className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-[#0052ff]"
          >
            <Sparkles aria-hidden="true" className="size-3.5" />
            Fill fields from resume
          </button>
```

5. Replace the Documents block's `onClick={() => setPickerOpen(true)}` buttons' data source — they currently read from `contextDocumentRows` and `selectedDocIds` directly (lines 106-137); update the `.filter()` call to read from the new `documents` state instead of the static `contextDocumentRows` import:

```tsx
              {selectedDocIds.size > 0 ? (
                documents
                  .filter((doc) => selectedDocIds.has(doc.id))
```

6. Add Model, Language, and Behavior fields after the "Additional context" block (after the closing `</div>` at line 155, still inside the `<div className="grid gap-3 p-8">` wrapper):

```tsx
          <div className="flex gap-6">
            <DarkField label="Model">
              <DarkSelect value={modelTier === 'balanced' ? 'Balanced' : 'Precision'} onChange={(value) => setModelTier(value === 'Balanced' ? 'balanced' : 'precision')} options={['Balanced', 'Precision']} />
            </DarkField>
            <DarkField label="Response language">
              <DarkSelect value={responseLanguage} onChange={setResponseLanguage} options={['English', 'Spanish', 'French', 'German', 'Portuguese', 'Mandarin Chinese']} />
            </DarkField>
          </div>

          <div className="grid gap-3 border-t border-white/15 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Behavior</p>
            <DarkCheckboxRow checked={autoAnswer} onChange={setAutoAnswer} label="Auto Answer (Beta)" hint="Copilot answers live-interviewer questions automatically." />
            <DarkCheckboxRow checked={saveTranscript} onChange={setSaveTranscript} label="Save Transcript" hint="Keep a written transcript of this session in your history." />
          </div>
```

7. Replace the closing `<Dialog>...</Dialog>` block (lines 173-195) with the shared component:

```tsx
      <KnowledgeBasePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        documents={documents}
        selectedIds={selectedDocIds}
        onConfirm={setSelectedDocIds}
        onAddDocument={(doc) => setDocuments((prev) => [...prev, doc])}
        description="Select the documents you want Jobwhisper to use as context for this session."
        listMaxHeightClassName="max-h-72"
      />
    </div>
  )
}
```

- [ ] **Step 2: Add a "Window" section with Meeting Detect to the Desktop settings dialog**

In `src/features/desktop/desktop-session-view.tsx`:

1. Add local state — in `DesktopSessionView`, alongside the existing `useState` calls (after `const [activityLabel, setActivityLabel] = useState(copilotLiveSession.activityLabel)`):

```tsx
  const [meetingDetect, setMeetingDetect] = useState(false)
```

2. Replace the settings `Dialog` body (lines 84-96) with:

```tsx
          <div className="mt-4 grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">Theme</span>
              <ThemeSwitch size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">Microphone</span>
              <span className="text-xs text-ink-muted">System Default</span>
            </div>
            <div className="border-t border-border pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Window</p>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-ink">Meeting Detect</p>
                  <p className="text-xs text-ink-muted">Notify me when a meeting app is active</p>
                </div>
                <Checkbox checked={meetingDetect} onCheckedChange={(checked) => setMeetingDetect(Boolean(checked))} aria-label="Toggle Meeting Detect" />
              </div>
            </div>
            <Button variant="secondary" onClick={() => navigate('/desktop')}>
              Sign out
            </Button>
          </div>
```

3. Add `Checkbox` to the `@/ui` import list at the top of the file (currently `import { Button, Dialog, DialogClose, DialogPopup, DialogTitle, ThemeSwitch } from '@/ui'`).

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.app.json` — no new errors beyond baseline.

- [ ] **Step 4: Manual browser verification**

Navigate to `/desktop/configure`: confirm Fill-from-resume, Model/Language dark selects, Behavior checkboxes, and the KB picker (select-all + inline add) all render correctly against the dark theme. Navigate to `/desktop/session`, open Settings: confirm the new "Window" section with Meeting Detect checkbox renders below Microphone and above Sign out.

- [ ] **Step 5: Commit**

```bash
git add src/features/desktop/desktop-configure-view.tsx src/features/desktop/desktop-session-view.tsx
git commit -m "Add model/language/behavior fields and Meeting Detect setting to Desktop app"
```

---

### Task 7: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Full typecheck**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: identical error count/content to the pre-Task-1 baseline captured at the start of this plan — zero new errors across all six modified/created files.

- [ ] **Step 2: Full test suite**

Run: `npx vitest run`
Expected: matches the documented baseline (1 file / 10 tests failing in `auth-flow.test.tsx`, unrelated to this work).

- [ ] **Step 3: Full manual walkthrough**

Using the browser preview tool, walk through, at both desktop and 375px mobile widths (mobile for the two web flows only — Desktop app view is fixed-width by nature):
1. `/v3/interview-copilot/configure` → `/v3/interview-copilot/preferences` — all new fields present and functional.
2. `/v3/interview-prep/configure` — all new fields present and functional.
3. `/desktop/configure` and `/desktop/session` (Settings) — all new fields and the Meeting Detect toggle present and functional.
4. Confirm no console errors on any of the above via `read_console_messages`.

- [ ] **Step 4: Push**

Per standing project convention, merge and deploy without asking:

```bash
git push origin main
```
