export type MarketingProductSlug =
  | 'resume-builder'
  | 'interview-copilot'
  | 'interview-prep'
  | 'auto-apply'

export type MarketingProductSection = {
  readonly id: string
  readonly eyebrow: string
  readonly title: string
  readonly body: string
  readonly steps: readonly string[]
  readonly imageSrc: string
  readonly imageAlt: string
}

export type MarketingProduct = {
  readonly slug: MarketingProductSlug
  readonly label: string
  readonly headline: string
  readonly summary: string
  readonly ctaLabel: string
  readonly ctaHref: string
  readonly sections: readonly MarketingProductSection[]
}
