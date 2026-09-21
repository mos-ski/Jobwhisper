import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check } from 'lucide-react'

import './plan-card.css'

/** One row of the card's ruled-off table, as [label, value]. */
export type PlanTerms = readonly (readonly [string, string])[]

export type PlanCardProps = {
  readonly name: string
  /** Pill beside the plan name. The featured card wears its badge as a banner instead. */
  readonly badge?: string
  /** Banner across the top of the card; also what marks it as the featured one. */
  readonly banner?: string
  readonly tagline?: string
  /** The large figure. A node rather than a string so callers can animate it. */
  readonly amount: ReactNode
  /** What follows the figure — "/month", "one time", "per AI prompt". */
  readonly unit?: string
  readonly terms?: PlanTerms
  readonly features: readonly string[]
  readonly ctaLabel: string
  readonly onCta?: () => void
  readonly ctaDisabled?: boolean
  /** 'ghost' steps the CTA back so a sibling card's primary is the obvious one. */
  readonly ctaVariant?: 'primary' | 'ghost'
  /** Italic line under the features, e.g. who a plan suits. */
  readonly note?: string
  /** Selects the card's wash, and marks it as one of a set where one card is featured. */
  readonly plan?: string
  readonly onMouseEnter?: () => void
}

/**
 * The pricing card from Figma 1130:20394 — a 16px-radius panel with a colour wash rising
 * from its foot, a ruled-off terms table and a feature list. Shared so the marketing
 * pricing page and the in-app plan picker are one component rather than two that drift.
 */
export function PlanCard({
  name, badge, banner, tagline, amount, unit, terms, features, ctaLabel, onCta, ctaDisabled, ctaVariant, note, plan, onMouseEnter,
}: PlanCardProps) {
  return (
    <article className="pricing-plan" data-featured={banner ? 'true' : undefined} data-plan={plan} onMouseEnter={onMouseEnter}>
      {banner ? <p className="pricing-plan-banner">{banner}</p> : null}
      <div className="pricing-plan-body">
        <div className="pricing-plan-head">
          <h3>{name}</h3>
          {badge ? <span className="pricing-plan-badge">{badge}</span> : null}
        </div>
        {tagline ? <p className="pricing-plan-tagline">{tagline}</p> : null}
        <p className="pricing-plan-price">{amount}{unit ? <span className="pricing-plan-cadence">{unit}</span> : null}</p>
        <button type="button" className="pricing-plan-cta" data-variant={ctaVariant} onClick={onCta} disabled={ctaDisabled}>{ctaLabel}</button>
        {terms?.length ? (
          <dl className="pricing-plan-credits">
            {terms.map(([label, value], index) => (
              <div key={label} className={index === terms.length - 1 ? 'pricing-plan-credits-total' : undefined}>
                <dt>{label}</dt><dd>{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <ul className="pricing-plan-features">
          {features.map((feature) => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}
        </ul>
        {note ? <p className="pricing-plan-note">{note}</p> : null}
      </div>
    </article>
  )
}

/**
 * The card row. On phones it is a snap carousel, opening on the featured card if there is
 * one, with dashes underneath — a snap scroller draws no scrollbar, so nothing else says
 * the row continues. On wider screens it is the grid and the dashes are hidden.
 */
export function PlanCarousel({ count, children }: { readonly count: number; readonly children: ReactNode }) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [activeCard, setActiveCard] = useState(0)

  // scrollLeft rather than scrollIntoView: the latter would drag the whole page down to
  // the carousel on load.
  useEffect(() => {
    const grid = gridRef.current
    const featured = grid?.querySelector<HTMLElement>('[data-featured]')
    if (!grid || !featured) return
    setActiveCard([...grid.children].indexOf(featured))
    grid.scrollLeft += featured.getBoundingClientRect().left - grid.getBoundingClientRect().left
      - (grid.clientWidth - featured.clientWidth) / 2
  }, [])

  const handleScroll = () => {
    const grid = gridRef.current
    if (!grid) return
    const middle = grid.scrollLeft + grid.clientWidth / 2
    const cards = [...grid.children] as HTMLElement[]
    const distance = (card: HTMLElement) => Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle)
    let nearest = 0
    cards.forEach((card, index) => { if (distance(card) < distance(cards[nearest])) nearest = index })
    setActiveCard(nearest)
  }

  return (
    <>
      <div className="pricing-plan-grid" data-cards={count} ref={gridRef} onScroll={handleScroll}>{children}</div>
      <div className="pricing-plan-dots" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => <span key={index} data-active={index === activeCard ? 'true' : undefined} />)}
      </div>
    </>
  )
}

/** The card's large figure, in the brand serif at the design's 32px. */
export function PlanAmount({ children }: { readonly children: ReactNode }) {
  return <span className="font-gowun text-[32px] font-bold leading-none text-ink">{children}</span>
}
