import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { ArrowRight, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Paperclip, Plus, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from '@/ui'
import { MarketingFooter, MarketingNav } from '@/features/marketing/marketing-chrome'
import './landing-page.css'

/** [title, full description, short description]. The short one runs on mobile, where the
 *  card opens in place of its own pill and a paragraph this long stops reading as a tab. */
const JOURNEY = [
  ['AI Resume Builder', 'Start with a resume built for the job you want. Tell us the role you are going after. Jobwhisper helps you build or tailor your resume around it, highlighting the experience and skills that matter most.', 'Start with a resume built for the job you want, tailored around the role you are going after.'],
  ['AI Job Application', 'Find roles that match your experience, compare fit at a glance, and move the applications you choose into one focused workflow.', 'Find roles that match your experience and move the ones you choose into one focused workflow.'],
  ['Interview Copilot', 'Bring real-time, resume-aware answers into the live conversation, privately and exactly when you need them.', 'Real-time, resume-aware answers in the live conversation, exactly when you need them.'],
  ['Interview Prep', 'Practice realistic questions with an AI interviewer before the real conversation begins.', 'Practice realistic questions with an AI interviewer before the real conversation begins.'],
  ['Meeting Copilot', 'Get real-time notes, talking points and summaries during meetings, so you stay focused on the conversation instead of scrambling to take notes.', 'Real-time notes, talking points and summaries, so you stay in the conversation.'],
  ['Coding Interview', 'Live AI assistance during coding interviews. Real-time hints as you work through the problem.', 'Live AI assistance during coding interviews, with hints as you work through the problem.'],
] as const

const FAQS = [
  ['Is Jobwhisper free to start?', 'Yes. You can create an account and start on free monthly credits, no card required. Paid plans begin at $47 a month.'],
  ['How does “land the job or don’t pay” work?', 'It is the interview guarantee that comes with a Done-For-You package. A success manager applies on your behalf until you have landed the number of interviews your package guarantees, and your Jobwhisper access continues until that guarantee is fulfilled rather than expiring on a fixed date. It is a one-time price, not a subscription. Subscription plans on their own do not carry the guarantee, and the exact terms for the package you pick are shown before you pay.'],
  ['What does it cost?', 'Plans start at $47 a month, which includes roughly 500 credits. Metered features run at $0.10 per credit, where one credit is a minute of Copilot time or a single prompt. Done-For-You is priced separately as a one-time package. The pricing page has the full breakdown.'],
  ['Can the interviewer tell I am using it?', 'Jobwhisper runs in its own desktop app rather than inside the meeting window, and Stealth Mode keeps it out of the way while you are on a call. What it shows you stays on your screen.'],
  ['What if the answer it gives is not right?', 'Answers are drafted from your resume, the job description and anything you add to your knowledge base, so they stay grounded in your own experience rather than invented. Treat them as a prompt, not a script: say them in your own words, and switch models mid-conversation if one is not landing.'],
  ['Which conversations does it work in?', 'Live interviews, coding interviews, meetings, and practice sessions with an AI interviewer before the real thing.'],
  ['Why did Lightforth become Jobwhisper?', 'The new name reflects the product more clearly: practical AI help throughout your job search, including live support when answers matter. Existing accounts keep working, and you can log in at the top of this page.'],
  ['How do I contact the Jobwhisper team?', 'Open the help center from your account or use the contact options in the footer.'],
] as const

const BRAND_ANNOUNCEMENT = 'We’ve moved on from Lightforth. Meet Jobwhisper, built to help you land your next role.'

function BrandAnnouncement() {
  // The message travels; the link does not, so it stays hittable rather than sliding out
  // from under the cursor. The second copy is what makes the loop seamless — it is hidden
  // from assistive tech so the sentence is not announced twice.
  return <div className="landing-brand-announcement">
    <div className="landing-brand-announcement-marquee">
      <div className="landing-brand-announcement-track">
        <p>{BRAND_ANNOUNCEMENT}</p>
        <p aria-hidden="true" data-marquee-clone="">{BRAND_ANNOUNCEMENT}</p>
      </div>
    </div>
    <a href="https://lightforth.ai/">Learn more</a>
  </div>
}

function SocialProofSignup() {
  const navigate = useNavigate()
  return <aside className="landing-social-proof" aria-label="Join Jobwhisper">
    <div className="landing-social-proof-avatars" aria-hidden="true"><img src="/figma-landing/social-proof-1.jpg" alt="" /><img src="/figma-landing/social-proof-2.jpg" alt="" /><img src="/figma-landing/social-proof-3.jpg" alt="" /></div>
    <p><span className="landing-social-proof-copy-desktop">Join 57,000+ job seekers landing better roles</span><span className="landing-social-proof-copy-mobile">57,000+ job seekers</span></p>
    <button type="button" onClick={() => navigate('/v3/downloads')}><span>Download</span><span className="landing-social-proof-platforms" aria-hidden="true"><img src="/landing-apple.svg" alt="" /><img src="/landing-windows.svg" alt="" /></span></button>
  </aside>
}

function Hero({ heroRef }: { readonly heroRef: RefObject<HTMLElement | null> }) {
  const navigate = useNavigate()
  return <section className="landing-hero" ref={heroRef}><MarketingNav /><div className="landing-hero-copy"><h1>Pass Your <span>Next Interview.</span><br />Land the Job. Or Don’t Pay!</h1><p>Jobwhisper Copilot listens to every interview question and instantly gives you a tailored answer using your resume and the job description, so you always know what to say. No guessing. No delay. No memorizing scripts. No freezing under pressure.</p><div className="landing-hero-actions"><button className="landing-primary-button" onClick={() => navigate('/v3/auth/create-account')}>Ace your Interview <ArrowUpRight aria-hidden="true" /></button></div><div className="landing-hero-notes"><span><img src="/figma-landing/free-credits-gift.svg" alt="" />Includes free credits</span><b aria-hidden="true">·</b><span><img src="/figma-landing/no-card.svg" alt="" />No card required</span></div></div></section>
}

function Demo() {
  return <section className="landing-demo" aria-label="Jobwhisper live copilot demo"><video src="/landing-demo.mp4" autoPlay muted loop playsInline /><div className="landing-demo-fade" /></section>
}

function JourneyPreview({ active }: { readonly active: number }) {
  const images = ['/figma-landing/journey-resume.png', '/figma-landing/journey-jobs.png', '/figma-landing/journey-copilot.png', '/figma-landing/journey-simulator.png', '/figma-landing/journey-meeting.png', '/figma-landing/journey-coding.png']
  const labels = ['AI Resume Builder preview', 'AI Job Application preview', 'Interview Copilot preview', 'Interview Prep preview', 'Meeting Copilot preview', 'Coding Interview preview']
  return <div className="journey-product">{images.map((image, index) => <img key={image} src={image} alt={index === active ? labels[index] : ''} data-active={index === active} data-side={index === active ? undefined : index < active ? 'before' : 'after'} aria-hidden={index === active ? undefined : true} />)}</div>
}

const JOURNEY_COPY = [
  { text: 'Jobwhisper is built to help you through every stage of', strong: false },
  { text: 'landing your next role.', strong: true },
  { text: 'Start by creating or', strong: false },
  { text: 'tailoring a resume', strong: true },
  { text: 'for the job you want. Let Auto Apply find', strong: false },
  { text: 'relevant opportunities', strong: true },
  { text: 'without spending hours searching job boards. Prepare for the interview with realistic', strong: false },
  { text: 'AI simulations,', strong: true },
  { text: 'then take', strong: false },
  { text: 'Interview Copilot', strong: true },
  { text: 'with you when it is time for the real conversation.', strong: false },
] as const

const JOURNEY_COPY_LABEL = JOURNEY_COPY.map(({ text }) => text).join(' ')

type RevealSegment = { readonly text: string; readonly strong: boolean }

function ScrollRevealText({ segments, className, onComplete }: { readonly segments: readonly RevealSegment[]; readonly className: string; readonly onComplete?: () => void }) {
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const [revealedWords, setRevealedWords] = useState(0)
  const wordCount = segments.reduce((count, segment) => count + segment.text.split(' ').length, 0)
  const label = segments.map(({ text }) => text).join(' ')

  useEffect(() => {
    const paragraph = paragraphRef.current
    if (!paragraph) return

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (reducedMotion) {
      setRevealedWords(wordCount)
      return
    }

    let animationFrame = 0
    const update = () => {
      animationFrame = 0
      const { top } = paragraph.getBoundingClientRect()
      const revealStart = window.innerHeight * 0.82
      const revealEnd = window.innerHeight * 0.28
      const progress = Math.min(1, Math.max(0, (revealStart - top) / (revealStart - revealEnd)))
      setRevealedWords(Math.ceil(progress * wordCount))
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
  }, [wordCount])

  useEffect(() => {
    if (revealedWords >= wordCount) onComplete?.()
  }, [onComplete, revealedWords, wordCount])

  let wordIndex = 0
  return <p ref={paragraphRef} className={className} aria-label={label}>{segments.map((segment) => {
    const words = segment.text.split(' ')
    const content = words.map((word) => {
      const currentIndex = wordIndex
      wordIndex += 1
      return <span key={`${word}-${currentIndex}`} data-reveal-word data-revealed={currentIndex < revealedWords} aria-hidden="true">{word}{currentIndex < wordCount - 1 ? ' ' : ''}</span>
    })
    return segment.strong ? <strong key={segment.text}>{content}</strong> : <span key={segment.text}>{content}</span>
  })}</p>
}

function JourneyRevealText() {
  return <ScrollRevealText segments={JOURNEY_COPY} className="landing-journey-reveal" />
}

function CountUp({ value, decimals = 0, prefix = '', enabled = true }: { readonly value: number; readonly decimals?: number; readonly prefix?: string; readonly enabled?: boolean }) {
  const valueRef = useRef<HTMLElement>(null)
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (!enabled) return
    const element = valueRef.current
    if (!element) return
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (reducedMotion) {
      setDisplayValue(value)
      return
    }

    let animationFrame = 0
    let started = false
    const run = () => {
      if (started) return
      started = true
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 1300)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayValue(value * eased)
        if (progress < 1) animationFrame = window.requestAnimationFrame(tick)
      }
      animationFrame = window.requestAnimationFrame(tick)
    }

    if (!('IntersectionObserver' in window)) run()
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        run()
        observer.disconnect()
      }
    }, { threshold: 0.4 }) : null
    observer?.observe(element)
    return () => {
      observer?.disconnect()
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [enabled, value])

  const formatted = displayValue.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return <strong ref={valueRef}>{prefix}{formatted}</strong>
}

