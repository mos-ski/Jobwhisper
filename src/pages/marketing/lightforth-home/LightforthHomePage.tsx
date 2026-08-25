import './lightforth-home.css'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaApple, FaWindows } from 'react-icons/fa'
import {
  ArrowUpRight,
  BarChart2,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  FileText,
  Mail,
  Menu,
  MonitorPlay,
  Power,
  Radar,
  Settings,
  Target,
  X,
} from 'lucide-react'

const navLinks = [
  { label: 'Solutions', href: '#solutions' },
  { label: 'Product', href: '#product' },
  { label: 'Resources', href: '#faq' },
  { label: 'Pricing', href: '/pricing' },
]

const supportCards = [
  {
    title: 'AI Resume Builder',
    text: 'A resume tailored to every role, built in minutes.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Auto-Apply',
    text: 'Applies to matching jobs for you, while you focus on prepping.',
    icon: FileText,
  },
  {
    title: 'ATS Checker',
    text: 'Get past the bots before you ever reach a human.',
    icon: Bot,
  },
  {
    title: 'AI Cover Letter',
    text: 'A tailored cover letter for every application, generated instantly.',
    icon: FileCheck2,
  },
  {
    title: 'Interview Prep',
    text: 'Practice with realistic mock interviews before the one that counts.',
    icon: Radar,
  },
  {
    title: 'Application Tracking',
    text: 'See exactly where every application stands, in one place.',
    icon: Target,
  },
]

const interviewTabs = [
  {
    label: 'Behavioral',
    prompt: 'Tell me about a time you handled conflict on a team.',
    response:
      'I would use a concise STAR structure here. At FinCart, two teams disagreed on launch scope, so I brought them around the customer impact, proposed a smaller release, and kept the timeline intact.',
    bullets: ['Situation: cross-functional conflict', 'Action: aligned on customer risk', 'Result: shipped on time'],
  },
  {
    label: 'Technical',
    prompt: 'How would you design a reliable notification system?',
    response:
      'Start with events, queues, retries, and idempotency. I would separate delivery channels from business logic, add dead-letter queues, and track message state so failures are recoverable.',
    bullets: ['Queue-backed delivery', 'Idempotent workers', 'Retry + dead-letter path'],
  },
  {
    label: 'Situation Test',
    prompt: 'A key stakeholder changes direction two days before launch. What do you do?',
    response:
      'I would quickly clarify the business reason, quantify the launch risk, and offer two options: a narrow change now or a follow-up release. That keeps momentum without ignoring the stakeholder.',
    bullets: ['Clarify urgency', 'Surface trade-offs', 'Protect launch scope'],
  },
  {
    label: 'Case Study',
    prompt: 'Revenue is flat even though signups are growing. Walk me through the diagnosis.',
    response:
      'I would split the funnel by acquisition source, activation, conversion, and retention. If signups are growing but revenue is flat, I would look first for lower-intent traffic or pricing-plan mismatch.',
    bullets: ['Segment the funnel', 'Find conversion drop-off', 'Prioritize highest leverage test'],
  },
  {
    label: 'Coding',
    prompt: 'Return the first repeated value in an array.',
    response:
      'Use a Set while scanning once. If the current value already exists, return it immediately. That gives O(n) time and O(n) space, with no nested loop.',
    bullets: ['const seen = new Set()', 'if (seen.has(n)) return n', 'seen.add(n)'],
  },
  {
    label: 'Salary Negotiation',
    prompt: 'The offer is lower than expected. How do you respond?',
    response:
      'I would stay appreciative, restate excitement, then anchor on market data and scope. I would ask whether they can close the gap on base or improve equity/signing bonus.',
    bullets: ['Thank them first', 'Anchor on scope + market', 'Ask for flexible levers'],
  },
]

type InterviewScenario = (typeof interviewTabs)[number]

const downloadOptions = [
  {
    title: 'Copilot Desktop App',
    platform: 'Application',
    extension: 'dmg',
    cta: 'Desktop app for macOS',
    meta: 'Silicon (M-series)',
    image: '/lightforth-home/download-modal/mac-silicon.png',
    icon: FaApple,
    href: 'https://lightforth-copilot-downloads.nyc3.digitaloceanspaces.com/Lightforth_Copilot_1.0.1_arm64.dmg',
  },
  {
    title: 'Copilot Desktop App',
    platform: 'Application',
    extension: 'dmg',
    cta: 'Desktop app for macOS',
    meta: 'Intel • macOS 13+',
    image: '/lightforth-home/download-modal/mac-intel.png',
    icon: FaApple,
    href: 'https://lightforth-copilot-downloads.nyc3.digitaloceanspaces.com/Lightforth_Copilot_1.0.1_x64.dmg',
  },
  {
    title: 'Copilot Extension (Windows)',
    platform: 'Application',
    extension: 'exe',
    cta: 'Desktop app for Windows',
    meta: '',
    image: '/lightforth-home/download-modal/windows.png',
    icon: FaWindows,
    href: 'https://lightforth-copilot-downloads.nyc3.digitaloceanspaces.com/Lightforth-Copilot-Windows-Installer.exe',
  },
]

const copilotPills = [
  { label: 'Practice Mode', iconSrc: '/comparison/icon-practice.svg' },
  { label: 'Resume-Aware Answers', iconSrc: '/comparison/icon-resume.svg' },
  { label: 'Live Transcription', iconSrc: '/lightforth-home/images/tagicon1.svg' },
  { label: 'Speech Clarity', iconSrc: '/lightforth-home/images/tagicon2.svg' },
  { label: 'Undetectable Overlay', iconSrc: '/comparison/icon-undetectable.svg' },
]

const statCards = [
  { label: 'Response time', prefix: '<', value: 1, suffix: 's' },
  { label: 'Invisible on screen share', prefix: '', value: 100, suffix: '%' },
  { label: 'Setup', prefix: '<', value: 2, suffix: 'min' },
]

const copilotFeatures = [
  {
    title: 'Live question detection',
    text: 'Hears "Tell me about a time you handled conflict" and starts structuring an answer while you\'re still parsing it.',
  },
  {
    title: 'Resume-aware answers',
    text: 'Pulls the actual project from your resume that fits the question, not a generic template response.',
  },
  {
    title: 'Safeguards against hallucination',
    text: 'If your connection drops or it loses the audio for a stretch, it won\'t guess. Auto-refresh (or a manual override) reconnects instantly, so you\'re always answering from what was actually said - never a made-up fill-in.',
  },
]

