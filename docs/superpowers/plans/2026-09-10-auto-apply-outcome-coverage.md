# Auto Apply Outcome Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Display every supported application outcome on the Applied page using the six existing job records.

**Architecture:** Keep `AutoApplyAppliedView` and `OutcomeBadge` unchanged. Correct only the outcome values in the app-layer fixtures, then protect the rendered behavior with the existing route-level integration test.

**Tech Stack:** React, TypeScript, Vitest, Testing Library

**Spec:** `docs/superpowers/specs/2026-09-10-auto-apply-outcome-coverage-design.md`

## Global Constraints

- Do not add job records.
- Keep feature views pure and fixture wiring in the app layer.
- Use only the existing `AutoApplyOutcome` values: `success`, `needs-review`, `failed`, and `closed`.
- Preserve the existing Needs Review dialog behavior.

---

### Task 1: Render complete outcome coverage

**Files:**
- Modify: `src/apps/web/auth-flow.test.tsx`
- Modify: `src/mocks/auto-apply.ts`

**Interfaces:**
- Consumes: `AutoApplyJob.outcome?: AutoApplyOutcome`
- Produces: Applied-page rows covering Applied, Success, Needs review, Failed, and Closed

- [x] **Step 1: Write the failing integration assertion**

Add literal badge assertions to the existing Applied route test:

```tsx
expect(screen.getAllByText('Success')).toHaveLength(2)
expect(screen.getByText('Applied')).toBeInTheDocument()
expect(screen.getByText('Needs Review')).toBeInTheDocument()
expect(screen.getByText('Failed')).toBeInTheDocument()
expect(screen.getByText('Closed')).toBeInTheDocument()
```

- [x] **Step 2: Verify the test fails for the missing outcomes**

Run:

```bash
npx vitest run src/apps/web/auth-flow.test.tsx --exclude '.claude/**' -t 'shows every existing submitted application on the applied page'
```

Expected: failure because Needs review, Failed, and Closed are absent.

- [x] **Step 3: Assign outcomes to existing fixtures**

Set Coinbase Payments Core to `needs-review`, Stripe Payments to `failed`, and Google Frontend Engineer to `closed`. Preserve Delinea and Meta as `success`, and leave Coinbase CX Automation without an outcome so it renders `Applied`.

- [x] **Step 4: Verify the regression and build**

Run the targeted test from Step 2 and `npm run build`. Expected: both succeed.

- [x] **Step 5: Verify the running page**

Reload `/v3/auto-apply/applied` and confirm all five badge labels render, with six existing job rows and no newly added records.

### Task 2: Keep the Jobs page actionable

**Files:**
- Modify: `src/features/auto-apply/auto-apply-view.tsx`
- Modify: `src/apps/web/pages/auto-apply-jobs-page.tsx`
- Modify: `src/apps/web/auth-flow.test.tsx`
- Modify: `docs/LIGHTFORTH_END_TO_END_SMARTER_SCRIPT.md`

**Interfaces:**
- Consumes: `AutoApplyJobsViewProps.onApplyJob(job: AutoApplyJob): void`
- Produces: a Jobs list limited to `new`, `queued`, and `applying`, with a working Apply-to-Queued transition

- [x] **Step 1: Write the failing Jobs route test**

Assert applied and closed records are absent, a New record exposes an Apply button, clicking it produces the queue toast and Queued state, and its opened details no longer expose Apply Now.

- [x] **Step 2: Verify the Jobs test fails**

Run:

```bash
npx vitest run src/apps/web/auth-flow.test.tsx --exclude '.claude/**' -t 'keeps the jobs page actionable and queues a new job from its primary action'
```

Expected: failure because applied and closed records still render and no row-level Apply action exists.

- [x] **Step 3: Implement the actionable Jobs list**

Filter applied and posting-closed records, move New into a compact secondary badge, add an accessible Apply action, update the selected record to Queued after application, remove Apply from queued/applying details, and point the extension arrow right.

- [x] **Step 4: Wire the queue confirmation**

Pass `onApplyJob` from `AutoApplyJobsPage` and call:

```ts
toast.success('Whisper AI has started the application.', {
  description: 'The application is now in queue.',
})
```

- [x] **Step 5: Verify behavior and build**

Run both focused Auto Apply route tests and `npm run build`, then confirm Jobs and Applied visually at `http://127.0.0.1:5174`.

### Task 3: Fill both first pages to 10 jobs

**Files:**
- Modify: `src/mocks/auto-apply.ts`
- Modify: `src/apps/web/auth-flow.test.tsx`

**Interfaces:**
- Consumes: `AutoApplyJob`
- Produces: 10 visible actionable jobs and 10 visible applied jobs

- [ ] **Step 1: Write failing count assertions**

Assert that the Jobs route renders 10 job-detail buttons and Applied renders 10 job-detail buttons.

- [ ] **Step 2: Verify both counts fail at six**

Run the focused first-page count test and confirm the expected six-versus-ten failure.

- [ ] **Step 3: Add eight typed fixtures**

Add four actionable records distributed as two New, one Queued, and one Applying. Add four applied records distributed as one Success, one Needs Review, one Failed, and one Closed. Use distinct companies, roles, IDs, listing URLs, and realistic job-search copy.

- [ ] **Step 4: Verify counts and build**

Run the first-page count test and `npm run build`; both must succeed.

- [ ] **Step 5: Verify both pages visually**

Reload Jobs and Applied at `http://127.0.0.1:5174` and confirm each renders exactly 10 rows.
