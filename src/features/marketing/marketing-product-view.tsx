import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

import type { MarketingProduct, MarketingProductSection } from '@/contracts/marketing-product.draft'
import { MarketingFooter, MarketingNav } from './marketing-chrome'
import './marketing-product-view.css'

export type MarketingProductViewProps = {
  readonly product: MarketingProduct
  readonly walkthroughImages: readonly string[]
  readonly activeSectionId: string
  readonly onSectionVisible: (sectionId: string) => void
  readonly onPrimaryAction: () => void
  readonly onDownload: () => void
}

function walkthroughCopy(product: MarketingProduct, index: number): MarketingProductSection {
  const section = product.sections[index]
  if (section) return section
  // Every screenshot has a section of its own now; this only guards a mismatch between the
  // image list and the copy list.
  const workflow = product.workflow[index] ?? product.workflow[index % product.workflow.length]
  return {
    id: `${product.slug}-step-${index + 1}`,
    eyebrow: `Step ${index + 1}`,
    title: workflow?.title ?? product.outcome,
    body: workflow?.body ?? product.summary,
    steps: [],
    imageSrc: '',
    imageAlt: `${product.label} walkthrough step ${index + 1}`,
  }
}

function ProductFaq({ product }: { readonly product: MarketingProduct }) {
  return <section className="marketing-product-faq" aria-label={`${product.label} frequently asked questions`}>
    {product.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}
  </section>
}

function TwoLineTitle({ children }: { readonly children: string }) {
  const words = children.trim().split(/\s+/)
  if (words.length < 2) return <>{children}</>

  let bestBreak = 1
  let smallestDifference = Number.POSITIVE_INFINITY
  for (let index = 1; index < words.length; index += 1) {
    const firstLength = words.slice(0, index).join(' ').length
    const secondLength = words.slice(index).join(' ').length
    const difference = Math.abs(firstLength - secondLength)
    if (difference < smallestDifference) {
      bestBreak = index
      smallestDifference = difference
    }
  }

  return <><span>{words.slice(0, bestBreak).join(' ')}</span><span>{words.slice(bestBreak).join(' ')}</span></>
}

/**
 * The phone stage. The walkthrough copy scrolls in the story column below; the screenshot
 * for whichever step you are reading stays pinned at the top of the screen, so the picture
 * and the words describing it are on screen together. Hidden on the wide layout, where the
 * screenshots already sit beside their copy.
 */
function ProductStage({ walkthroughImages, activeIndex }: {
  readonly walkthroughImages: readonly string[]
  readonly activeIndex: number
}) {
  return <div className="marketing-product-stage" data-testid="product-stage" aria-hidden="true">
    <div className="marketing-product-stage-frame">
      {walkthroughImages.map((imageSrc, index) => <img
        key={imageSrc}
        src={imageSrc}
        alt=""
        loading={index === 0 ? 'eager' : 'lazy'}
        data-current={index === activeIndex}
        // A step behind the one on screen waits to its left, a step ahead to its right, so
        // reading down always slides the next in from the right and the last out to the
        // left — direction comes from the order, not from watching the scroll.
        data-side={index === activeIndex ? undefined : index < activeIndex ? 'before' : 'after'}
      />)}
    </div>
  </div>
}

