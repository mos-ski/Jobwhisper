# TM Funnel Copy Corrections Design

## Goal

Bring the main landing page and the four public acquisition funnels into line with TM's September 30 feedback: each page must state one clear outcome, make the work Jobwhisper performs explicit, reduce perceived risk, and show credible proof close to the first action.

## Scope

The change covers five existing experiences:

1. Main landing page (`/`).
2. Resume/ATS funnel (`/try/resume`).
3. Interview Copilot funnel (`/try/copilot`).
4. Auto Apply funnel (`/try/auto-apply`).
5. General seven-day Pro funnel (`/try/pro`).

The existing flows, data contracts, offer terms, routing, and current uncommitted visual work remain intact. This is a focused conversion-copy and proof-placement pass, plus responsive corrections discovered while validating the pages.

## Copy Strategy

Each page will follow the same conversion sequence without collapsing the products into one generic message:

1. Name the result the visitor wants.
2. State what Jobwhisper does to produce that result.
3. State the relevant timing or immediacy without inventing a new guarantee.
4. Make the visitor's reduced effort explicit.
5. State the real risk reversal or offer terms accurately.
6. Show outcome-led proof before asking the visitor to invest substantial effort.

No page will imply that the standard subscription carries the managed Done-For-You guarantee. “Or don't pay” will only appear where the existing product terms support it. The Auto Apply page may use TM's 14-day direction only when the copy clearly identifies the applicable managed-service guarantee rather than attaching it to ordinary automated applications.

## Page Direction

### Main landing page

Position Jobwhisper as the practical system that helps a job seeker move from resume to application to interview, while keeping the hero focused on the strongest immediate outcome: passing the next interview. The hero will explain the real-time Copilot mechanism and retain the accurate guarantee qualification already present elsewhere on the page. Proof will become visible in the normal page flow near the hero instead of relying only on the floating download control.

### Resume/ATS funnel

Keep the approved upload, ATS score, rewritten comparison, and gated download sequence. Tighten the landing copy around diagnosing why the resume is being filtered out, improving it for the target role, and showing the improvement before signup. Add concise proof appropriate to resume outcomes, without claiming that an ATS score guarantees employment.

### Interview Copilot funnel

Keep the dynamic calendar, role selection, resume upload, interview-stage selection, and seven-day Pro offer. Clarify that Copilot listens during the interview and drafts resume-aware answers in real time. Move credible outcome proof earlier while retaining the company-logo proof at the stage-selection step.

### Auto Apply funnel

Correct the central omission TM identified: the page must say that Jobwhisper finds suitable recent roles and applies for the user. The headline and supporting copy will communicate outcome, timing, saved effort, and the applicable risk reversal without misrepresenting subscription terms. Proof will sit directly below the first resume action.

### General Pro funnel

Keep one general seven-day Pro journey. Introduce it as a low-risk way to use the complete job-search workflow for seven days, with the exact $10 introductory price, $99 monthly renewal, reminder timing, and cancellation terms kept visible. Proof will represent multiple product outcomes rather than making one feature dominate the page.

## Proof System

A focused feature-level proof component will support compact customer outcome cards and company marks. Proof content will be realistic, short, and specific, but will not invent named customers, employers, or unverifiable numeric outcomes. Existing verified aggregate language such as “57,000+ job seekers” may be reused. Where the available assets do not establish a real identity, cards will use anonymized role/location labels instead of fabricated full names.

Movement, if used, will be optional enhancement only. All proof remains readable without animation, pauses under reduced motion, and does not create a hover-only interaction. Mobile uses a readable horizontal snap row or stacked list rather than a clipped desktop marquee.

## Mobile and Accessibility

- Validate every first step at 360px width and at 200% zoom.
- Keep primary actions at least 44 CSS pixels high.
- Prevent headline, testimonial, logo, form, and offer-card overflow.
- Preserve one page-level `h1`, ordered headings, labeled inputs, keyboard operation, and visible focus.
- Keep proof meaningful without color or motion.
- Respect `prefers-reduced-motion`.
- Use semantic tokens only; add no raw colors or palette utilities.

## Testing

Update focused view and route-flow tests so they assert the corrected value propositions, explicit Auto Apply behavior, proof placement, and accurate offer terms. Run the funnel tests first, then the complete test suite and production build. Use a browser at desktop and 360px to inspect all five landing states before deployment.

## Documentation and Deployment

Update `docs/LIGHTFORTH_END_TO_END_SMARTER_SCRIPT.md` with the final canonical wording and update the web manifest for changed states. Preserve unrelated work in the dirty tree. Commit only the intended files, push the current `main` branch, then verify the production deployment and its five public routes.

## Out of Scope

- Changing pricing, renewal, refund, or managed-service terms.
- Rebuilding the underlying funnel flows.
- Adding analytics, third-party testimonial tools, or new runtime dependencies.
- Fabricating customer identities, employer relationships, or success statistics.
