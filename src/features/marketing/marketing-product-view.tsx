import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

import type { MarketingProduct } from '@/contracts/marketing-product.draft'
import { MarketingFooter, MarketingNav } from './marketing-chrome'
import './marketing-product-view.css'

type EmphasisKind = 'strong' | 'underline' | 'mark'

const PRODUCT_EMPHASIS: Readonly<Record<MarketingProduct['slug'], Readonly<Record<EmphasisKind, readonly string[]>>>> = {
  'resume-builder': {
    strong: ['existing experience', 'real experience', 'you remain in control', 'finished version'],
    underline: ['review every suggested change', 'accept the changes', 'reject the ones', 'save this tailored resume'],
    mark: ['job description', 'role you want', 'resume canvas', 'ATS review'],
  },
  'interview-copilot': {
    strong: ['your own voice', 'you remain responsible', 'stay present', 'better-supported version of you'],
    underline: ['test the microphone and system audio', 'read the suggestion as support', 'review the conversation'],
    mark: ['resume and the job description', 'live conversation', 'Copilot session', 'desktop experience'],
  },
  'interview-prep': {
    strong: ['answer out loud', 'the first run is diagnostic', 'specific feedback', 'visible improvement'],
    underline: ['practice them again', 'do not memorize an entire paragraph', 'create a practice setup for each one'],
    mark: ['job description', 'simulated interviewer', 'session report', 'real interview'],
  },
  'auto-apply': {
    strong: ['accurate information', 'you choose a job', 'use your judgment', 'you keep the decisions'],
    underline: ['review the proposed version', 'choose how much control you want', 'follow the activity in Your Jobs'],
    mark: ['job preferences', 'Auto Apply agents', 'application timeline', 'controlled submission'],
  },
}

function splitNarrative(narrative: string) {
  const sentences = narrative.trim().split(/(?<=[.!?])\s+(?=[A-Z])/)
  const paragraphs: string[] = []
  for (let index = 0; index < sentences.length; index += 4) paragraphs.push(sentences.slice(index, index + 4).join(' '))
  return paragraphs
}

function ProductNarrative({ product, revealedWords }: { readonly product: MarketingProduct; readonly revealedWords: number }) {
  const paragraphs = splitNarrative(product.narrative)
  const emphasis = PRODUCT_EMPHASIS[product.slug]
  let wordIndex = 0

  const renderText = (text: string, kind?: EmphasisKind) => {
    const words = text.trim().split(/\s+/)
    const content = words.map((word) => {
      const currentIndex = wordIndex
      wordIndex += 1
      return <span key={`${word}-${currentIndex}`} data-reveal-word data-revealed={currentIndex < revealedWords} aria-hidden="true">{word} </span>
    })
    if (kind === 'strong') return <strong key={`${kind}-${wordIndex}`}>{content}</strong>
    if (kind === 'underline') return <u key={`${kind}-${wordIndex}`}>{content}</u>
    if (kind === 'mark') return <mark key={`${kind}-${wordIndex}`}>{content}</mark>
    return <span key={`plain-${wordIndex}`}>{content}</span>
  }

  const renderParagraph = (paragraph: string) => {
    const matches = (Object.keys(emphasis) as EmphasisKind[]).flatMap((kind) => emphasis[kind].flatMap((phrase) => {
      const index = paragraph.toLocaleLowerCase().indexOf(phrase.toLocaleLowerCase())
      return index < 0 ? [] : [{ kind, index, end: index + phrase.length }]
    })).sort((a, b) => a.index - b.index)
    const parts: ReactNode[] = []
    let cursor = 0
    matches.forEach((match) => {
      if (match.index < cursor) return
      if (match.index > cursor) parts.push(renderText(paragraph.slice(cursor, match.index)))
      parts.push(renderText(paragraph.slice(match.index, match.end), match.kind))
      cursor = match.end
    })
    if (cursor < paragraph.length) parts.push(renderText(paragraph.slice(cursor)))
    return parts
  }

  return <div className="marketing-product-narrative" data-testid="product-narrative" aria-label={product.narrative}>
    {paragraphs.map((paragraph, index) => <p className="marketing-product-reveal" key={`${product.slug}-${index}`}>{renderParagraph(paragraph)}</p>)}
  </div>
}

