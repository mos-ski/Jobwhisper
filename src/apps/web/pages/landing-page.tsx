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
  ['Is Jobwhisper free to start?', 'Yes. You can create an account and try it without a card. Paid plans begin at $47 for a week of unlimited interview prep and live support.'],
  ['How does “land the job or don’t pay” work?', 'It is the interview guarantee that comes with a Done-For-You package. A success manager applies on your behalf until you have landed the number of interviews your package guarantees, and your Jobwhisper access continues until that guarantee is fulfilled rather than expiring on a fixed date. It is a one-time price, not a subscription. Subscription plans on their own do not carry the guarantee, and the exact terms for the package you pick are shown before you pay.'],
  ['What does it cost?', 'Starter is $47 a week for unlimited Interview Prep and Interview Copilot, on web, desktop and mobile. Pro is $99 a month and adds Meeting and Coding Copilot, Resume Builder, and Auto Apply for 500 jobs a month. Premium is $497 a month and takes the job cap off Auto Apply. Call recording is included on every plan. Without a plan you can buy what you need as you go: interview minutes at $0.10, resume prompts at $0.10, applications at $1 each. Done-For-You is a one-time package. The pricing page has the full breakdown.'],
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
  return <section className="landing-hero" ref={heroRef}><MarketingNav /><div className="landing-hero-copy"><h1>Pass Your <span>Next Interview.</span><br />Land the Job. Or Don’t Pay!</h1><p>Jobwhisper Copilot listens to every interview question and instantly gives you a tailored answer using your resume and the job description, so you always know what to say. No guessing. No delay. No memorizing scripts. No freezing under pressure.</p><div className="landing-hero-actions"><button className="landing-primary-button" onClick={() => navigate('/v3/auth/create-account')}>Ace my next interview <ArrowUpRight aria-hidden="true" /></button></div><div className="landing-hero-notes"><span><img src="/figma-landing/free-credits-gift.svg" alt="" />Includes free credits</span><b aria-hidden="true">·</b><span><img src="/figma-landing/no-card.svg" alt="" />No card required</span></div></div></section>
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
  return <ScrollRevealText segments={JOURNEY_COPY} className="landing-reveal landing-journey-reveal" />
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

const COPILOT_COPY = [
  { text: 'Jobwhisper gives you', strong: false },
  { text: 'real-time AI support while the conversation is happening,', strong: true },
  { text: 'so you can focus on the person in front of you instead of scrambling for what to say next. Whether you’re answering an interview question, working through a coding challenge, leading an important meeting, or practicing before the real thing, your Copilot listens,', strong: false },
  { text: 'understands the context,', strong: true },
  { text: 'and helps you respond with confidence.', strong: false },
] as const

const CLOSING_COPY = [
  { text: 'Your next opportunity could start with a better resume, the right application, stronger preparation, or simply knowing what to say when the interview begins.', strong: false },
  { text: 'Jobwhisper brings it all together,', strong: true },
  { text: 'helping you find the right roles, prepare for the moments that matter, and show up with support when it counts. You’ve done the hard part getting this far. Now let’s help you turn the next opportunity into an offer.', strong: false },
] as const

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

  return <section className="landing-journey" id="features"><div className="landing-section-intro"><p className="lf-eyebrow">Your entire job search</p><h2>Start to finish.</h2><JourneyRevealText /></div><div className="landing-journey-scroller" ref={runwayRef} style={{ '--steps': JOURNEY.length } as CSSProperties}><div className="landing-journey-pinned"><div className="landing-journey-viewer"><div className="landing-journey-controls"><button aria-label="Previous feature" onClick={() => cycleFeature(-1)}><ChevronUp aria-hidden="true" /></button><button aria-label="Next feature" onClick={() => cycleFeature(1)}><ChevronDown aria-hidden="true" /></button></div><div className="landing-journey-nav" ref={navRef} aria-label="Job search stages">{JOURNEY.map(([title, description, shortDescription], index) => <div className="landing-journey-item" key={title}><button aria-expanded={active === index} aria-controls={`journey-description-${index}`} onClick={() => setActive(index)}><Plus aria-hidden="true" className="landing-journey-icon-expand" />{index > active ? <ChevronRight aria-hidden="true" className="landing-journey-icon-step" /> : null}{title}{index < active ? <ChevronLeft aria-hidden="true" className="landing-journey-icon-step" /> : null}</button><div className="landing-journey-description-shell" data-open={active === index}><div className="landing-journey-description" id={`journey-description-${index}`} role="region" aria-label={`${title} details`} aria-hidden={active !== index}><strong className="landing-journey-description-title">{title}.</strong> <span className="landing-journey-description-full">{description}</span><span className="landing-journey-description-short">{shortDescription}</span></div></div></div>)}</div><div className="landing-journey-stage" role="region" aria-label={`${JOURNEY[active][0]} preview`}><JourneyPreview active={active} /></div></div></div></div></section>
}

