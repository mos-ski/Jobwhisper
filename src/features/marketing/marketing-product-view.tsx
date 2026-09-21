import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight, ChevronDown } from 'lucide-react'

import type { MarketingProduct } from '@/contracts/marketing-product.draft'
import { Menu, MenuContent, MenuItem, MenuTrigger } from '@/ui'
import './marketing-product-view.css'

export type MarketingProductViewProps = {
  readonly product: MarketingProduct
  readonly activeSectionId: string
  readonly onSectionVisible: (sectionId: string) => void
  readonly onPrimaryAction: () => void
  readonly onHome: () => void
}

export function MarketingProductView({ product, activeSectionId, onSectionVisible, onPrimaryAction, onHome }: MarketingProductViewProps) {
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
      <ProductHeader onHome={onHome} />
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
      <ProductFooter />
    </main>
  )
}

function ProductHeader({ onHome }: { readonly onHome: () => void }) {
  return <nav className="marketing-product-header" aria-label="Main navigation">
    <a href="/" onClick={(event) => { event.preventDefault(); onHome() }} aria-label="Jobwhisper home"><img src="/landing-logo.svg" alt="" /></a>
    <div className="marketing-product-header-links">
      <a href="/#features">Features <ChevronDown aria-hidden="true" /></a><a href="/pricing">Pricing</a><a href="/#faq">FAQ</a>
      <Menu><MenuTrigger render={<button className="marketing-product-header-download" aria-label="Download" />}><span>Download</span><ChevronDown aria-hidden="true" /></MenuTrigger><MenuContent align="end" sideOffset={8} className="marketing-product-download-menu"><MenuItem render={<a href="/v3/downloads" />}>Download for Mac</MenuItem><MenuItem render={<a href="/v3/downloads" />}>Download for Windows</MenuItem></MenuContent></Menu>
      <a className="marketing-product-header-login" href="/v3/auth/sign-in">Log in</a>
    </div>
  </nav>
}

const PRODUCT_LINKS = [['AI Resume Builder', '/products/resume-builder'], ['Interview Copilot', '/products/interview-copilot'], ['Interview Prep', '/products/interview-prep'], ['Auto Apply', '/products/auto-apply']] as const
const DOWNLOAD_LINKS = [['Download Extension', '/v3/downloads'], ['Download for Mac', '/v3/downloads'], ['Download for Windows', '/v3/downloads'], ['Download for Linux', '/v3/downloads']] as const
const COMPANY_LINKS = [['Contact', '/#contact'], ['Help center', '/#help'], ['LinkedIn', '#'], ['Twitter', '#'], ['TikTok', '#'], ['Instagram', '#']] as const

function ProductFooter() {
  const links = (items: readonly (readonly [string, string])[]) => items.map(([label, href]) => <a href={href} key={label}>{label}</a>)
  return <footer className="marketing-product-footer">
    <div className="marketing-product-footer-brand"><img src="/figma-landing/footer-logo.svg" alt="Jobwhisper" /><p>From job search to job offer, with the right support at every step.</p></div>
    <nav className="marketing-product-footer-links" aria-label="Footer navigation"><div>{links(PRODUCT_LINKS)}</div><div>{links(DOWNLOAD_LINKS)}</div><div>{links(COMPANY_LINKS)}</div></nav>
    <div className="marketing-product-footer-meta"><span>© Jobwhisper 2026</span><div><a href="/privacy">Privacy Policy</a><a href="/terms">Terms</a></div></div>
  </footer>
}

function ProductFaq({ product }: { readonly product: MarketingProduct }) {
  return <section className="marketing-product-faq" aria-label={`${product.label} frequently asked questions`}>
    {product.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}
  </section>
}
