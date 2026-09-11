import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, ChevronDown, Check, Bot, FileText, Code2, Headphones, Wallet, LayoutGrid } from 'lucide-react'
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger, JobwhisperIcon } from '@/ui'
import { useInView } from '@/hooks/useInView'
import { DemoModal } from './demo-modal'

const MOBILE_QUERY = '(max-width: 639px)'

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches)

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY)
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return isMobile
}

function RevealOnScroll({
  children,
  delayMs = 0,
  className = '',
}: {
  readonly children: ReactNode
  readonly delayMs?: number
  readonly className?: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`${inView ? 'animate-ease-in-bottom' : 'opacity-0'} ${className}`}
      style={inView ? { animationDelay: `${delayMs}ms`, animationFillMode: 'backwards' } : undefined}
    >
      {children}
    </div>
  )
}

const FEATURES = [
  {
    Icon: Bot,
    title: 'Auto Apply AI Agents',
    subtitle: 'Apply to hundreds of jobs while you sleep',
    description:
      'Our agents browse job boards, match your profile to open roles, and submit tailored applications on your behalf, 24/7, no manual effort required.',
    href: '/v3/auto-apply',
  },
  {
    Icon: FileText,
    title: 'AI Resume Builders',
    subtitle: 'Tailored for every role, in seconds',
    description:
      'Paste a job description and get a resume instantly rewritten to match, right keywords, right achievements, right format, every time.',
    href: '/v3/resume',
  },
  {
    Icon: Code2,
    title: 'Coding Copilot',
    subtitle: 'Real-time help during technical screens',
    description:
      'Whispers hints, patterns, and solutions as the interviewer talks. Stay sharp and confident through any coding challenge, completely live.',
    href: '#',
  },
  {
    Icon: Headphones,
    title: 'Meeting Copilots',
    subtitle: 'Live AI support in any video call',
    description:
      'Get real-time talking points, answers, and context surfaced during interviews or meetings, without the other side ever knowing.',
    href: '#',
  },
  {
    Icon: Wallet,
    title: 'Top Up credits anytime',
    subtitle: 'Pay only for what you use',
    description:
      'No subscriptions or surprise charges. Buy credits to power any Jobwhisper feature and use them at your own pace, whenever you need them.',
    href: '/v3/billing',
  },
  {
    Icon: LayoutGrid,
    title: 'Other Applications',
    subtitle: 'Desktop, mobile, and browser',
    description:
      'Take Jobwhisper everywhere, available as a Chrome extension, a macOS or Windows desktop app, and a mobile app on iOS and Android.',
    href: '#',
  },
]

const FEATURE_CARD_STYLES = [
  { bg: 'bg-white', text: 'text-black' },
  { bg: 'bg-[#E4ECFF]', text: 'text-black' },
  { bg: 'bg-landing-nav', text: 'text-white' },
]

const FAQS = [
  {
    question: 'What is Jobwhisper?',
    answer:
      'Jobwhisper is an AI interview copilot. Rehearse against a role-aware AI before the interview, then bring a live copilot into the actual conversation for real-time talking points and answers.',
  },
  {
    question: 'How does the live copilot work during an interview?',
    answer:
      'Jobwhisper listens in alongside you, over screen share or your microphone, and surfaces suggested talking points and answers on your screen as the conversation happens, without the other side ever knowing.',
  },
  {
    question: 'What do I need to use Jobwhisper?',
    answer:
      'Just a Jobwhisper account and either the desktop app or the Chrome extension. No special hardware, it works with whatever video call or in-person setup you already use.',
  },
  {
    question: 'Is my interview data kept private?',
    answer:
      "Yes. Your resumes, transcripts, and session recordings are only visible to you, and you can delete them at any time from your account. We don't share your data with employers or third parties.",
  },
  {
    question: 'Can I review past interview sessions?',
    answer:
      'Every session is saved to your history with a summary, talk-time breakdown, and what went well or needs work, so you can review and improve before your next interview.',
  },
  {
    question: 'Does it work for coding interviews and meetings too?',
    answer:
      'Yes, Coding Copilot gives real-time hints during technical screens, and Meeting Copilot brings the same live support to client calls and stakeholder meetings, not just interviews.',
  },
  {
    question: 'What happens if I run out of credits mid-session?',
    answer:
      "You'll get a low-balance warning first, and can top up without losing your place, your session resumes right where you left off once you add more credits.",
  },
]