function ProductFacts() {
  const [copyRevealed, setCopyRevealed] = useState(false)
  return <section className="landing-facts"><ScrollRevealText segments={FACTS_COPY} className="landing-reveal landing-facts-reveal" onComplete={() => setCopyRevealed(true)} /><div className="landing-facts-grid"><div className="landing-stat landing-stat-minutes"><span>Up to</span><CountUp value={4000} enabled={copyRevealed} /><span>minutes Included</span></div><div className="landing-fact-copy"><div><strong>Multiple AI models</strong><span>Choose the model that fits the conversation.</span><ul><li>OpenAI</li><li>Anthropic</li><li>Google Gemini</li><li>Kimi</li><li>Qwen</li></ul><span>Switch models depending on the interview, question, or task.</span></div><div><strong>Personalized context</strong><span>Your resume<br />Your job description<br />Upload multiple knowledge bases</span></div><div><strong>Simple setup</strong><span>Add your context<br />Choose your preferences<br />Start your Copilot</span></div></div><div className="landing-stat landing-stat-price"><span>Starting from</span><CountUp value={0.1} decimals={2} prefix="$" enabled={copyRevealed} /><span>per minute</span></div></div></section>
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
  return <section className="landing-copilot"><div className="landing-section-intro"><h2>Your copilot.<br />Always within reach.</h2><ScrollRevealText segments={COPILOT_COPY} className="landing-reveal" /></div><div className="landing-copilot-scroller" ref={runwayRef} style={{ '--steps': COPILOT_TABS.length } as CSSProperties}><div className="landing-copilot-pinned"><div className="landing-copilot-tabs" role="tablist" aria-label="Copilot use cases">{COPILOT_TABS.map((tab, index) => <button key={tab} role="tab" aria-selected={activeTab === tab} aria-controls="copilot-preview" onClick={() => setActive(index)}>{tab}</button>)}</div><div className="landing-copilot-image" data-copilot-tab={activeTab.toLowerCase()} id="copilot-preview" role="tabpanel">{COPILOT_TABS.map((tab, index) => <img key={tab} src={COPILOT_IMAGES[tab]} alt={index === active ? `Jobwhisper ${tab.toLowerCase()} copilot desktop preview` : ''} aria-hidden={index === active ? undefined : true} loading={index === 0 ? 'eager' : 'lazy'} data-current={index === active} data-side={index === active ? undefined : index < active ? 'before' : 'after'} />)}</div><div className="landing-copilot-actions"><button className="landing-primary-button" onClick={() => navigate('/v3/auth/create-account')}>Try Interview Copilot <ArrowUpRight aria-hidden="true" /></button></div></div></div></section>
}

/**
 * The quiz. One question a screen, the way FlexJobs' wizard works, asked in the panel that
 * rises over the button — so the section is a way in rather than a form to complete.
 */
