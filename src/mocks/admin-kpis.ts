import type { AdminKpiCard, AdminKpiDetailRow, AdminKpiPeriod, AdminRevenueKpis } from '@/contracts/admin-kpis.draft'
import type { AdminDateRangeId } from '@/contracts/admin.draft'

/**
 * The plan is written once, in monthly terms, and every date range is derived from it — so a
 * 90-day target is always exactly three times the monthly one and the breakdown rows can never
 * disagree with the card total they sit under.
 */

const MONTHLY_TARGET_CENTS = 2_000_000

const MONTHS_IN_RANGE: Record<AdminDateRangeId, number> = {
  '7d': 7 / 30,
  '30d': 1,
  '90d': 3,
  '12m': 12,
}

const RANGE_IDS: readonly AdminDateRangeId[] = ['7d', '30d', '90d', '12m']

type RowSpec = {
  readonly id: string
  readonly label: string
  /** Short name used when the card summarises its rows on one line, e.g. "5 large + 3 small". */
  readonly shortLabel: string
  /**
   * `stock` rows bill a standing count every month (subscribers), so the count holds steady and
   * only the revenue scales with the window. `flow` rows are one-off events, so the count scales too.
   */
  readonly kind: 'stock' | 'flow'
  readonly unitNoun: string
  readonly priceLabel: string
  readonly unitPriceCents: number
  /** Units the plan assumes per month. */
  readonly planUnits: number
  readonly actualUnits: Record<AdminDateRangeId, number>
}

type CardSpec = {
  readonly id: string
  readonly label: string
  readonly detailNote: string
  readonly rows: readonly RowSpec[]
}

const CARD_SPECS: readonly CardSpec[] = [
  {
    id: 'dfy',
    label: 'Done For You',
    detailNote: 'The floor to plan around is 5 large-package sales a month, and no window here has hit it. This is the line dragging the whole month below target — every other one is at or over plan.',
    rows: [
      {
        id: 'dfy-large',
        label: 'Large — 20 interviews guaranteed',
        shortLabel: 'large',
        kind: 'flow',
        unitNoun: 'sale',
        priceLabel: '$997',
        unitPriceCents: 99_700,
        planUnits: 5,
        actualUnits: { '7d': 0, '30d': 2, '90d': 11, '12m': 52 },
      },
      {
        id: 'dfy-small',
        label: 'Small — 10 interviews guaranteed',
        shortLabel: 'small',
        kind: 'flow',
        unitNoun: 'sale',
        priceLabel: '$497',
        unitPriceCents: 49_700,
        planUnits: 3,
        actualUnits: { '7d': 1, '30d': 1, '90d': 8, '12m': 33 },
      },
    ],
  },
  {
    id: 'ayi',
    label: 'Ace Your Interview',
    detailNote: 'Starter carries the volume, but Pro and Premium together still drive over 60% of subscription revenue from 40% of subscribers — the upgrade path out of Starter is the one worth prioritizing.',
    rows: [
      {
        id: 'ayi-starter',
        label: 'Starter',
        shortLabel: 'Starter',
        kind: 'stock',
        unitNoun: 'subscriber',
        priceLabel: '$47/mo',
        unitPriceCents: 4_700,
        planUnits: 90,
        actualUnits: { '7d': 96, '30d': 96, '90d': 88, '12m': 71 },
      },
      {
        id: 'ayi-pro',
        label: 'Pro',
        shortLabel: 'Pro',
        kind: 'stock',
        unitNoun: 'subscriber',
        priceLabel: '$99/mo',
        unitPriceCents: 9_900,
        planUnits: 45,
        actualUnits: { '7d': 47, '30d': 47, '90d': 44, '12m': 36 },
      },
      {
        id: 'ayi-premium',
        label: 'Premium',
        shortLabel: 'Premium',
        kind: 'stock',
        unitNoun: 'subscriber',
        priceLabel: '$197/mo',
        unitPriceCents: 19_700,
        planUnits: 15,
        actualUnits: { '7d': 16, '30d': 16, '90d': 15, '12m': 12 },
      },
    ],
  },
  {
    id: 'fyj',
    label: 'Find Your Job',
    detailNote: 'Auto Apply carries this line — people take job-hunting seriously enough to want to run it themselves rather than pay someone else, and it is outgrowing the estimate faster than any other line. Resume Builder stays a small add-on, not a product to lean on.',
    rows: [
      {
        id: 'fyj-auto-apply',
        label: 'Auto Apply credits',
        shortLabel: 'Auto Apply',
        kind: 'flow',
        unitNoun: 'purchase',
        priceLabel: '$20 average',
        unitPriceCents: 2_000,
        planUnits: 150,
        actualUnits: { '7d': 44, '30d': 174, '90d': 478, '12m': 1_690 },
      },
      {
        id: 'fyj-resume',
        label: 'Resume Builder credits',
        shortLabel: 'Resume Builder',
        kind: 'flow',
        unitNoun: 'purchase',
        priceLabel: '$8 average',
        unitPriceCents: 800,
        planUnits: 10,
        actualUnits: { '7d': 3, '30d': 12, '90d': 29, '12m': 104 },
      },
    ],
  },
  {
    id: 'topups',
    label: 'Mid-session top-ups',
    detailNote: 'The cheapest revenue on the page — subscribers who run out of credits mid-session and pay on the spot to finish. No acquisition cost, since they are already paying customers. The $10 minimum buys roughly 60 extra minutes.',
    rows: [
      {
        id: 'topups-prep',
        label: 'Interview Prep',
        shortLabel: 'Prep',
        kind: 'flow',
        unitNoun: 'top-up',
        priceLabel: '$10 minimum',
        unitPriceCents: 1_000,
        planUnits: 6,
        actualUnits: { '7d': 1, '30d': 4, '90d': 14, '12m': 61 },
      },
      {
        id: 'topups-copilot',
        label: 'Interview Copilot',
        shortLabel: 'Copilot',
        kind: 'flow',
        unitNoun: 'top-up',
        priceLabel: '$10 minimum',
        unitPriceCents: 1_000,
        planUnits: 9,
        actualUnits: { '7d': 1, '30d': 7, '90d': 22, '12m': 95 },
      },
    ],
  },
]

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}

