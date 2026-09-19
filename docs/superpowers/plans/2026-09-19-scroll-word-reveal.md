# Journey Paragraph Scroll Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reveal the “Start to finish” explanatory paragraph word by word according to scroll position.

**Architecture:** A focused React component tokenizes the existing rich paragraph into word spans while retaining strong emphasis. A passive scroll listener schedules one `requestAnimationFrame` update, maps the paragraph’s viewport position to reveal progress, and writes the active word count to component state.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library

## Global Constraints

- Add no runtime dependency.
- Preserve the current paragraph copy and emphasis.
- Reduced-motion users see all words immediately.
- The animation reverses naturally when scrolling upward.
- The layout must continue to wrap naturally at 360px.

---

### Task 1: Scroll-linked paragraph component

**Files:**
- Modify: `src/apps/web/pages/landing-page.tsx`
- Modify: `src/apps/web/pages/landing-page.css`
- Test: `src/apps/web/pages/landing-page.test.tsx`

**Interfaces:**
- Consumes: the existing journey paragraph copy.
- Produces: `JourneyRevealText`, a self-contained presentational paragraph with scroll-linked visual state.

- [ ] **Step 1: Add a focused rendering test**

Assert that the journey paragraph renders word spans and preserves emphasized phrases.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run `npm test -- --run src/apps/web/pages/landing-page.test.tsx` and confirm the missing reveal markup causes failure.

- [ ] **Step 3: Implement the component**

Add a ref, reduced-motion check, passive scroll/resize listeners, a single scheduled animation-frame update, clamped viewport progress, and cleanup. Render semantic paragraph text with `aria-label` and decorative word spans.

- [ ] **Step 4: Add reveal styles**

Use inherited wrapping, a muted unrevealed state, an ink revealed state, and a reduced-motion rule that reveals all words.

- [ ] **Step 5: Verify behavior and build**

Run the focused test, inspect desktop and 360px rendering in the browser, run `npm run build`, and run `git diff --check`.
