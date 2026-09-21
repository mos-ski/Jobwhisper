import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight, Check } from 'lucide-react'

import type { MarketingProduct } from '@/contracts/marketing-product.draft'
import './marketing-product-view.css'

export type MarketingProductViewProps = {
  readonly product: MarketingProduct
  readonly activeSectionId: string
  readonly onSectionVisible: (sectionId: string) => void
  readonly onPrimaryAction: () => void
  readonly onHome: () => void
}

export function MarketingProductView({
  product,
  activeSectionId,
  onSectionVisible,
  onPrimaryAction,
  onHome,
}: MarketingProductViewProps) {
  const storyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const story = storyRef.current
    if (!story || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) onSectionVisible(visible.target.id)
      },
      { rootMargin: '-20% 0px -45% 0px', threshold: [0.15, 0.4, 0.7] },
    )

    story.querySelectorAll<HTMLElement>('[data-product-section]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [onSectionVisible, product.slug])

  return (
    <main className="marketing-product-page">
      <aside className="marketing-product-summary" aria-label={`${product.label} overview`}>
        <button className="marketing-product-home" type="button" onClick={onHome} aria-label="Go to Jobwhisper home">
          <img src="/landing-logo.svg" alt="" />
        </button>

        <div className="marketing-product-summary-copy">
          <p>{product.label}</p>
          <h1>{product.headline}</h1>
          <p>{product.summary}</p>
          <button className="marketing-product-cta" type="button" onClick={onPrimaryAction}>
            {product.ctaLabel}
            <ArrowUpRight aria-hidden="true" />
          </button>
        </div>

        <nav className="marketing-product-progress" aria-label={`${product.label} sections`}>
          {product.sections.map((section, index) => (
            <a
              href={`#${section.id}`}
              key={section.id}
              aria-label={section.title}
              aria-current={activeSectionId === section.id ? 'step' : undefined}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {section.title}
            </a>
          ))}
        </nav>

        <a className="marketing-product-scroll-cue" href={`#${product.sections[0]?.id}`}>
          Explore how it works
          <ArrowDown aria-hidden="true" />
        </a>
      </aside>

      <div className="marketing-product-story" ref={storyRef}>
        {product.sections.map((section, index) => (
          <section
            className="marketing-product-section"
            id={section.id}
            key={section.id}
            data-product-section=""
            data-active={activeSectionId === section.id}
          >
            <div className="marketing-product-section-copy">
              <p>{section.eyebrow}</p>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              <ul>
                {section.steps.map((step) => (
                  <li key={step}><Check aria-hidden="true" />{step}</li>
                ))}
              </ul>
            </div>
            <figure>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <img src={section.imageSrc} alt={section.imageAlt} />
            </figure>
          </section>
        ))}
      </div>
    </main>
  )
}
