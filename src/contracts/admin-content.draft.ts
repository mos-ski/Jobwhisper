import type { DownloadItem } from './account.draft'
import type { MarketplaceItem } from './marketplace.draft'
import type { TutorialItem } from './account.draft'

export type AdminContentTab = 'marketplace' | 'downloads' | 'tutorials' | 'faq' | 'popups'

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
/**
 * Extends the candidate-side `MarketplaceItem` with the PDF asset filename backing it.
 * The candidate view renders a fixed marketplace icon for every item today and has no
 * per-item asset field to manage — this is what the admin catalog needs to add one.
 */
export type AdminMarketplaceItem = MarketplaceItem & {
  readonly assetFileName: string
}

/* -------------------------------------------------------------------------- */
/* Popup widgets                                                               */
/* -------------------------------------------------------------------------- */

export type PopupCategory = 'popup' | 'offer' | 'feature-release'

export type PopupDisplayType = 'modal' | 'toast' | 'banner'

/** Shared fields across all popup widget types. */
type PopupWidgetBase = {
  readonly id: string
  readonly name: string
  readonly category: PopupCategory
  readonly displayType: PopupDisplayType
  readonly active: boolean
}

/** Popup — general promotional popup with headline, sub-headline, title, body, CTA. */
export type PopupWidget = PopupWidgetBase & {
  readonly category: 'popup'
  readonly headline: string
  readonly subHeadline: string
  readonly title: string
  readonly body: string
  readonly ctaLabel: string
  readonly ctaUrl: string
}

/** Offer — pricing offer with discount, repeater list, optional countdown timer. */
export type OfferWidget = PopupWidgetBase & {
  readonly category: 'offer'
  readonly headline: string
  readonly subHeadline: string
  readonly price: number
  readonly discount: number
  readonly offerList: readonly string[]
  readonly ctaLabel: string
  readonly ctaUrl: string
  readonly timerEnabled: boolean
  readonly timerExpiry?: string
}

/** Feature Release — product update with media upload and tag. */
export type FeatureReleaseWidget = PopupWidgetBase & {
  readonly category: 'feature-release'
  readonly title: string
  readonly body: string
  readonly mediaUrl?: string
  readonly mediaType?: 'image' | 'video'
  readonly tag: string
}

export type AdminPopupWidget = PopupWidget | OfferWidget | FeatureReleaseWidget
