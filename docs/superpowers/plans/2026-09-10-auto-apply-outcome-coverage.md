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

- [ ] **Step 1: Write the failing integration assertion**

Add literal badge assertions to the existing Applied route test:

```tsx
expect(screen.getAllByText('Success')).toHaveLength(2)
expect(screen.getByText('Applied')).toBeInTheDocument()
expect(screen.getByText('Needs review')).toBeInTheDocument()
expect(screen.getByText('Failed')).toBeInTheDocument()
expect(screen.getByText('Closed')).toBeInTheDocument()
```

- [ ] **Step 2: Verify the test fails for the missing outcomes**

Run:

```bash
npx vitest run src/apps/web/auth-flow.test.tsx --exclude '.claude/**' -t 'shows every existing submitted application on the applied page'
```

Expected: failure because Needs review, Failed, and Closed are absent.

- [ ] **Step 3: Assign outcomes to existing fixtures**

Set Coinbase Payments Core to `needs-review`, Stripe Payments to `failed`, and Google Frontend Engineer to `closed`. Preserve Delinea and Meta as `success`, and leave Coinbase CX Automation without an outcome so it renders `Applied`.

- [ ] **Step 4: Verify the regression and build**

Run the targeted test from Step 2 and `npm run build`. Expected: both succeed.

- [ ] **Step 5: Verify the running page**

Reload `/v3/auto-apply/applied` and confirm all five badge labels render, with six existing job rows and no newly added records.
