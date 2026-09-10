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

## Verification

The Applied route test must assert that all five user-visible labels—Applied, Success, Needs review, Failed, and Closed—render from the existing six records. The production build and browser view must also be checked.
