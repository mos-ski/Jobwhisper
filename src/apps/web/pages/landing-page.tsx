import { useState } from 'react'
import { ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, Mic, Play, Plus, Search, Send, SlidersHorizontal, Video } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger, Menu, MenuContent, MenuItem, MenuTrigger } from '@/ui'
import { downloadItems } from '@/mocks/account'
import './landing-page.css'

const JOURNEY = [
  ['AI Resume Builder', 'Start with a resume built for the job you want. Tell us the role you are going after. Jobwhisper helps you build or tailor your resume around it, highlighting the experience and skills that matter most.'],
  ['AI Job Application', 'Find roles that match your experience, compare fit at a glance, and move the applications you choose into one focused workflow.'],
  ['Interview Copilot', 'Bring real-time, resume-aware answers into the live conversation, privately and exactly when you need them.'],
  ['Interview Prep', 'Practice realistic questions with an AI interviewer before the real conversation begins.'],
] as const

const PLATFORMS = [
  ['Desktop App', 'Stealth. Completely Undetectable', 'Take Jobwhisper into interviews, coding sessions and meetings with our desktop app, including Stealth Mode for a private, distraction-free Copilot experience.', '/v3/downloads', 'Download now', '/landing-feature-autoapply.svg'],
  ['Browser Extension', 'Turn job boards into your job-search workspace.', 'Find and apply to roles directly across supported job sites, with Jobwhisper helping automate the repetitive parts of applying.', '/v3/downloads', 'Download from store', '/landing-feature-other.svg'],
  ['Mobile App', 'Your job search on the go.', 'Keep Jobwhisper close for job search, preparation and career support right from your phone.', '#', 'Coming soon', '/landing-feature-coding.svg'],
  ['Done For You', 'Or let a real person handle the search.', 'Our team can find relevant roles, tailor your resume and apply for you, with a dedicated success manager supporting your search.', '/v3/done-for-you', 'Explore Done For You', '/landing-feature-meeting.svg'],
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

function LandingNav() {
  const navigate = useNavigate()
  return <nav className="landing-nav" aria-label="Main navigation"><img src="/landing-logo.svg" alt="Jobwhisper" className="landing-nav-logo" /><div className="landing-nav-links"><a href="#features">Features <ChevronDown aria-hidden="true" /></a><button onClick={() => navigate('/pricing')}>Pricing</button><a href="#faq">FAQ</a></div><div className="landing-nav-actions"><button className="landing-login" onClick={() => navigate('/v3/auth/sign-in')}>Log in</button><DownloadMenu compact /></div></nav>
}

function Hero() {
  const navigate = useNavigate()
  return <section className="landing-hero"><LandingNav /><div className="landing-hero-copy"><h1>Pass Your <span>Next Interview.</span><br />Land the Job. Or Don’t Pay!</h1><p>JobWhisper Copilot listens to every interview question and instantly gives you a tailored answer using your resume and the job description, so you always know what to say. No guessing. No delay. No memorizing scripts. No freezing under pressure.</p><div className="landing-hero-actions"><DownloadMenu /><button className="landing-secondary-button" onClick={() => navigate('/v3/auth/create-account')}>Get Started <ArrowUpRight aria-hidden="true" /></button></div><div className="landing-hero-notes"><span><Check aria-hidden="true" />Includes free credits</span><span>No card required</span></div></div></section>
}

function Demo() {
  const navigate = useNavigate()
  return <section className="landing-demo" aria-label="Jobwhisper live copilot demo"><video src="/landing-demo.mp4" autoPlay muted loop playsInline /><div className="landing-demo-fade" /><button onClick={() => navigate('/pricing')}><Play aria-hidden="true" />Start demo</button><p>Land the role, or pay nothing</p></section>
}

function MomentCards() {
  return <section className="landing-moments" id="features"><h2>Built for the moment that matters.</h2><div><article><p>Built with <strong>Real-time answers.</strong> Say them in your own words.</p><Plus aria-hidden="true" /></article><article><p><strong>Personalized to your resume,</strong> grounded in your experience.</p><Plus aria-hidden="true" /></article><article><p><strong>Built around the job you want.</strong> Get closer to the offer.</p><Plus aria-hidden="true" /></article></div></section>
}

function JourneyPreview({ active }: { readonly active: number }) {
  if (active === 1) return <div className="journey-product journey-jobs"><div className="journey-toolbar"><span><Search />Search by title or company</span><button><SlidersHorizontal />Filter</button></div><aside><strong>Apply with our Auto Apply Extension</strong><p>Apply directly from LinkedIn, Glassdoor, Indeed, and Workable.</p><a href="/v3/downloads">Download ↗</a></aside><div className="journey-job-list">{[['FI','Immigration Program Manager','Figma','65% MATCH'],['CA','Senior Product Manager','Canva','91% MATCH'],['NO','Product Operations Lead','Notion','84% MATCH'],['LI','Program Manager','Linear','78% MATCH']].map(([mark,role,company,match]) => <article key={role}><b>{mark}</b><span><strong>{role}</strong><small>{company} · Remote</small></span><em>{match}</em></article>)}</div></div>
  if (active === 2) return <div className="journey-product journey-live"><header><strong>Senior Product Manager · GitLab</strong><span>08:21</span><button>End Session</button></header><div className="journey-status"><span>▮▮▮▮ Connected</span><em>Listening</em></div><h3>Live Response <i /></h3><div className="journey-transcript"><article><small>Interviewer</small><p>Let’s simulate pressure. Here’s the first one.</p></article><article><small>Interviewer</small><p>Describe a program you’ve had that was failing.</p></article><article className="answer"><small>Jobwhisper</small><p>I inherited a rollout that was two quarters behind. In the first 72 hours, I rebuilt the risk map, aligned owners, and reset the launch plan around measurable milestones.</p></article></div><footer><Mic /><span>Ask Jobwhisper anything…</span><Send /></footer></div>
  if (active === 3) return <div className="journey-product journey-simulator"><header><strong>Live Simulator</strong><i /></header><div className="journey-people"><figure><div className="journey-person journey-interviewer"><Video /></div><figcaption><strong>Zahra Christensen</strong><span>Backend Developer</span></figcaption></figure><figure><div className="journey-person journey-candidate"><Mic /></div><figcaption><strong>You</strong><span>Candidate</span></figcaption></figure></div><div className="journey-question"><small>Interview question</small><p>Tell me about a time you changed direction after receiving difficult feedback.</p></div></div>
  return <div className="journey-product journey-resume"><div className="journey-chat-user">Put the bullets on my “Lightforth Technologies” role into the present tense — for example “Developed” becomes “Develop”.</div><div className="journey-chat-ai">I propose updating the bullet points under the “Lightforth Technologies” role to present tense as requested. This change reflects your current responsibilities more accurately since the role is ongoing.</div><div className="journey-chat-actions"><button>Reject All</button><button>Accept All</button></div><div className="journey-chat-input">Message Jobwhisper AI… <Send /></div></div>
}

function Journey() {
  const [active, setActive] = useState(0)
  return <section className="landing-journey"><div className="landing-section-intro"><p>Your entire job search</p><h2>Start to finish.</h2><p>Jobwhisper is built to help you through every stage of <strong>landing your next role.</strong> Start by creating or <strong>tailoring a resume</strong> for the job you want. Let Auto Apply find <strong>relevant opportunities</strong> without spending hours searching job boards. Prepare for the interview with realistic <strong>AI simulations</strong>, then take <strong>Interview Copilot</strong> with you when it is time for the real conversation.</p></div><div className="landing-journey-viewer"><div className="landing-journey-nav" role="tablist" aria-label="Job search stages">{JOURNEY.map(([title], index) => <button key={title} role="tab" aria-selected={active === index} aria-controls="journey-panel" onClick={() => setActive(index)}><Plus aria-hidden="true" />{title}</button>)}<div className="landing-journey-description">{JOURNEY[active][1]}</div></div><div className="landing-journey-stage" id="journey-panel" role="tabpanel"><JourneyPreview active={active} /></div></div></section>
}

function ProductFacts() {
  return <section className="landing-facts"><p>Meet the <strong>AI copilot built for the moments when the right answer matters.</strong> Jobwhisper combines leading AI models with your resume, job description and personal context to give you relevant answers in real time. Setup takes just a few steps, and once you are ready, your Copilot stays with you across interviews, coding sessions, meetings and practice.</p><div className="landing-facts-grid"><div className="landing-stat"><span>Up to</span><strong>4,000</strong><span>minutes included</span></div><div className="landing-fact-copy"><strong>Multiple AI models</strong><span>Choose the model that fits the conversation, question, or task.</span><ul><li>OpenAI</li><li>Anthropic</li><li>Google</li><li>Kimi</li><li>Qwen</li></ul></div><div className="landing-stat"><span>Starting from</span><strong>$0.10</strong><span>per minute</span></div><div className="landing-fact-copy"><strong>Personalized context</strong><span>Your resume<br />Your job description<br />Multiple knowledge bases</span><strong>Simple setup</strong><span>Add your context<br />Choose your preferences<br />Start your Copilot</span></div></div></section>
}

function Testimonial() {
  return <section className="landing-testimonial"><div className="landing-testimonial-media"><img src="/figma-landing/testimonial-photo.png" alt="Jay holding a phone" /><span><Play aria-hidden="true" /></span></div><blockquote>Nothing lives rent-free in your mind quite like an interview that went horribly wrong<footer><strong>Jay</strong><span>Project Manager</span></footer></blockquote></section>
}

const COPILOT_TABS = ['Interviews', 'Meetings', 'Coding', 'Practice'] as const
function CopilotShowcase() {
  const [activeTab, setActiveTab] = useState<(typeof COPILOT_TABS)[number]>('Interviews')
  return <section className="landing-copilot"><div className="landing-section-intro"><h2>Your copilot.<br />Always within reach.</h2><p>Jobwhisper gives you real-time AI support while the conversation is happening, so you can focus on the person in front of you instead of scrambling for what to say next.</p></div><div className="landing-copilot-tabs" role="tablist" aria-label="Copilot use cases">{COPILOT_TABS.map((tab) => <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div><div className="landing-copilot-image"><img src="/figma-landing/copilot-window.png" alt={`Jobwhisper ${activeTab.toLowerCase()} copilot desktop preview`} /></div></section>
}

function PlatformCards() {
  const scroll = (direction: number) => document.getElementById('landing-platform-scroller')?.scrollBy({ left: direction * 392, behavior: 'smooth' })
  return <section className="landing-platforms"><h2>Jobwhisper,<br />wherever you need it.</h2><div className="landing-platform-scroller" id="landing-platform-scroller">{PLATFORMS.map(([label, title, body, href, action, image]) => <article key={label}><span>{label}</span><h3>{title}</h3><p>{body}</p><a href={href}>{action}</a><img src={image} alt="" /></article>)}</div><div className="landing-scroll-controls"><button aria-label="Previous platform" onClick={() => scroll(-1)}><ChevronLeft /></button><button aria-label="Next platform" onClick={() => scroll(1)}><ChevronRight /></button></div></section>
}

function ServiceChoice() {
  const navigate = useNavigate()
  return <section className="landing-service-choice"><article><span>Do yourself</span><h2>We find you<br />Apply yourself.</h2><button onClick={() => navigate('/pricing')}>View Pricing</button><img src="/figma-landing/self-serve-person.png" alt="Job seeker using Jobwhisper self-service" /></article><article><span>Done for you</span><h2>Our success manager supports your search.</h2><div><button onClick={() => navigate('/v3/done-for-you')}>Get Started</button><button onClick={() => navigate('/pricing')}>View Pricing</button></div><img src="/figma-landing/managed-person.png" alt="Jobwhisper success manager" /></article></section>
}

function Faq() {
  return <section className="landing-faq" id="faq"><h2>Frequently asked questions</h2><Accordion className="landing-faq-list">{FAQS.map(([question, answer], index) => <AccordionItem key={question} value={String(index)}><AccordionHeader><AccordionTrigger>{question}</AccordionTrigger></AccordionHeader><AccordionPanel>{answer}</AccordionPanel></AccordionItem>)}</Accordion></section>
}

function Closing() {
  return <section className="landing-closing"><span>Your next role</span><h2>Ready when you are.<br />Let’s get you hired.</h2><p>Your next opportunity could start with a better resume, the right application, stronger preparation, or simply knowing what to say when the interview begins. <strong>Jobwhisper brings it all together,</strong> helping you find the right roles, prepare for the moments that matter, and show up with support when it counts.</p></section>
}

function Footer() {
  return <footer className="landing-footer"><div><img src="/landing-logo.svg" alt="Jobwhisper" /><h2>From job search<br />to <span>job offer.</span></h2><p>© 2026 Jobwhisper</p></div><div><strong>Product</strong><a href="/v3/resume">Resume Builder</a><a href="/v3/auto-apply">Auto Apply</a><a href="/v3/interview-prep">Interview Prep</a><a href="/v3/copilot">Interview Copilot</a></div><div><strong>Company</strong><a href="/pricing">Pricing</a><a href="/help">Help Center</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div><div><strong>Download</strong><a href="/v3/downloads">Desktop App</a><a href="/v3/downloads">Browser Extension</a><a href="/v3/downloads">Mobile App</a></div></footer>
}

export function LandingPage() {
  return <main className="figma-landing-page"><Hero /><Demo /><MomentCards /><Journey /><ProductFacts /><Testimonial /><CopilotShowcase /><PlatformCards /><ServiceChoice /><Faq /><Closing /><Footer /></main>
}