/**
 * The phone walkthrough stage. The story column is a desktop device — screenshots
 * scrolling beside pinned text — and on a phone it collapsed into a pile of images at the
 * very bottom of the page, past the narrative, where nobody reading ever arrives. Here the
 * same screenshots pin to the top of the screen once the headline scrolls away and advance
 * with the reading position, so the step being described is the step on screen. The steps
 * lie side by side like a filmstrip: each one is parked left or right of the one on screen
 * according to where it falls in the order, so scrolling down always slides the strip one
 * way and scrolling up always the other, without the code having to watch which way the
 * page is moving.
 */
function ProductStage({ product, walkthroughImages, activeIndex }: {
  readonly product: MarketingProduct
  readonly walkthroughImages: readonly string[]
  readonly activeIndex: number
}) {
  const sectionFor = (index: number) => product.sections[Math.min(index, product.sections.length - 1)]
  const current = sectionFor(activeIndex)

  return <div className="marketing-product-stage" data-testid="product-stage">
    <div className="marketing-product-stage-frame">
      {walkthroughImages.map((imageSrc, index) => <img
        key={imageSrc}
        src={imageSrc}
        // Only the image on screen carries a description: the others are the same picture
        // waiting its turn, and announcing all of them would read as one long duplicate.
        alt={index === activeIndex ? `${product.label} step ${index + 1} of ${walkthroughImages.length}: ${sectionFor(index)?.title ?? product.outcome}` : ''}
        loading={index === 0 ? 'eager' : 'lazy'}
        data-current={index === activeIndex}
        data-side={index === activeIndex ? undefined : index < activeIndex ? 'before' : 'after'}
      />)}
    </div>
    {/* The caption carries the step's own eyebrow, title and body — the copy direction the
        walkthrough rewrite introduced — rather than a title alone, so the picture above is
        explained where it is being shown. */}
    <div className="marketing-product-stage-caption">
      <p className="marketing-product-stage-step">
        <span>Step {activeIndex + 1} of {walkthroughImages.length}</span>
        {current?.eyebrow ? <span>{current.eyebrow}</span> : null}
      </p>
      <h2>{current?.title ?? product.outcome}</h2>
      {current?.body ? <p className="marketing-product-stage-body">{current.body}</p> : null}
    </div>
  </div>
}

export type MarketingProductViewProps = {
  readonly product: MarketingProduct
  readonly walkthroughImages: readonly string[]
  readonly activeSectionId: string
  readonly onSectionVisible: (sectionId: string) => void
  readonly onPrimaryAction: () => void
  readonly onDownload: () => void
}