const FACTS_COPY = [
  { text: 'Meet the', strong: false },
  { text: 'AI copilot built for the moments when the right answer matters.', strong: true },
  { text: 'Jobwhisper combines leading AI models with your resume, job description and personal context to give you relevant answers in real time. Setup takes just a few steps, and once you’re ready, your Copilot stays with you across interviews, coding sessions, meetings and practice. Less switching between tools. Less searching for answers. More focus on the conversation in front of you.', strong: false },
] as const

/**
 * Steps a pinned section with the scroll, the way the product pages advance their
 * walkthrough: the panel stays on screen while its runway travels past, and the step
 * follows the reading position instead of waiting for a tap. A tap still chooses a step
 * and keeps it until the scroll crosses into a different one.
 *
 * The runway only exists on the phone layout — the wide one has its chevrons and tabs and
 * keeps them — so this asks the stylesheet whether there is a box to measure rather than
 * re-testing the breakpoint in here.
 */
function useScrollSteps(count: number) {
  const runwayRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const scrolledStep = useRef(0)

  useEffect(() => {
    const runway = runwayRef.current
    if (!runway) return

    let animationFrame = 0
    const update = () => {
      animationFrame = 0
      if (window.getComputedStyle(runway).display === 'contents') return
      const { top, height } = runway.getBoundingClientRect()
      const extent = Math.max(1, height - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -top / extent))
      const step = Math.min(count - 1, Math.floor(progress * count))
      // Only when the scroll has genuinely moved on, so a tap survives until then.
      if (step === scrolledStep.current) return
      scrolledStep.current = step
      setActive(step)
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
  }, [count])

  return { runwayRef, active, setActive }
}

