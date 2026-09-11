import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Breadcrumbs } from '@/ui/breadcrumbs'
import { helpCollections } from '@/data/help-center'
import type { HelpContentBlock } from '@/data/help-center'

export type HelpArticlePageProps = {
  readonly collectionSlug: string
  readonly articleSlug: string
}

function ContentBlock({ block }: { readonly block: HelpContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="text-ink leading-relaxed">{block.text}</p>
    case 'heading':
      if (block.level === 2) {
        return <h2 className="mt-8 mb-3 text-lg font-semibold text-ink">{block.text}</h2>
      }
      return <h3 className="mt-6 mb-2 text-base font-semibold text-ink">{block.text}</h3>
    case 'list':
      const Tag = block.ordered ? 'ol' : 'ul'
      return (
        <Tag
          className={`ms-5 space-y-1.5 text-ink leading-relaxed ${block.ordered ? 'list-decimal' : 'list-disc'}`}
        >
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </Tag>
      )
    case 'callout': {
      const styles = {
        info: 'border-info/30 bg-info-surface text-info',
        warning: 'border-warning/30 bg-warning-surface text-warning',
        tip: 'border-positive/30 bg-positive-surface text-positive',
      }
      return (
        <div className={`mt-4 rounded-panel border p-4 text-sm leading-relaxed ${styles[block.variant]}`}>
          {block.text}
        </div>
      )
    }
    case 'code':
      return (
        <pre className="mt-4 overflow-x-auto rounded-panel bg-surface-subtle p-4 text-sm text-ink">
          <code>{block.text}</code>
        </pre>
      )
    case 'link':
      return (
        <a
          href={block.href}
          className="text-accent-text underline underline-offset-2 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          {block.text}
        </a>
      )
  }
}

export function HelpArticlePage({ collectionSlug, articleSlug }: HelpArticlePageProps) {
  const collection = helpCollections.find((c) => c.slug === collectionSlug)
  const article = collection?.articles.find((a) => a.slug === articleSlug)

  if (!collection || !article) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-ink">Article not found</h1>
        <p className="mt-2 text-ink-muted">This help article does not exist.</p>
        <Link to="/help" className="mt-4 inline-block text-sm font-medium text-accent-text hover:text-accent-hover">
          Back to Help Center
        </Link>
      </div>
    )
  }

  const collectionIndex = helpCollections.indexOf(collection)
  const articleIndex = collection.articles.indexOf(article)
  const prevArticle =
    articleIndex > 0
      ? collection.articles[articleIndex - 1]
      : collectionIndex > 0
        ? helpCollections[collectionIndex - 1].articles.at(-1)
        : null
  const nextArticle =
    articleIndex < collection.articles.length - 1
      ? collection.articles[articleIndex + 1]
      : collectionIndex < helpCollections.length - 1
        ? helpCollections[collectionIndex + 1].articles[0]
        : null

  return (
    <div data-slot="help-article-page">
      <Breadcrumbs
        items={[
          { label: 'Help', href: '/help' },
          { label: collection.title, href: `/help/${collection.slug}` },
          { label: article.title, current: true },
        ]}
        className="mb-6"
      />

      <article className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {article.title}
          </h1>
          <p className="mt-2 text-ink-muted">{article.description}</p>
          <p className="mt-2 text-xs text-ink-muted">Last updated: {article.lastUpdated}</p>
        </header>

        <div className="space-y-4">
          {article.content.map((block, i) => (
            <ContentBlock key={i} block={block} />
          ))}
        </div>

        <div className="mt-10 flex items-center gap-4 rounded-panel border border-border bg-surface p-4">
          <span className="text-sm text-ink-muted">Was this article helpful?</span>
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-ink-muted transition-colors duration-fast hover:border-positive/30 hover:bg-positive-surface hover:text-positive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <ThumbsUp className="size-3.5" />
              Yes
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-ink-muted transition-colors duration-fast hover:border-danger/30 hover:bg-danger-surface hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <ThumbsDown className="size-3.5" />
              No
            </button>
          </div>
        </div>

        <nav className="mt-8 flex items-center justify-between border-t border-border pt-6">
          {prevArticle ? (
            <Link
              to={`/help/${collectionIndex > 0 && articleIndex === 0 ? helpCollections[collectionIndex - 1].slug : collection.slug}/${prevArticle.slug}`}
              className="group flex items-center gap-2 text-sm text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <ChevronLeft className="size-4 group-hover:-translate-x-0.5 transition-transform duration-fast" />
              <span className="max-w-[200px] truncate">{prevArticle.title}</span>
            </Link>
          ) : (
            <div />
          )}
          {nextArticle ? (
            <Link
              to={`/help/${articleIndex === collection.articles.length - 1 && collectionIndex < helpCollections.length - 1 ? helpCollections[collectionIndex + 1].slug : collection.slug}/${nextArticle.slug}`}
              className="group flex items-center gap-2 text-sm text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <span className="max-w-[200px] truncate">{nextArticle.title}</span>
              <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform duration-fast" />
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </article>
    </div>
  )
}
