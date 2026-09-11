# Pricing Page Spacing Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the pricing FAQ the same surface treatment as the rest of the page and close excessive gaps between page sections.

**Architecture:** Keep the existing pricing components and data unchanged. Adjust only semantic surface and spacing classes in `PricingPage` and `PricingFaq`, then protect the FAQ panel treatment with the existing focused page test.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library.

## Global Constraints

- Use existing semantic color and radius tokens only.
- Do not change prices, copy, navigation, or interaction behavior.
- Keep the 360px responsive layout free of horizontal overflow.

---

### Task 1: Tighten the pricing section stack

**Files:**
- Modify: `src/apps/web/pages/pricing-page.tsx`
- Modify: `src/apps/web/pages/pricing-page.test.tsx`

**Interfaces:**
- Consumes: the existing `PricingPage` and `PricingFaq` components.
- Produces: a compact section stack and a white FAQ panel consistent with the other pricing surfaces.

- [x] **Step 1: Add a failing FAQ surface test**

Assert that `#pricing-faq` contains a labeled panel using the semantic `bg-surface`, `border-border`, and `rounded-panel` classes.

- [x] **Step 2: Run the focused test and confirm the new assertion fails**

Run: `npx vitest run src/apps/web/pages/pricing-page.test.tsx --reporter=dot`

- [x] **Step 3: Apply the compact spacing and FAQ panel treatment**

Reduce the gap below the pricing tabs and credit guide, wrap the FAQ contents in a bordered surface panel, and reduce the space before the closing action.

- [x] **Step 4: Verify tests, build, and desktop/mobile rendering**

Run `npx vitest run src/apps/web/pages/pricing-page.test.tsx --reporter=dot`, `npm run test:run`, `npm run build`, and `git diff --check`. Review `/pricing` at desktop and 360px widths.

- [x] **Step 5: Commit only the refinement files**

Commit the pricing page, test, updated design spec, and this implementation plan without staging unrelated working-tree changes.

### Task 2: Square the major pricing surfaces

**Files:**
- Modify: `src/apps/web/pages/pricing-page.tsx`
- Modify: `src/apps/web/pages/pricing-page.test.tsx`

**Interfaces:**
- Consumes: the existing semantic panel surfaces.
- Produces: restrained 2px outer corners without changing control shapes.

- [x] **Step 1: Update the FAQ regression assertion to require `rounded-sm` and reject `rounded-panel`**

- [x] **Step 2: Run the focused test and confirm the assertion fails**

- [x] **Step 3: Replace `rounded-panel` with `rounded-sm` on every major pricing surface**

- [x] **Step 4: Run the focused test, full suite, production build, and visual check**

- [x] **Step 5: Commit only the scoped refinement files**

### Task 3: Make supporting content follow the selected tab

**Files:**
- Modify: `src/apps/web/pages/pricing-page.tsx`
- Modify: `src/apps/web/pages/pricing-page.test.tsx`

**Interfaces:**
- Consumes: the URL-derived `PricingTab` value.
- Produces: tab-specific explainer rows, FAQs, and closing actions without introducing additional state.

- [x] **Step 1: Add failing assertions for tab-specific supporting content**

- [x] **Step 2: Run the focused test and confirm the assertions fail**

- [x] **Step 3: Define typed content for each pricing model and pass `activeTab` into the supporting sections**

- [x] **Step 4: Verify tab interactions, full tests, production build, and desktop/mobile rendering**

- [x] **Step 5: Commit only the scoped pricing refinement files**

### Task 4: Expand each contextual FAQ to 20 questions

**Files:**
- Modify: `src/apps/web/pages/pricing-page.tsx`
- Modify: `src/apps/web/pages/pricing-page.test.tsx`

**Interfaces:**
- Consumes: `SUPPORTING_CONTENT` and the canonical product script.
- Produces: exactly 20 product-specific `FaqItem` entries for each `PricingTab`.

- [x] **Step 1: Add failing per-tab FAQ count assertions**

- [x] **Step 2: Run the focused test and confirm all three counts fail**

- [x] **Step 3: Add concise, non-repetitive answers grounded in verified product behavior**

- [x] **Step 4: Run focused and full verification plus a dense-layout browser review**

- [x] **Step 5: Commit the scoped FAQ expansion**
