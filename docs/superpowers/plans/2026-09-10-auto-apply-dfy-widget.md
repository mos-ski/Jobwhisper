# Auto Apply Done For You Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved Done For You Figma promotion as a dismissible bottom-right widget on the Auto Apply Jobs page.

**Architecture:** A focused presentational component owns the Figma-derived markup and accepts navigation and dismissal props. `AutoApplyJobsView` owns temporary visibility state and renders the component only on the Jobs surface. Exact exported SVG assets are committed locally.

**Tech Stack:** React 19-compatible TypeScript, Vite, Tailwind CSS, Vitest, Testing Library.

## Global Constraints

- Use semantic color tokens outside `src/tokens/`; do not introduce raw colors or palette utilities.
- Use the exact Figma-exported assets, stored locally rather than temporary Figma URLs.
- Keep the feature component framework-free and route-free.
- Preserve keyboard access, a labeled close button, and 44px interactive targets.
- Do not persist dismissal in local storage.

---

### Task 1: Add route-level widget behavior coverage

**Files:**
- Modify: `src/apps/web/auth-flow.test.tsx`

**Interfaces:**
- Consumes: `WebRoutes`
- Produces: coverage for widget visibility, signup destination, and dismissal

- [x] **Step 1: Write the failing test**

Add a test that renders `/v3/auto-apply/jobs`, finds the `Done For You` region, verifies `Sign Up Now` points to `/v3/billing/done-for-you`, clicks `Maybe Later.`, and verifies the region is removed.

- [x] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/apps/web/auth-flow.test.tsx --exclude '.claude/**' -t 'shows and dismisses the Done For You jobs promotion'`

Expected: FAIL because the region does not exist.

### Task 2: Add exact Figma assets and the presentational widget

**Files:**
- Create: `public/v3-assets/figma/dfy-widget-wordmark.svg`
- Create: `public/v3-assets/figma/dfy-widget-wave.svg`
- Create: `src/features/auto-apply/done-for-you-promo-widget.tsx`

**Interfaces:**
- Consumes: `signupHref: string`, `onDismiss: () => void`
- Produces: `DoneForYouPromoWidget` and `DoneForYouPromoWidgetProps`

- [x] **Step 1: Download the two SVG assets returned by Figma**

Save the exact exported Jobwhisper wordmark and wave separator under `public/v3-assets/figma/`.

- [x] **Step 2: Implement the component**

Build a fixed, responsive region with the Figma copy, local assets, primary signup link, close button, and `Maybe Later.` dismissal button. Map Figma colors to the repository's semantic accent, surface, ink-muted, and on-accent roles.

### Task 3: Wire the widget into Jobs only

**Files:**
- Modify: `src/features/auto-apply/auto-apply-view.tsx`

**Interfaces:**
- Consumes: `DoneForYouPromoWidget`
- Produces: temporary Jobs-page dismissal state

- [x] **Step 1: Render the widget from `AutoApplyJobsView`**

Add `promoVisible` state initialized to `true`, render the widget after the Jobs workspace content, pass `/v3/billing/done-for-you`, and set visibility to false from `onDismiss`.

- [x] **Step 2: Run the focused test**

Run: `npx vitest run src/apps/web/auth-flow.test.tsx --exclude '.claude/**' -t 'shows and dismisses the Done For You jobs promotion'`

Expected: PASS.

### Task 4: Verify the result

**Files:**
- Modify: `src/apps/web/MANIFEST.md`

**Interfaces:**
- Consumes: completed widget behavior
- Produces: documented and verified Jobs state

- [x] **Step 1: Update the Jobs manifest row**

Record the Done For You promotion and its dismissible state.

- [x] **Step 2: Run verification**

Run the focused Auto Apply tests, `npm run build`, and `git diff --check`.

- [x] **Step 3: Verify in the browser**

Confirm the card is fixed bottom-right on desktop, constrained on mobile, dismisses from either control, and the CTA opens the Done For You route.