function Journey() {
  const { runwayRef, active, setActive } = useScrollSteps(JOURNEY.length)
  const navRef = useRef<HTMLDivElement>(null)
  const cycleFeature = (direction: -1 | 1) => setActive((current) => (current + direction + JOURNEY.length) % JOURNEY.length)

  // Where the stages are a horizontal row (mobile), centre the card a tap opened so the
  // stages either side of it break the panel edges as chevrons. The scroll clamps at the
  // ends on its own, which is what leaves the first and last stage with only one neighbour
  // showing. The overflow check keeps this off the desktop column, which never scrolls
  // sideways and would otherwise jump the page on every change.
  useEffect(() => {
    const nav = navRef.current
    if (!nav || nav.scrollWidth <= nav.clientWidth) return
    const item = nav.children[active]
    if (item instanceof HTMLElement) item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [active])

  return <section className="landing-journey" id="features"><div className="landing-section-intro"><p>Your entire job search</p><h2>Start to finish.</h2><JourneyRevealText /></div><div className="landing-journey-scroller" ref={runwayRef} style={{ '--steps': JOURNEY.length } as CSSProperties}><div className="landing-journey-pinned"><div className="landing-journey-viewer"><div className="landing-journey-controls"><button aria-label="Previous feature" onClick={() => cycleFeature(-1)}><ChevronUp aria-hidden="true" /></button><button aria-label="Next feature" onClick={() => cycleFeature(1)}><ChevronDown aria-hidden="true" /></button></div><div className="landing-journey-nav" ref={navRef} aria-label="Job search stages">{JOURNEY.map(([title, description, shortDescription], index) => <div className="landing-journey-item" key={title}><button aria-expanded={active === index} aria-controls={`journey-description-${index}`} onClick={() => setActive(index)}><Plus aria-hidden="true" className="landing-journey-icon-expand" />{index > active ? <ChevronRight aria-hidden="true" className="landing-journey-icon-step" /> : null}{title}{index < active ? <ChevronLeft aria-hidden="true" className="landing-journey-icon-step" /> : null}</button><div className="landing-journey-description-shell" data-open={active === index}><div className="landing-journey-description" id={`journey-description-${index}`} role="region" aria-label={`${title} details`} aria-hidden={active !== index}><strong className="landing-journey-description-title">{title}.</strong> <span className="landing-journey-description-full">{description}</span><span className="landing-journey-description-short">{shortDescription}</span></div></div></div>)}</div><div className="landing-journey-stage" role="region" aria-label={`${JOURNEY[active][0]} preview`}><JourneyPreview active={active} /></div></div></div></div></section>
}

function ProductFacts() {
  const [copyRevealed, setCopyRevealed] = useState(false)
  return <section className="landing-facts"><ScrollRevealText segments={FACTS_COPY} className="landing-facts-reveal" onComplete={() => setCopyRevealed(true)} /><div className="landing-facts-grid"><div className="landing-stat landing-stat-minutes"><span>Up to</span><CountUp value={4000} enabled={copyRevealed} /><span>minutes Included</span></div><div className="landing-fact-copy"><div><strong>Multiple AI models</strong><span>Choose the model that fits the conversation.</span><ul><li>OpenAI</li><li>Anthropic</li><li>Google Gemini</li><li>Kimi</li><li>Qwen</li></ul><span>Switch models depending on the interview, question, or task.</span></div><div><strong>Personalized context</strong><span>Your resume<br />Your job description<br />Upload multiple knowledge bases</span></div><div><strong>Simple setup</strong><span>Add your context<br />Choose your preferences<br />Start your Copilot</span></div></div><div className="landing-stat landing-stat-price"><span>Starting from</span><CountUp value={0.1} decimals={2} prefix="$" enabled={copyRevealed} /><span>per minute</span></div></div></section>
}

const COPILOT_TABS = ['Interviews', 'Meetings', 'Coding', 'Practice'] as const
const COPILOT_IMAGES: Record<(typeof COPILOT_TABS)[number], string> = {
  Interviews: '/figma-landing/copilot-interviews.png',
  Meetings: '/figma-landing/copilot-meetings.png',
  Coding: '/figma-landing/copilot-coding.png',
  Practice: '/figma-landing/copilot-practice.png',
}
function CopilotShowcase() {
  const navigate = useNavigate()
  // The four use cases were a tab row and nothing else: on a phone they sat above the fold
  // of the section and most readers scrolled straight past all but the first. Scrolling
  // now walks them, tapping still picks one.
  const { runwayRef, active, setActive } = useScrollSteps(COPILOT_TABS.length)
  const activeTab = COPILOT_TABS[active]
  return <section className="landing-copilot"><div className="landing-section-intro"><h2>Your copilot.<br />Always within reach.</h2><p>Jobwhisper gives you real-time AI support while the conversation is happening, so you can focus on the person in front of you instead of scrambling for what to say next. Whether you’re answering an interview question, working through a coding challenge, leading an important meeting, or practicing before the real thing, your Copilot listens, understands the context, and helps you respond with confidence.</p></div><div className="landing-copilot-scroller" ref={runwayRef} style={{ '--steps': COPILOT_TABS.length } as CSSProperties}><div className="landing-copilot-pinned"><div className="landing-copilot-tabs" role="tablist" aria-label="Copilot use cases">{COPILOT_TABS.map((tab, index) => <button key={tab} role="tab" aria-selected={activeTab === tab} aria-controls="copilot-preview" onClick={() => setActive(index)}>{tab}</button>)}</div><div className="landing-copilot-image" data-copilot-tab={activeTab.toLowerCase()} id="copilot-preview" role="tabpanel">{COPILOT_TABS.map((tab, index) => <img key={tab} src={COPILOT_IMAGES[tab]} alt={index === active ? `Jobwhisper ${tab.toLowerCase()} copilot desktop preview` : ''} aria-hidden={index === active ? undefined : true} loading={index === 0 ? 'eager' : 'lazy'} data-current={index === active} data-side={index === active ? undefined : index < active ? 'before' : 'after'} />)}</div><div className="landing-copilot-actions"><button className="landing-primary-button" onClick={() => navigate('/v3/auth/create-account')}>Try Interview Copilot <ArrowUpRight aria-hidden="true" /></button></div></div></div></section>
}

/** [label, blurb, isNew]. Shown once the reader asks to see how it works. */
const TRY_OPTIONS = [
  ['Tailor my Resume', 'Let Jobwhisper build a resume around this role, leading with the experience the employer asked for.', false],
  ['Practice For Interview', 'Rehearse with an AI interviewer on this role, then read what landed and what needs work.', false],
  ['Start Interview Copilot', 'Live support during the real conversation, drawn from the resume and the job description you just gave.', false],
  ['Auto-Apply', 'Let Jobwhisper find roles like this one and prepare each application for you to approve.', true],
] as const

/**
 * The funnel: paste the job, add a resume, and the four things Jobwhisper can do with them
 * appear underneath. Every one of them goes to sign-up for now.
 */
function TryItNow() {
  const navigate = useNavigate()
  const [stage, setStage] = useState<'idle' | 'asking' | 'loading' | 'options'>('idle')
  const [jobText, setJobText] = useState('')
  const [resume, setResume] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const optionsRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  // The card only gates on the job description. The resume is asked for afterwards, in the
  // panel, because one question at a time is easier to answer than a form to complete.
  const hasJob = jobText.trim().length > 0

  useEffect(() => {
    if (stage !== 'loading') return
    const timer = window.setTimeout(() => setStage('options'), 1100)
    return () => window.clearTimeout(timer)
  }, [stage])

  // The options arrive below the fold of this card, so move the reader to them rather than
  // leaving the page looking unchanged after the wait.
  useEffect(() => {
    if (stage === 'options') optionsRef.current?.focus({ preventScroll: true })
  }, [stage])

  // While the panel is up it owns the keyboard: it takes focus on open, Escape dismisses it,
  // and dismissing hands focus back to the button it rose from.
  useEffect(() => {
    if (stage !== 'asking') return
    sheetRef.current?.focus({ preventScroll: true })
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSheet()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [stage])

  function closeSheet() {
    setStage('idle')
    setDragging(false)
    ctaRef.current?.focus({ preventScroll: true })
  }

  function takeFile(file: File | undefined) {
    if (file) setResume(file)
    setDragging(false)
  }

  return <section className="landing-try" aria-labelledby="landing-try-title">
    <p className="landing-try-eyebrow">Getting started</p>
    <h2 id="landing-try-title">Try it on a job you actually want.</h2>
    <p className="landing-try-lede">Paste the description, add your resume, and see what Jobwhisper would do with them.</p>

    <div className="landing-try-card" data-asking={stage === 'asking' ? '' : undefined}>
      <label className="sr-only" htmlFor="landing-try-job">Paste a job description</label>
      <textarea id="landing-try-job" placeholder="Paste a job description" rows={3} value={jobText} onChange={(event) => setJobText(event.target.value)} />
      <span className="landing-try-glow" aria-hidden="true" />
      <div className="landing-try-card-foot">
        {/* The shortcut for anyone who has the file to hand already: attach here and the panel
            opens with the answer filled in, one click from done. */}
        <label className="landing-try-attach">
          <Paperclip aria-hidden="true" />
          <span className="sr-only">Attach your resume</span>
          <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(event) => takeFile(event.target.files?.[0])} />
        </label>
        {resume ? <span className="landing-try-file">{resume.name}</span> : null}
        <button
          ref={ctaRef}
          type="button"
          className="landing-try-cta"
          onClick={() => setStage('asking')}
          disabled={!hasJob || stage === 'loading'}
          data-working={stage === 'loading' ? '' : undefined}
        >
          {stage === 'loading' ? 'Working…' : 'See how it works'}
        </button>
      </div>

      {/* The resume is asked for the way a question gets asked mid-conversation: a panel that
          rises over the button you just pressed, holding one question and its answer. */}
      {stage === 'asking' ? (
        <div
          className="landing-try-sheet"
          role="dialog"
          aria-labelledby="landing-try-ask"
          ref={sheetRef}
          tabIndex={-1}
          onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); takeFile(event.dataTransfer.files?.[0]) }}
        >
          <div className="landing-try-sheet-head">
            <span className="landing-try-sheet-tab">Resume</span>
            <button type="button" className="landing-try-sheet-close" onClick={closeSheet}>
              <X aria-hidden="true" /><span className="sr-only">Close</span>
            </button>
          </div>

          <div className="landing-try-sheet-body">
          <p className="landing-try-ask" id="landing-try-ask">Which resume should we work from?</p>

          <button
            type="button"
            className="landing-try-pick"
            data-selected={resume ? '' : undefined}
            data-dragging={dragging ? '' : undefined}
            onClick={() => fileRef.current?.click()}
          >
            <span className="landing-try-radio" aria-hidden="true" />
            <span className="landing-try-pick-copy">
              <b>{resume ? resume.name : 'Upload your resume'}</b>
              <small>{resume ? `${Math.max(1, Math.round(resume.size / 1024))} KB · choose a different file` : 'PDF, DOC, DOCX or TXT — or drop it anywhere in this panel'}</small>
            </span>
          </button>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="landing-try-sheet-file" onChange={(event) => takeFile(event.target.files?.[0])} />
          </div>

          <div className="landing-try-sheet-foot">
            <span className="landing-try-sheet-step" aria-hidden="true">1</span>
            <button type="button" className="landing-try-submit" onClick={() => setStage('loading')} disabled={!resume}>
              {resume ? 'Submit' : 'Add a resume to continue'}
            </button>
          </div>
        </div>
      ) : null}
    </div>

    <p className="landing-try-hint" aria-live="polite">
      {hasJob ? 'Nothing is sent yet. This just shows you where it would go.' : 'Paste a job description to continue.'}
    </p>

    <div className="landing-try-reveal" data-stage={stage} aria-live="polite">
      {stage === 'loading' ? <span className="landing-try-dots" role="status"><i /><i /><i /><span className="sr-only">Reading the job description</span></span> : null}
      {stage === 'options' ? (
        <div className="landing-try-options" ref={optionsRef} tabIndex={-1}>
          <p className="landing-try-options-title">What do you want to use this for?</p>
          <div className="landing-try-grid">
            {TRY_OPTIONS.map(([label, blurb, isNew]) => (
              <button type="button" key={label} onClick={() => navigate('/v3/auth/create-account')}>
                <span className="landing-try-option-head">
                  <b>{label}</b>
                  <ArrowRight aria-hidden="true" />
                  {isNew ? <em>New</em> : null}
                </span>
                <span className="landing-try-option-body">{blurb}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  </section>
}

function Faq() {
  return <section className="landing-faq" id="faq"><h2>Frequently asked questions</h2><Accordion className="landing-faq-list">{FAQS.map(([question, answer], index) => <AccordionItem key={question} value={String(index)}><AccordionHeader><AccordionTrigger>{question}</AccordionTrigger></AccordionHeader><AccordionPanel>{answer}</AccordionPanel></AccordionItem>)}</Accordion></section>
}

function Closing() {
  const navigate = useNavigate()
  return <section className="landing-closing"><h2>Ready when you are.<br />Let’s get you hired.</h2><p>Your next opportunity could start with a better resume, the right application, stronger preparation, or simply knowing what to say when the interview begins. <strong>Jobwhisper brings it all together,</strong> helping you find the right roles, prepare for the moments that matter, and show up with support when it counts. You’ve done the hard part getting this far. Now let’s help you turn the next opportunity into an offer.</p><div className="landing-closing-actions"><button className="landing-primary-button" onClick={() => navigate('/v3/auth/create-account')}>Get started free <ArrowUpRight aria-hidden="true" /></button><button className="landing-secondary-button" onClick={() => navigate('/pricing')}>See pricing</button></div><div className="landing-hero-notes landing-closing-note"><span><img src="/figma-landing/free-credits-gift.svg" alt="" />Includes free credits</span><b aria-hidden="true">·</b><span><img src="/figma-landing/no-card.svg" alt="" />No card required</span><b aria-hidden="true">·</b><span>Plans from $47/month</span></div></section>
}

export function LandingPage() {
  const { hash } = useLocation()
  const heroRef = useRef<HTMLElement>(null)
  const [showSocialProof, setShowSocialProof] = useState(false)

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [hash])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const observer = new IntersectionObserver(([entry]) => setShowSocialProof(!entry.isIntersecting))
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  // The sections are wrapped so they can carry the opaque sheet that covers the pinned
  // footer — on the page element itself the background paints under the footer instead.
  return <main className="figma-landing-page"><div className="landing-content"><BrandAnnouncement /><Hero heroRef={heroRef} /><Demo /><CopilotShowcase /><ProductFacts /><Journey /><TryItNow /><Faq /><Closing /></div><MarketingFooter />{showSocialProof ? <SocialProofSignup /> : null}</main>
}