const codingCopilotFeatures = [
  {
    title: 'Complete, working code',
    text: 'Not a hint. A full solution to the exact problem on your screen.',
  },
  {
    title: 'The explanation, in plain English',
    text: 'Say it out loud like you wrote it yourself.',
  },
  {
    title: 'Time and space complexity, done for you',
    text: 'Know the Big-O before your interviewer even asks.',
  },
]

const meetingCopilotFeatures = [
  {
    title: 'Live notes, zero typing',
    text: 'Captures action items while you stay in the conversation.',
  },
  {
    title: 'Every call, one place',
    text: 'Screening calls, interviews, and post-offer conversations, all searchable.',
  },
  {
    title: 'Never re-explain yourself',
    text: 'Pull up what was said last time before the next call starts.',
  },
]

const prepSteps = [
  {
    title: 'Connect your resume',
    text: 'Upload your CV once so Lightforth can ground every answer in your own experience.',
    icon: FileText,
  },
  {
    title: 'Tell it the role',
    text: 'Add the job description, interview type, or company notes before the call.',
    icon: Radar,
  },
  {
    title: 'Go live',
    text: 'Open the desktop copilot and get clear prompts while the conversation moves.',
    icon: Power,
  },
]

type CellValue = 'yes' | 'partial' | 'no'

const comparisonRows: { icon: string | null; label: string; values: CellValue[] }[] = [
  { icon: '/comparison/icon-journey.svg', label: 'Full journey in one subscription', values: ['yes', 'partial', 'partial', 'partial'] },
  { icon: '/comparison/icon-undetectable.svg', label: 'Live, undetectable answers on any call platform', values: ['yes', 'no', 'yes', 'yes'] },
  { icon: '/comparison/icon-resume.svg', label: 'Resume-aware, personalized answers', values: ['yes', 'partial', 'no', 'partial'] },
  { icon: '/comparison/icon-coding.svg', label: 'Full coding solutions (code + explanation + complexity)', values: ['yes', 'partial', 'partial', 'partial'] },
  { icon: '/comparison/icon-reconnect.svg', label: 'Auto-reconnect if audio/connection drops', values: ['yes', 'partial', 'no', 'no'] },
  { icon: '/comparison/icon-auto-reply.svg', label: 'Auto Reply and Manual Control', values: ['yes', 'no', 'no', 'no'] },
  { icon: '/comparison/icon-practice.svg', label: 'Practice/mock interview mode', values: ['yes', 'partial', 'no', 'no'] },
  { icon: null, label: 'Auto-Apply', values: ['yes', 'no', 'no', 'no'] },
  { icon: '/comparison/icon-funnel.svg', label: 'ATS Checker', values: ['yes', 'yes', 'yes', 'no'] },
]

const competitors = [
  { name: 'Parakeet', logo: '/comparison/parakeet-logo.png' },
  { name: 'FinalRound', logo: '/comparison/finalround-logo.png' },
  { name: 'Cluely', logo: '/comparison/cluely-logo.png' },
]

const socialProofLogos = [
  { name: 'Ephemeral', mark: '/social-proof/ephemeral-mark.svg', text: '/social-proof/ephemeral-text.svg', markWidth: 48, textWidth: 128, gap: 10 },
  { name: 'Wildcrafted', mark: '/social-proof/wildcrafted-mark.svg', text: '/social-proof/wildcrafted-text.svg', markWidth: 48, textWidth: 141, gap: 8 },
  { name: 'Codecraft_', mark: '/social-proof/codecraft-mark.svg', text: '/social-proof/codecraft-text.svg', markWidth: 40, textWidth: 152, gap: 10 },
  { name: 'Convergence', mark: '/social-proof/convergence-mark.svg', text: '/social-proof/convergence-text.svg', markWidth: 42, textWidth: 159, gap: 8 },
  { name: 'ImgCompress', mark: '/social-proof/imgcompress-mark.svg', text: '/social-proof/imgcompress-text.svg', markWidth: 40, textWidth: 172, gap: 10 },
]


function playMutedVideo(video: HTMLVideoElement | null) {
  if (!video) return
  video.muted = true
  video.defaultMuted = true
  video.play().catch(() => {
    // Browser autoplay can still be denied in low-power or restricted modes.
  })
}

function useLightforthMotion() {
  useEffect(() => {
    const root = document.querySelector('.lf-home')
    if (!root) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      root.classList.add('lf-motion-ready', 'lf-reduced-motion')
      return
    }

    const revealTargets = Array.from(
      root.querySelectorAll<HTMLElement>(
        [
          '.lf-hero-copy',
          '#solutions article',
          '.lf-stat-card',
          '.lf-copilot-feature-copy',
          '.lf-copilot-feature-media',
          '.lf-coding-feature-copy',
          '.lf-coding-feature-media',
          '.lf-meeting-feature-copy',
          '.lf-meeting-feature-media',
          '.lf-how-header',
          '.lf-how-card',
          '.lf-how-cta-wrap',
          '.lf-comparison-table',
          '.lf-social-proof p',
          '.lf-social-proof [class*="items-center"]',
          '#faq h2',
          '#faq p',
          '#faq button',
          '.lf-final-cta-heading',
          '.lf-final-download',
          '.lf-final-pricing',
          '.lf-footer-brand',
          '.lf-footer-column',
        ].join(', '),
      ),
    )

    revealTargets.forEach((element, index) => {
      element.classList.add('lf-reveal')
      element.style.setProperty('--lf-reveal-delay', `${Math.min(index % 8, 7) * 45}ms`)
    })

    root.classList.add('lf-motion-ready')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('lf-reveal-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )

    revealTargets.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const alreadyVisible = rect.top < window.innerHeight * 0.92 && rect.bottom > 0

      if (alreadyVisible) {
        element.classList.add('lf-reveal-visible')
        return
      }

      observer.observe(element)
    })

    return () => {
      observer.disconnect()
      revealTargets.forEach((element) => {
        element.classList.remove('lf-reveal', 'lf-reveal-visible')
        element.style.removeProperty('--lf-reveal-delay')
      })
      root.classList.remove('lf-motion-ready')
    }
  }, [])
}

