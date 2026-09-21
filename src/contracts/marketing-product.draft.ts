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

export type MarketingProductWorkflowStep = {
  readonly title: string
  readonly body: string
}

export type MarketingProductFaq = {
  readonly question: string
  readonly answer: string
}

export type MarketingProduct = {
  readonly slug: MarketingProductSlug
  readonly label: string
  readonly headline: string
  readonly summary: string
  readonly overview: readonly string[]
  readonly workflow: readonly MarketingProductWorkflowStep[]
  readonly outcome: string
  readonly faqs: readonly MarketingProductFaq[]
  readonly ctaLabel: string
  readonly ctaHref: string
  readonly sections: readonly MarketingProductSection[]
}
