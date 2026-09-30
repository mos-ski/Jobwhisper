# TM Funnel Copy Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the conversion copy and proof placement on the main landing page and four public funnels, verify responsive behavior, and deploy the result.

**Architecture:** Keep app wiring in `src/apps/web`, pure funnel views in `src/features/funnel`, and introduce only a focused proof component if reuse across funnels warrants it. Preserve all existing flow state and pricing behavior while updating tests before production copy.

**Tech Stack:** React, TypeScript, React Router, Tailwind CSS, Vitest, Testing Library, Vite, Vercel.

## Global Constraints

- Preserve the current uncommitted funnel and landing-page work.
- Use semantic color tokens only outside `src/tokens`.
- Do not add runtime dependencies.
- Do not invent customer names, employer relationships, or unsupported success statistics.
- Keep the five views keyboard accessible and usable at 360px and 200% zoom.
- Update the canonical product script when final wording changes.

---

### Task 1: Lock the corrected copy in tests

**Files:**
- Modify: `src/apps/web/pages/landing-page.test.tsx`
- Modify: `src/features/funnel/funnel-resume-view.test.tsx`
- Modify: `src/features/funnel/funnel-copilot-view.test.tsx`
- Modify: `src/features/funnel/funnel-auto-apply-view.test.tsx`
- Modify: `src/features/funnel/funnel-trial-view.test.tsx`
- Modify: route-flow tests under `src/apps/web/*-flow.test.tsx`

**Interfaces:**
- Consumes: existing view props and routes.
- Produces: failing assertions for the approved value propositions, proof, and offer terms.

- [ ] Add assertions for one clear product outcome and visible proof on each initial landing state.
- [ ] Assert that Auto Apply explicitly says Jobwhisper applies for the visitor.
- [ ] Assert that the seven-day Pro offer states $10 today, $99 monthly renewal, reminder, and cancellation terms accurately.
- [ ] Run the focused tests and confirm that new assertions fail for missing copy or proof.

### Task 2: Implement the shared proof treatment

**Files:**
- Create or modify: focused files under `src/features/funnel/`
- Modify: `src/features/funnel/funnel-resume-view.tsx`
- Modify: `src/features/funnel/funnel-copilot-view.tsx`
- Modify: `src/features/funnel/funnel-auto-apply-view.tsx`
- Modify: `src/features/funnel/funnel-trial-view.tsx`

**Interfaces:**
- Consumes: typed, readonly proof content supplied within each pure feature view.
- Produces: semantic proof regions readable without animation and responsive at 360px.

- [ ] Implement the minimum reusable proof family needed by at least two funnels.
- [ ] Place outcome proof near the first meaningful action on each funnel.
- [ ] Ensure animation is nonessential and disabled under reduced motion.
- [ ] Run focused funnel tests and correct accessibility or overflow failures.

### Task 3: Correct the five landing experiences

**Files:**
- Modify: `src/apps/web/pages/landing-page.tsx`
- Modify: `src/apps/web/pages/landing-page.css`
- Modify: `src/features/funnel/funnel-resume-view.tsx`
- Modify: `src/features/funnel/funnel-copilot-view.tsx`
- Modify: `src/features/funnel/funnel-auto-apply-view.tsx`
- Modify: `src/features/funnel/funnel-trial-view.tsx`

**Interfaces:**
- Consumes: existing callbacks, props, route state, billing offer data, and proof treatment.
- Produces: updated conversion copy without changing funnel transitions.

- [ ] Update the main hero to state the outcome, real-time mechanism, reduced effort, and accurate risk reversal.
- [ ] Tighten Resume around diagnosis, role-specific improvement, and seeing the rewrite before signup.
- [ ] Tighten Copilot around real-time, resume-grounded answers and the approved interview setup sequence.
- [ ] State that Auto Apply finds, ranks, and applies to suitable roles for the visitor; qualify the managed-service guarantee accurately.
- [ ] Introduce the general Pro flow as a transparent seven-day, $10 trial of the complete workflow.
- [ ] Run focused tests until all pass.

### Task 4: Update canonical documentation

**Files:**
- Modify: `docs/LIGHTFORTH_END_TO_END_SMARTER_SCRIPT.md`
- Modify: `src/apps/web/MANIFEST.md`

**Interfaces:**
- Consumes: final shipped wording and routes.
- Produces: canonical product-copy record and accurate route manifest.

- [ ] Record the five page promises and proof rules in the living product script.
- [ ] Update manifest notes and states for each affected route.
- [ ] Check documentation for contradictions with pricing and guarantee terms.

### Task 5: Verify responsive behavior and deploy

**Files:**
- Modify only files required to fix verified regressions.

**Interfaces:**
- Consumes: complete implementation.
- Produces: passing tests/build, pushed `main`, and verified public routes.

- [ ] Run focused funnel and landing tests.
- [ ] Run the complete test suite and `npm run build`.
- [ ] Start the built app and inspect `/`, `/try/resume`, `/try/copilot`, `/try/auto-apply`, and `/try/pro` at 360px and desktop width.
- [ ] Scan modified files for raw colors, palette utilities, TypeScript escape hatches, and accidental em dashes in user-facing copy.
- [ ] Review the diff to ensure unrelated dirty-tree changes were not overwritten.
- [ ] Commit the intended implementation and documentation files.
- [ ] Push `main` to the configured remote.
- [ ] Verify the production deployment and all five public routes.