export function MarketingProductView({ product, walkthroughImages, activeSectionId, onSectionVisible, onPrimaryAction, onDownload }: MarketingProductViewProps) {
  const storyRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLElement>(null)
  const sectionIdParts = activeSectionId.split('-')
  const activeIndex = Math.max(0, Number.parseInt(sectionIdParts[sectionIdParts.length - 1] ?? '1', 10) - 1)
  const activeCopy = walkthroughCopy(product, activeIndex)
  const isHero = activeIndex === 0
  // The first step keeps the page's own headline, because that is the page's H1 and what a
  // search result shows. Its body still describes the screenshot on screen, so the words
  // and the picture agree from the first frame.
  const activeBody = activeCopy.body

  useEffect(() => {
    const story = storyRef.current
    const summary = summaryRef.current
    if (!story || !summary) return

    // Two ways to know which step you are on, because the two layouts scroll differently.
    // Wide: the sections scroll past a pinned column, so whichever is on screen wins.
    // Phone: the pinned block covers the screen, so nothing is "visible" to observe — the
    // step comes from how far you have scrolled through the story instead.
    let observer: IntersectionObserver | null = null
    let animationFrame = 0

    const stepFromScroll = () => {
      animationFrame = 0
      const sections = story.querySelectorAll<HTMLElement>('[data-product-section]')
      if (sections.length === 0) return
      const { top, height } = story.getBoundingClientRect()
      const travelled = summary.getBoundingClientRect().bottom - top
      const step = Math.min(sections.length - 1, Math.max(0, Math.floor((travelled / height) * sections.length)))
      const id = sections[step]?.id
      if (id) onSectionVisible(id)
    }
    const scheduleStep = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(stepFromScroll)
    }

    // The stylesheet decides which layout is running; asking it avoids a second copy of
    // the breakpoint here that could drift from the one that matters.
    const pinned = window.getComputedStyle(summary).position === 'sticky'
      && window.matchMedia('(max-width: 900px)').matches

    if (pinned) {
      stepFromScroll()
      window.addEventListener('scroll', scheduleStep, { passive: true })
      window.addEventListener('resize', scheduleStep)
    } else if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) onSectionVisible(visible.target.id)
      }, { rootMargin: '-10% 0px -50% 0px', threshold: [0.1, 0.35, 0.65] })
      story.querySelectorAll<HTMLElement>('[data-product-section]').forEach((section) => observer?.observe(section))
    }

    return () => {
      observer?.disconnect()
      window.removeEventListener('scroll', scheduleStep)
      window.removeEventListener('resize', scheduleStep)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [onSectionVisible, product.slug])

  return <main className="marketing-product-page">
    <div className="marketing-product-nav"><MarketingNav /></div>
    <div className="marketing-product-layout">
      <aside className="marketing-product-summary" aria-label={`${product.label} overview`} ref={summaryRef}>
        <ProductStage walkthroughImages={walkthroughImages} activeIndex={activeIndex} />
        <div className="marketing-product-intro">
          <div className="marketing-product-copy" key={activeSectionId}>
            <p className="marketing-product-label">{product.label}</p>
            <h1 aria-label={isHero ? product.headline : activeCopy.title}><TwoLineTitle>{isHero ? product.headline : activeCopy.title}</TwoLineTitle></h1>
            <p>{activeBody}</p>
          </div>
          <button className="marketing-product-cta" type="button" onClick={onPrimaryAction}>{product.ctaLabel}<ArrowUpRight aria-hidden="true" /></button>
        </div>
        <a className="marketing-product-scroll-cue" href={`#${product.slug}-walkthrough-1`}>See how it works<ArrowDown aria-hidden="true" /></a>
      </aside>

      <div className="marketing-product-story" ref={storyRef}>
        {walkthroughImages.map((imageSrc, index) => {
          const copy = walkthroughCopy(product, index)
          const sectionId = `${product.slug}-walkthrough-${index + 1}`
          return <section className="marketing-product-section" id={sectionId} key={imageSrc} data-product-section="" data-active={activeSectionId === sectionId}>
            <div className="marketing-product-section-copy" data-testid="product-walkthrough-copy">
              <span>{copy.eyebrow}</span>
              <h2>{copy.title}</h2>
              <p>{copy.body}</p>
            </div>
            <figure><img src={imageSrc} alt={`${product.label} walkthrough step ${index + 1}: ${copy.title}`} loading={index === 0 ? 'eager' : 'lazy'} /></figure>
          </section>
        })}
      </div>
    </div>
    <ProductFaq product={product} />
    <MarketingFooter />
    <aside className="landing-social-proof" aria-label="Join Jobwhisper">
      <div className="landing-social-proof-avatars" aria-hidden="true"><img src="/figma-landing/social-proof-1.jpg" alt="" /><img src="/figma-landing/social-proof-2.jpg" alt="" /><img src="/figma-landing/social-proof-3.jpg" alt="" /></div>
      <p><span className="landing-social-proof-copy-desktop">Join 57,000+ job seekers landing better roles</span><span className="landing-social-proof-copy-mobile">57,000+ job seekers</span></p>
      <button type="button" onClick={onDownload}><span>Download</span><span className="landing-social-proof-platforms" aria-hidden="true"><img src="/landing-apple.svg" alt="" /><img src="/landing-windows.svg" alt="" /></span></button>
    </aside>
  </main>
}
