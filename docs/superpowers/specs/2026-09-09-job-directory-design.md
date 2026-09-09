# Job Directory Design

## Purpose

Add a Jobwhisper job-board directory that helps candidates discover useful job sources without pretending external sites can be embedded reliably. Users browse trusted boards, open a Jobwhisper-hosted browser-like preview, inspect representative jobs, and continue to the real application page in a new browser tab.

## Product flow

1. A signed-in candidate opens **Job Directory** from the app navigation.
2. The directory uses the same restrained panel composition as **Download Apps**: app rail, page bar, bordered white surface, Gowun Batang title, and compact cards.
3. The candidate searches boards or filters by focus.
4. Selecting **Explore** opens a dialog sized to approximately 80% of the viewport.
5. The dialog has lightweight browser chrome, board identity, a representative job list, and a job-detail pane.
6. Selecting a job updates the detail pane without leaving Jobwhisper.
7. Selecting **Apply on [board]** opens the job's canonical external application URL in a new tab using `target="_blank"` and `rel="noreferrer"`.

## Reliability decision

The preview is curated and rendered by Jobwhisper. It is not an iframe. Many external job boards block embedding through frame policies, and a broken frame would leave candidates stranded. The UI explains that the preview is a snapshot and that the final application happens on the source board.

## Architecture

- `src/contracts/job-directory.draft.ts` defines flat, serializable board and job shapes plus view status.
- `src/mocks/job-directory.ts` provides realistic typed fixtures and canonical external URLs.
- `src/features/job-directory/job-directory-view.tsx` owns only presentational and local interaction state. It receives data and callbacks as props and imports no mocks or routing.
- `src/apps/web/pages/job-directory-page.tsx` wires fixtures and external navigation behavior to the view.
- `src/apps/web/routes.tsx`, the app navigation, route index, manifest, flow documentation, and product script expose and explain the feature.

## Visual direction

The directory extends the Download Apps screen instead of inventing another visual system. Board entries are compact editorial rows with useful metadata and a red-signal action. The preview resembles a practical desktop browser window through a title bar and address field, without decorative glass, gradients, or fake operating-system controls. On wide screens the modal uses a list-detail split. On narrow screens the panes stack so no content is hidden at 360px or 200% zoom.

## States

- **Ready:** directory and preview are fully interactive.
- **Loading:** skeletons match the directory rows.
- **Empty:** a clear search-reset action appears when filters remove all results.
- **Error:** an explanatory message and retry action replace the list.
- **Offline:** cached boards remain visible, while external applications are labeled unavailable until connectivity returns.
- **Dense:** fixtures include long names, multiple tags, and enough jobs to test overflow.

## Accessibility

- One page `h1`; structured headings inside the preview.
- Search and filter controls have visible labels.
- Explore and Apply targets meet the 44px minimum.
- Base UI dialog supplies focus trapping, Escape close, and focus restoration.
- Board type, remote status, and availability are always expressed in text, not color alone.
- External destinations are disclosed in button copy and accessible labels.

## Testing

Interaction tests verify filtering, the empty-state reset, dialog open/close, job selection, and safe external application links. TypeScript compilation and the production build verify layer-safe imports and valid props.

## Scope boundaries

This version does not fetch live job feeds, scrape third-party sites, authenticate with boards, or submit applications. Those capabilities require backend contracts and commercial/data-source decisions beyond this UI delivery.
