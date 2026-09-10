# Email Callout Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the decorative callout-card treatment from every transactional email.

**Architecture:** Replace each callout helper usage with existing plain paragraph markup, then delete the unused helper. Add a catalog-level regression assertion so the rejected rail, tinted container, and label markup cannot return unnoticed.

**Tech Stack:** TypeScript, Vitest, table-based HTML email markup

## Global Constraints

- Keep all templates inline-styled and email-client portable.
- Use existing token-derived colors only.
- Do not change template data, CTAs, or routing.

---

### Task 1: Remove callout presentation

**Files:**
- Modify: `src/emails/templates/login-link.ts`
- Modify: `src/emails/templates/payment-reminder.ts`
- Modify: `src/emails/templates/payment-failed.ts`
- Modify: `src/emails/shell.ts`
- Test: `src/emails/templates/templates.test.ts`

**Interfaces:**
- Consumes: existing `paragraph(html, opts?)` helper
- Produces: eight templates without `calloutBox` markup or an accent rail

- [ ] **Step 1: Write the failing regression test**

Assert every catalog HTML result excludes `class="email-callout"`, `border-left:4px`, `text-transform:uppercase`, and the former routine labels.

- [ ] **Step 2: Run the scoped test and confirm failure**

Run: `npm test -- --run src/emails/templates/templates.test.ts`

- [ ] **Step 3: Replace all callouts with plain paragraphs**

Use muted paragraph text for routine notes and normal body text with direct warning copy for the failed-payment message. Remove `calloutBox` from imports and delete the helper from `shell.ts`.

- [ ] **Step 4: Verify the implementation**

Run: `npm test -- --run src/emails src/apps/web/pages/email-review-workspace.test.tsx`

Run: `npm run build`

Run: `git diff --check`
