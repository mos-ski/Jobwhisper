import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Menu as MenuIcon, Play, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger, Menu, MenuContent, MenuItem, MenuTrigger } from '@/ui'
import { downloadItems } from '@/mocks/account'
import './landing-page.css'

const JOURNEY = [
  ['AI Resume Builder', 'Start with a resume built for the job you want. Tell us the role you are going after. Jobwhisper helps you build or tailor your resume around it, highlighting the experience and skills that matter most.'],
  ['AI Job Application', 'Find roles that match your experience, compare fit at a glance, and move the applications you choose into one focused workflow.'],
  ['Interview Copilot', 'Bring real-time, resume-aware answers into the live conversation, privately and exactly when you need them.'],
  ['Interview Prep', 'Practice realistic questions with an AI interviewer before the real conversation begins.'],
  ['Meeting Copilot', 'Get real-time notes, talking points and summaries during meetings, so you stay focused on the conversation instead of scrambling to take notes.'],
  ['Coding Interview', 'Live AI assistance during coding interviews. Real-time hints as you work through the problem.'],
] as const

const PLATFORMS = [
  { label: 'Desktop App', title: 'Stealth. Completely Undetectable', body: 'Take Jobwhisper into interviews, coding sessions and meetings with our desktop app, including Stealth Mode for a private, distraction-free Copilot experience.', href: '/v3/downloads', action: 'Download Now →', image: '/figma-landing/platform-desktop.svg', icon: 'arrow' },
  { label: 'Browser Extension', title: 'Turn job boards into your job-search workspace.', body: 'Find and apply to roles directly across LinkedIn, Glassdoor, Workable and supported job sites, with Jobwhisper helping automate the repetitive parts of applying.', href: '/v3/downloads', action: 'Download From Store →', image: '/figma-landing/platform-browser.svg', icon: 'arrow' },
  { label: 'Mobile App', title: 'Your job search on the go.', body: 'Keep Jobwhisper close for job search, preparation and career support right from your phone.', action: 'Coming soon', image: '/figma-landing/platform-mobile.svg', icon: 'plus' },
  { label: 'Done For You', title: 'Or let a real person handle the search.', body: 'Want to skip the applications entirely? Our team can find relevant roles, tailor your resume and apply for you, with a dedicated success manager supporting your search.', href: '/v3/done-for-you', action: 'Explore Done For You →', image: '/figma-landing/platform-managed.svg', icon: 'plus' },
] as const

const FAQS = [
  ['Is Jobwhisper free?', 'You can create an account with free monthly credits. Paid usage depends on the feature and the amount of support you use.'],
  ['What happens if I fail an interview?', 'Eligible offers include the interview guarantee described at checkout. The exact terms are shown before purchase.'],
  ['Is Jobwhisper the same company as FanBasis?', 'No. Jobwhisper is an AI career companion built for resumes, applications, interview preparation and live interview support.'],
  ['Where do existing Jobwhisper users log in?', 'Use the Log in link at the top of this page to access your Jobwhisper account.'],
  ['Do I need to create a new account?', 'New users can create an account in a few steps. Existing users can keep using their current account.'],
  ['What happened to the Lightforth website?', 'Lightforth is now Jobwhisper. The product continues with the same goal: helping you move from job search to job offer.'],
  ['Why did Lightforth become Jobwhisper?', 'The new name reflects the product more clearly: practical AI help throughout your job search, including live support when answers matter.'],
  ['How do I contact the Jobwhisper team?', 'Open the help center from your account or use the contact options in the footer.'],
] as const

function DownloadMenu({ compact = false }: { readonly compact?: boolean }) {
  return <Menu><MenuTrigger render={<button className={compact ? 'landing-nav-download' : 'landing-primary-button'} aria-label={compact ? 'Download Jobwhisper' : undefined} />}>
    {compact ? <img src="/landing-logo-icon.svg" alt="" /> : <span>Download Now</span>}
    {compact ? <span>Download</span> : <span className="landing-platform-icons" aria-hidden="true"><img src="/landing-apple.svg" alt="" /><img src="/landing-windows.svg" alt="" /></span>}
  </MenuTrigger><MenuContent align="end" sideOffset={8} className="landing-download-menu">{downloadItems.map((item) => <MenuItem key={item.id} render={<a href={item.href} className="landing-download-item" />}><img src={item.imageSrc} alt="" /><span>{item.support}</span></MenuItem>)}</MenuContent></Menu>
}