export function MarketingProductView({ product, walkthroughImages, activeSectionId, onSectionVisible, onPrimaryAction, onDownload }: MarketingProductViewProps) {
  const storyRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLElement>(null)
  const [revealedWords, setRevealedWords] = useState(0)
  const [readProgress, setReadProgress] = useState(0)
  const totalRevealWords = product.narrative.trim().split(/\s+/).length

  useEffect(() => {
    const story = storyRef.current
    if (!story || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) onSectionVisible(visible.target.id)
    }, { root: null, rootMargin: '-10% 0px -54% 0px', threshold: [0.1, 0.35, 0.65] })
    story.querySelectorAll<HTMLElement>('[data-product-section]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [onSectionVisible, product.slug])

  useEffect(() => {
    const story = storyRef.current
    const summary = summaryRef.current
    if (!story || !summary) return
    // Reduced motion hands the narrative over whole instead of revealing it word by word,
    // but the reading position still has to be measured: the phone stage uses it to decide
    // which screenshot belongs with the paragraph in front of the reader.
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    let animationFrame = 0
    const update = () => {
      animationFrame = 0
      // Which element is doing the scrolling depends on the layout, so ask the stylesheet
      // rather than re-testing its breakpoint here — duplicating that 901px in JS is what
      // let these two drift apart in the first place.
      const summaryStyle = window.getComputedStyle(summary)
      const clamp = (value: number) => Math.min(1, Math.max(0, value))
      let rawProgress: number

      if (summaryStyle.position === 'sticky') {
        // Two columns: the summary is pinned, so progress runs from the moment it lands at
        // its sticky offset to the moment the last walkthrough image clears the viewport.
        // The footer shares this column, so the measurement stops at the last section —
        // otherwise the text would still be revealing while you read the footer.
        const sections = story.querySelectorAll<HTMLElement>('[data-product-section]')
        const lastSection = sections[sections.length - 1]
        const storyTop = story.getBoundingClientRect().top
        const storyEnd = (lastSection ?? story).getBoundingClientRect().bottom
        const pinTop = Number.parseFloat(summaryStyle.top) || 0
        const extent = Math.max(1, storyEnd - storyTop - Math.max(1, window.innerHeight - pinTop))
        rawProgress = clamp((pinTop - storyTop) / extent)
      } else {
        // One column: the narrative sits above the images and is itself what travels past
        // the reader, so it is the summary's own trip through the viewport that counts.
        // Measuring the story here would leave the text frozen until you had already
        // scrolled past all of it.
        const { top, height } = summary.getBoundingClientRect()
        const revealStart = window.innerHeight * 0.72
        const revealEnd = -(height - window.innerHeight * 0.35)
        rawProgress = clamp((revealStart - top) / Math.max(1, revealStart - revealEnd))
      }
      const progress = 0.08 + rawProgress * 0.92
      setReadProgress(rawProgress)
      setRevealedWords(reducedMotion ? totalRevealWords : Math.ceil(progress * totalRevealWords))
      if (reducedMotion) return
      // The summary is taller than its pinned box, so its own text has to advance in step.
      // Safe inside a window-scroll handler: this scrolls the summary, not the window.
      const availableScroll = Math.max(0, summary.scrollHeight - summary.clientHeight)
      summary.scrollTop = availableScroll * rawProgress
    }
    const scheduleUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [product.slug, totalRevealWords])

  // Reading position rather than the story column's observer: the column is laid aside on
  // a phone, so nothing there intersects to report a step.
  const stageIndex = Math.min(
    Math.max(walkthroughImages.length - 1, 0),
    Math.floor(readProgress * walkthroughImages.length),
  )

  return (
    <main className="marketing-product-page">
      <div className="marketing-product-nav"><MarketingNav /></div>
      <div className="marketing-product-layout">
        <aside className="marketing-product-summary" aria-label={`${product.label} overview`} ref={summaryRef}>
          <div className="marketing-product-intro">
            <div className="marketing-product-summary-copy">
              <h1>{product.headline}</h1>
              <div className="marketing-product-actions">
                <button className="marketing-product-cta" type="button" onClick={onPrimaryAction}>{product.ctaLabel}<ArrowUpRight aria-hidden="true" /></button>
              </div>
              <div className="marketing-product-read">
                <ProductStage product={product} walkthroughImages={walkthroughImages} activeIndex={stageIndex} />
                <ProductNarrative product={product} revealedWords={revealedWords} />
              </div>
            </div>
          </div>
          <ProductFaq product={product} />
          <a className="marketing-product-scroll-cue" href={`#${product.slug}-walkthrough-1`}>See how it works<ArrowDown aria-hidden="true" /></a>
        </aside>
        <div className="marketing-product-story" ref={storyRef}>
          {walkthroughImages.map((imageSrc, index) => {
            const section = product.sections[Math.min(index, product.sections.length - 1)]
            const sectionId = `${product.slug}-walkthrough-${index + 1}`
            return (
            <section className="marketing-product-section" id={sectionId} key={imageSrc} data-product-section="" data-active={activeSectionId === sectionId}>
              <figure><img src={imageSrc} alt={`${product.label} walkthrough step ${index + 1}: ${section?.title ?? product.outcome}`} loading={index === 0 ? 'eager' : 'lazy'} /></figure>
            </section>
          )})}
        </div>
      </div>
      <MarketingFooter />
      <aside className="landing-social-proof" aria-label="Join Jobwhisper">
        <div className="landing-social-proof-avatars" aria-hidden="true"><img src="/figma-landing/social-proof-1.jpg" alt="" /><img src="/figma-landing/social-proof-2.jpg" alt="" /><img src="/figma-landing/social-proof-3.jpg" alt="" /></div>
        <p><span className="landing-social-proof-copy-desktop">Join 57,000+ job seekers landing better roles</span><span className="landing-social-proof-copy-mobile">57,000+ job seekers</span></p>
        <button type="button" onClick={onDownload}><span>Download</span><span className="landing-social-proof-platforms" aria-hidden="true"><img src="/landing-apple.svg" alt="" /><img src="/landing-windows.svg" alt="" /></span></button>
      </aside>
    </main>
  )
}

function ProductFaq({ product }: { readonly product: MarketingProduct }) {
  return <section className="marketing-product-faq" aria-label={`${product.label} frequently asked questions`}>
    {product.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}
  </section>
}
