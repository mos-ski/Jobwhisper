# Product-led Email System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild all eight transactional emails as a restrained, recognizably Jobwhisper product-email system informed by the supplied references.

**Architecture:** Keep the existing catalog and builder contracts. Replace the shared presentation helpers in `shell.ts`, then compose each email from the new primitives; specialized job, report, and recap structures remain local to their template files.

**Tech Stack:** TypeScript, table-based inline email HTML, Vitest, React/Vite review workspace

## Global Constraints

- Keep one primary button per email.
- Use only color values sourced from `src/tokens/tokens.ts`.
- Keep the generated HTML table-based and responsive at 640px and below.
- Do not add dependencies or external runtime assets.

---

### Task 1: Rebuild the shared email frame

**Files:**
- Modify: `src/emails/shell.ts`
- Modify: `src/emails/shell.test.ts`

**Interfaces:**
- Consumes: `jobwhisperTokens.light`
- Produces: `renderEmailShell`, `heading`, `greeting`, `paragraph`, `button`, `divider`, `infoTable`, `verificationCode`, and a new `metric` helper

- [ ] Add failing assertions for the neutral canvas, compact in-card wordmark, sans typography, quiet footer, and single code band.
- [ ] Run `npm test -- --run src/emails/shell.test.ts` and confirm failure.
- [ ] Implement the new shell and helpers without changing builder signatures.
- [ ] Re-run the shell test and confirm it passes.

### Task 2: Recompose all eight templates

**Files:**
- Modify: `src/emails/templates/login-link.ts`
- Modify: `src/emails/templates/receipt.ts`
- Modify: `src/emails/templates/payment-reminder.ts`
- Modify: `src/emails/templates/payment-failed.ts`
- Modify: `src/emails/templates/job-alert.ts`
- Modify: `src/emails/templates/copilot-report.ts`
- Modify: `src/emails/templates/interview-prep-report.ts`
- Modify: `src/emails/templates/meeting-recap.ts`
- Modify: `src/emails/templates/templates.test.ts`

**Interfaces:**
- Consumes: shared helpers from Task 1
- Produces: eight template builders with unchanged slugs and return shapes

- [ ] Update catalog assertions for the new system and write template-specific content assertions.
- [ ] Run `npm test -- --run src/emails/templates/templates.test.ts` and confirm failure.
- [ ] Recompose authentication, billing, digest, report, and recap layouts.
- [ ] Run all email and review-workspace tests.

### Task 3: Review and verify

**Files:**
- Modify: `src/apps/web/MANIFEST.md`

**Interfaces:**
- Consumes: finished templates and existing `/emails/:slug` review workspace
- Produces: documented, visually reviewed delivery

- [ ] Update the manifest description.
- [ ] Run `npm test -- --run src/emails src/apps/web/pages/email-review-workspace.test.tsx`.
- [ ] Run `npm run build` and `git diff --check`.
- [ ] Reload the live preview and inspect representative authentication, billing, digest, and report emails.