/** The inline Features/Pricing/FAQ links are hidden below 900px, so the same destinations
 *  move into this menu rather than being unreachable from a phone. */
function NavLinksMenu() {
  const navigate = useNavigate()
  return <Menu><MenuTrigger render={<button className="landing-nav-menu" aria-label="Open menu" />}><MenuIcon aria-hidden="true" /></MenuTrigger><MenuContent align="end" className="landing-download-menu">
    <MenuItem className="landing-download-item"><a href="#features">Features</a></MenuItem>
    <MenuItem className="landing-download-item" onClick={() => navigate('/pricing')}>Pricing</MenuItem>
    <MenuItem className="landing-download-item"><a href="#faq">FAQ</a></MenuItem>
  </MenuContent></Menu>
}

function LandingNav() {
  const navigate = useNavigate()
  return <nav className="landing-nav" aria-label="Main navigation"><img src="/landing-logo.svg" alt="Jobwhisper" className="landing-nav-logo" /><div className="landing-nav-links"><a href="#features">Features <ChevronDown aria-hidden="true" /></a><button onClick={() => navigate('/pricing')}>Pricing</button><a href="#faq">FAQ</a></div><div className="landing-nav-actions"><button className="landing-login" onClick={() => navigate('/v3/auth/sign-in')}>Log in</button><DownloadMenu compact /><NavLinksMenu /></div></nav>
}

function Hero() {
  const navigate = useNavigate()
  return <section className="landing-hero"><LandingNav /><div className="landing-hero-copy"><h1>Pass Your <span>Next Interview.</span><br />Land the Job. Or Don’t Pay!</h1><p>JobWhisper Copilot listens to every interview question and instantly gives you a tailored answer using your resume and the job description, so you always know what to say. No guessing. No delay. No memorizing scripts. No freezing under pressure.</p><div className="landing-hero-actions"><DownloadMenu /><button className="landing-secondary-button" onClick={() => navigate('/v3/auth/create-account')}>Get Started <ArrowUpRight aria-hidden="true" /></button></div><div className="landing-hero-notes"><span><img src="/figma-landing/free-credits-gift.svg" alt="" />Includes free credits</span><b aria-hidden="true">·</b><span><img src="/figma-landing/no-card.svg" alt="" />No card required</span></div></div></section>
}

function Demo() {
  const navigate = useNavigate()
  return <section className="landing-demo" aria-label="Jobwhisper live copilot demo"><video src="/landing-demo.mp4" autoPlay muted loop playsInline /><div className="landing-demo-fade" /><button onClick={() => navigate('/pricing')}>Get Started <ChevronRight aria-hidden="true" /></button><p>Land the role, or pay nothing</p></section>
}

function MomentCards() {
  return <section className="landing-moments" id="features"><h2>Built for the moment that matters.</h2><div><article><p>Built with <strong>Real-time answers.</strong> Say them in your own words.</p><Plus aria-hidden="true" /></article><article><p><strong>Personalized to your resume,</strong> grounded in your experience.</p><Plus aria-hidden="true" /></article><article><p><strong>Built around the job you want.</strong> Get closer to the offer.</p><Plus aria-hidden="true" /></article></div></section>
}

