# Figma Email System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild all eight Jobwhisper transactional emails with the shared visual system from Figma node `859:3571`.

**Architecture:** Keep the existing string-builder API and consolidate the Figma-derived email-safe layout and components in `src/emails/shell.ts`. Adapt each template through those helpers, using inline styles and presentation tables while retaining the existing catalog and timezone interfaces.

**Tech Stack:** TypeScript, HTML email tables, inline CSS, Vitest, Vite

## Global Constraints

- Preserve every existing email builder export and `EmailTemplateBuilder` signature.
- Keep Jobwhisper copy and product semantics; do not copy the Figma placeholder brand or address.
- Use a 640px white card, 20px card radius, cobalt outer canvas, Gowun Batang greeting, and Rethink Sans body language from Figma node `859:3571`.
- Keep dynamic plain text HTML-escaped and use no temporary Figma asset URLs.
- Add no runtime dependency.
- Keep rendering mobile-safe and email-client-safe.

---

### Task 1: Lock the Figma shell contract with tests

**Files:**
- Create: `src/emails/shell.test.ts`
- Modify: `src/emails/shell.ts`

**Interfaces:**
- Consumes: existing `renderEmailShell`, `heading`, `paragraph`, `button`, `infoTable`, `calloutBox`, and `pill` exports.
- Produces: `greeting(name: string): string` and `verificationCode(code: string): string` in addition to compatible existing helpers.

- [ ] **Step 1: Write failing tests**

Add tests asserting the shared HTML contains the cobalt canvas, 640px/20px white card, mobile media query, Jobwhisper wordmark, Figma typography, escaped greeting text, six separate verification cells, and no `figma.com/api/mcp/asset` URLs.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `npm test -- --run src/emails/shell.test.ts`

Expected: FAIL because `greeting` and `verificationCode` do not exist and the old shell does not match the Figma structure.

- [ ] **Step 3: Implement the shared shell**

Replace the dark-header shell with the cobalt canvas, centered wordmark, 640px rounded white card, responsive gutters, in-card footer, escaped recipient copy, and helper functions described above. Retain inline styles and table markup.

- [ ] **Step 4: Run the focused test**

Run: `npm test -- --run src/emails/shell.test.ts`

Expected: PASS.

### Task 2: Adapt all email templates

**Files:**
- Modify: `src/emails/templates/login-link.ts`
- Modify: `src/emails/templates/receipt.ts`
- Modify: `src/emails/templates/payment-reminder.ts`
- Modify: `src/emails/templates/payment-failed.ts`
- Modify: `src/emails/templates/job-alert.ts`
- Modify: `src/emails/templates/copilot-report.ts`
- Modify: `src/emails/templates/interview-prep-report.ts`
- Modify: `src/emails/templates/meeting-recap.ts`
- Create: `src/emails/templates/templates.test.ts`

**Interfaces:**
- Consumes: the shared helpers from `src/emails/shell.ts` and existing date/currency formatters.
- Produces: the same eight builder exports listed in `src/emails/catalog.ts`.

- [ ] **Step 1: Write failing catalog tests**

Assert that every catalog entry builds complete HTML, uses the new shell, contains a personalized greeting, has one primary action, preserves its subject/preview output, and contains no temporary Figma URL.

- [ ] **Step 2: Run the focused tests and confirm failure**

Run: `npm test -- --run src/emails/templates/templates.test.ts`

Expected: FAIL because the current templates use the old shell and inconsistent greeting/action structures.

- [ ] **Step 3: Convert the account and billing templates**

Use `greeting`, `verificationCode`, `infoTable`, `calloutBox`, and `button` to rebuild the sign-in, receipt, renewal, and failed-payment messages without changing their functional data.

- [ ] **Step 4: Convert the jobs, reports, and meeting templates**

Use the same shell primitives for job rows, score/session details, meeting summary, and action items, retaining their existing builder exports and timezone formatting.

- [ ] **Step 5: Run all email tests**

Run: `npm test -- --run src/emails/shell.test.ts src/emails/templates/templates.test.ts`

Expected: PASS.

### Task 3: Verify preview integration and repository constraints

**Files:**
- Modify if needed: `src/apps/web/MANIFEST.md`
- Modify if product wording changes: `docs/LIGHTFORTH_END_TO_END_SMARTER_SCRIPT.md`

**Interfaces:**
- Consumes: `EMAIL_CATALOG` and the existing `/emails/:slug` iframe preview.
- Produces: a buildable review surface containing all eight redesigned templates.

- [ ] **Step 1: Run static checks**

Run: `rg -n "figma.com/api/mcp/asset|Untitled UI|100 Smith Street" src/emails`

Expected: no matches.

- [ ] **Step 2: Run the complete test suite**

Run: `npm test -- --run`

Expected: PASS.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: TypeScript and Vite complete successfully.

- [ ] **Step 4: Inspect the rendered preview**

Start Vite, open `/emails/login-link` and representative billing/report templates, and inspect desktop and narrow viewport screenshots for faithful shell geometry, readable content, and no horizontal overflow.

- [ ] **Step 5: Review the final diff**

Run: `git diff --check && git status --short`

Expected: no whitespace errors and only intended email/test/documentation files changed, alongside the user's pre-existing untracked files.