function SocialProofSection() {
  const logoTrack = [...socialProofLogos, ...socialProofLogos]

  return (
    <section className="lf-social-proof bg-white py-12">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-8">
        <p className="text-center text-base font-medium text-[#475467]">Our candidates have landed offers at</p>
        <div className="lf-social-logo-marquee">
          <div className="lf-social-logo-track">
            {logoTrack.map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="lf-social-logo-item flex items-center"
              style={{ gap: `${company.gap}px` }}
              aria-hidden={index >= socialProofLogos.length ? 'true' : undefined}
            >
              <img src={company.mark} alt="" className="h-12 flex-none" style={{ width: `${company.markWidth}px` }} />
              <img src={company.text} alt={company.name} className="h-12 flex-none" style={{ width: `${company.textWidth}px` }} />
            </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-5 lg:px-0">
        <Link to="/" aria-label="Lightforth home">
          <img src="/lightforth-home/images/lightforth-logo-2.svg" alt="Lightforth" className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="inline-flex items-center gap-1 transition hover:text-[#0494fc]">
              {link.label}
              {link.label !== 'Pricing' ? <ChevronDown className="h-3.5 w-3.5" /> : null}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="/v3/auth/sign-in" className="rounded-full px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Login
          </a>
          <a href="/v3/auth/sign-in" className="rounded-full bg-[#0494fc] px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:bg-[#0380e0]">
            Sign in
          </a>
        </div>

        <button type="button" className="rounded-full p-2 text-slate-800 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-100 bg-white px-5 py-4 md:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-3">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="rounded-lg px-2 py-2 text-sm font-medium text-slate-700" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <a href="/v3/auth/sign-in" className="mt-2 rounded-full bg-[#0494fc] px-5 py-2.5 text-center text-sm font-semibold text-white">
              Sign in
            </a>
          </div>
        </div>
      ) : null}
    </header>
  )
}