function unitsFor(row: RowSpec, rangeId: AdminDateRangeId, months: number) {
  return {
    targetUnits: row.kind === 'stock' ? row.planUnits : Math.round(row.planUnits * months),
    actualUnits: row.actualUnits[rangeId],
  }
}

function centsFor(row: RowSpec, units: number, months: number) {
  return row.kind === 'stock' ? Math.round(units * row.unitPriceCents * months) : units * row.unitPriceCents
}

function buildRow(row: RowSpec, rangeId: AdminDateRangeId, months: number): AdminKpiDetailRow {
  const { targetUnits, actualUnits } = unitsFor(row, rangeId, months)
  return {
    id: row.id,
    label: row.label,
    targetDetail: `${plural(targetUnits, row.unitNoun)} · ${row.priceLabel}`,
    targetCents: centsFor(row, targetUnits, months),
    actualDetail: plural(actualUnits, row.unitNoun),
    actualCents: centsFor(row, actualUnits, months),
  }
}

function buildCard(spec: CardSpec, rangeId: AdminDateRangeId, months: number): AdminKpiCard {
  const detailRows = spec.rows.map((row) => buildRow(row, rangeId, months))
  const summarize = (pick: (row: RowSpec) => number) =>
    spec.rows.map((row) => `${pick(row)} ${row.shortLabel}`).join(' + ')

  return {
    id: spec.id,
    label: spec.label,
    targetCents: detailRows.reduce((sum, row) => sum + row.targetCents, 0),
    targetDetail: summarize((row) => unitsFor(row, rangeId, months).targetUnits),
    actualCents: detailRows.reduce((sum, row) => sum + row.actualCents, 0),
    actualDetail: summarize((row) => unitsFor(row, rangeId, months).actualUnits),
    detailRows,
    detailNote: spec.detailNote,
  }
}

function buildPeriod(rangeId: AdminDateRangeId): AdminKpiPeriod {
  const months = MONTHS_IN_RANGE[rangeId]
  return {
    rangeId,
    targetCents: Math.round(MONTHLY_TARGET_CENTS * months),
    cards: CARD_SPECS.map((spec) => buildCard(spec, rangeId, months)),
  }
}

export const adminRevenueKpis: AdminRevenueKpis = {
  periods: RANGE_IDS.map(buildPeriod),
}
