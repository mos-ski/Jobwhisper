# Landing CTA Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace competing landing-page actions with one interview-focused hero CTA and clear download and signup actions elsewhere.

**Architecture:** Keep action wiring in `landing-page.tsx` and styling in its colocated stylesheet. Reuse the existing download menu and account routes; add no new state or dependencies.

**Tech Stack:** React 19, TypeScript, React Router, Base UI menu primitives, Vitest, Testing Library, CSS tokens.

## Global Constraints

- No raw color values outside the token files.
- Preserve section-hash navigation and mobile accessibility.
- Use the existing Apple and Windows assets.
- Keep action targets at least 44 CSS pixels high.

---

### Task 1: Landing action hierarchy

**Files:**
- Modify: `src/apps/web/pages/landing-page.tsx`
- Modify: `src/apps/web/pages/landing-page.css`
- Test: `src/apps/web/pages/landing-page.test.tsx`
- Modify: `docs/LIGHTFORTH_END_TO_END_SMARTER_SCRIPT.md`

**Interfaces:**
- Consumes: existing `DownloadMenu`, `downloadItems`, React Router `navigate`.
- Produces: hero `Ace your Interview`, nav `Download` and `Sign up`, overlay `Download`.

- [ ] **Step 1: Write the failing test**

Assert that the hero has one `Ace your Interview` action, the main navigation exposes `Download` and `Sign up`, and the social-proof region exposes `Download`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/apps/web/pages/landing-page.test.tsx`

Expected: FAIL because the new labels are not rendered.

- [ ] **Step 3: Write minimal implementation**

Update `LandingNav`, `Hero`, and `SocialProofSignup`; style the new hierarchy with existing landing tokens, including full-contrast reassurance copy and mobile sizing.

- [ ] **Step 4: Run tests and production build**

Run: `npm test -- --run && npm run build && git diff --check`

Expected: all tests pass, TypeScript and Vite build successfully, and the diff has no whitespace errors.

- [ ] **Step 5: Commit**

```bash
git add src/apps/web/pages/landing-page.tsx src/apps/web/pages/landing-page.css src/apps/web/pages/landing-page.test.tsx docs/LIGHTFORTH_END_TO_END_SMARTER_SCRIPT.md docs/superpowers/specs/2026-09-21-landing-cta-hierarchy-design.md docs/superpowers/plans/2026-09-21-landing-cta-hierarchy.md
git commit -m "Refine landing page CTA hierarchy"
```
