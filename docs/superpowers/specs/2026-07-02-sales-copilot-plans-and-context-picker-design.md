# Sales Copilot — Individual/Enterprise Plans + Context Document Picker

## Context

Two independent changes to the Sales Copilot ("Sales Closer AI") product surface, requested together:

1. The sales landing page (`/copilot/enterprise`, [EnterpriseCopilotLanding.tsx](../../../src/pages/marketing/EnterpriseCopilotLanding.tsx)) currently sells a single Enterprise plan ($5,000 one-time setup fee + $79/seat/month, self-serve checkout). It's moving to two plans: a self-serve **Individual** plan and a sales-led **Enterprise** plan.
2. Several "Context" inputs across the product are free-text textareas. They should become a select-type document picker — tick documents from a library you already manage, instead of typing or pasting text. [InterviewPrep.tsx](../../../src/pages/InterviewPrep.tsx) already does this correctly via [DocumentPickerModal](../../../src/components/shared/DocumentPickerModal.tsx); the desktop Copilot simulator ([DesktopCopilotPreview.tsx](../../../src/pages/DesktopCopilotPreview.tsx)) does not, and needs it added/converted.

## Part 1 — Individual + Enterprise plans

### Pricing section (`EnterpriseCopilotLanding.tsx`)

Replace the single pricing `<article>` (current lines ~191-212) with two cards side by side:

| Plan | Price | CTA | Behavior |
|---|---|---|---|
| **Individual** | $99.90/month | "Get started" | Opens self-serve checkout (same `CheckoutFlow` component as today, `collectCompany={false}`) |
| **Enterprise** | No price shown | "Book a Call" | Opens an external scheduling link in a new tab (placeholder URL, e.g. `https://calendly.com/lightforth/enterprise` — swap in the real link later) |

Enterprise's feature bullets (`PRICING_BULLETS`) stay as marketing copy; only the price block and CTA change. The FAQ item "What does the $5,000 setup fee actually cover?" is removed since Enterprise no longer has a visible fee — replace it with a line explaining Enterprise is a custom/team rollout, sales-assisted.

The hero CTA and closing-section CTA (both currently "Get started" → `#pricing` or `/copilot/enterprise/checkout`) keep scrolling to `#pricing` — they don't need to pick a plan on the visitor's behalf.

The existing `?waitlist` mode (hides pricing entirely) keeps that behavior — it still shows no pricing/checkout CTAs. It only needs a copy pass (see "Copy consistency pass" below) so nothing on the page contradicts the new two-plan model once waitlist mode is turned off.

### Copy consistency pass

Beyond the pricing section itself, scrub stray copy elsewhere on `EnterpriseCopilotLanding.tsx` that assumes the old single-plan (Enterprise-only, $5,000 setup, admin-and-team-only) framing, so the page reads consistently now that Individual is also a persona:

- FAQ item "What does the $5,000 setup fee actually cover?" — removed per Part 1 above (applies in both waitlist and non-waitlist FAQ variants — `FAQ_ITEMS.filter(item => !item.q.includes('$'))` already strips it from the waitlist variant, so removing the item outright keeps both variants correct without further filtering logic).
- FAQ item "What happens to our call recordings and transcripts?" says "the admin who set up the account has access to everything" — reword to also cover the Individual case (a solo user is effectively their own admin, so this still holds; just avoid implying an admin/rep hierarchy is required).
- Leave hero copy, `FEATURES`, and `CASE_STUDIES` as-is — they read fine for both a team rollout and a solo rep ("every rep gets the right answer" applies whether there's one rep or twelve). No broader messaging rewrite requested.

### Checkout (`IndividualCheckoutPage.tsx`, new — mirrors `EnterpriseCheckoutPage.tsx`)

Reuses `CheckoutFlow` with `collectCompany={false}`:

```ts
const MONTHLY_PRICE = 99.90

<CheckoutFlow
  productLabel="the Individual plan"
  collectCompany={false}
  lineItems={[{ label: 'Individual plan — first month', amount: '$99.90' }]}
  totalLabel="$99.90"
  payButtonLabel="Pay $99.90 and continue"
  onComplete={({ email, fullName }) => {
    setAccount(email, { accountType: 'sales-individual' })
    createOrg(email, demoSeedOrg(email, fullName, `${fullName}'s workspace`))
    setActiveAdminEmail(email)
    navigate('/sales/dashboard')
  }}