const TIMELINE_STAGES = [
  {
    label: 'Today',
    title: 'Get interview-ready',
    items: [
      'Upload your resume and get instant feedback on gaps',
      'Run your first AI mock interview, role-aware from question one',
      'See exactly what to work on before you walk in',
    ],
  },
  {
    label: 'Before the call',
    title: "Rehearse until it's natural",
    items: [
      'Practice the questions your specific role gets asked',
      'Get real answers scored against what strong candidates say',
      'Walk in knowing your story, not reciting it',
    ],
  },
  {
    label: 'The real interview',
    title: 'Never freeze up again',
    items: [
      'The live copilot listens in and feeds you talking points',
      "Real-time answers to questions you didn't prep for",
      'Invisible to everyone else on the call',
    ],
  },
  {
    label: 'After the call',
    title: 'Walk into round two stronger',
    items: [
      'Every session saved with a summary and talk-time breakdown',
      "See exactly what went well and what didn't, no guessing",
      'Only spend credits on the sessions you actually run',
    ],
  },
]

function LandingNav() {
  const navigate = useNavigate()
  return (
    <nav className="fixed top-4 sm:top-9 left-0 right-0 z-50 flex justify-center px-4">
      <div className="flex items-center h-[54px] bg-landing-nav rounded-[22px] pl-4 pr-2 shadow-[0px_2px_40px_rgba(0,0,0,0.25)] w-full max-w-fit">
        <img src="/landing-logo.svg" alt="Jobwhisper" className="h-6 w-auto" />

        <div className="hidden md:flex items-center gap-5 ml-10">
          <button className="flex items-center gap-1.5 text-white/60 text-base font-medium tracking-[-0.3px] leading-6 hover:text-white transition-colors">
            Features
            <ChevronDown size={10} className="mt-px" />
          </button>
          <button className="text-white/60 text-base font-medium tracking-[-0.3px] leading-6 hover:text-white transition-colors">
            Pricing
          </button>
          <a
            href="#faq"
            className="text-white/60 text-base font-medium tracking-[-0.3px] leading-6 hover:text-white transition-colors"
          >
            FAQ
          </a>
        </div>

        <div className="flex items-center gap-3.5 ml-4 md:ml-14">
          <button
            onClick={() => navigate('/v3/auth/sign-in')}
            className="hidden sm:block text-white/60 text-base font-medium tracking-[-0.3px] leading-6 hover:text-white transition-colors"
          >
            Log in
          </button>
          <button className="flex items-center gap-1.5 bg-landing-bg rounded-[16px] px-4 h-[42px] overflow-hidden">
            <img src="/landing-logo-icon.svg" alt="" className="h-[18px] w-4 object-contain" />
            <span className="text-white text-base font-medium tracking-[-0.3px] leading-6">Download</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

function LandingHero() {
  const navigate = useNavigate()
  return (
    <section className="px-4 sm:px-8 lg:px-[113px] pt-[140px] sm:pt-[180px] lg:pt-[220px] pb-0">
      <div className="flex flex-col gap-6 lg:gap-8 max-w-[813px]">
        <h1
          className="text-white font-normal font-gowun"
          style={{ fontSize: 'clamp(40px, 6vw, 70.732px)', lineHeight: '1.112', letterSpacing: '-0.05em' }}
        >
          Never leave an interview wishing you'd said something different.
        </h1>
        <p
          className="text-white font-normal max-w-[504px]"
          style={{ fontSize: 'clamp(16px, 2vw, 24px)', letterSpacing: '-0.02em' }}
        >
          Rehearse against a role-aware AI, then bring a live copilot into the actual conversation.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 bg-landing-btn rounded-[10px] h-12 px-8 text-white text-lg font-semibold whitespace-nowrap">
            Download Now
            <span className="flex items-center gap-1.5">
              <img src="/landing-apple.svg" alt="Apple" className="h-4 w-4" />
              <img src="/landing-windows.svg" alt="Windows" className="h-4 w-4" />
            </span>
          </button>
          <button
            onClick={() => navigate('/v3/auth/choose-plan')}
            className="flex items-center gap-2 bg-white rounded-[10px] h-12 px-8 text-landing-btn-text text-lg font-semibold whitespace-nowrap hover:bg-white/90 transition-colors"
          >
            See Pricing
            <img src="/landing-arrow.svg" alt="" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

function LandingDemo({ onOpenDemo }: { readonly onOpenDemo: () => void }) {
  const isMobile = useIsMobileViewport()

  return (
    <section
      onClick={isMobile ? undefined : onOpenDemo}
      onKeyDown={
        isMobile
          ? undefined
          : (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onOpenDemo()
              }
            }
      }
      role={isMobile ? undefined : 'button'}
      tabIndex={isMobile ? undefined : 0}
      aria-label={isMobile ? undefined : 'Open the interactive Jobwhisper demo'}
      className={`group relative mt-16 sm:mt-24 lg:mt-[160px] mx-4 sm:mx-8 lg:mx-[113px] aspect-[1728/1080] rounded-xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${isMobile ? '' : 'cursor-pointer'}`}
    >
      <video
        src="/MacBook-Pro-14-25.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
      {isMobile ? null : (
        <>
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
          <div className="absolute bottom-0 left-0 right-0 h-[540px] bg-gradient-to-b from-transparent to-landing-bg" />
          <div className="absolute bottom-[70px] left-0 right-0 flex flex-col items-center">
            <span className="flex items-center gap-2 rounded-full bg-white h-10 px-4 border border-transparent transition-colors group-hover:bg-white/90">
              <Play size={14} fill="black" className="text-black" />
              <span className="text-black text-sm font-normal leading-5 tracking-[-0.13px]">Start demo</span>
            </span>
          </div>
        </>
      )}
    </section>
  )
}

function LandingTimeline() {
  return (
    <section className="px-4 sm:px-8 lg:px-[113px] pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-24">
      <div className="flex flex-col items-center text-center gap-4">
        <h2
          className="text-white font-normal font-gowun max-w-[700px]"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: '1.2', letterSpacing: '-0.02em' }}
        >
          Every stage of the interview, covered.
        </h2>
      </div>

      <div className="mt-12 sm:mt-16 hidden md:grid md:grid-cols-4 md:gap-2">
        {TIMELINE_STAGES.map((stage, index) => {
          const isLast = index === TIMELINE_STAGES.length - 1
          return (
            <div key={stage.label} className="flex flex-col items-center gap-3">
              <span
                className={`shrink-0 rounded-lg border px-4 h-9 inline-flex items-center text-sm font-medium whitespace-nowrap ${
                  isLast ? 'border-white bg-white text-landing-btn-text' : 'border-white/15 text-white/70'
                }`}
              >
                {stage.label}
              </span>
              <span className="relative flex h-2.5 w-full items-center justify-center">
                {index !== 0 ? (
                  <span className="absolute right-1/2 h-px w-full bg-white/15" aria-hidden="true" />
                ) : null}
                {!isLast ? (
                  <span className="absolute left-1/2 h-px w-full bg-white/15" aria-hidden="true" />
                ) : null}
                <span
                  className={`relative z-10 size-2.5 rounded-full ${
                    isLast ? 'bg-white' : 'border border-white/30 bg-landing-bg'
                  }`}
                />
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TIMELINE_STAGES.map((stage, index) => {
          const isLast = index === TIMELINE_STAGES.length - 1
          return (
            <RevealOnScroll key={stage.title} delayMs={index * 90} className="h-full">
              <div
                className={`h-full rounded-xl p-6 transition-all duration-300 ease-out hover:-translate-y-1 ${
                  isLast ? 'bg-white hover:shadow-xl' : 'bg-white/[0.06] hover:bg-white/[0.1]'
                }`}
              >
                <p className={`text-xs font-semibold uppercase tracking-[0.06em] mb-2 md:hidden ${isLast ? 'text-landing-btn-text' : 'text-white/50'}`}>
                  {stage.label}
                </p>
                <p className={`font-semibold text-base mb-4 ${isLast ? 'text-landing-btn-text' : 'text-white'}`}>
                  {stage.title}
                </p>
                <ul className="flex flex-col gap-3">
                  {stage.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check
                        size={16}
                        className={`shrink-0 mt-0.5 ${isLast ? 'text-landing-btn-text' : 'text-white/50'}`}
                      />
                      <span className={`text-sm leading-[1.5] ${isLast ? 'text-landing-ink' : 'text-white/70'}`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          )
        })}
      </div>
    </section>
  )
}

function LandingFeatures() {
  const navigate = useNavigate()
  return (
    <section className="flex flex-col items-center gap-4 sm:gap-8 px-4 sm:px-8 lg:px-[113px] pt-16 sm:pt-24 pb-20 sm:pb-32">
      <div className="w-full">
        <p
          className="text-white font-normal font-gowun text-center"
          style={{ fontSize: '28px', lineHeight: '36px', letterSpacing: '-0.84px' }}
        >
          More ways Jobwhisper helps
        </p>
      </div>

      <div className="w-full max-w-[340px] mx-auto">
        {FEATURES.map((feature, index) => {
          const style = FEATURE_CARD_STYLES[index % FEATURE_CARD_STYLES.length]
          const rotate = index % 2 === 0 ? '-rotate-3' : 'rotate-3'
          return (
            <div key={feature.title} className="sticky top-24 sm:top-28 pb-2" style={{ zIndex: index + 1 }}>
              <a
                href={feature.href}
                className={`flex flex-col rounded-lg p-8 sm:p-10 min-h-[420px] sm:min-h-[460px] shadow-2xl no-underline transition-transform duration-300 ease-out hover:scale-[1.02] ${style.bg} ${rotate} hover:rotate-0`}
              >
                <feature.Icon aria-hidden="true" strokeWidth={1.25} className={`size-11 opacity-80 ${style.text}`} />
                <div className="mt-auto">
                  <p className={`font-gowun font-normal text-4xl mb-3 ${style.text}`}>{feature.title}</p>
                  <p className={`text-base opacity-70 mb-2 ${style.text}`}>{feature.subtitle}</p>
                  <p className={`text-sm opacity-50 ${style.text}`}>{feature.description}</p>
                </div>
              </a>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => navigate('/v3/auth/choose-plan')}
        className="flex items-center gap-2 bg-white rounded-[10px] h-12 px-8 text-landing-btn-text text-lg font-semibold whitespace-nowrap hover:bg-white/90 transition-colors"
      >
        See Pricing
        <img src="/landing-arrow.svg" alt="" className="h-4 w-4" />
      </button>
    </section>
  )
}

function LandingFAQ() {
  return (
    <section id="faq" className="bg-landing-footer-frame px-4 sm:px-8 lg:px-[113px] pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <h2
          className="text-white font-normal font-gowun"
          style={{ fontSize: 'clamp(32px, 4vw, 44px)', lineHeight: '1.15', letterSpacing: '-0.02em' }}
        >
          Frequently
          <br />
          asked questions.
        </h2>

        <Accordion className="w-full">
          {FAQS.map((faq, index) => (
            <AccordionItem key={faq.question} value={String(index)} className="border-b border-white/10">
              <AccordionHeader>
                <AccordionTrigger className="text-white text-base sm:text-lg font-medium tracking-[-0.16px] hover:text-white/80 [&>svg]:text-white/50">
                  {faq.question}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel className="text-white/60 text-sm sm:text-base leading-6">{faq.answer}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

function LandingFooter() {
  return (
    <footer className="bg-landing-footer-frame px-4 sm:px-8 lg:px-[113px] pb-12 sm:pb-16">
      <div className="flex flex-col items-center gap-6 text-center">
        <span className="grid size-12 place-items-center rounded-2xl border border-white/10">
          <JobwhisperIcon className="size-5 text-white" />
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-white/60 text-sm">
          <span>© 2026 Jobwhisper.ai</span>
          <span aria-hidden="true">·</span>
          <button className="hover:text-white transition-colors">Download</button>
          <span aria-hidden="true">·</span>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <span aria-hidden="true">·</span>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}

export function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <div className="min-h-screen bg-landing-bg font-rethink">
      {demoOpen ? null : <LandingNav />}
      <LandingHero />
      <LandingDemo onOpenDemo={() => setDemoOpen(true)} />
      <LandingTimeline />
      <LandingFeatures />
      <LandingFAQ />
      <LandingFooter />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  )
}