function DownloadButton({
  dark = false,
  hero = false,
  className = '',
  onClick,
}: {
  dark?: boolean
  hero?: boolean
  className?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-12 items-center justify-center gap-2 font-bold transition ${
        dark ? 'bg-white text-[#071530] hover:bg-white/90' : 'bg-[#0c0f14] text-white hover:bg-[#20242b]'
      } ${hero ? 'rounded-lg px-8 text-[17px]' : 'rounded-full px-6 text-sm'} ${className}`}
    >
      Download Now
      <span className="inline-flex items-center gap-2 text-base opacity-95">
        <FaApple aria-hidden="true" />
        <FaWindows aria-hidden="true" />
      </span>
    </button>
  )
}

function ProductMockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="w-full overflow-clip rounded-[12px] border-2 border-[#303030] bg-[#0c1a2f] pt-6">
      <div className="overflow-clip rounded-t-[18px] bg-[rgba(255,255,255,0.05)]">

        {/* Bar 1 — title + timer + End Interview */}
        <div className="flex items-center justify-between bg-[#14223e] px-[15px] py-[10px]">
          <div className="flex items-center gap-[6px]">
            <span className="h-[5.25px] w-[5.25px] shrink-0 rounded-full bg-[#ff5f57]" />
            <span style={{ fontFamily: "'Kumbh Sans', sans-serif" }} className="whitespace-nowrap text-[12px] font-medium leading-[21px] text-white">
              Live Interview Response
            </span>
          </div>
          <div className="flex items-center gap-[12px]">
            <span style={{ fontFamily: "'Kumbh Sans', sans-serif" }} className="text-[10.5px] font-medium text-white">
              03:48
            </span>
            <div className="flex w-[121px] items-center justify-center rounded-[6px] bg-[#dc2828] px-3 py-[5px]">
              <span style={{ fontFamily: "'Kumbh Sans', sans-serif" }} className="text-[10.5px] font-semibold tracking-[0.1875px] text-[#ffedec]">
                End Interview
              </span>
            </div>
          </div>
        </div>

        {/* Bar 2 — signal strength + listening + scroll/font controls */}
        <div
          className="flex items-center justify-between bg-[#101d2b] px-[15px] py-[10px]"
          style={{ boxShadow: 'inset 0px -1px 4px 0px rgba(79,145,100,0.38)' }}
        >
          <div className="flex items-center gap-[12px]">
            <div className="flex items-center gap-[6px]">
              <BarChart2 className="h-[12px] w-[12px] text-[#76d988]" />
              <span style={{ fontFamily: "'Kumbh Sans', sans-serif" }} className="text-[12px] font-medium text-[#76d988]">
                Strong
              </span>
            </div>
            <span style={{ fontFamily: "'Kumbh Sans', sans-serif" }} className="text-[10.5px] font-medium text-[#6d727c]">
              Listening...
            </span>
          </div>
          {!compact ? (
            <div className="flex items-center gap-[20px]">
              <div className="flex items-center gap-[6px]">
                <span style={{ fontFamily: "'Kumbh Sans', sans-serif" }} className="text-[10.5px] font-medium text-[#6d727c]">Auto scroll</span>
                <img src="/mockup-slider.svg" alt="" className="h-[10px] w-[58px]" />
                <span style={{ fontFamily: "'Kumbh Sans', sans-serif" }} className="text-[10.5px] font-medium text-[#6d727c]">1</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <span style={{ fontFamily: "'Kumbh Sans', sans-serif" }} className="text-[10.5px] font-medium text-[#6d727c]">Font size</span>
                <img src="/mockup-slider.svg" alt="" className="h-[10px] w-[58px]" />
                <span style={{ fontFamily: "'Kumbh Sans', sans-serif" }} className="text-[10.5px] font-medium text-[#6d727c]">12</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Bar 3 — secondary header + settings */}
        <div className="flex items-center justify-between bg-[#101d2b] px-[15px] py-[10px]">
          <div className="flex items-center gap-[6px]">
            <span className="h-[5.25px] w-[5.25px] shrink-0 rounded-full bg-[#ff5f57]" />
            <span style={{ fontFamily: "'Kumbh Sans', sans-serif" }} className="whitespace-nowrap text-[12px] font-medium leading-[21px] text-white">
              Live Interview Response
            </span>
          </div>
          <Settings className="h-[18px] w-[18px] shrink-0 text-white/50" />
        </div>

        {/* Content area */}
        <div className="border border-black bg-[rgba(0,0,0,0.5)] px-6 pb-6">
          <div className="flex flex-col gap-[19.5px] pt-4">

            {/* Interviewer bubble */}
            <div className="rounded-[4.5px] bg-[rgba(255,255,255,0.1)] p-[9px]">
              <p style={{ fontFamily: "'Martian Mono', monospace" }} className="text-[6.75px] font-bold leading-[10.125px] text-white">
                Interviewer:
              </p>
              <p style={{ fontFamily: "'Kumbh Sans', sans-serif" }} className="mt-[5px] text-[12px] font-normal leading-[18px] text-white">
                Tell me about a time you handled conflict with a teammate.
              </p>
            </div>

            {/* Lightforth AI bubble */}
            <div className="rounded-[4.5px] border border-[#244978] bg-[#0c1b2b] p-[9px]">
              <p style={{ fontFamily: "'Martian Mono', monospace" }} className="text-[6.75px] font-bold leading-[10.125px] text-white">
                Lightforth AI
              </p>
              <div style={{ fontFamily: "'Kumbh Sans', sans-serif" }} className="mt-[5px] text-[12px] leading-[18px] text-white">
                <p className="font-normal">
                  Start with the business context, then show how you kept the relationship intact. Use a concise STAR answer and close with the measurable result.
                </p>
                {!compact ? (
                  <>
                    <p className="mt-[10px] font-bold text-[#4a9eff]">1. Situation &amp; Task</p>
                    <p className="font-normal">
                      Disagreement on <span className="font-bold text-[#0494fc]">launch scope</span> — two engineers wanted to ship the full feature set, but timeline risk was real.
                    </p>
                    <p className="mt-[10px] font-bold text-[#4a9eff]">2. Action</p>
                    <p className="font-normal">
                      Reframed around customer risk and <span className="font-bold text-[#0494fc]">proposed</span> a phased release. Got alignment in one sync.
                    </p>
                    <p className="mt-[10px] font-bold text-[#4a9eff]">3. Result</p>
                    <p className="font-normal">
                      Shipped the phased release <span className="font-bold text-[#0494fc]">two days early</span> with zero rollbacks. Relationship intact.
                    </p>
                  </>
                ) : null}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

function InterviewScenarioMockup({ scenario }: { scenario: InterviewScenario }) {
  return (
    <div className="lf-scenario-stage">
      <div key={scenario.label} className="lf-scenario-window" aria-label={`${scenario.label} interview copilot response preview`}>
        <div className="lf-scenario-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="lf-scenario-card lf-scenario-question">
          <span>Interviewer:</span>
          <p>{scenario.prompt}</p>
        </div>

        <div className="lf-scenario-card lf-scenario-answer">
          <span>Lightforth AI</span>
          <p>{scenario.response}</p>
          <ul>
            {scenario.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Hero({ onDownload }: { onDownload: () => void }) {
  return (
    <section className="lf-hero-wave relative overflow-hidden bg-white pb-16 pt-20 sm:pt-24">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-0">
        <div className="lf-hero-copy">
          <h1 className="max-w-[669px] text-[44px] font-normal leading-[1.02] tracking-[-0.055em] text-[#15191f] sm:text-[64px] lg:text-[72px]">
            What&apos;s your next interview really <span className="text-[#2388ff]">worth</span>?
          </h1>
          <p className="mt-8 max-w-[483px] text-[17px] leading-[1.48] text-[#4b5565]">
            The wrong answer doesn&apos;t just lose the job — it costs the timeline, the leverage, and the next six months. Lightforth{' '}
            <em className="font-medium text-[#2388ff] underline decoration-[#2388ff]/50 underline-offset-2">listens</em> and answers in real time, completely{' '}
            <strong className="font-bold text-[#344054]">undetectable</strong>, on any call.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <DownloadButton hero className="w-full sm:w-[239px]" onClick={onDownload} />
            <a href="/v3/auth/sign-up" className="inline-flex h-12 min-w-[167px] items-center justify-center whitespace-nowrap rounded-lg bg-[#2388ff] px-6 text-base font-medium leading-none text-white transition hover:bg-[#0879f2]">
              Activate Pro for $10
            </a>
          </div>
        </div>

        <img
          src="/hero-interview-response.png"
          alt="Lightforth live interview response shown over a mountain backdrop"
          className="mt-14 block w-full max-w-[1280px]"
        />
      </div>
    </section>
  )
}

function SupportSection() {
  return (
    <section id="solutions" className="bg-white">
      <div className="mx-auto min-h-[680px] max-w-[1278px] px-5 pt-16 sm:px-8 lg:px-0 lg:pt-16">
        <div className="lg:pl-[99px]">
          <p className="w-fit text-[13px] font-medium uppercase leading-4 tracking-[0.08em] text-[#4f4f4f]">AI Career Support</p>
          <h2 className="mt-6 max-w-[734px] text-[34px] font-medium leading-[1.16] tracking-[-0.045em] text-[#1b1b1d] sm:text-[42px] lg:text-[42px]">
            You get real-time help in every interview.
            <br />
            + everything else it takes to land it.
          </h2>
        </div>

        <div className="mt-6 grid border-y border-[#e0e0e0] md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[184px_184px]">
          {supportCards.map((card, index) => (
            <article
              key={card.title}
              className="relative h-[184px] overflow-hidden border-b border-[#e0e0e0] p-8 md:border-r lg:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
            >
              <card.icon className="h-6 w-6 stroke-[2.6px] text-black" />
              <div className="relative mt-4 max-w-[312px]">
                <span className="absolute -left-8 top-0 h-5 w-px bg-[#2688ff]" aria-hidden="true" />
                <h3 className="text-[20px] font-medium leading-6 tracking-[-0.035em] text-[#18181a]">{card.title}</h3>
                <p className="mt-2 max-w-[312px] text-[17px] leading-6 tracking-[-0.02em] text-[#626262]">{card.text}</p>
              </div>
              {index > 2 ? null : <span className="pointer-events-none absolute inset-x-0 bottom-[-1px] hidden h-px bg-[#e0e0e0] lg:block" />}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function InterviewTypes() {
  const [activeTab, setActiveTab] = useState(0)
  const [pillsInView, setPillsInView] = useState(false)
  const [pillsScattered, setPillsScattered] = useState(false)
  const productSectionRef = useRef<HTMLElement | null>(null)
  const tabListRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const section = productSectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPillsInView(entry.isIntersecting)
      },
      { threshold: 0.35 },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  function selectTab(index: number) {
    setActiveTab(index)
    const prefersDirectScroll =
      typeof window !== 'undefined' &&
      (window.matchMedia('(hover: none), (pointer: coarse)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    tabListRef.current?.children[index]?.scrollIntoView({
      behavior: prefersDirectScroll ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }

  function scatterPillsForPointer(pointerType?: string) {
    if (pointerType === 'touch') return
    setPillsScattered(true)
  }

  const activePanel = interviewTabs[activeTab]

  return (
    <section id="product" ref={productSectionRef} className="lf-product-scroll-scene bg-white">
      <div className="lf-product-sticky mx-auto max-w-[1280px] overflow-hidden">
        <div
          ref={tabListRef}
          className="lf-tab-scroller flex h-[45px] overflow-x-auto border border-[#d5d5d5] border-r-0 bg-white"
          role="tablist"
          aria-label="Interview type"
        >
          {interviewTabs.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={activeTab === index}
              onClick={() => selectTab(index)}
              className="relative h-[45px] min-w-[213.33px] shrink-0 overflow-hidden border-r border-[#d5d5d5] px-5 text-center text-[14px] font-normal leading-[17px] text-[#171717]"
            >
              {activeTab === index ? <span className="lf-tab-loader" aria-hidden="true" /> : null}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="grid min-h-[656px] bg-white lg:grid-cols-[704px_576px]">
          <div className="min-h-[430px] overflow-hidden bg-[#c0d4ee] lg:min-h-[656px]">
            <InterviewScenarioMockup scenario={activePanel} />
          </div>

          <div className="relative min-h-[560px] overflow-hidden bg-white px-8 py-14 lg:min-h-[656px] lg:px-[72px] lg:py-[60px]">
            <p className="text-[13px] font-normal uppercase leading-[15px] tracking-[0.24em] text-[#171717]">Available for MAC-OS &amp; WINDOWS</p>
            <h2 className="mt-10 max-w-[432px] text-[42px] font-normal leading-[1.15] tracking-[-0.06em] text-[#111317]">
              One copilot, every interview type.
            </h2>

            <div
              className={`lf-pill-field group absolute bottom-[58px] left-1/2 h-[280px] w-[432px] max-w-[calc(100%-32px)] -translate-x-1/2 lg:left-[72px] lg:translate-x-0 ${pillsInView ? 'lf-pill-field-active' : ''} ${pillsScattered ? 'lf-pill-field-scattered' : ''}`}
              onMouseEnter={() => scatterPillsForPointer('mouse')}
              onMouseLeave={() => setPillsScattered(false)}
              onPointerMove={(event) => scatterPillsForPointer(event.pointerType)}
            >
              {copilotPills.map((pill, index) => (
                <button
                  key={pill.label}
                  type="button"
                  className={`lf-skill-pill lf-skill-pill-${index}`}
                  aria-label={pill.label}
                >
                  <img src={pill.iconSrc} alt="" className="lf-skill-pill-icon" aria-hidden="true" />
                  <span>{pill.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AnimatedStatValue({
  started,
  prefix,
  value,
  suffix,
}: {
  started: boolean
  prefix: string
  value: number
  suffix: string
}) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!started) return

    const duration = value === 100 ? 1400 : 900
    const startTime = performance.now()
    let frame = 0

    function tick(now: number) {
      const progress = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(eased * value))

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [started, value])

  return (
    <span className="lf-stat-value">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}

function StatsStrip() {
  const [started, setStarted] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { rootMargin: '-15% 0px -15% 0px', threshold: 0.25 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="stats" ref={sectionRef} className="bg-white px-5 py-6 lg:px-0">
      <div className="lf-stats-strip mx-auto grid max-w-[1280px] gap-6 md:grid-cols-3">
        {statCards.map((stat) => (
          <article key={stat.label} className="lf-stat-card">
            <p className="lf-stat-label">{stat.label}</p>
            <AnimatedStatValue started={started} prefix={stat.prefix} value={stat.value} suffix={stat.suffix} />
          </article>
        ))}
      </div>
    </section>
  )
}

function InterviewPressureSection({ onWatchDemo }: { onWatchDemo: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    playMutedVideo(videoRef.current)
  }, [])

  return (
    <section id="interview-pressure" className="bg-white py-6">
      <div className="lf-pressure-section">
        <video
          ref={videoRef}
          className="lf-pressure-section-video"
          src="/137250-766326162_medium.mp4"
          autoPlay
          muted
          defaultMuted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={(event) => playMutedVideo(event.currentTarget)}
          onCanPlay={(event) => playMutedVideo(event.currentTarget)}
          aria-label="Candidate under interview pressure"
        />

        <div className="lf-pressure-overlay" aria-hidden="true" />

        <div className="lf-pressure-content">
          <h2>Even the sharpest candidates freeze.</h2>
          <p>&quot;I knew the answer. I just couldn&apos;t get it out in time &mdash; until I had something helping me say it.&quot;</p>
          <button type="button" className="lf-pressure-demo-link" onClick={onWatchDemo}>
            <img src="/figma-play-orange.svg" alt="" className="lf-pressure-demo-icon" />
            <span>Watch Quick Demo</span>
          </button>
        </div>
      </div>
    </section>
  )
}

function InterviewCopilotFeature() {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    playMutedVideo(videoRef.current)
  }, [])

  return (
    <section id="interview-copilot" className="lf-overlap-section bg-white px-5 py-6 lg:px-0" data-overlap-index="0">
      <div className="lf-copilot-feature mx-auto max-w-[1280px]">
        <div className="lf-copilot-feature-copy">
          <p className="lf-copilot-eyebrow">INTERVIEW COPILOT</p>
          <h2 className="lf-copilot-feature-heading">Hears the question first. Has your answer before you freeze.</h2>
          <ul className="lf-copilot-feature-list">
            {copilotFeatures.map((feature) => (
              <li key={feature.title} className="lf-copilot-feature-item">
                <img src="/feature-check-icon.svg" alt="" className="lf-copilot-feature-check" />
                <p>
                  <strong>{feature.title}</strong>
                  {' — '}
                  {feature.text}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="lf-copilot-feature-media">
          <video
            ref={videoRef}
            className="lf-copilot-desktop-video"
            src="/How%20to%20use%20copilot%20desktop2.mp4"
            autoPlay
            muted
            defaultMuted
            loop
            playsInline
            preload="auto"
            onLoadedMetadata={(event) => playMutedVideo(event.currentTarget)}
            onCanPlay={(event) => playMutedVideo(event.currentTarget)}
            aria-label="Lightforth desktop copilot in use"
          />
        </div>
      </div>
    </section>
  )
}

function CodingCopilotFeature() {
  return (
    <section id="coding-copilot" className="lf-overlap-section bg-white px-5 py-6 lg:px-0" data-overlap-index="1">
      <div className="lf-coding-feature mx-auto max-w-[1280px]">
        <div className="lf-coding-feature-copy">
          <p className="lf-coding-eyebrow">CODING COPILOT</p>
          <h2 className="lf-coding-feature-heading">
            The whole answer &mdash;
            <br />
            code, explanation, complexity.
          </h2>
          <ul className="lf-coding-feature-list">
            {codingCopilotFeatures.map((feature) => (
              <li key={feature.title} className="lf-coding-feature-item">
                <img src="/coding-copilot-check-icon.svg" alt="" className="lf-coding-feature-check" />
                <p>
                  <strong>{feature.title}</strong>
                  {' — '}
                  {feature.text}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="lf-coding-feature-media">
          <video
            src="/codingg.mp4"
            className="lf-coding-feature-image"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label="Coding copilot response with code, explanation, and complexity notes"
          />
        </div>
      </div>
    </section>
  )
}

function MeetingCopilotFeature() {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    playMutedVideo(videoRef.current)
  }, [])

  return (
    <section id="meeting-copilot" className="lf-overlap-section bg-white px-5 py-6 lg:px-0" data-overlap-index="2">
      <div className="lf-meeting-feature mx-auto max-w-[1280px]">
        <div className="lf-meeting-feature-media">
          <video
            ref={videoRef}
            className="lf-meeting-feature-video"
            src="/sales-call-copy.mp4"
            autoPlay
            muted
            defaultMuted
            loop
            playsInline
            preload="auto"
            onLoadedMetadata={(event) => playMutedVideo(event.currentTarget)}
            onCanPlay={(event) => playMutedVideo(event.currentTarget)}
            aria-label="Meeting copilot sales call notes preview"
          />
        </div>

        <div className="lf-meeting-feature-copy">
          <p className="lf-meeting-eyebrow">MEETING COPILOT</p>
          <h2 className="lf-meeting-feature-heading">Every call that decides your career.</h2>
          <ul className="lf-meeting-feature-list">
            {meetingCopilotFeatures.map((feature) => (
              <li key={feature.title} className="lf-meeting-feature-item">
                <img src="/meeting-copilot-check-icon.svg" alt="" className="lf-meeting-feature-check" />
                <p>
                  <strong>{feature.title}</strong>
                  {' — '}
                  {feature.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function StorySections() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[980px] space-y-28 px-5">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">AI hears it all</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#15191f]">
              Hears the question first. Has your answer before you freeze.
            </h2>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
              <li><CheckCircle2 className="mr-2 inline h-4 w-4 text-[#0494fc]" />Live question detection turns the interview into structured prompts.</li>
              <li><CheckCircle2 className="mr-2 inline h-4 w-4 text-[#0494fc]" />Resume-aware answers keep every response specific to your experience.</li>
              <li><CheckCircle2 className="mr-2 inline h-4 w-4 text-[#0494fc]" />Talk naturally while Lightforth keeps the answer close to your eyeline.</li>
            </ul>
          </div>
          <div className="bg-gradient-to-b from-[#f7fbff] to-[#dceeff] p-8">
            <ProductMockup compact />
          </div>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="order-2 bg-slate-50 p-8 md:order-1">
            <ProductMockup compact />
          </div>
          <div className="order-1 md:order-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Coding solution</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#15191f]">
              The whole answer - code, explanation, complexity.
            </h2>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
              <li><CheckCircle2 className="mr-2 inline h-4 w-4 text-[#0494fc]" />Breaks down the approach before writing the solution.</li>
              <li><CheckCircle2 className="mr-2 inline h-4 w-4 text-[#0494fc]" />Includes edge cases, complexity, and an explanation you can say out loud.</li>
              <li><CheckCircle2 className="mr-2 inline h-4 w-4 text-[#0494fc]" />Keeps the answer visible while your assessment window stays active.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function PrepSection({ onDownload }: { onDownload: () => void }) {
  const steps = [
    {
      number: '01',
      image: '/image%2044%20%5BVectorized%5D.svg',
      imageClass: 'lf-how-step-image-install',
      title: 'Install the app.',
      text: 'Download for Mac or Windows and sign in — done in under a minute.',
    },
    {
      number: '02',
      image: '/image%2045%20%5BVectorized%5D.svg',
      imageClass: 'lf-how-step-image-permissions',
      title: 'Grant permissions.',
      text: "Allow Lightforth to see your screen and hear the call — that's what lets it listen and answer in real time.",
    },
    {
      number: '03',
      image: '/appicon_light-JdYyUE_2%201.svg',
      imageClass: 'lf-how-step-image-start',
      title: 'Start the interview.',
      text: 'Join the call as normal. Lightforth listens, answers, and stays invisible the whole time.',
    },
  ]

  return (
    <section id="how-it-works" className="lf-how-section bg-white px-5 py-20 text-center lg:px-0">
      <div className="lf-how-header mx-auto">
        <p className="lf-how-eyebrow">HOW IT WORKS</p>
        <h2 className="lf-how-heading">Get interview-ready in minutes</h2>
        <p className="lf-how-copy">Download the app, allow the right permissions, and bring Lightforth into your next interview in minutes.</p>
      </div>

      <div className="lf-how-grid mx-auto">
        {steps.map((step) => (
          <article key={step.number} className="lf-how-card">
            <div className="lf-how-card-visual">
              <img src={step.image} alt="" className={`lf-how-step-image ${step.imageClass}`} />
            </div>
            <div className="lf-how-card-body">
              <div className="lf-how-number">{step.number}</div>
              <p className="lf-how-step-text">
                <span>{step.title} </span>
                {step.text}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="lf-how-cta-wrap">
        <button type="button" onClick={onDownload} className="lf-how-download">
          <span>Download Now</span>
          <span className="lf-how-download-icons">
            <FaApple aria-hidden="true" />
            <FaWindows aria-hidden="true" />
          </span>
        </button>
      </div>
    </section>
  )
}

function CellIcon({ value }: { value: CellValue }) {
  const src = value === 'yes' ? '/comparison/state-check.svg' : value === 'partial' ? '/comparison/state-minus.svg' : '/comparison/state-x.svg'
  return <img src={src} alt={value} className="mx-auto h-5 w-5" />
}

function Comparison() {
  return (
    <section id="comparison" className="bg-white px-5 py-24 lg:px-0" aria-label="Lightforth competitor comparison">
      <div className="mx-auto max-w-[1280px]">
        <div className="lf-comparison-scroll lf-comparison-desktop overflow-x-auto">
          <div className="lf-comparison-table mx-auto">
            <div className="flex">
              <div className="lf-comparison-feature-col" />
              <div className="lf-comparison-brand-cell lf-comparison-lightforth-header">
                <div className="lf-comparison-lightforth-brand">
                  <img src="/comparison/lightforth-mark.svg" alt="" className="lf-comparison-lightforth-mark" />
                  <span className="lf-comparison-lightforth-name">Lightforth</span>
                </div>
              </div>
              {competitors.map((c) => (
                <div key={c.name} className="lf-comparison-brand-cell">
                  <div className="flex flex-col items-center gap-2">
                    <img src={c.logo} alt={c.name} className="h-[37px] w-[37px] rounded-full object-cover" />
                    <span className="text-sm font-medium tracking-[-0.02em] text-[#181925]">{c.name}</span>
                  </div>
                </div>
              ))}
            </div>

            {comparisonRows.map((row, i) => {
              const isLast = i === comparisonRows.length - 1
              return (
                <div key={row.label} className="flex border-t border-[#e8e8e8]">
                  <div className="lf-comparison-feature-col flex items-center gap-2 py-4 pr-5">
                    {row.icon ? (
                      <img src={row.icon} alt="" className="h-4 w-4 flex-none" />
                    ) : (
                      <span className="flex h-4 w-4 flex-none items-center justify-center text-[12px] font-bold text-[#999]">A+</span>
                    )}
                    <span className="text-base text-[#181925]">{row.label}</span>
                  </div>
                  <div className={`lf-comparison-status-cell border-x-2 border-[#1f8bff] bg-white ${isLast ? 'rounded-b-[24px] border-b-2' : ''}`}>
                    <CellIcon value={row.values[0]} />
                  </div>
                  {row.values.slice(1).map((val, j) => (
                    <div key={j} className="lf-comparison-status-cell">
                      <CellIcon value={val} />
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        <div className="lf-comparison-mobile" aria-label="Lightforth comparison">
          <div className="lf-comparison-mobile-features">
            <div className="lf-comparison-mobile-head">Features</div>
            {comparisonRows.map((row) => (
              <div key={row.label} className="lf-comparison-mobile-feature">
                {row.icon ? (
                  <img src={row.icon} alt="" className="h-4 w-4 flex-none" />
                ) : (
                  <span className="flex h-4 w-4 flex-none items-center justify-center text-[11px] font-bold text-[#999]">A+</span>
                )}
                <span>{row.label}</span>
              </div>
            ))}
          </div>
          <div className="lf-comparison-mobile-scroll">
            <div className="lf-comparison-mobile-values">
              {['Lightforth', ...competitors.map((competitor) => competitor.name)].map((name, index) => (
                <div key={name} className={`lf-comparison-mobile-brand-head ${index === 0 ? 'is-lightforth' : ''}`}>
                  <span>{name}</span>
                </div>
              ))}
              {comparisonRows.map((row) =>
                row.values.map((value, index) => (
                  <div key={`${row.label}-${index}`} className={`lf-comparison-mobile-status ${index === 0 ? 'is-lightforth' : ''}`}>
                    <CellIcon value={value} />
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const faqItems = [
  {
    q: 'How does Lightforth support the full interview process?',
    a: "Lightforth covers every stage — building a tailored resume, auto-applying to matching jobs, and giving you live answer support during any call. It's the only tool built for the entire journey from application to offer, not just one step of it.",
  },
  {
    q: 'What is Stealth Mode in Lightforth?',
    a: 'Stealth Mode keeps Lightforth invisible during screen shares and recordings. Interviewers on Zoom, Teams, or any other platform can\'t see the overlay — only you can.',
  },
  {
    q: 'Is Lightforth detectable during interviews?',
    a: 'No. Lightforth runs as a transparent overlay that doesn\'t appear on screen recordings or screen shares. It\'s been tested across all major video platforms including Zoom, Teams, Google Meet, and HireVue.',
  },
  {
    q: 'Do you have a free plan?',
    a: 'No. Lightforth does not have a free plan. Non-subscribers receive 5 credits per month to test or use limited product actions, and first-time users may be eligible to activate Pro for $10 for the first month before it renews at $49/month.',
  },
  {
    q: 'Is Lightforth a downloadable application?',
    a: 'Yes — Lightforth is a desktop app for Mac and Windows. The download takes under a minute and you\'re set up in two steps.',
  },
  {
    q: 'Can Lightforth help with coding interviews?',
    a: 'Yes. Lightforth detects the coding question on screen, generates a complete solution with a plain-English explanation and time/space complexity breakdown, and keeps it visible while your assessment window stays active.',
  },
  {
    q: 'What types of interviews does Lightforth assist with?',
    a: 'Behavioral, technical, situational, case study, coding, and salary negotiation. If there\'s a question being asked, Lightforth has an answer ready.',
  },
  {
    q: 'Is Lightforth legit?',
    a: 'Yes. Thousands of candidates have used Lightforth to land roles at top companies. It\'s designed to help you perform at your best — the same way prep books and coaches do.',
  },
  {
    q: 'Is Lightforth worth it?',
    a: 'One well-answered interview can be worth months of salary difference. Lightforth pays for itself the first time it helps you land an offer you might have otherwise missed.',
  },
]

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="bg-white py-24">
      <div className="mx-auto max-w-[640px] px-5 text-center">
        <h2
          className="mx-auto max-w-[448px] text-[36px] font-semibold leading-[44px] text-[#181925]"
          style={{ letterSpacing: '-0.63px' }}
        >
          If you have questions.<br />We&apos;ve Got You Covered.
        </h2>
        <p className="mt-1 text-[16px] text-[#4a5565]" style={{ letterSpacing: '-0.3125px' }}>
          Still curious? Reach out anytime at{' '}
          <a href="mailto:support@lightforth.org" className="text-[#1f8bff] hover:underline">
            support@lightforth.org
          </a>
        </p>
        <div className="mt-10 flex flex-col gap-[2px] text-left">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={item.q} className="overflow-hidden rounded-[12px] bg-[#fafafa]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between py-[10px] pl-[16px] pr-[12px] text-left"
                >
                  <span className="text-[16px] leading-[24px] tracking-[-0.02em] text-[#181925]">{item.q}</span>
                  <ChevronDown
                    className="ml-3 h-4 w-4 flex-none text-[#1f8bff] transition-transform duration-[380ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
                <div className={`lf-faq-content${isOpen ? ' lf-faq-open' : ''}`}>
                  <div>
                    <p className="px-4 pb-4 pt-1 text-[14px] leading-[22px] text-[#666]">{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FinalCta({ onDownload }: { onDownload: () => void }) {
  return (
    <section className="lf-final-section bg-white px-5 py-16 lg:px-0">
      <div className="lf-final-cta-new relative mx-auto max-w-[1280px] overflow-hidden bg-[#00053d]">
        <img src="/Container22.png" alt="" className="absolute inset-0 h-full w-full object-cover object-right" aria-hidden="true" />
        <div className="lf-final-cta-shade" aria-hidden="true" />

        <div className="relative flex min-h-[638px] items-center px-5 py-16 lg:px-[80px]">
          <div className="flex flex-col gap-[19px]">
            <h2 className="lf-final-cta-heading">
            Your next offer starts with your next answer
            </h2>

            <div className="flex flex-wrap gap-[10px]">
              <button type="button" onClick={onDownload} className="lf-final-download">
                Download Now
                <span className="inline-flex items-center gap-[6px] text-base">
                  <FaApple aria-hidden="true" />
                  <FaWindows aria-hidden="true" />
                </span>
              </button>
              <a href="/pricing" className="lf-final-pricing">
                See Pricing
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <p className="text-[16px] font-medium leading-[24px] text-[rgba(245,245,245,0.69)]">Coming Soon</p>

            <div className="lf-final-badges">
              <img src="/badges/soc2-type1.svg" alt="SOC 2 Type 1" />
              <img src="/badges/soc2-type2.svg" alt="SOC 2 Type 2" />
              <img src="/badges/ccpa.svg" alt="CCPA" />
              <img src="/badges/gdpr.svg" alt="GDPR" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const productGroups = [
    { title: 'Products', links: ['Watch Demo', 'Changelog', 'Vision Board'] },
    { title: 'Partner With US', links: ['Refer with Friends', 'Become a Partner'] },
  ]

  const solutionGroups = [
    {
      title: 'Solutions',
      links: ['AI Resume Builder', 'AI Auto Apply', 'AI Cover letter', 'AI Copilot', 'ATS Checker', 'AI Interview Prep', 'Resume Templates'],
    },
    { title: 'Follow Us', links: ['Instagram', 'Tiktok', 'Facebook', 'Youtube'], icon: '/footer/x.svg' },
  ]

  const resourceGroups = [
    { title: 'Resources', links: ['Blog', 'Guides', 'FAQ', 'Privacy & Terms', 'Cookie Settings'] },
    { title: 'Company', links: ['Jobs', 'Vision Board'] },
    { title: 'Support', links: ['Help Center', 'Contact Sales', 'Support Center', 'Refund Policy'] },
  ]

  function renderGroups(groups: { title: string; links: string[]; icon?: string }[]) {
    return groups.map((group) => (
      <div key={group.title} className="lf-footer-group">
        <h3>{group.title}</h3>
        <ul>
          {group.icon ? (
            <li>
              <a href="#" aria-label="X" className="lf-footer-social-icon">
                <img src={group.icon} alt="" />
              </a>
            </li>
          ) : null}
          {group.links.map((link) => (
            <li key={link}>
              <a href={link === 'FAQ' ? '#faq' : '#'}>{link}</a>
            </li>
          ))}
        </ul>
      </div>
    ))
  }

  return (
    <footer className="lf-footer bg-white">
      <div className="lf-footer-inner mx-auto">
        <div className="lf-footer-brand">
          <a href="/" aria-label="Lightforth home" className="lf-footer-logo-link">
            <img src="/lightforth-home/images/lightforth-logo-2.svg" alt="Lightforth" className="lf-footer-logo" />
          </a>

          <div className="lf-footer-contact">
            <div className="lf-footer-contact-row">
              <img src="/footer/location.svg" alt="" className="lf-footer-contact-icon" />
              <p>
                14160 N Dallas Parkway, Suite 760
                <br />
                Dallas TX 75254
              </p>
            </div>
            <a href="mailto:support@lightforth.org" className="lf-footer-contact-row">
              <Mail className="lf-footer-contact-icon" aria-hidden="true" />
              <span>support@lightforth.org</span>
            </a>
          </div>

          <p className="lf-footer-copyright">© 2025 Lightforth, Inc.</p>
        </div>

        <div className="lf-footer-column">{renderGroups(productGroups)}</div>
        <div className="lf-footer-column">{renderGroups(solutionGroups)}</div>
        <div className="lf-footer-column">{renderGroups(resourceGroups)}</div>
      </div>
    </footer>
  )
}

function DownloadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="lf-download-modal-shell" role="presentation" onMouseDown={onClose}>
      <div className="lf-download-modal" role="dialog" aria-modal="true" aria-labelledby="download-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="lf-download-modal-header">
          <h2 id="download-modal-title">Download Lightforth Copilot</h2>
          <button type="button" className="lf-download-modal-close" onClick={onClose} aria-label="Close download modal">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="lf-download-modal-grid">
          {downloadOptions.map((option) => {
            const PlatformIcon = option.icon

            return (
              <a key={`${option.title}-${option.meta || option.extension}`} href={option.href} className="lf-download-card">
                <span className="lf-download-card-image">
                  <img src={option.image} alt="" />
                </span>
                <span className="lf-download-card-body">
                  <span className="lf-download-card-title">{option.title}</span>
                  <span className="lf-download-card-meta">
                    <PlatformIcon aria-hidden="true" />
                    <span>{option.platform}</span>
                    <span className="lf-download-card-dot" aria-hidden="true" />
                    <span>{option.extension}</span>
                  </span>
                  <span className="lf-download-card-button">{option.cta}</span>
                  {option.meta ? <span className="lf-download-card-support">{option.meta}</span> : null}
                </span>
              </a>
            )
          })}
        </div>

        <p className="lf-download-modal-legal">
          By downloading a Lightforth application, you agree that our Terms of Service apply to your use of that application. If you have entered a different agreement with Lightforth that covers our applications, that agreement will apply instead.
        </p>
      </div>
    </div>
  )
}

function QuickDemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="lf-quick-demo-modal-shell" role="presentation" onMouseDown={onClose}>
      <div
        className="lf-quick-demo-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Lightforth quick demo"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="lf-quick-demo-modal-close" onClick={onClose} aria-label="Close quick demo">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="lf-quick-demo-player" data-testid="quick-demo-player" data-mobile-layout="fullscreen">
          <iframe
            src="https://drive.google.com/file/d/118_lmiPcoUBvDzsglUGqZc2uZDDmIJQs/preview"
            title="Lightforth quick demo video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
          <span className="lf-drive-popout-mask" data-testid="drive-popout-mask" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

export default function LightforthHomePage() {
  useLightforthMotion()
  const [downloadModalOpen, setDownloadModalOpen] = useState(false)
  const [quickDemoOpen, setQuickDemoOpen] = useState(false)

  return (
    <div className="lf-home min-h-screen bg-white font-sans text-slate-950">
      <Header />
      <Hero />
      <SupportSection />
      <InterviewTypes />
      <StatsStrip />
      <InterviewPressureSection onWatchDemo={() => setQuickDemoOpen(true)} />
      <div className="lf-overlap-group" data-testid="copilot-overlap-group">
        <InterviewCopilotFeature />
        <CodingCopilotFeature />
        <MeetingCopilotFeature />
      </div>
      <PrepSection onDownload={() => setDownloadModalOpen(true)} />
      <Comparison />
      <SocialProofSection />
      <FaqSection />
      <FinalCta onDownload={() => setDownloadModalOpen(true)} />
      <Footer />
      <DownloadModal open={downloadModalOpen} onClose={() => setDownloadModalOpen(false)} />
      <QuickDemoModal open={quickDemoOpen} onClose={() => setQuickDemoOpen(false)} />
    </div>
  )
}