function JourneyPreview({ active }: { readonly active: number }) {
  const images = ['/figma-landing/journey-resume.png', '/figma-landing/journey-jobs.png', '/figma-landing/journey-copilot.png', '/figma-landing/journey-simulator.png', '/figma-landing/journey-meeting.png', '/figma-landing/journey-coding.png']
  const labels = ['AI Resume Builder preview', 'AI Job Application preview', 'Interview Copilot preview', 'Interview Prep preview', 'Meeting Copilot preview', 'Coding Interview preview']
  return <div className="journey-product">{images.map((image, index) => <img key={image} src={image} alt={index === active ? labels[index] : ''} data-active={index === active} aria-hidden={index === active ? undefined : true} />)}</div>
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
  const [displayValue, setDisplayValue] = useState(0)

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

function Journey() {
  const [active, setActive] = useState(0)
  const navRef = useRef<HTMLDivElement>(null)
  const cycleFeature = (direction: -1 | 1) => setActive((current) => (current + direction + JOURNEY.length) % JOURNEY.length)

  // Where the stages are a horizontal row (mobile), keep the open card in view when it is
  // opened from the next control rather than by tapping. The overflow check keeps this off
  // the desktop column, which does not scroll sideways.
  useEffect(() => {
    const nav = navRef.current
    if (!nav || nav.scrollWidth <= nav.clientWidth) return
    const item = nav.children[active]
    if (item instanceof HTMLElement) item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [active])

  return <section className="landing-journey"><div className="landing-section-intro"><p>Your entire job search</p><h2>Start to finish.</h2><JourneyRevealText /></div><div className="landing-journey-viewer"><div className="landing-journey-controls"><button aria-label="Previous feature" onClick={() => cycleFeature(-1)}><ChevronUp aria-hidden="true" /></button><button aria-label="Next feature" onClick={() => cycleFeature(1)}><ChevronDown aria-hidden="true" /></button></div><div className="landing-journey-nav" ref={navRef} aria-label="Job search stages">{JOURNEY.map(([title, description], index) => <div className="landing-journey-item" key={title}><button aria-expanded={active === index} aria-controls={`journey-description-${index}`} onClick={() => setActive(index)}><Plus aria-hidden="true" />{title}</button><div className="landing-journey-description-shell" data-open={active === index}><div className="landing-journey-description" id={`journey-description-${index}`} role="region" aria-label={`${title} details`} aria-hidden={active !== index}><strong className="landing-journey-description-title">{title}.</strong> {description}</div></div></div>)}</div><div className="landing-journey-stage" role="region" aria-label={`${JOURNEY[active][0]} preview`}><JourneyPreview active={active} /></div></div></section>
}

function ProductFacts() {
  const [copyRevealed, setCopyRevealed] = useState(false)
  return <section className="landing-facts"><ScrollRevealText segments={FACTS_COPY} className="landing-facts-reveal" onComplete={() => setCopyRevealed(true)} /><div className="landing-facts-grid"><div className="landing-stat landing-stat-minutes"><span>Up to</span><CountUp value={4000} enabled={copyRevealed} /><span>minutes Included</span></div><div className="landing-fact-copy"><div><strong>Multiple AI models</strong><span>Choose the model that fits the conversation.</span><ul><li>OpenAI — GPT-5.6 Sol</li><li>Anthropic — Claude Sonnet 5</li><li>Google — Gemini 3.8 Flash</li><li>Kimi — Kimi K3</li><li>Qwen — Qwen3.8 Max</li></ul><span>Switch models depending on the interview, question, or task.</span></div><div><strong>Personalized context</strong><span>Your resume<br />Your job description<br />Upload multiple knowledge base</span></div><div><strong>Simple setup</strong><span>Add your context<br />Choose your preferences<br />Start your Copilot</span></div></div><div className="landing-stat landing-stat-price"><span>Starting from</span><CountUp value={0.1} decimals={2} prefix="$" enabled={copyRevealed} /><span>per minutes</span></div></div></section>
}

function Testimonial() {
  return <section className="landing-testimonial"><div className="landing-testimonial-media"><img src="/figma-landing/testimonial-photo.png" alt="Jay holding a phone" /><button aria-label="Play Jay’s story"><Play aria-hidden="true" /></button></div><blockquote>Nothing lives rent-free in your mind quite like an interview that went horribly wrong<footer><strong>Jay</strong><span>Project Manager</span></footer></blockquote></section>
}

const COPILOT_TABS = ['Interviews', 'Meetings', 'Coding', 'Practice'] as const
const COPILOT_IMAGES: Record<(typeof COPILOT_TABS)[number], string> = {
  Interviews: '/figma-landing/copilot-interviews.png',
  Meetings: '/figma-landing/copilot-meetings.png',
  Coding: '/figma-landing/copilot-coding.png',
  Practice: '/figma-landing/copilot-practice.png',
}
function CopilotShowcase() {
  const [activeTab, setActiveTab] = useState<(typeof COPILOT_TABS)[number]>('Interviews')
  return <section className="landing-copilot"><div className="landing-section-intro"><h2>Your copilot.<br />Always within reach.</h2><p>Jobwhisper gives you real-time AI support while the conversation is happening, so you can focus on the person in front of you instead of scrambling for what to say next. Whether you’re answering an interview question, working through a coding challenge, leading an important meeting, or practicing before the real thing, your Copilot listens, understands the context, and helps you respond with confidence.</p></div><div className="landing-copilot-tabs" role="tablist" aria-label="Copilot use cases">{COPILOT_TABS.map((tab) => <button key={tab} role="tab" aria-selected={activeTab === tab} aria-controls="copilot-preview" onClick={() => setActiveTab(tab)}>{tab}</button>)}</div><div className="landing-copilot-image" id="copilot-preview" role="tabpanel"><img src={COPILOT_IMAGES[activeTab]} alt={`Jobwhisper ${activeTab.toLowerCase()} copilot desktop preview`} /></div></section>
}

function PlatformCards() {
  const scroll = (direction: number) => document.getElementById('landing-platform-scroller')?.scrollBy({ left: direction * 392, behavior: 'smooth' })
  return <section className="landing-platforms"><h2>Jobwhisper,<br />wherever you need it.</h2><div className="landing-platform-scroller" id="landing-platform-scroller">{PLATFORMS.map((platform, index) => <article key={platform.label} data-platform={index}><div className="landing-platform-copy"><span>{platform.label}</span><h3>{platform.title}</h3><p>{platform.body}</p>{'href' in platform ? <a className="landing-platform-action" href={platform.href}>{platform.action}</a> : <span className="landing-platform-action landing-platform-coming">{platform.action}</span>}</div><img src={platform.image} alt="" /><span className="landing-platform-card-control" aria-hidden="true">{platform.icon === 'arrow' ? <ChevronRight /> : <Plus />}</span>{'href' in platform && <a className="landing-platform-card-link" href={platform.href} aria-label={`${platform.action.replace(' →', '')}: ${platform.label}`} />}</article>)}</div><div className="landing-scroll-controls"><button aria-label="Previous platform" onClick={() => scroll(-1)}><ChevronLeft /></button><button aria-label="Next platform" onClick={() => scroll(1)}><ChevronRight /></button></div></section>
}

function ServiceChoice() {
  const navigate = useNavigate()
  return <section className="landing-service-choice"><article><div className="landing-service-copy"><span>Do yourself</span><h2>We find you<br />Apply yourself.</h2><button className="landing-service-pricing" onClick={() => navigate('/pricing')}>View Pricing <ChevronRight aria-hidden="true" /></button></div><div className="landing-service-image"><img src="/figma-landing/service-self.png" alt="Job seeker using Jobwhisper self-service" /></div></article><article><div className="landing-service-copy"><span>Done for you</span><h2>Our success manager supports your search.</h2><div className="landing-service-actions"><button className="landing-service-start" onClick={() => navigate('/v3/done-for-you')}>Get Started</button><button className="landing-service-pricing" onClick={() => navigate('/pricing')}>View Pricing <ChevronRight aria-hidden="true" /></button></div></div><div className="landing-service-image"><img src="/figma-landing/service-managed.png" alt="Jobwhisper success manager" /></div></article></section>
}

function Faq() {
  return <section className="landing-faq" id="faq"><h2>Frequently asked questions</h2><Accordion className="landing-faq-list">{FAQS.map(([question, answer], index) => <AccordionItem key={question} value={String(index)}><AccordionHeader><AccordionTrigger>{question}</AccordionTrigger></AccordionHeader><AccordionPanel>{answer}</AccordionPanel></AccordionItem>)}</Accordion></section>
}

function Closing() {
  return <section className="landing-closing"><span>Your next role</span><h2>Ready when you are.<br />Let’s get you hired.</h2><p>Your next opportunity could start with a better resume, the right application, stronger preparation, or simply knowing what to say when the interview begins. <strong>Jobwhisper brings it all together,</strong> helping you find the right roles, prepare for the moments that matter, and show up with support when it counts. You’ve done the hard part getting this far. Now let’s help you turn the next opportunity into an offer.</p></section>
}

function Footer() {
  const links = (items: readonly string[]) => items.map((item) => <a href="#" key={item}>{item}</a>)
  return <footer className="landing-footer">
    <div className="landing-footer-inner">
      <div className="landing-footer-brand">
        <img className="landing-footer-logo" src="/figma-landing/footer-logo.svg" alt="Jobwhisper" />
        <p>From job search to job offer, with the right support at every step.</p>
      </div>
      <nav className="landing-footer-links" aria-label="Footer navigation">
        <div className="landing-footer-column">{links(['Features', 'Pricing', 'FAQ', 'Download'])}</div>
        <div className="landing-footer-column">{links(['Contact', 'Help center', 'Careers', 'LinkedIn'])}</div>
      </nav>
      <div className="landing-footer-meta">
        <span>© Jobwhisper 2026</span>
        <div><a href="#">Privacy policy</a><a href="#">Terms</a></div>
      </div>
    </div>
  </footer>
}

export function LandingPage() {
  return <main className="figma-landing-page"><Hero /><Demo /><MomentCards /><Journey /><ProductFacts /><Testimonial /><CopilotShowcase /><PlatformCards /><ServiceChoice /><Faq /><Closing /><Footer /></main>
}
