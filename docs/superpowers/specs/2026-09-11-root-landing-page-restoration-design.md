# Root Landing Page Restoration Design

## Goal

Restore the Jobwhisper root route (`/`) to the landing page currently published at `www.jobwhisper.ai`. The matching historical implementation is `src/apps/web/pages/landing-page.tsx` from commit `16c213b`.

## Scope

- Replace only `src/apps/web/pages/landing-page.tsx` with its version from commit `16c213b`.
- Keep the current root route wiring in `src/App.tsx`.
- Preserve `/vsl`, `/v3`, `/admin`, `/desktop`, `/help`, email previews, and all other newer work.
- Reuse the existing landing assets. The historical page references six assets, and all six remain available in `public/`.
- Do not revert commit `d632d6d` wholesale because it contains unrelated VSL work that must remain.

## Expected Experience

The restored homepage will match the public page's structure and content, including:

- The hero headline “Never leave an interview wishing you'd said something different.”
- Download and pricing calls to action.
- The interactive Jobwhisper demo.
- The interview-stage explanation.
- The “More ways Jobwhisper helps” feature section.
- The FAQ and existing footer navigation.

## Verification

- Add a regression test that renders `/` and verifies the correct hero, navigation, and primary calls to action.
- Run the focused landing-page test.
- Run the complete test suite.
- Run the production build.
- Compare the local root page visually with `https://www.jobwhisper.ai/` at desktop width.

## Safety

The working tree contains unrelated in-progress changes. The restoration must not overwrite, stage, or commit those changes. Only the historical landing page, its regression test, and this restoration documentation belong to this change.
