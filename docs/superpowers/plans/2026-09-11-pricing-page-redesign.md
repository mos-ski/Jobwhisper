# Pricing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/pricing` as a neutral, settings-led explanation of Jobwhisper subscriptions, prepaid credits, and Done For You packages.

**Architecture:** Keep the public route wired through `PricingPage`, using existing `Button`, `Tabs`, and tokenized surface patterns. Store the selected pricing model in the `tab` query parameter, keep annual billing as local UI state, and keep all display data local to the app page because no backend contract is involved.

**Tech Stack:** React 19, TypeScript, React Router, Base UI tabs, Tailwind CSS v4, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-11-pricing-page-redesign-design.md`

## Global Constraints

- Do not visually recommend or pre-rank any plan or package.
- Use only semantic color tokens and existing typography roles.
- Preserve current prices and entitlements.
- Auto Apply copy must say users pay per successful application.
- Do not add runtime dependencies or data fetching.

---

### Task 1: Protect the pricing information contract

**Files:**
- Create: `src/apps/web/pages/pricing-page.test.tsx`
- Modify: `src/apps/web/pages/pricing-page.tsx`

**Interfaces:**
- Consumes: `PricingPage` rendered inside `MemoryRouter`.
- Produces: regression coverage for neutral plans, billing toggle, pricing-model tabs, and corrected usage copy.

- [x] **Step 1: Write the failing page tests**

Test the new heading, absence of recommendation labels, annual-to-monthly price behavior, and the content exposed by the job-search and Done For You tabs.

- [x] **Step 2: Run the focused test to verify it fails**

Run: `npx vitest run src/apps/web/pages/pricing-page.test.tsx --reporter=dot`

Expected: FAIL because the current page has the old heading and a `Most popular` recommendation.

- [x] **Step 3: Rebuild the page with settings-style panels**

Use a compact public header, left-aligned introduction, bordered tab shell, equal plan panels, compact credit explanation, FAQ disclosures, and a quiet closing action panel. Use `tab=interview`, `tab=job-search`, and `tab=done-for-you` as query values.

- [x] **Step 4: Run the focused test to verify it passes**

Run: `npx vitest run src/apps/web/pages/pricing-page.test.tsx --reporter=dot`

Expected: PASS with no console errors.

### Task 2: Document and verify the review route

**Files:**
- Modify: `src/apps/web/MANIFEST.md`

**Interfaces:**
- Consumes: the completed `PricingPage` route and test coverage.
- Produces: an accurate review-surface entry for `/pricing` and its tab query variants.

- [x] **Step 1: Add the `/pricing` manifest row**

Document neutral subscription plans, job-search credits, Done For You packages, billing toggle, compact usage explanation, FAQ, and responsive behavior.

- [x] **Step 2: Run project verification**

Run `npm run test:run`, `npm run build`, and `git diff --check`.

- [x] **Step 3: Review desktop and mobile layouts**

Open `/pricing` at desktop and 360px widths. Confirm no horizontal page overflow, all tabs and actions remain reachable, and no plan is visually recommended.

- [x] **Step 4: Commit only scoped pricing files**

Commit the pricing page, pricing test, manifest entry, and this plan without staging unrelated working-tree changes.
