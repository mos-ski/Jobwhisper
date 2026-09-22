import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

import { JobwhisperMark } from '@/ui'
import { ThemeSwitch } from '@/ui/theme-switch'
import { helpCollections } from '@/data/help-center'

export type HelpCenterLayoutProps = {
  readonly children: ReactNode
}

/**
 * Three panes that scroll independently: a grouped index on the left, the article in the
 * middle, and its table of contents on the right. The bar stays put above all three, so
 * only the column you are reading moves.
 */
export function HelpCenterLayout({ children }: HelpCenterLayoutProps) {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div data-slot="help-center-layout" className="flex h-screen flex-col bg-canvas text-ink">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 sm:px-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Open help navigation"
            className="-ms-1 grid size-9 place-items-center rounded-soft text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus lg:hidden"
          >
            <Menu aria-hidden="true" className="size-5" />
          </button>
          <Link
            to="/help"
            className="flex items-center gap-2 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <JobwhisperMark className="h-6" />
            <span className="text-sm font-semibold tracking-tight">Help</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/v3" className="text-sm text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            Open App
          </Link>
          <ThemeSwitch />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <HelpIndex open={navOpen} onNavigate={() => setNavOpen(false)} />
        {/* The only scroller on the page, so the index and the contents list stay put. */}
        <main className="h-full min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

/** The grouped article index. A drawer below lg, a fixed column above it. */
function HelpIndex({ open, onNavigate }: { readonly open: boolean; readonly onNavigate: () => void }) {
  const { pathname } = useLocation()
  const columnRef = useRef<HTMLElement>(null)

  // Seven groups do not fit the column, so an article deep in the list would open with its
  // own entry scrolled out of sight. Bring it into view without moving the article itself.
  useEffect(() => {
    const column = columnRef.current
    const current = column?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!column || !current) return
    const top = current.offsetTop - column.clientHeight / 2 + current.offsetHeight / 2
    column.scrollTop = Math.max(0, top)
  }, [pathname])

  const list = (
    <nav aria-label="Help topics" className="flex flex-col gap-7 px-4 py-7">
      {helpCollections.map((collection) => (
        <div key={collection.slug}>
          <p className="px-3 text-sm font-semibold text-ink">{collection.title}</p>
          <ul className="mt-1.5 flex flex-col">
            {collection.articles.map((article) => {
              const href = `/help/${collection.slug}/${article.slug}`
              const current = pathname === href
              return (
                <li key={article.slug}>
                  <Link
                    to={href}
                    onClick={onNavigate}
                    aria-current={current ? 'page' : undefined}
                    className={`block rounded-soft px-3 py-1.5 text-sm transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                      current ? 'bg-surface-subtle font-medium text-ink' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {article.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )

  return (
    <>
      <aside ref={columnRef} className="hidden h-full w-[300px] shrink-0 overflow-y-auto border-e border-border lg:block">{list}</aside>
      {open ? (
        <div className="fixed inset-0 z-modal lg:hidden">
          <button type="button" aria-label="Close help navigation" onClick={onNavigate} className="absolute inset-0 bg-ink/40" />
          <aside className="absolute inset-y-0 start-0 w-[300px] max-w-[85vw] overflow-y-auto bg-canvas shadow-panel">
            <div className="flex h-14 items-center justify-end px-3">
              <button
                type="button"
                onClick={onNavigate}
                aria-label="Close help navigation"
                className="grid size-9 place-items-center rounded-soft text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            {list}
          </aside>
        </div>
      ) : null}
    </>
  )
}
