# Shared Public Navigation and Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Share the landing-page navigation and footer across all public product pages.

**Architecture:** Create router-independent marketing shell components in `src/features/marketing/`. Compose them from both the landing page and `MarketingProductView`, keeping navigation callbacks at the app boundary.

**Tech Stack:** React 19, TypeScript, Base UI menu primitives, Vitest, Testing Library.

## Global Constraints

- Use existing semantic color tokens only.
- Keep feature components presentational and router-independent.
- Preserve keyboard navigation, visible focus, 44px targets, mobile responsiveness, and reduced motion.

---

### Task 1: Shared Public Shell

**Files:**
- Create: `src/features/marketing/public-marketing-shell.tsx`
- Create: `src/features/marketing/public-marketing-shell.css`
- Modify: `src/features/marketing/marketing-product-view.tsx`
- Modify: `src/apps/web/pages/landing-page.tsx`
- Test: `src/features/marketing/marketing-product-view.test.tsx`
- Test: `src/apps/web/pages/landing-page.test.tsx`

**Interfaces:**
- Produces: `PublicMarketingNav`, `PublicMarketingFooter`, and their exported prop types.
- Consumes: URL strings and `onHome` callback supplied by each page.

- [ ] **Step 1: Extend tests for the shared shell**

Assert that product pages expose Features, Pricing, FAQ, Download, Log in, Privacy Policy, and Terms.

- [ ] **Step 2: Run focused tests and confirm failure**

Run `npm test -- --run src/features/marketing/marketing-product-view.test.tsx src/apps/web/pages/landing-page.test.tsx`.

- [ ] **Step 3: Implement and compose the shared shell**

Build pure shared components, replace the duplicate product header, and add the footer below the product story.

- [ ] **Step 4: Verify focused and full checks**

Run the focused tests, `npm test -- --run`, `npm run build`, and `git diff --check`.
