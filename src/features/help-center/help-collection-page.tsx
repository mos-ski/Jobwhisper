import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Breadcrumbs } from '@/ui/breadcrumbs'
import { helpCollections } from '@/data/help-center'

export type HelpCollectionPageProps = {
  readonly collectionSlug: string
}

export function HelpCollectionPage({ collectionSlug }: HelpCollectionPageProps) {
  const collection = helpCollections.find((c) => c.slug === collectionSlug)

  if (!collection) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-ink">Collection not found</h1>
        <p className="mt-2 text-ink-muted">This help category does not exist.</p>
        <Link to="/help" className="mt-4 inline-block text-sm font-medium text-accent-text hover:text-accent-hover">
          Back to Help Center
        </Link>
      </div>
    )
  }

  return (
    <div data-slot="help-collection-page">
      <Breadcrumbs
        items={[
          { label: 'Help', href: '/help' },
          { label: collection.title, current: true },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {collection.title}
        </h1>
        <p className="mt-2 text-ink-muted">{collection.description}</p>
      </div>

      <div className="flex flex-col gap-2">
        {collection.articles.map((article) => (
          <Link
            key={article.slug}
            to={`/help/${collection.slug}/${article.slug}`}
            className="group flex items-center justify-between rounded-panel border border-border bg-surface p-4 transition-colors duration-fast hover:border-accent-subtle hover:bg-accent-subtle/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <div>
              <div className="text-sm font-medium text-ink group-hover:text-accent-text transition-colors duration-fast">
                {article.title}
              </div>
              <div className="mt-1 text-sm text-ink-muted">{article.description}</div>
            </div>
            <ChevronRight className="size-4 shrink-0 text-ink-muted group-hover:text-accent-text transition-colors duration-fast" />
          </Link>
        ))}
      </div>
    </div>
  )
}
