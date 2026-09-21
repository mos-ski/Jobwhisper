import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

import type { MarketingProduct } from '@/contracts/marketing-product.draft'
import { MarketingFooter, MarketingNav } from './marketing-chrome'
import './marketing-product-view.css'

export type MarketingProductViewProps = {
  readonly product: MarketingProduct
  readonly activeSectionId: string
  readonly onSectionVisible: (sectionId: string) => void
  readonly onPrimaryAction: () => void
}

export function MarketingProductView({ product, activeSectionId, onSectionVisible, onPrimaryAction }: MarketingProductViewProps) {
  const storyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const story = storyRef.current
    if (!story || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) onSectionVisible(visible.target.id)
    }, { rootMargin: '-10% 0px -54% 0px', threshold: [0.1, 0.35, 0.65] })
    story.querySelectorAll<HTMLElement>('[data-product-section]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [onSectionVisible, product.slug])

  return (
    <main className="marketing-product-page">
      <MarketingNav />
      <div className="marketing-product-layout">
        <aside className="marketing-product-summary" aria-label={`${product.label} overview`}>
          <div className="marketing-product-intro">
            <div className="marketing-product-summary-copy">
              <h1>{product.headline}</h1>
              <p>{product.summary}</p>
              {product.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <section className="marketing-product-explanation" aria-labelledby={`${product.slug}-how-it-works`}>
                <h2 id={`${product.slug}-how-it-works`}>How it works</h2>
                {product.workflow.map((step) => <p key={step.title}><strong>{step.title}.</strong> {step.body}</p>)}
              </section>
              <p className="marketing-product-outcome"><strong>The outcome.</strong> {product.outcome}</p>
            </div>
            <div className="marketing-product-actions">
              <a className="marketing-product-download" href="/#download">
                <span>Download Now</span>
                <span className="marketing-product-platforms" aria-hidden="true"><img src="/landing-apple.svg" alt="" /><img src="/landing-windows.svg" alt="" /></span>
              </a>
              <button className="marketing-product-cta" type="button" onClick={onPrimaryAction}>Get Started<ArrowUpRight aria-hidden="true" /></button>
            </div>
          </div>
          <ProductFaq product={product} />
          <a className="marketing-product-scroll-cue" href={`#${product.sections[0]?.id}`}>See how it works<ArrowDown aria-hidden="true" /></a>
        </aside>
        <div className="marketing-product-story" ref={storyRef}>
          {product.sections.map((section) => (
            <section className="marketing-product-section" id={section.id} key={section.id} data-product-section="" data-active={activeSectionId === section.id}>
              <div className="marketing-product-section-copy"><h2>{section.title}</h2><p>{section.body}</p></div>
              <figure><img src={section.imageSrc} alt={section.imageAlt} /></figure>
            </section>
          ))}
        </div>
      </div>
      <MarketingFooter />
    </main>
  )
}

function ProductFaq({ product }: { readonly product: MarketingProduct }) {
  return <section className="marketing-product-faq" aria-label={`${product.label} frequently asked questions`}>
    {product.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}
  </section>
}
