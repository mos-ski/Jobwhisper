import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, List } from 'lucide-react'

import { helpCollections } from '@/data/help-center'
import type { HelpContentBlock } from '@/data/help-center'

export type HelpArticlePageProps = {
  readonly collectionSlug: string
  readonly articleSlug: string
}

/** Slug for a heading, so the contents list and the heading agree on one id. */
function headingId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function ContentBlock({ block }: { readonly block: HelpContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="mt-4 text-[17px] leading-[1.75] text-ink-muted">{block.text}</p>
    case 'heading':
      return block.level === 2 ? (
        <h2 id={headingId(block.text)} className="mt-12 scroll-mt-8 border-t border-border pt-12 font-gowun text-[26px] font-bold leading-tight text-ink">
          {block.text}
        </h2>
      ) : (
        <h3 id={headingId(block.text)} className="mt-9 scroll-mt-8 font-gowun text-[19px] font-bold leading-snug text-ink">
          {block.text}
        </h3>
      )
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul'
      return (
        <Tag className={`mt-4 ms-5 flex flex-col gap-2.5 text-[17px] leading-[1.75] text-ink-muted ${block.ordered ? 'list-decimal' : 'list-disc'}`}>
          {block.items.map((item) => <li key={item} className="ps-1.5">{item}</li>)}
        </Tag>
      )
    }
    case 'callout':
      // The reference's flat left-ruled panel rather than a boxed alert: it reads as an
      // emphasised paragraph, which is what these are.
      return (
        <div className="mt-5 rounded-e-[10px] border-s-[3px] border-accent/40 bg-accent-subtle px-[18px] py-4 text-[17px] leading-[1.7] text-ink">
          {block.text}
        </div>
      )
    case 'code':
      return (
        <pre className="mt-5 overflow-x-auto rounded-panel bg-surface-subtle p-4 text-sm leading-relaxed text-ink">
          <code>{block.text}</code>
        </pre>
      )
    case 'link':
      return (
        <p className="mt-4">
          <a href={block.href} className="text-[17px] text-accent-text underline underline-offset-2 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            {block.text}
          </a>
        </p>
      )
  }
}

/** Marks the heading nearest the top of the reader's view, so the list tracks the article. */
function useActiveHeading(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)

  useEffect(() => {
    setActive(ids[0] ?? null)
    if (ids.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const onScreen = entries.filter((entry) => entry.isIntersecting)
        if (onScreen.length === 0) return
        const first = onScreen.reduce((a, b) => (a.boundingClientRect.top <= b.boundingClientRect.top ? a : b))
        setActive(first.target.id)
      },
      { rootMargin: '0px 0px -70% 0px' },
    )
    ids.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [ids])

  return active
}

export function HelpArticlePage({ collectionSlug, articleSlug }: HelpArticlePageProps) {
  const collection = helpCollections.find((item) => item.slug === collectionSlug)
  const article = collection?.articles.find((item) => item.slug === articleSlug)

  const outline = useMemo(
    () =>
      (article?.content ?? [])
        .filter((block): block is Extract<HelpContentBlock, { type: 'heading' }> => block.type === 'heading')
        .map((block) => ({ id: headingId(block.text), text: block.text, level: block.level })),
    [article],
  )
  const outlineIds = useMemo(() => outline.map((entry) => entry.id), [outline])
  const activeHeading = useActiveHeading(outlineIds)

  if (!collection || !article) {
    return (
      <div className="px-6 py-16 text-center">
        <h1 className="font-gowun text-2xl font-bold text-ink">Article not found</h1>
        <p className="mt-2 text-ink-muted">This help article does not exist.</p>
        <Link to="/help" className="mt-4 inline-block text-sm font-medium text-accent-text hover:text-accent-hover">
          Back to Help
        </Link>
      </div>
    )
  }

  const collectionIndex = helpCollections.indexOf(collection)
  const previousCollectionArticles = collectionIndex > 0 ? helpCollections[collectionIndex - 1].articles : []
  const articleIndex = collection.articles.indexOf(article)
  const previous =
    articleIndex > 0
      ? { article: collection.articles[articleIndex - 1], slug: collection.slug }
      : collectionIndex > 0
        ? { article: previousCollectionArticles[previousCollectionArticles.length - 1], slug: helpCollections[collectionIndex - 1].slug }
        : null
  const next =
    articleIndex < collection.articles.length - 1
      ? { article: collection.articles[articleIndex + 1], slug: collection.slug }
      : collectionIndex < helpCollections.length - 1
        ? { article: helpCollections[collectionIndex + 1].articles[0], slug: helpCollections[collectionIndex + 1].slug }
        : null

  return (
    <div className="flex items-start justify-center">
      <article className="min-w-0 max-w-[711px] flex-1 px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <p className="text-sm text-ink-muted">{collection.title}</p>
        <h1 className="mt-2 font-gowun text-[32px] font-bold leading-tight text-ink sm:text-[38px]">{article.title}</h1>
        <p className="mt-3 text-[17px] leading-[1.65] text-ink-muted">{article.description}</p>

        {article.content.map((block, index) => <ContentBlock key={index} block={block} />)}

        <nav aria-label="More help articles" className="mt-14 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between">
          {previous?.article ? (
            <Link to={`/help/${previous.slug}/${previous.article.slug}`} className="group inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <ChevronLeft aria-hidden="true" className="size-4" />
              {previous.article.title}
            </Link>
          ) : <span />}
          {next?.article ? (
            <Link to={`/help/${next.slug}/${next.article.slug}`} className="group inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:ms-auto">
              {next.article.title}
              <ChevronRight aria-hidden="true" className="size-4" />
            </Link>
          ) : null}
        </nav>

        <footer className="mt-10 flex items-center justify-between border-t border-border pt-6 text-xs text-ink-muted">
          <span>&copy; {new Date().getFullYear()} Jobwhisper</span>
          <a href="mailto:support@jobwhisper.org" className="hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            Contact support
          </a>
        </footer>
      </article>

      {outline.length > 0 ? (
        <aside aria-label="On this page" className="sticky top-0 hidden h-fit w-[248px] shrink-0 py-14 pe-6 xl:block">
          <p className="flex items-center gap-2 text-sm font-medium text-ink">
            <List aria-hidden="true" className="size-4" />
            On This Page
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {outline.map((entry) => (
              <li key={entry.id} className={entry.level === 3 ? 'ps-4' : undefined}>
                <a
                  href={`#${entry.id}`}
                  aria-current={activeHeading === entry.id ? 'true' : undefined}
                  className={`block text-sm leading-snug transition-colors duration-fast hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                    activeHeading === entry.id ? 'font-medium text-accent-text' : 'text-ink-muted'
                  }`}
                >
                  {entry.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </div>
  )
}
