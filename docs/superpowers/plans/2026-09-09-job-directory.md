# Job Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browsable job-board directory with a reliable Jobwhisper-hosted preview and safe external application handoff.

**Architecture:** Add a draft contract and typed mocks, then compose them in a pure feature view wired by a web page. The feature view owns only local search, filter, dialog, and selected-job state; the app layer owns fixture wiring and routing.

**Tech Stack:** React, strict TypeScript, Base UI dialog primitives, Tailwind token utilities, Vitest, Testing Library.

## Global Constraints

- Preserve the `apps -> features -> ui/contracts` import direction and never import mocks from the feature layer.
- Raw color values remain limited to `src/tokens/theme.css` and `src/tokens/tokens.ts`.
- Use Gowun Batang for display text and Rethink Sans through the existing app typography.
- Do not use iframes, network fetching, browser storage, or new runtime dependencies.
- All external application links use a new tab and `rel="noreferrer"`.
- The view remains usable at 360px, 200% zoom, keyboard-only operation, and reduced motion.

---

### Task 1: Define and test the directory interaction contract

**Files:**
- Create: `src/contracts/job-directory.draft.ts`
- Create: `src/mocks/job-directory.ts`
- Create: `src/features/job-directory/job-directory-view.test.tsx`

**Interfaces:**
- Produces: `JobBoard`, `DirectoryJob`, `JobDirectoryStatus`, and `JobDirectoryViewProps` expectations.
- Consumes: existing `AppShell`, `ShellBar`, `Dialog`, `Button`, and token utilities.

- [ ] **Step 1: Write failing interaction tests**

Create tests that render `JobDirectoryView` with typed fixture boards and assert that search hides unmatched boards, reset restores the list, Explore opens a dialog, selecting a job changes the detail heading, and Apply is an external link with `_blank` and `noreferrer`.

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npm run test:run -- src/features/job-directory/job-directory-view.test.tsx`

Expected: FAIL because the contract, fixture, and view modules do not exist.

- [ ] **Step 3: Add the flat draft contracts and realistic fixtures**

Define readonly serializable fields for board identity, board focus, supported regions, job summary, job detail, and canonical URLs. Export a typed fixture array with at least six boards and representative jobs.

- [ ] **Step 4: Re-run the focused test**

Run: `npm run test:run -- src/features/job-directory/job-directory-view.test.tsx`

Expected: still FAIL because the view is not implemented; type errors related to contract and fixtures are gone.

### Task 2: Implement the pure directory and preview view

**Files:**
- Create: `src/features/job-directory/job-directory-view.tsx`
- Modify: `src/features/job-directory/job-directory-view.test.tsx`

**Interfaces:**
- Consumes: `readonly JobBoard[]`, `JobDirectoryStatus`, `homeHref`, `onRetry`, and optional initial board/job identifiers.
- Produces: named `JobDirectoryView` and exported `JobDirectoryViewProps`.

- [ ] **Step 1: Implement the minimum ready-state view**

Create the Download Apps-aligned shell, labeled search, focus filter, board rows, Explore buttons, 80%-viewport dialog, responsive list-detail layout, browser-style address row, job selection, and external Apply link.

- [ ] **Step 2: Run the focused test and confirm GREEN**

Run: `npm run test:run -- src/features/job-directory/job-directory-view.test.tsx`

Expected: PASS.

- [ ] **Step 3: Add failing state tests**

Add assertions for layout-matched loading skeletons, recoverable error with retry, offline messaging and disabled external apply affordance, and zero-results reset.

- [ ] **Step 4: Run the focused test and confirm RED**

Run: `npm run test:run -- src/features/job-directory/job-directory-view.test.tsx`

Expected: FAIL on the new state assertions.

- [ ] **Step 5: Implement state coverage and responsive polish**

Render state-specific content, preserve cached boards offline, stack preview panes below the large breakpoint, use token-only color utilities, logical alignment, visible focus, and 44px controls.

- [ ] **Step 6: Run the focused test and confirm GREEN**

Run: `npm run test:run -- src/features/job-directory/job-directory-view.test.tsx`

Expected: PASS.

### Task 3: Wire the feature into the web application

**Files:**
- Create: `src/apps/web/pages/job-directory-page.tsx`
- Modify: `src/apps/web/routes.tsx`
- Modify: `src/apps/web/pages/route-index-page.tsx`
- Modify: `src/features/dashboard/app-nav.tsx`
- Modify: `src/features/dashboard/dashboard-nav-icons.tsx`

**Interfaces:**
- Consumes: `jobBoards` fixture and `JobDirectoryView`.
- Produces: `/v3/job-directory` route and persistent navigation entry.

- [ ] **Step 1: Add a failing route-level test assertion**

Extend the feature test or add a route test that verifies Job Directory appears in navigation and the route renders the page heading.

- [ ] **Step 2: Run the test and confirm RED**

Run: `npm run test:run -- src/features/job-directory/job-directory-view.test.tsx`

Expected: FAIL because the route and navigation item are absent.

- [ ] **Step 3: Wire page, route, route index, navigation icon, and entry**

Add the app page, match `/job-directory` in `WebRoutes`, list it in the review index, and add a functional directory icon beside the label.

- [ ] **Step 4: Run the focused test and confirm GREEN**

Run: `npm run test:run -- src/features/job-directory/job-directory-view.test.tsx`

Expected: PASS.

### Task 4: Document the product and verify the build

**Files:**
- Modify: `src/apps/web/MANIFEST.md`
- Modify: `CONTRACT-REQUESTS.md`
- Modify: `FLOWS.md`
- Modify: `docs/LIGHTFORTH_END_TO_END_SMARTER_SCRIPT.md`

**Interfaces:**
- Consumes: final route, props type, supported states, and user flow.
- Produces: a complete porting and product-story record.

- [ ] **Step 1: Update required documentation**

Add the route manifest row, record the draft board/job contract request, add the directory-to-application journey with entry/exit/failure branches, and place Job Directory before Auto Apply in the product education script.

- [ ] **Step 2: Run focused tests**

Run: `npm run test:run -- src/features/job-directory/job-directory-view.test.tsx`

Expected: PASS with zero failures.

- [ ] **Step 3: Run the full test suite**

Run: `npm run test:run`

Expected: PASS with zero failures.

- [ ] **Step 4: Run the production build**

Run: `npm run build`

Expected: TypeScript and Vite both exit successfully.

- [ ] **Step 5: Review the diff for scope and token compliance**

Run: `git diff --check && rg -n "#[0-9a-fA-F]{3,8}|rgba?\\(|hsla?\\(|oklch\\(|lab\\(|color\\(" src/features/job-directory src/apps/web/pages/job-directory-page.tsx src/contracts/job-directory.draft.ts src/mocks/job-directory.ts`

Expected: `git diff --check` exits successfully and the color scan returns no matches.
