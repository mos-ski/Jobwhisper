import { Link } from 'react-router-dom'
import {
  Rocket,
  FileText,
  MessageSquare,
  Headphones,
  Zap,
  CreditCard,
  LifeBuoy,
  Search,
} from 'lucide-react'
import { Card } from '@/ui/card'
import { SearchInput } from '@/ui/search-input'
import { helpCollections } from '@/data/help-center'
import { useHelpSearch } from './use-help-search'
import type { HelpCollection } from '@/data/help-center'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  FileText,
  MessageSquare,
  Headphones,
  Zap,
  CreditCard,
  LifeBuoy,
}

function CollectionCard({ collection }: { readonly collection: HelpCollection }) {
  const Icon = iconMap[collection.icon] ?? Rocket
  return (
    <Link
      to={`/help/${collection.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      <Card className="flex h-full flex-col gap-3 p-5 transition-shadow duration-normal hover:shadow-lg">
        <div className="flex size-10 items-center justify-center rounded-panel bg-accent-subtle text-accent-text">
          <Icon className="size-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-ink group-hover:text-accent-text transition-colors duration-fast">
            {collection.title}
          </h3>
          <p className="mt-1 text-sm text-ink-muted leading-relaxed">{collection.description}</p>
        </div>
        <span className="mt-auto text-xs text-ink-muted">
          {collection.articles.length} article{collection.articles.length !== 1 ? 's' : ''}
        </span>
      </Card>
    </Link>
  )
}

export function HelpCenterHome() {
  const { query, setQuery, results, clear } = useHelpSearch()

  return (
    <div data-slot="help-center-home">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          How can we help?
        </h1>
        <p className="mt-3 text-ink-muted">
          Search our help center or browse by topic.
        </p>
        <div className="mx-auto mt-6 max-w-lg">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={clear}
            placeholder="Search articles..."
            aria-label="Search help center"
          />
        </div>
      </div>

      {results.length > 0 ? (
        <div data-slot="help-search-results">
          <h2 className="mb-4 text-sm font-semibold text-ink-muted uppercase tracking-wide">
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </h2>
          <div className="flex flex-col gap-2">
            {results.map(({ article, collection }) => (
              <Link
                key={article.slug}
                to={`/help/${collection.slug}/${article.slug}`}
                className="group flex items-start gap-3 rounded-panel border border-border bg-surface p-4 transition-colors duration-fast hover:border-accent-subtle hover:bg-accent-subtle/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <Search className="mt-0.5 size-4 shrink-0 text-ink-muted group-hover:text-accent-text" />
                <div>
                  <div className="text-sm font-medium text-ink group-hover:text-accent-text transition-colors duration-fast">
                    {article.title}
                  </div>
                  <div className="mt-0.5 text-xs text-ink-muted">{collection.title}</div>
                  <div className="mt-1 text-sm text-ink-muted leading-relaxed">
                    {article.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : query.trim().length >= 2 ? (
        <div className="py-12 text-center">
          <Search className="mx-auto mb-3 size-8 text-ink-muted" />
          <p className="text-ink-muted">No articles found for &ldquo;{query}&rdquo;</p>
          <p className="mt-1 text-sm text-ink-muted">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {helpCollections.map((collection) => (
            <CollectionCard key={collection.slug} collection={collection} />
          ))}
        </div>
      )}
    </div>
  )
}
