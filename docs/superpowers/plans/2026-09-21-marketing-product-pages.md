# Marketing Product Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build four responsive public product pages with complete outcome-based product education and FAQ on the pinned left, plus a sequential module screenshot narrative on the right.

**Architecture:** A pure `MarketingProductView` in `src/features/marketing/` renders a typed product model containing overview, workflow, outcome, FAQ, and visual modules. A page-level wrapper in `src/apps/web/pages/` supplies one of four static product definitions. The root router exposes stable public URLs, and the landing footer links to them.

**Tech Stack:** React 18, TypeScript strict mode, React Router, CSS with semantic tokens, Vitest, Testing Library.

## Global Constraints

- Reuse the existing Jobwhisper landing-page typography, navigation, footer, semantic colors, spacing rhythm, and rounded media treatment.
- Keep the feature view pure: all content, active state, and callbacks arrive through typed props.
- Use existing local product artwork and application UI; do not fetch data or add dependencies.
- Desktop uses a pinned left column and scroll narrative; tablet/mobile use one natural document flow.
- Keep every interactive target at least 44px and support keyboard focus, reduced motion, 360px width, and 200% zoom.
- Copy must lead with the job seeker's outcome.

---

### Task 1: Product-page contract and pure feature view

**Files:**
- Create: `src/contracts/marketing-product.draft.ts`
- Create: `src/features/marketing/marketing-product-view.tsx`
- Create: `src/features/marketing/marketing-product-view.css`
- Test: `src/features/marketing/marketing-product-view.test.tsx`

**Interfaces:**
- Produces: `MarketingProduct`, `MarketingProductSection`, `MarketingProductView`, and `MarketingProductViewProps`.
- `MarketingProductViewProps` contains `product`, `activeSectionId`, `onSectionVisible`, `onPrimaryAction`, and `onHome`.

- [ ] **Step 1: Write the failing accessibility and content test**

Create a representative product fixture, render `MarketingProductView`, and assert one `h1`, every section heading, a named primary action, a home action, and an `aria-current="step"` progress link for the active section.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- --run src/features/marketing/marketing-product-view.test.tsx`

Expected: FAIL because the view and contract do not exist.

- [ ] **Step 3: Add the typed serializable draft contract**

Define readonly `MarketingProductSection` fields for `id`, `eyebrow`, `title`, `body`, `steps`, `imageSrc`, and `imageAlt`. Define readonly `MarketingProduct` fields for `slug`, `label`, `headline`, `summary`, `ctaLabel`, `ctaHref`, `accent`, and `sections`.

- [ ] **Step 4: Implement the pure view and responsive stylesheet**

Render a semantic header, pinned `aside`, section navigation, CTA, and right-side `article` sections. Use an `IntersectionObserver` effect only to report visible section ids through `onSectionVisible`; clean it up on unmount. At `max-width: 860px`, remove sticky positioning and render one document flow. Add a reduced-motion rule that disables section transforms and transitions.

- [ ] **Step 5: Run the focused test**

Run: `npm test -- --run src/features/marketing/marketing-product-view.test.tsx`

Expected: PASS.

### Task 2: Four product definitions and application wrapper

**Files:**
- Create: `src/apps/web/product-content.ts`
- Create: `src/apps/web/pages/product-page.tsx`
- Test: `src/apps/web/pages/product-page.test.tsx`

**Interfaces:**
- Consumes: `MarketingProduct` and `MarketingProductView` from Task 1.
- Produces: `PRODUCTS: Readonly<Record<ProductSlug, MarketingProduct>>`, `ProductSlug`, `ProductPage`, and `ProductPageProps`.

- [ ] **Step 1: Write failing route-content tests**

Render each slug and assert the outcome headline, all named narrative sections, and correct CTA destination. Assert an unknown slug does not compile by keeping `ProductPageProps.slug` typed as `ProductSlug`.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- --run src/apps/web/pages/product-page.test.tsx`

Expected: FAIL because product content and page wrapper do not exist.

- [ ] **Step 3: Add outcome-led content for all four products**

Create definitions for `resume-builder`, `interview-copilot`, `interview-prep`, and `auto-apply` using the narratives approved in the design spec. Use existing files under `public/figma-landing/` and existing UI screenshots where each image accurately represents the section.

- [ ] **Step 4: Wire page state and navigation**

Implement `ProductPage` with local `activeSectionId` initialized to the first section. Pass navigation callbacks using React Router's `useNavigate`; primary CTAs point to the matching `/v3/...` product entry.

- [ ] **Step 5: Run the focused test**

Run: `npm test -- --run src/apps/web/pages/product-page.test.tsx`

Expected: PASS for all four products.

### Task 3: Public routes and footer links

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/apps/web/pages/landing-page.tsx`
- Modify: `src/apps/web/pages/landing-page.test.tsx`

**Interfaces:**
- Consumes: `ProductPage` and `ProductSlug` from Task 2.
- Produces public routes `/products/resume-builder`, `/products/interview-copilot`, `/products/interview-prep`, and `/products/auto-apply`.

- [ ] **Step 1: Extend the landing test with footer destinations**

Assert the four footer product links resolve to their matching `/products/...` URLs.

- [ ] **Step 2: Run the landing test and verify it fails**

Run: `npm test -- --run src/apps/web/pages/landing-page.test.tsx`

Expected: FAIL because the links still use `#`.

- [ ] **Step 3: Register four public product routes**

Import `ProductPage` in `src/App.tsx` and add one explicit route per typed slug before the `/v3/*` route.

- [ ] **Step 4: Replace placeholder footer destinations**

Map AI Resume Builder, Interview Copilot, Interview Prep, and Auto Apply to their new public URLs. Leave Pricing and FAQ unchanged.

- [ ] **Step 5: Run landing and product tests**

Run: `npm test -- --run src/apps/web/pages/landing-page.test.tsx src/apps/web/pages/product-page.test.tsx`

Expected: PASS.

### Task 4: Manifest, contract request, and visual verification

**Files:**
- Modify: `src/apps/web/MANIFEST.md`
- Modify: `CONTRACT-REQUESTS.md`

**Interfaces:**
- Consumes: all routes and types from Tasks 1-3.
- Produces: portability documentation for the production team.

- [ ] **Step 1: Document all four routes in the web manifest**

Add one row per product page naming `MarketingProductViewProps`, responsive states, sticky desktop behavior, mobile flow, and reduced-motion behavior.

- [ ] **Step 2: Register the draft marketing contract**

Document why `MarketingProduct` and `MarketingProductSection` are needed and that they remain flat, readonly, and serializable.

- [ ] **Step 3: Run the complete automated verification**

Run: `npm test -- --run && npm run build && git diff --check`

Expected: all tests pass, TypeScript and Vite build succeed, and diff check prints no errors.

- [ ] **Step 4: Verify the rendered pages**

Open each route at desktop width and 360px width. Confirm the left panel pins only on desktop, every section is reachable, active progress follows scrolling, images do not overflow, focus remains visible, and the footer routes work.
