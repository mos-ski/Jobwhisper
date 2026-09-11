# Pricing Page Redesign

## Goal

Redesign `/pricing` as a clear, informative Jobwhisper pricing reference that feels native to the existing account settings experience. The page must explain the three ways users pay without recommending, ranking, or visually favoring one plan or pricing model.

## Product principles

- Pricing is explanatory, not promotional.
- Interview plans, job-search credits, and Done For You receive equal visual weight.
- Users should understand what they pay for, how usage is measured, and what happens next without opening the FAQ.
- Auto Apply is charged per successful application. It is not conditional on receiving an interview.
- Interview usage is measured in minutes, with one interview credit representing one minute.
- Resume Builder is charged per AI prompt.
- Done For You is a separate one-time managed service.

## Visual direction

The page borrows the visual grammar of user settings: a restrained canvas, a compact header, left-aligned content, bordered white panels, clear section titles, and a settings-style tab row. Gowun Batang carries page titles, panel titles, and prices. Rethink Sans carries descriptions, controls, labels, and supporting details.

The palette uses the existing semantic tokens. Cobalt is reserved for the active tab, focus states, and primary actions. Ink, paper, subtle surfaces, and borders carry the rest of the hierarchy. The design does not use gradients, glass effects, decorative icons, hover-lift cards, marketing badges, or a highlighted recommended plan.

## Page structure

### Header

Keep a compact public navigation bar with the Jobwhisper identity, Home, Pricing, FAQ, and Get started. It should use the same disciplined spacing and border treatment as the app shell instead of translucent marketing chrome.

### Introduction

Use a left-aligned heading, `Pricing that follows how you use Jobwhisper`, followed by a concise explanation that Jobwhisper supports subscription, prepaid, and managed-service pricing. Keep the introduction inside the same maximum-width content shell used by the rest of the page.

### Pricing model tabs

Use the existing settings-tab pattern with three URL-compatible values:

- Interview plans
- Job-search credits
- Done for you

The first tab remains Interview plans. Selection communicates which information is visible, not which option is recommended. Tabs remain keyboard-operable and horizontally scroll on narrow screens.

### Interview plans

Place the monthly/annual control in the panel header. Render Starter, Pro, and Premium as equal-width structured plan panels. Each panel shows:

- Plan name
- Monthly equivalent
- Annual total when annual billing is selected
- Included interview credits and their minute meaning
- Short description
- Included features
- Neutral Get started action

Remove `Most popular` and any stronger border, shadow, or CTA treatment from Pro. All plans use identical hierarchy.

### Job-search credits

Render Resume Builder and Auto Apply as two equal panels. Each panel explains the unit price first, then what triggers the charge, what is included, credit validity, and its purchase action. The copy must make clear that these products do not require a subscription.

### Done For You

Render the 10-interview and 20-interview managed-service packages as equal panels. Explain that payment is one time, a success manager handles the work, and Jobwhisper continues working until the package guarantee is fulfilled. Neither package receives a recommendation badge or special treatment.

### How credits work

Replace the visually dominant usage table with a compact settings-style panel below the active pricing model. Use short labeled rows for:

- Interview sessions: 1 credit per minute
- Resume Builder: 1 credit per AI prompt
- Auto Apply: 1 credit per successful application
- Free actions: ATS scoring and AI suggestions

The panel can expose the full cost breakdown through a disclosure on smaller screens. Remove the duplicated AI Suggester row.

### Pricing FAQ

Use a two-column section: category navigation or labels on the left, accordion questions on the right. Keep the content plain and task-focused. Correct the Auto Apply answer so it never says users are charged based on receiving an interview.

### Closing actions

End with a quiet bordered panel instead of a dark promotional banner. Provide two clear actions: Get started and Contact support. Do not introduce a recommendation or sales-pressure language.

## Interaction and state

- The billing toggle updates displayed interview prices and annual totals without changing the selected tab.
- Tabs support pointer and keyboard interaction.
- Buttons keep their current navigation targets.
- FAQ disclosures use semantic controls and expose expanded state.
- Focus rings use the existing focus token.
- Motion is limited to control feedback and panel changes, and respects reduced-motion preferences.

## Responsive behavior

- Desktop: three-column interview plans, two-column prepaid and managed-service packages, two-column FAQ.
- Tablet: plan panels may use two columns with the last item spanning only when it improves balance; no information is hidden.
- Mobile: all panels stack, tabs scroll horizontally, prices remain on one readable line, and controls keep a minimum 44px target.
- Content remains usable at 200% zoom without horizontal page overflow.

## Architecture and reuse

Keep route wiring in `src/apps/web/pages/pricing-page.tsx`. Reuse existing `Button`, `Tabs`, `Badge` only where it carries real status, `Card` or the settings panel structure, and shared `cn`. Do not introduce a runtime dependency. If repeated panel structure needs extraction, place domain-specific pricing components with the pricing page rather than adding billing language to `src/ui/`.

## Testing

Add focused PricingPage tests covering:

- All three neutral tabs and no recommendation labels.
- Monthly and annual interview price changes.
- Job-search unit pricing and charge triggers.
- Done For You package information.
- The compact credit explanation with no duplicate entries.
- Correct Auto Apply FAQ language.
- Keyboard-accessible tab and FAQ behavior.

Run the focused test first, then the full Vitest suite, TypeScript/Vite production build, and a visual check at desktop and mobile widths.

## Out of scope

- Payment processing or API calls.
- Changing the underlying prices or package entitlements.
- Redesigning `/v3/billing` or account settings.
- Adding testimonials, urgency, discounts beyond the existing annual saving, or a recommended package.

## Approved visual refinement

- Place the pricing FAQ inside the same white, bordered, rounded panel treatment used by the pricing and credit sections.
- Reduce the vertical gaps between the tabbed pricing panel, credit guide, FAQ, and closing action so the page reads as one compact settings-style stack.
- Preserve clear internal padding and section boundaries; only the empty canvas space between sections becomes smaller.
- Use a restrained 2px radius on the large pricing, credit, FAQ, and closing panels instead of visibly curved container edges. Keep the existing control radii for buttons, tabs, and switches.
