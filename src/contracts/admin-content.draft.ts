import type { DownloadItem } from './account.draft'
import type { MarketplaceItem } from './marketplace.draft'
import type { TutorialItem } from './account.draft'

export type AdminContentTab = 'marketplace' | 'downloads' | 'tutorials' | 'faq'

/* -------------------------------------------------------------------------- */
/* FAQ                                                                         */
/* -------------------------------------------------------------------------- */

export type AdminFaqItem = {
  readonly id: string
  readonly question: string
  readonly answer: string
}

/* -------------------------------------------------------------------------- */
/* Tutorial extensions (admin-side only)                                       */
/* -------------------------------------------------------------------------- */

/**
 * Extends the candidate-side `TutorialItem` with an optional `category` field
 * the admin view needs for filtering/grouping but that the candidate view does not display.
 */
export type AdminTutorialItem = TutorialItem & {
  readonly category?: string
}

/**
 * Extends the candidate-side `DownloadItem` with a string `id` (overriding the
 * candidate-side `DownloadPlatform` union) so admin-added entries can use any id.
 */
export type AdminDownloadItem = Omit<DownloadItem, 'id'> & {
  readonly id: string
}
export type AdminMarketplaceItem = MarketplaceItem