type QuizStep = {
  readonly id: string
  readonly tab: string
  readonly ask: string
  readonly options?: readonly (readonly [label: string, hint: string])[]
  readonly field?: { readonly placeholder: string }
  /** Short answers that read better as a row of pills than as rows with a line of hint each. */
  readonly choices?: readonly string[]
}

const QUIZ: readonly QuizStep[] = [
  {
    id: 'goal',
    tab: 'Goal',
    ask: 'What do you want to do with this resume?',
    options: [
      ['Tailor it to this job', 'Rewrite it around the posting, leading with the experience the employer asked for.'],
      ['Auto-Apply to roles like it', 'Find matching roles and prepare every application for you to approve.'],
      ['Practise for the interview', 'Rehearse with an AI interviewer on this role, then read what landed.'],
      ['Get live help in the interview', 'Copilot in the real conversation, drawn from this resume and this posting.'],
    ],
  },
  {
    id: 'timing',
    tab: 'Timing',
    ask: 'How soon are you looking to start?',
    options: [
      ['Right away', 'I could start within a fortnight.'],
      ['Within a month', 'I have notice to work, or a date in mind.'],
      ['One to three months', 'No rush, but I am moving.'],
      ['Just exploring', 'Seeing what is out there before I commit.'],
    ],
  },
  {
    id: 'pace',
    tab: 'Pace',
    ask: 'How many interviews do you want a week?',
    options: [
      ['One or two', 'Fewer roles, more preparation for each one.'],
      ['Three to five', 'A steady week without losing the day job.'],
      ['Five or more', 'Volume. Keep them coming.'],
      ['As many as I can get', 'Apply wide and sort the shortlist later.'],
    ],
  },
  {
    id: 'setup',
    tab: 'Setup',
    ask: 'What kind of role are you looking for?',
    options: [
      ['Fully remote', 'Anywhere, with no commute in the offer.'],
      ['Hybrid', 'Some days in the office, some at home.'],
      ['On-site', 'In person, with a team around you.'],
      ['Open to any', 'The role matters more than where it is.'],
    ],
  },
  {
    id: 'title',
    tab: 'Title',
    ask: 'What job title are you going for?',
    field: { placeholder: 'e.g. Senior Product Designer' },
  },
  {
    id: 'reason',
    tab: 'About you',
    ask: 'What brings you to Jobwhisper?',
    options: [
      ['Actively job hunting', 'Applying now, and I want to move faster.'],
      ['Open to the right thing', 'Not looking hard, but I would take a good role.'],
      ['Preparing for interviews', 'I have rounds booked and want to be ready.'],
      ['Just having a look', 'Working out whether this is for me.'],
    ],
  },
  {
    id: 'source',
    tab: 'About you',
    ask: 'How did you hear about us?',
    choices: ['Search', 'Social', 'A friend', 'YouTube', 'An ad', 'Somewhere else'],
  },
]

/**
 * The funnel: paste a job, add a resume, answer six short questions, and the answers carry
 * into sign-up. Nothing leaves the page — the section is the starting point, not the product.
 */
