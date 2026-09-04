/**
 * Draft contracts for the admin KPIs module.
 *
 * Every revenue line is the same shape: a target, what the window actually brought in, and
 * the rows behind both. The page renders them as one repeated indicator card, so a new line
 * is a data change rather than a new layout.
 *
 * Figures are supplied per date range, since a 7-day window has to be measured against a
 * 7-day slice of the target rather than the whole month.
 *
 * Status (surplus / achieved / in progress / at risk) is derived from target vs. actual in
 * the view — it is never stored, so it cannot drift from the two numbers it describes.
 */

import type { AdminDateRangeId } from './admin.draft'

/** One row inside a card's expanded breakdown — a package, a tier, or a credit source. */
export type AdminKpiDetailRow = {
  readonly id: string
  readonly label: string
  /** The volume the target assumes, e.g. "5 sales · $997" or "90 subscribers · $47/mo". */
  readonly targetDetail: string
  readonly targetCents: number
  /** What that volume actually came out at, e.g. "2 sales". */
  readonly actualDetail: string
  readonly actualCents: number
}

/** One indicator card: a revenue line measured against its own target for the selected window. */
export type AdminKpiCard = {
  readonly id: string
  readonly label: string
  readonly targetCents: number
  readonly targetDetail: string
  readonly actualCents: number
  readonly actualDetail: string
  readonly detailRows: readonly AdminKpiDetailRow[]
  readonly detailNote: string
}

/** The whole page for one date range. */
export type AdminKpiPeriod = {
  readonly rangeId: AdminDateRangeId
  /** The self-sustaining target for this window — the monthly target scaled to its length. */
  readonly targetCents: number
  readonly cards: readonly AdminKpiCard[]
}

export type AdminRevenueKpis = {
  readonly periods: readonly AdminKpiPeriod[]
}
