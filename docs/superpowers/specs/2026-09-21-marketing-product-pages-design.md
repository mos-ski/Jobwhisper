# Jobwhisper Marketing Product Pages

## Scope

Build four public product education pages linked from the landing-page footer:

- AI Resume Builder
- Interview Copilot
- Interview Prep
- Auto Apply

The pages explain how each product helps a job seeker achieve a concrete outcome. Pricing and FAQ remain existing landing-page destinations.

## Shared page system

Each desktop page uses a two-column composition inspired by the supplied reference while retaining Jobwhisper's visual system.

- The left column occupies roughly 38% of the viewport and remains pinned while the user reads the page. It contains the Jobwhisper navigation, product name, outcome-led headline, concise explanation, primary action, and section progress.
- A quiet divider separates the columns.
- The right column occupies roughly 62% and contains the scroll narrative. Each section combines an outcome, a short explanation, a small sequence of steps or capabilities, and a product image.
- The active right-hand section updates the left-hand progress indicator. Content remains readable and usable if JavaScript is unavailable; active-state enhancement is optional rather than structural.
- The shared landing-page footer closes every page.

## Responsive behavior

At tablet and phone widths, the page becomes one natural document flow. The left introduction is no longer sticky and appears before the feature narrative. The right column loses its independent-scroll treatment, sections stack vertically, images remain inside the viewport, and every action retains a minimum 44px target. No information is hidden behind hover.

## Product narratives

### AI Resume Builder

Outcome: turn existing experience into a resume tailored to the role.

Narrative sections: choose the target role; bring in existing experience; receive role-specific suggestions; refine and export the finished resume.

### Interview Copilot

Outcome: answer live interview questions with relevant support grounded in the candidate's own experience.

Narrative sections: add resume and job context; configure response preferences; start the live session; receive answers in real time; review the session afterward.

### Interview Prep

Outcome: practice realistic questions and improve before the actual conversation.

Narrative sections: define the role; meet the AI interviewer; answer realistic questions; receive specific feedback; repeat the areas that need work.

### Auto Apply

Outcome: find suitable roles and move selected applications through one focused workflow.

Narrative sections: set role preferences; review matched jobs; choose application control level; tailor application materials; track submitted applications.

## Content and visual rules

- Copy leads with user outcomes, not internal feature names.
- Pages reuse the landing navigation, typography, semantic color tokens, controls, spacing rhythm, and rounded media treatment.
- Product screenshots use existing local artwork where it accurately represents the described step. Missing views use composed interface demonstrations built from existing app patterns rather than generic decorative illustrations.
- Motion is limited to the active-section transition and image entrance. Reduced-motion users receive an immediate state change.

## Architecture

- A pure feature view receives product title, outcome copy, CTA, sections, active section, and callbacks through props.
- Product content is typed and stored outside the reusable view.
- The marketing app page wires routing and active-section behavior.
- Footer links point to stable public routes for each product.

## Verification

- Verify all four routes render and footer links resolve.
- Test keyboard navigation and focus visibility.
- Test desktop sticky behavior, mobile document flow at 360px, and 200% zoom.
- Run TypeScript, the production build, relevant component tests, and the repository diff check.