function TryItNow() {
  const navigate = useNavigate()
  const [stage, setStage] = useState<'idle' | 'quiz' | 'loading' | 'done'>('idle')
  const [jobText, setJobText] = useState('')
  const [resume, setResume] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const sheetRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  // Nothing opens until there is a posting and a resume to work from — the questions that
  // follow are about those two things, so asking them first would be asking about nothing.
  const ready = jobText.trim().length > 0 && resume !== null
  const open = stage !== 'idle'
  const quizStep = QUIZ[step]
  const answered = quizStep !== undefined && (answers[quizStep.id] ?? '').trim().length > 0

  useEffect(() => {
    if (stage !== 'loading') return
    const timer = window.setTimeout(() => setStage('done'), 1100)
    return () => window.clearTimeout(timer)
  }, [stage])

  // While the panel is up it owns the keyboard: it takes focus on open, Escape dismisses it,
  // and dismissing hands focus back to the button it rose from.
  useEffect(() => {
    if (!open) return
    sheetRef.current?.focus({ preventScroll: true })
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSheet()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  function closeSheet() {
    setStage('idle')
    setDragging(false)
    ctaRef.current?.focus({ preventScroll: true })
  }

  function takeFile(file: File | undefined) {
    if (file) setResume(file)
    setDragging(false)
  }

  function answer(id: string, value: string) {
    setAnswers((previous) => ({ ...previous, [id]: value }))
  }

  function goBack() {
    if (step > 0) return setStep(step - 1)
    closeSheet()
  }

  function goOn() {
    if (step < QUIZ.length - 1) return setStep(step + 1)
    setStage('loading')
  }

  const position = stage === 'quiz' ? step : QUIZ.length
  const tab = stage === 'quiz' ? quizStep?.tab : 'All set'

  return <section className="landing-try" aria-labelledby="landing-try-title">
    <p className="lf-eyebrow">Getting started</p>
    <h2 id="landing-try-title">Try it on a job you actually want.</h2>
    <p className="landing-try-lede">Paste the description, add your resume, and tell us what landing it looks like. Your setup will be waiting.</p>

    <div
      className="landing-try-card"
      data-asking={open ? '' : undefined}
      data-dragging={dragging ? '' : undefined}
      onDragOver={(event) => { if (!open) { event.preventDefault(); setDragging(true) } }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => { if (!open) { event.preventDefault(); takeFile(event.dataTransfer.files?.[0]) } }}
    >
      <label className="sr-only" htmlFor="landing-try-job">Paste a job description</label>
      <textarea id="landing-try-job" placeholder="Paste a job description" rows={3} value={jobText} onChange={(event) => setJobText(event.target.value)} />
      <div className="landing-try-card-foot">
        {/* The only way in: the questions that follow are about this resume and this posting. */}
        <label className="landing-try-attach">
          <Paperclip aria-hidden="true" />
          <span className="sr-only">Attach your resume</span>
          <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(event) => takeFile(event.target.files?.[0])} />
        </label>
        {resume ? <span className="landing-try-file">{resume.name}</span> : null}
        <button ref={ctaRef} type="button" className="landing-try-cta" onClick={() => { setStep(0); setStage('quiz') }} disabled={!ready}>Set me up</button>
      </div>

      {open ? (
        <div
          className="landing-try-sheet"
          data-stage={stage}
          role="dialog"
          aria-labelledby="landing-try-ask"
          ref={sheetRef}
          tabIndex={-1}
        >
          <div className="landing-try-sheet-head">
            <span className="landing-try-sheet-tab">{tab}</span>
            <button type="button" className="landing-try-sheet-close" onClick={closeSheet}>
              <X aria-hidden="true" /><span className="sr-only">Close</span>
            </button>
          </div>
          <div className="landing-try-progress" role="presentation"><span style={{ width: `${((position + 1) / (QUIZ.length + 1)) * 100}%` }} /></div>

          <div className="landing-try-sheet-body">
            {stage === 'quiz' && quizStep ? <>
              <p className="landing-try-ask" id="landing-try-ask">{quizStep.ask}</p>
              {quizStep.options?.map(([label, hint]) => (
                <button
                  type="button"
                  key={label}
                  className="landing-try-pick"
                  data-selected={answers[quizStep.id] === label ? '' : undefined}
                  onClick={() => answer(quizStep.id, label)}
                >
                  <span className="landing-try-radio" aria-hidden="true" />
                  <span className="landing-try-pick-copy"><b>{label}</b><small>{hint}</small></span>
                </button>
              ))}
              {quizStep.field ? <input
                className="landing-try-field"
                placeholder={quizStep.field.placeholder}
                value={answers[quizStep.id] ?? ''}
                onChange={(event) => answer(quizStep.id, event.target.value)}
                aria-label={quizStep.ask}
                autoFocus
              /> : null}
              {quizStep.choices ? <div className="landing-try-pills">
                {quizStep.choices.map((choice) => <button
                  type="button"
                  key={choice}
                  data-selected={answers[quizStep.id] === choice ? '' : undefined}
                  onClick={() => answer(quizStep.id, choice)}
                >{choice}</button>)}
              </div> : null}
            </> : null}

            {stage === 'loading' ? <div className="landing-try-working">
              <span className="landing-try-dots" role="status"><i /><i /><i /><span className="sr-only">Setting things up</span></span>
              <p>Putting your setup together…</p>
            </div> : null}

            {stage === 'done' ? <>
              <p className="landing-try-ask" id="landing-try-ask">Right. That is everything.</p>
              <p className="landing-try-summary">We will open Jobwhisper on <b>{answers.goal ?? 'your resume'}</b> and set the rest up around it.</p>
              {/* Read back rather than written out as a sentence — the answers are short labels
                  and a sentence built from them reads like a mail merge. */}
              <dl className="landing-try-recap">
                {answers.title ? <div><dt>Role</dt><dd>{answers.title}</dd></div> : null}
                {answers.setup ? <div><dt>Setup</dt><dd>{answers.setup}</dd></div> : null}
                {answers.timing ? <div><dt>Starting</dt><dd>{answers.timing}</dd></div> : null}
                {answers.pace ? <div><dt>Interviews a week</dt><dd>{answers.pace}</dd></div> : null}
              </dl>
              <button type="button" className="landing-try-finish" onClick={() => navigate('/v3/auth/create-account')}>
                Let’s go land this one<ArrowRight aria-hidden="true" />
              </button>
            </> : null}
          </div>

          {stage === 'quiz' ? <div className="landing-try-sheet-foot">
            <button type="button" className="landing-try-back" onClick={goBack}>Back</button>
            <span className="landing-try-sheet-step">{position + 1} of {QUIZ.length}</span>
            <button type="button" className="landing-try-submit" onClick={goOn} disabled={!answered}>
              {stage === 'quiz' && step === QUIZ.length - 1 ? 'Finish' : 'Continue'}
            </button>
          </div> : null}
        </div>
      ) : null}
    </div>

    <p className="landing-try-hint" aria-live="polite">
      {ready
        ? 'Nothing is sent yet. Your answers set your account up when you sign in.'
        : jobText.trim()
          ? 'Attach your resume to continue.'
          : resume
            ? 'Paste a job description to continue.'
            : 'Paste a job description and attach your resume to continue.'}
    </p>
  </section>
}

function Faq() {
  return <section className="landing-faq" id="faq"><h2>Frequently asked questions</h2><Accordion className="landing-faq-list">{FAQS.map(([question, answer], index) => <AccordionItem key={question} value={String(index)}><AccordionHeader><AccordionTrigger>{question}</AccordionTrigger></AccordionHeader><AccordionPanel>{answer}</AccordionPanel></AccordionItem>)}</Accordion></section>
}

function Closing() {
  const navigate = useNavigate()
  return <section className="landing-closing"><h2>Ready when you are.<br />Let’s get you hired.</h2><ScrollRevealText segments={CLOSING_COPY} className="landing-reveal" /><div className="landing-closing-actions"><button className="landing-primary-button" onClick={() => navigate('/v3/auth/create-account')}>Get started free <ArrowUpRight aria-hidden="true" /></button><button className="landing-secondary-button" onClick={() => navigate('/pricing')}>See pricing</button></div><div className="landing-hero-notes landing-closing-note"><span><img src="/figma-landing/free-credits-gift.svg" alt="" />Includes free credits</span><b aria-hidden="true">·</b><span><img src="/figma-landing/no-card.svg" alt="" />No card required</span><b aria-hidden="true">·</b><span>Plans from $47/month</span></div></section>
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
