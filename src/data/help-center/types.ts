export type HelpArticle = {
  readonly slug: string
  readonly title: string
  readonly description: string
  readonly content: readonly HelpContentBlock[]
  readonly lastUpdated: string
}

export type HelpContentBlock =
  | { readonly type: 'paragraph'; readonly text: string }
  | { readonly type: 'heading'; readonly text: string; readonly level: 2 | 3 }
  | { readonly type: 'list'; readonly items: readonly string[]; readonly ordered?: boolean }
  | { readonly type: 'callout'; readonly variant: 'info' | 'warning' | 'tip'; readonly text: string }
  | { readonly type: 'code'; readonly language?: string; readonly text: string }
  | { readonly type: 'link'; readonly text: string; readonly href: string }

export type HelpCollection = {
  readonly slug: string
  readonly title: string
  readonly description: string
  readonly icon: string
  readonly articles: readonly HelpArticle[]
}
