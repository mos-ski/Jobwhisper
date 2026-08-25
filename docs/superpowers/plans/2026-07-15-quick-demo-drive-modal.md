# Quick Demo Drive Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Open the selected Google Drive quick demo in an accessible, responsive modal from the landing-page pressure section.

**Architecture:** Keep modal state in `LightforthHomePage` and pass an open callback into `InterviewPressureSection`. Render a focused `QuickDemoModal` beside the existing download modal, reusing the same body-scroll lock and dismissal conventions.

**Tech Stack:** React, TypeScript, CSS, Google Drive iframe preview, Vitest, Testing Library.

## Global Constraints

- Drive preview URL: `https://drive.google.com/file/d/118_lmiPcoUBvDzsglUGqZc2uZDDmIJQs/preview`.
- Preserve the existing interview-pressure section layout.
- Close through the close button, backdrop click, or `Escape`.
- Preserve a 16:9 player ratio on desktop and mobile.

---

### Task 1: Quick Demo Modal

**Files:**
- Modify: `src/pages/marketing/lightforth-home/LightforthHomePage.test.tsx`
- Modify: `src/pages/marketing/lightforth-home/LightforthHomePage.tsx`
- Modify: `src/pages/marketing/lightforth-home/lightforth-home.css`

**Interfaces:**
- Consumes: `onWatchDemo: () => void` in `InterviewPressureSection`.
- Produces: `QuickDemoModal({ open, onClose }: { open: boolean; onClose: () => void })`.

- [ ] **Step 1: Write the failing interaction test**

Add a test that clicks `Watch Quick Demo`, expects a dialog named `Lightforth quick demo`, and asserts the iframe source equals the exact Drive preview URL. Close it with the dialog close button and assert it is removed.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm run test:run -- src/pages/marketing/lightforth-home/LightforthHomePage.test.tsx`

Expected: FAIL because `Watch Quick Demo` is still an anchor and no quick-demo dialog exists.

- [ ] **Step 3: Implement the modal and trigger**

Change the pressure-section anchor to a button callback. Add page-level modal state and a `QuickDemoModal` that embeds the exact Drive preview URL, locks body scrolling, supports `Escape`, backdrop dismissal, and a labelled close button.

- [ ] **Step 4: Add responsive modal styling**

Add a dark fixed overlay, centered bounded modal, 16:9 iframe wrapper, visible close control, and mobile safe padding without changing pressure-section sizing.

- [ ] **Step 5: Verify focused and full behavior**

Run:

```bash
npm run test:run -- src/pages/marketing/lightforth-home/LightforthHomePage.test.tsx
npm run test:run
npm run build
```

Expected: all tests pass and the production build exits successfully.

- [ ] **Step 6: Verify in the browser**

At desktop and mobile widths, click the demo button, confirm the embedded player is visible and framed correctly, close it, and confirm normal page scrolling resumes.
