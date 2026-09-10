# Auto Apply Outcome Coverage Design

## Goal

Show the complete set of existing application outcomes on the Applied page without adding more job records or changing the page layout.

## Outcome mapping

- Delinea: `success`
- Coinbase CX Automation: no outcome, so it remains the plain `Applied` state
- Coinbase Payments Core: `needs-review`
- Stripe Payments: `failed`
- Google Frontend Engineer: `closed`
- Meta Product Manager: `success`

The existing outcome badges remain the visual treatment. The `needs-review` row continues to open the existing review and retry dialog; other rows continue to open application details.

## Jobs page behavior

The Jobs page contains only actionable listings: `new`, `queued`, and `applying`. Applied jobs belong exclusively on Applied, and closed postings are not presented to users. New rows show a compact New indicator beside the match score and a primary Apply button. Applying changes that row to Queued and shows “Whisper AI has started the application.” with “The application is now in queue.” as supporting text. Queued and Applying details do not offer another application action. The extension link uses a right-facing arrow.

## First-page density

Jobs and Applied each show exactly 10 fixture records on their first page. Four additional Jobs records provide two New, one Queued, and one Applying example. Four additional Applied records provide one Success, one Needs Review, one Failed, and one Closed example. The existing posting-closed fixture remains hidden from users and does not count toward either page.

## Verification

The Applied route test must assert that all five user-visible labels—Applied, Success, Needs Review, Failed, and Closed—render from the existing six records. A Jobs route test must verify applied and closed records are absent, Apply queues a new job, the confirmation toast appears, and queued job details cannot be applied again. The production build and browser view must also be checked.