/>
```

Route: `/copilot/individual/checkout`.

### Account/org model changes

- `AccountType` (in [mockAccounts.ts](../../../src/pages/desktopCopilot/mockAccounts.ts)) gains a new value: `'sales-individual'`.
- `SalesOrg` (in [mockOrg.ts](../../../src/pages/sales/mockOrg.ts)) gains a `planTier: 'individual' | 'enterprise'` field, set at creation time by whichever checkout page calls `createOrg`.
- Individual orgs are seeded with `setupFeePaid: true` (there's no fee to track, so the existing "Setup fee: Paid/Unpaid" UI in Overview/Billing simply always reads "Paid" — no fee amount shown for individual plans; the $5,000 figure in `Billing.tsx`/`Overview.tsx` only renders when `planTier === 'enterprise'`).

### Dashboard gating (`SalesAdminLayout.tsx`)

The nav item `{ to: '/sales/dashboard/team', label: 'Team', ... }` is filtered out of `NAV` when `org.planTier === 'individual'`. Everything else (Overview, Knowledge Base, Call History, Billing, Integrations, Settings) is shown to both plan tiers unchanged. The `/sales/dashboard/team` route itself redirects to `/sales/dashboard` if a non-enterprise org somehow lands there directly (defense against a stale bookmark, not a real access-control concern in this prototype).

## Part 2 — Context becomes a document picker

### Current state (confirmed by codebase read)

| Location | Field | Current UI | Needs change? |
|---|---|---|---|
| `InterviewPrep.tsx` (web page) | "Documents" | Already a picker via `DocumentPickerModal` | No — reference implementation |
| `DesktopCopilotPreview.tsx` → `RegularSetupScreen`, Meeting tab | "Context" | Free-text textarea + dead "Upload document" button | Yes — convert to picker |
| `DesktopCopilotPreview.tsx` → `RegularSetupScreen`, Interview tab | *(none)* | No context field exists | Yes — add picker |
| `DesktopCopilotPreview.tsx` → `SetupScreen` (config-driven, used for Sales-call & Exam) | *(none — closest is "Talk track notes")* | No context field exists for sales-call | Yes — add picker; "Talk track notes" stays as-is (structured notes, not context library) |

### New shared component: `ContextPickerField`

A dark-themed, inline (not modal-nested-in-modal) checklist matching the simulator's existing card style (`CARD`/`BORDER`/`BLUE` tokens already used throughout `DesktopCopilotPreview.tsx`):

- Label: "Context `(optional)`"
- Collapsed state: a dashed-border button, "+ Add context from your documents"
- Expanded/selected state: selected docs render as removable chips (same interaction pattern as `InterviewPrep.tsx`'s Documents section), with an "Add more" link
- Clicking either opens a lightweight checklist popover (not the full multi-step `DocumentPickerModal` — there's no CV/"Other Document" upload branch needed here, just the "tick documents" step) listing documents from the relevant source (see below), with a "✓ selected" state per row and a "Done" button

This lives in `src/pages/DesktopCopilotPreview.tsx` alongside the other field renderers (or a new small file `src/pages/desktopCopilot/ContextPickerField.tsx` if it grows past ~80 lines) — styled with the simulator's existing dark tokens, not `DocumentPickerModal`'s light `lf-panel`/`lf-input` classes.

### Document source by account type

- **`accountType: 'regular'` or `'sales-individual'`** → source is the personal Context library — the same data `InterviewPrep.tsx`/`DocumentPickerModal.tsx` already use (`MOCK_CONTEXT_SOURCES` today; both consumers should read from one shared export rather than each keeping their own copy).
- **`accountType: 'enterprise-admin'` or `'enterprise-member'`** → source is the org's Knowledge Base documents (`SalesOrg.knowledgeBase.documents`, `KnowledgeDocument[]` — `{ id, name, enabled }` — from [mockOrg.ts](../../../src/pages/sales/mockOrg.ts)), filtered to `enabled: true`.

`ContextPickerField` takes the resolved document list as a prop (`docs: { id: string; name: string; type?: string }[]`) — the caller (interview tab, meeting tab, sales-call `SetupScreen`) resolves which source to pass based on the current account, so the field component itself stays source-agnostic.

### Per-screen wiring

- **`RegularSetupScreen`, Interview tab**: add `ContextPickerField` below "Job description," selected doc IDs stored in new `interviewContext` state (array).
- **`RegularSetupScreen`, Meeting tab**: replace the existing free-text `<textarea placeholder="Paste any background info...">` + dead "Upload document" button (lines ~739-753) with `ContextPickerField`, reusing the existing `agenda`-adjacent layout position.
- **`SetupScreen`**, sales-call use case: add a new `SetupFieldId` value `'context'` to [useCases.ts](../../../src/pages/desktopCopilot/useCases.ts), add `'context'` to `sales-call`'s `setupFields` array (after `talk-track`), and render `ContextPickerField` in `SetupScreen`'s field-rendering block (alongside the existing `fields.has('talk-track')` block, ~line 422).

No changes to Exam or Coding — they weren't mentioned and have no context concept today.

## Out of scope

- Real payment processing, real scheduling-link integration, real document upload/storage — this is a mocked prototype throughout; "Book a Call" opens a placeholder URL and the document picker reads from existing mock arrays.
- Per-rep visibility rules on Knowledge Base documents beyond the existing `enabled` flag.
- Migrating any existing free-text "Job description," "Talk track notes," or "Agenda" fields to pickers — only fields conceptually named/used as "Context" are affected.
